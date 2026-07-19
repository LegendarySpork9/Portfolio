import axios from "axios";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from '@mui/material/MenuItem';
import styles from './FilterForm.module.css';
import TextField from '@mui/material/TextField';
import { useNewFilter, useUpdateFilter, useDeleteFilter } from "../../../Hooks/UseFilter";
import { useState, FormEvent, Fragment } from "react";
import "../../../Colours.css";

import type { FilterModel, FilterRequestModel, FilterType } from "../../../Types/Filter";

const operatorsByType: Record<string, string[]> = {
  tag: [],
  numeric: ["equals", "not equals", "greater than", "less than", "between"],
  text: ["contains", "not contains", "equals", "not equals", "starts with", "ends with"],
  boolean: ["is true", "is false"],
  null: ["has value", "has no value"],
  comparison: ["equals", "not equals", "greater than", "less than"],
};

const knownPaths = [
  "name",
  "type",
  "summary",
  "description",
  "demoLink",
  "releaseNotes",
  "unitTestCoverage",
  "llmUsage",
  "llmUsageNotes",
  "isDeleted",
  "gitHubInformation.issueBreakdown.totalIssues",
  "gitHubInformation.issueBreakdown.bugs",
  "gitHubInformation.issueBreakdown.newFeatures",
];

const numericPaths = [
  "unitTestCoverage",
  "gitHubInformation.issueBreakdown.totalIssues",
  "gitHubInformation.issueBreakdown.bugs",
  "gitHubInformation.issueBreakdown.newFeatures",
];

interface FilterFormProps {
  isUpdate: boolean;
  filter?: FilterModel;
  open: boolean;
  setOpen: (value: boolean) => void;
  onSuccess?: (message: string) => void;
};

