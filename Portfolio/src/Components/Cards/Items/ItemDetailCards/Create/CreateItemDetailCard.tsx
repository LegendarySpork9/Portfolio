import { useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { useNewPortfolioItem, useUpdatePortfolioItem } from "../../../../../Hooks/UsePortfolio";
import { useMedia } from "../../../../../Hooks/UseMedia";
import { uploadMedia, deleteMedia } from "../../../../../API/Media.api";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper'
import TextField from "@mui/material/TextField";
import BuildTable from "../../../../Tables/BuildHistoryTables/Edit/EditableBuildHistoryTable";
import LLMTable from "../../../../Tables/LLMUsageTables/Edit/EditableLLMUsageTable";
import Button from "@mui/material/Button";
import ImageTable from "../../../../Tables/ImageTable/ImageTable";
import CircularProgress from '@mui/material/CircularProgress';
import "../../../../../Colours.css";
import styles from './CreateItemDetailCard.module.css';

import type { ItemModel, ItemBuildHistoryModel, ItemLLMUsageModel, ItemRequestModel } from "../../../../../Types/Item";
import type { MediaModel } from "../../../../../Types/Media";
import React from "react";

interface ItemDetailProps {
  isUpdate: boolean;
  item?: ItemModel;
  onUpdateSuccess?: () => void;
}

const ItemDetail = ({ isUpdate, item, onUpdateSuccess }: ItemDetailProps) => {
  const navigate = useNavigate();
  const newItem = useNewPortfolioItem();
  const updateItem = useUpdatePortfolioItem();
  const { data: mediaData } = useMedia(item?.id ?? 0, isUpdate && !!item);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [buildHistory, setBuildHistory] = useState<ItemBuildHistoryModel[]>(item?.buildHistory ?? []);
  const [llmUsage, setLLMUsage] = useState<ItemLLMUsageModel | null>(item?.llmUsage ?? null);
  const [deletedMediaIds, setDeletedMediaIds] = useState<number[]>([]);

  const existingMedia = Array.isArray(mediaData)
    ? mediaData.filter((m: MediaModel) => !deletedMediaIds.includes(m.id))
    : [];

  const handleDeleteMedia = async (media: MediaModel) => {
    try {
      const fileName = media.name + media.type.extension;
      await deleteMedia(media.id, fileName);
      setDeletedMediaIds((prev) => [...prev, media.id]);
    } catch {
      setError("Failed to delete media.");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(event.target.files!)]);
    }

    event.target.value = "";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (buildHistory.length === 0) {
      setError("Build history must have at least one record.");
      return;
    }

    setLoading(true);
    setError("");

    const form = event.currentTarget;
    const getValue = (id: string) => (form.elements.namedItem(id) as HTMLInputElement | HTMLTextAreaElement)?.value?.trim() || null;
    const parseLines = (id: string) => getValue(id)?.split("\n").map(l => l.trim()).filter(Boolean) ?? null;

    try {
      if (isUpdate && item) {
        const request: Partial<ItemRequestModel> = {};

        if (getValue("name") !== item.name)
          request.name = getValue("name");

        if (getValue("type") !== item.type)
          request.type = getValue("type");

        if (getValue("iconURL") !== item.iconURL)
          request.iconURL = getValue("iconURL");

        if (getValue("summary") !== item.summary)
          request.summary = getValue("summary");

        if (getValue("description") !== item.description)
          request.description = getValue("description");

        if (JSON.stringify(parseLines("frameworks")) !== JSON.stringify(item.frameworks))
          request.frameworks = parseLines("frameworks");

        if (JSON.stringify(parseLines("languages")) !== JSON.stringify(item.languages))
          request.languages = parseLines("languages");

        if (JSON.stringify(parseLines("environments")) !== JSON.stringify(item.environments))
          request.environments = parseLines("environments");

        if (getValue("demoLink") !== (item.demoLink ?? null))
          request.demoLink = getValue("demoLink");

        if (getValue("releaseNotes") !== item.releaseNotes)
          request.releaseNotes = getValue("releaseNotes");

        if (JSON.stringify(buildHistory) !== JSON.stringify(item.buildHistory))
          request.buildHistory = buildHistory.length > 0 ? buildHistory : null;

        const unitTestCoverage = getValue("unitTestCoverage") ? Number(getValue("unitTestCoverage")) : null;
        if (unitTestCoverage !== (item.unitTestCoverage ?? null))
          request.unitTestCoverage = unitTestCoverage;

        if (getValue("gitHubLink") !== item.gitHubInformation?.url)
          request.gitHubLink = getValue("gitHubLink");

        if (JSON.stringify(llmUsage) !== JSON.stringify(item.llmUsage))
          request.llmUsage = llmUsage;

        if (getValue("llmUsageNotes") !== (item.llmUsageNotes ?? null))
          request.llmUsageNotes = getValue("llmUsageNotes");

        if (Object.keys(request).length > 0) {
          const result = await updateItem.mutateAsync({ id: item.id, request: request as ItemRequestModel });

          if (!result.id) {
            const info = (result as Record<string, unknown>).information;
            setError(typeof info === "string" ? info : "Failed to update item.");
            setLoading(false);
            return;
          }
        }

        if (selectedFiles.length > 0) {
          await Promise.all(selectedFiles.map(file => uploadMedia(item.id, file)));
          setSelectedFiles([]);
        }

        setLoading(false);
        onUpdateSuccess?.();
      } else {
        const request: ItemRequestModel = {
          name: getValue("name"),
          type: getValue("type"),
          iconURL: getValue("iconURL"),
          summary: getValue("summary"),
          description: getValue("description"),
          frameworks: parseLines("frameworks"),
          languages: parseLines("languages"),
          environments: parseLines("environments"),
          demoLink: getValue("demoLink"),
          releaseNotes: getValue("releaseNotes"),
          buildHistory: buildHistory.length > 0 ? buildHistory : null,
          unitTestCoverage: getValue("unitTestCoverage") ? Number(getValue("unitTestCoverage")) : null,
          gitHubLink: getValue("gitHubLink"),
          llmUsage: llmUsage,
          llmUsageNotes: getValue("llmUsageNotes")
        };

        const result = await newItem.mutateAsync(request);

        if (!result.id) {
          const info = (result as Record<string, unknown>).information;
          setError(typeof info === "string" ? info : "Failed to create item.");
          setLoading(false);
          return;
        }

        if (selectedFiles.length > 0) {
          await Promise.all(selectedFiles.map(file => uploadMedia(result.id, file)));
        }

        navigate("/items", { state: { created: true } });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(isUpdate ? "Failed to update item." : "Failed to create item.");
      }

      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      id="CreatePortfolioItem"
    >
      <Card className={styles['container']}>
        <CardContent>
          <TextField
            required
            id="name"
            label="Name"
            defaultValue={item?.name}
            placeholder="Portfolio"
            variant="outlined"
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input'], maxLength: 255}}
          />
          <br />
          <br />
          <TextField
            required
            id="type"
            label="Type"
            defaultValue={item?.type}
            placeholder="Website"
            variant="outlined"
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input'], maxLength: 50}}
          />
          <br />
          <br />
          <TextField
            required
            id="iconURL"
            label="Icon URL"
            defaultValue={item?.iconURL}
            placeholder="http://localhost/icon.png"
            variant="outlined"
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input'], maxLength: 255}}
          />
          <br />
          <br />
          <div className={styles['grid-container']}>
            <TextField
              required
              id="frameworks"
              label="Frameworks"
              defaultValue={item?.frameworks?.join("\n")}
              placeholder=".NET"
              variant="outlined"
              multiline
              rows={4}
              maxRows={4}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
            />
            <TextField
              required
              id="languages"
              label="Languages"
              defaultValue={item?.languages?.join("\n")}
              placeholder="C#"
              variant="outlined"
              multiline
              rows={4}
              maxRows={4}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
            />
            <TextField
              required
              id="environments"
              label="Environments"
              defaultValue={item?.environments?.join("\n")}
              placeholder="Windows"
              variant="outlined"
              multiline
              rows={4}
              maxRows={4}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
            />
          </div>
          <br />
          <Paper className={styles['card-paper-container']}>
            <Button
              component="label"
              variant="contained"
            >
              Select Images
              <input
                type="file"
                hidden
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
              />
            </Button>
            <ImageTable
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              existingMedia={isUpdate ? existingMedia : undefined}
              onDeleteMedia={isUpdate ? handleDeleteMedia : undefined}
            />
          </Paper>
          <br />
          <TextField
            required
            id="description"
            label="Description"
            defaultValue={item?.description}
            placeholder="Description"
            variant="outlined"
            multiline
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input']}}
          />
          <br />
          <br />
          <TextField
            required
            id="summary"
            label="Summary"
            defaultValue={item?.summary}
            placeholder="Summary"
            variant="outlined"
            multiline
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input'], maxLength: 255}}
          />
          <br />
          <br />
          <TextField
            id="demoLink"
            label="Demo Link"
            defaultValue={item?.demoLink}
            placeholder="https://demo.portfolio.co.uk"
            variant="outlined"
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input'], maxLength: 255}}
          />
          <br />
          <br />
          <div className={styles['sub-container']}>
            <Paper className={styles['card-paper']}>
              <BuildTable
                buildHistory={buildHistory}
                setBuildHistory={setBuildHistory}
              />
            </Paper>
            <TextField
              required
              id="releaseNotes"
              label="Release Notes"
              defaultValue={item?.releaseNotes}
              placeholder="Release Notes"
              variant="outlined"
              multiline
              sx={{ flex: 1 }}
              InputLabelProps={{className: styles['sub-section-input-label']}}
              InputProps={{className: styles['sub-section-input-wrapper']}}
              inputProps={{className: styles['sub-section-input']}}
            />
          </div>
          <br />
          <div className={styles['sub-container']}>
            <TextField
              required
              id="gitHubLink"
              label="GitHub Link"
              defaultValue={item?.gitHubInformation?.url}
              placeholder="https://github.com/LegendarySpork9/Portfolio"
              variant="outlined"
              sx={{ flex: 1 }}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input'], maxLength: 255}}
            />
            <TextField
              id="unitTestCoverage"
              label="Unit Test Coverage"
              defaultValue={item?.unitTestCoverage}
              placeholder="0.00"
              variant="outlined"
              sx={{ flex: 1 }}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
            />
          </div>
          <br />
          <div className={styles['sub-container']}>
            <Paper className={styles['card-paper']}>
              <LLMTable
                llmUsage={llmUsage}
                setLLMUsage={setLLMUsage}
              />
            </Paper>
            <TextField
              id="llmUsageNotes"
              label="LLM Usage Notes"
              defaultValue={item?.llmUsageNotes}
              placeholder="LLM Usage Notes"
              variant="outlined"
              multiline
              sx={{ flex: 1 }}
              InputLabelProps={{className: styles['sub-section-input-label']}}
              InputProps={{className: styles['sub-section-input-wrapper']}}
              inputProps={{className: styles['sub-section-input'], maxLength: 400}}
            />
          </div>
          {error && (
            <p className={styles['container-error']}>{error}</p>
          )}
        </CardContent>
        <div className={styles['container-action']}>
          {loading ? (
            <CircularProgress size={36.5} />
          ) : (
            <div style={{ display: 'flex', gap: '16px' }}>
              <Button
                type="submit"
                form="CreatePortfolioItem"
                variant="contained"
              >
                {isUpdate ? "Update" : "Create"}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/items")}
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </Card>
    </form>
  )
}

export default ItemDetail;