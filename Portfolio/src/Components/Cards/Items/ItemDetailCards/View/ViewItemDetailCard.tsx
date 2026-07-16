import { useNavigate } from "react-router-dom";
import { useMedia } from "../../../../../Hooks/UseMedia";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper'
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import ImageCarousel from "../../../../Carousel/Carousel";
import TextField from "@mui/material/TextField";
import BuildTable from "../../../../Tables/BuildHistoryTables/View/BuildHistoryTable";
import { PieChart } from '@mui/x-charts/PieChart';
import InProgressTable from "../../../../Tables/GitHubInProgressTable/GitHubInProgressTable";
import { BarChart } from '@mui/x-charts/BarChart';
import LLMTable from "../../../../Tables/LLMUsageTables/View/LLMUsageTable";
import Button from "@mui/material/Button";
import "../../../../../Colours.css";
import styles from './ViewItemDetailCard.module.css';

import type { ItemModel  } from "../../../../../Types/Item";
import type { MediaModel } from "../../../../../Types/Media";

interface ItemDetailProps {
  item: ItemModel;
}

const ItemDetail = ({item}: ItemDetailProps) => {
  const response = useMedia(item.id).data;
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');

  var testCoverage: string
  var unitTestCoverageColour: string

  if (item.unitTestCoverage !== null) {
    if (item.unitTestCoverage >= 95.0) {
      testCoverage = `${item.unitTestCoverage}%`
      unitTestCoverageColour = "#ccff90"
    }

    else if (item.unitTestCoverage < 95.0 && item.unitTestCoverage > 65.0) {
      testCoverage = `${item.unitTestCoverage}%`
      unitTestCoverageColour = "orange"
    }

    else {
      testCoverage = `${item.unitTestCoverage}%`
      unitTestCoverageColour = "red"
    }
  }

  else {
    testCoverage = "No Unit Tests"
    unitTestCoverageColour = "var(--colour-text)"
  }

  const tags = [
    ...item.frameworks.map((label) => ({ label, color: "primary" as const, textColor: undefined as string | undefined, tooltip: undefined as string | undefined })),
    ...item.languages.map((label) => ({ label, color: "success" as const, textColor: undefined as string | undefined, tooltip: undefined as string | undefined })),
    ...item.environments.map((label) => ({ label, color: "secondary" as const, textColor: undefined as string | undefined, tooltip: undefined as string | undefined })),
    { label: testCoverage, color: "info" as const, textColor: unitTestCoverageColour as string | undefined, tooltip: "Unit Test Coverage" as string | undefined  }
  ];

  const media: MediaModel[] = Array.isArray(response) ? response : [];

  const images = [
    ...media.map((mediaItem) => ({ src: mediaItem.url, alt: String(mediaItem.id) }))
  ]
  const buildData = item.buildHistory ?? {}
  const newFeatures = item.gitHubInformation.issueBreakdown.newFeatures
  const bugs = item.gitHubInformation.issueBreakdown.bugs

  const pieData = [
    { value: newFeatures, label: 'New Features', color: 'blue' },
    { value: bugs, label: 'Bugs', color: 'red' }
  ]

  const hasIssueData = newFeatures + bugs > 0

  const pieParams = {
    height: 200
  }

  return (
      <Card className={styles['container']}>
        <div className={styles['container-title']}>
          {item.name}
        </div>
        <CardContent>
          <Paper className={styles['grid-container']}>
            {
              tags.map((tag) => {
                const chip = (
                  <Chip
                    key={tag.label}
                    label={tag.label}
                    color={tag.color}
                    sx={tag.textColor ? { '& .MuiChip-label': { color: tag.textColor } } : undefined}
                  />
                );

                return tag.tooltip ? (
                  <Tooltip
                    key={tag.label}
                    title={tag.tooltip}
                    arrow
                    placement="top"
                  >
                    {chip}
                  </Tooltip>
                ) : chip;
              })
            }
          </Paper>
          <br />
          {images.length > 0 ? (
            <Paper className={styles['card-paper']}>
              <ImageCarousel images={images} />
            </Paper>
          ) : (
            <Paper className={styles['card-paper']}>
              There are no images registered in the API for this item.
            </Paper>
          )}
          <br />
          <TextField
            disabled
            id="description"
            label="Description"
            defaultValue={item.description}
            variant="outlined"
            multiline
            fullWidth
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input']}}
          />
          {item.demoLink && (
            <div>
              <br />
              <Paper className={styles['card-paper']}>
                <a href={item.demoLink}>
                  {item.demoLink}
                </a>
              </Paper>
            </div>
          )}
          <br />
          <br />
          <div className={styles['sub-container']}>
            <Paper className={styles['card-paper']}>
              <BuildTable buildHistory={buildData} />
            </Paper>
            <TextField
              disabled
              id="releaseNotes"
              label="Release Notes"
              defaultValue={item.releaseNotes}
              variant="outlined"
              multiline
              sx={{ flex: 1 }}
              InputLabelProps={{className: styles['sub-section-input-label']}}
              InputProps={{className: styles['sub-section-input-wrapper']}}
              inputProps={{className: styles['sub-section-input']}}
            />
          </div>
          <br />
          <Paper className={styles['card-paper']}>
            <a href={item.gitHubInformation.url}>
              {item.gitHubInformation.url}
            </a>
          </Paper>
          <br />
          <Paper className={styles['card-paper']} >
            <div className={styles['github-section']}>
              <div className={styles['ci-chips']}>
                {item.gitHubInformation.ciStatus.map((ciStatus) => (
                  <Chip
                    key={ciStatus.workflow}
                    label={`${ciStatus.workflow}: ${ciStatus.status}`}
                    color={ciStatus.status === "Success" ? "success" : "error"}
                  />
                ))}
              </div>
              {hasIssueData ? (
                <PieChart
                  className={styles['pie-chart']}
                  series={[
                    {
                      data: pieData,
                      arcLabel: (item) => `${Math.round((item.value / (newFeatures + bugs)) * 100)}%`
                    }
                  ]}
                  slotProps={{
                    legend: {
                      direction: 'horizontal' as const,
                      position: {
                        vertical: 'bottom' as const,
                        horizontal: 'center' as const
                      }
                    }
                  }}
                  {...pieParams}
                />
              ) : (
                <Typography variant="body2" color="var(--colour-text)">
                  No items logged.
                </Typography>
              )}
              <BarChart
                className={styles['bar-chart']}
                dataset={item.gitHubInformation.assigneeBreakdown}
                xAxis={[{ label: 'Items' }]}
                yAxis={[{ scaleType: 'band', dataKey: 'name', width: 110 }]}
                series={[{ dataKey: 'issues', label: 'GitHub Issues' }]}
                layout="horizontal"
                width={isMobile ? 350 : 700}
                height={isMobile ? 300 : 400}
                margin={{ left: 0 }}
                slotProps={{ noDataOverlay: { style: { fill: 'var(--colour-text)' } } }}
              />
              <InProgressTable issueBreakdown={item.gitHubInformation.inProgressBreakdown} />
            </div>
          </Paper>
          {item.llmUsage !== null && (
            <div>
              <br />
              <div className={styles['sub-container']}>
                <Paper className={styles['card-paper']}>
                  <LLMTable llm={item.llmUsage} />
                </Paper>
                <TextField
                  disabled
                  id="llmUsageNotes"
                  label="LLM Usage Notes"
                  defaultValue={item.llmUsageNotes}
                  variant="outlined"
                  multiline
                  sx={{ flex: 1 }}
                  InputLabelProps={{className: styles['sub-section-input-label']}}
                  InputProps={{className: styles['sub-section-input-wrapper']}}
                  inputProps={{className: styles['sub-section-input']}}
                />
              </div>
            </div>
          )}
        </CardContent>
        <div className={styles['container-action']}>
          <Button
            type="submit"
            form="login-form"
            variant="contained"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </div>
      </Card>
  )
}

export default ItemDetail;