const FilterForm = ({isUpdate, filter, open, setOpen, onSuccess}: FilterFormProps) => {
  const newFilter = useNewFilter();
  const updateFilter = useUpdateFilter();
  const deleteFilter = useDeleteFilter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<FilterType>(filter?.type ?? "tag");
  const [selectedOperator, setSelectedOperator] = useState(filter?.operator ?? "");

  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const operator = formData.get("operator") as string || null;
    const path = formData.get("path") as string || null;

    let values = "";

    if (type === "tag") {
      values = (formData.get("values") as string ?? "").split("\n").filter(v => v.trim() !== "").join(",");
    }
    
    else if (type === "comparison") {
      values = formData.get("comparePath") as string ?? "";
    }
    
    else if (type === "numeric" || type === "text") {
      values = formData.get("filterValue") as string ?? "";

      if (type === "numeric" && operator === "between") {
        const value2 = formData.get("filterValue2") as string ?? "";
        values = `${values},${value2}`;
      }
    }

    try {
      if (isUpdate && filter) {
        const request: Partial<FilterRequestModel> = {};

        if (name !== filter.name) {
          request.name = name;
        }

        if (type !== filter.type) {
          request.type = type;
        }

        if (operator !== filter.operator) {
          request.operator = operator;
        }

        if (path !== filter.path) {
          request.path = path;
        }

        const currentValues = filter.values.join(",");

        if (values !== currentValues) {
          request.values = values;
        }

        if (Object.keys(request).length > 0) {
          await updateFilter.mutateAsync({
            id: filter.id,
            request: request as FilterRequestModel
          });
        }

        handleClose();
        onSuccess?.("Filter updated successfully");
      }

      else {
        await newFilter.mutateAsync({
          name,
          type,
          operator,
          path,
          values
        });

        handleClose();
        onSuccess?.("Filter created successfully");
      }
    }

    catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;

        setError(typeof data === "string" ? data : data.message?.information || data.message?.error || (typeof data.message === "string" ? data.message : "Failed to save filter."));
      }

      else {
        setError("Failed to save filter.");
      }
    }

    finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      if (isUpdate && filter) {
        await deleteFilter.mutateAsync(filter.id);

        handleClose();
        onSuccess?.("Filter deleted successfully");
      }

      else {
        setError("Failed to delete filter.");
      }
    }

    catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;

        setError(typeof data === "string" ? data : data.message?.information || data.message?.error || (typeof data.message === "string" ? data.message : "Failed to delete filter."));
      }

      else {
        setError("Failed to delete filter.");
      }
    }

    finally {
      setLoading(false);
    }
  };

  const operators = operatorsByType[filterType] ?? [];
  const showValues = filterType === "tag";
  const showSingleValue = filterType === "numeric" || filterType === "text";
  const showSecondValue = filterType === "numeric" && selectedOperator === "between";

  const selectMenuProps = {
    PaperProps: { className: styles['container-select-paper'] }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{paper: {className: styles.container}}}
      >
        <DialogTitle className={styles['container-title']}>
          {isUpdate ? `Update Filter ${filter?.id}` : "Create Filter"}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit}
            id="filter-form"
          >
            <TextField
              required
              margin="dense"
              id="name"
              name="name"
              label="Name"
              defaultValue={filter?.name}
              placeholder="Languages"
              type="text"
              variant="outlined"
              disabled={filter?.isDeleted}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input'], maxLength: 50}}
            />
            <br />
            <TextField
              required
              select
              margin="dense"
              id="type"
              name="type"
              label="Type"
              defaultValue={filter?.type ?? "tag"}
              variant="outlined"
              disabled={filter?.isDeleted}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              InputLabelProps={{className: styles['container-input-label']}}
              InputProps={{className: styles['container-input-wrapper']}}
              inputProps={{className: styles['container-input']}}
              SelectProps={{MenuProps: selectMenuProps}}
              className={styles['container-select']}
            >
              <MenuItem value="tag">Tag</MenuItem>
              <MenuItem value="numeric">Numeric</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="boolean">Boolean</MenuItem>
              <MenuItem value="null">Null Check</MenuItem>
              <MenuItem value="comparison">Comparison</MenuItem>
            </TextField>
            <br />
            {operators.length > 0 && (
              <>
                <TextField
                  required
                  select
                  margin="dense"
                  id="operator"
                  name="operator"
                  label="Operator"
                  defaultValue={filter?.operator ?? ""}
                  variant="outlined"
                  disabled={filter?.isDeleted}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  InputLabelProps={{className: styles['container-input-label']}}
                  InputProps={{className: styles['container-input-wrapper']}}
                  inputProps={{className: styles['container-input']}}
                  SelectProps={{MenuProps: selectMenuProps}}
                  className={styles['container-select']}
                >
                  {operators.map(op => (
                    <MenuItem key={op} value={op}>{op}</MenuItem>
                  ))}
                </TextField>
                <br />
              </>
            )}
            {filterType !== "tag" && filterType !== "comparison" && (
              <>
                <TextField
                  required
                  select
                  margin="dense"
                  id="path"
                  name="path"
                  label="Path"
                  defaultValue={filter?.path ?? ""}
                  variant="outlined"
                  disabled={filter?.isDeleted}
                  InputLabelProps={{className: styles['container-input-label']}}
                  InputProps={{className: styles['container-input-wrapper']}}
                  inputProps={{className: styles['container-input']}}
                  SelectProps={{MenuProps: selectMenuProps}}
                  className={styles['container-select']}
                >
                  {knownPaths.map(p => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>
                <br />
              </>
            )}
            {filterType === "comparison" && (
              <>
                <TextField
                  required
                  select
                  margin="dense"
                  id="path"
                  name="path"
                  label="Path"
                  defaultValue={filter?.path ?? ""}
                  variant="outlined"
                  disabled={filter?.isDeleted}
                  InputLabelProps={{className: styles['container-input-label']}}
                  InputProps={{className: styles['container-input-wrapper']}}
                  inputProps={{className: styles['container-input']}}
                  SelectProps={{MenuProps: selectMenuProps}}
                  className={styles['container-select']}
                >
                  {numericPaths.map(p => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>
                <br />
                <TextField
                  required
                  select
                  margin="dense"
                  id="comparePath"
                  name="comparePath"
                  label="Compare Path"
                  defaultValue={filter?.values[0] ?? ""}
                  variant="outlined"
                  disabled={filter?.isDeleted}
                  InputLabelProps={{className: styles['container-input-label']}}
                  InputProps={{className: styles['container-input-wrapper']}}
                  inputProps={{className: styles['container-input']}}
                  SelectProps={{MenuProps: selectMenuProps}}
                  className={styles['container-select']}
                >
                  {numericPaths.map(p => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </TextField>
                <br />
              </>
            )}
            {showValues && (
              <>
                <TextField
                  required
                  margin="dense"
                  id="outlined-multiline-flexible"
                  name="values"
                  label="Values"
                  defaultValue={filter?.values.join("\n")}
                  placeholder="C#"
                  variant="outlined"
                  multiline
                  maxRows={4}
                  disabled={filter?.isDeleted}
                  InputLabelProps={{className: styles['container-input-label']}}
                  InputProps={{className: styles['container-input-wrapper']}}
                  inputProps={{className: styles['container-input']}}
                />
              </>
            )}
            {showSingleValue && (
              <>
                <TextField
                  required
                  margin="dense"
                  id="filterValue"
                  name="filterValue"
                  label="Value One"
                  defaultValue={filter?.values[0] ?? ""}
                  placeholder={filterType === "numeric" ? "0" : "Search text"}
                  type={filterType === "numeric" ? "number" : "text"}
                  variant="outlined"
                  disabled={filter?.isDeleted}
                  InputLabelProps={{className: styles['container-input-label']}}
                  InputProps={{className: styles['container-input-wrapper']}}
                  inputProps={{className: styles['container-input']}}
                />
                {showSecondValue && (
                  <>
                  <br />
                  <TextField
                    required
                    margin="dense"
                    id="filterValue2"
                    name="filterValue2"
                    label="Value Two"
                    defaultValue={filter?.values[1] ?? ""}
                    placeholder="0"
                    type="number"
                    variant="outlined"
                    disabled={filter?.isDeleted}
                    InputLabelProps={{className: styles['container-input-label']}}
                    InputProps={{className: styles['container-input-wrapper']}}
                    inputProps={{className: styles['container-input']}}
                  />
                  </>
                )}
              </>
            )}
            {error && (
              <p className={styles['container-error']}>{error}</p>
            )}
          </form>
        </DialogContent>
        {!filter?.isDeleted && (
          <DialogActions className={styles['container-action']}>
            {loading ? (
              <CircularProgress size={36.5} />
            ) : (
              <div className={styles['container-buttons']}>
                <Button
                  type="submit"
                  form="filter-form"
                  variant="contained"
                >
                  {isUpdate ? "Update" : "Create"}
                </Button>

                {isUpdate && (
                  <Button
                    type="button"
                    onClick={ () => handleDelete()}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                )}
              </div>
            )}
          </DialogActions>
        )}
      </Dialog>
    </Fragment>
  );
};

export default FilterForm;
