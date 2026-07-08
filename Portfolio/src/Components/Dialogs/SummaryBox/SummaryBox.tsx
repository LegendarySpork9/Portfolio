import { Fragment } from "react"; 
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import { PieChart } from '@mui/x-charts/PieChart';
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "../../../Colours.css";
import styles from './SummaryBox.module.css';

import type { ItemGitHubCIStatusModel, ItemGitHubIssueBreakdownModel } from "../../../Types/Item";

interface SummaryBoxProps {
  id: number
  name: string;
  summary: string;
  frameworks: string[];
  languages: string[];
  environments: string[];
  ciStatuses: ItemGitHubCIStatusModel[];
  issueBreakdown: ItemGitHubIssueBreakdownModel;
  latestBuildNumber: string;
  unitTestCoverage: number | null;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SummaryBox = ({name, summary, frameworks, languages, environments, ciStatuses, issueBreakdown, latestBuildNumber, unitTestCoverage, open, setOpen}: SummaryBoxProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const tags = [
    ...frameworks.map((label) => ({ label, color: "primary" as const })),
    ...languages.map((label) => ({ label, color: "success" as const })),
    ...environments.map((label) => ({ label, color: "secondary" as const })),
  ];

  const newFeatures = issueBreakdown.newFeatures
  const bugs = issueBreakdown.bugs

  const pieData = [
    { value: newFeatures, label: 'New Features', color: 'blue' },
    { value: bugs, label: 'Bugs', color: 'red' }
  ]

  const pieParams = {
    height: 200
  }

  var unitTestCoverageColour: string

  if (unitTestCoverage !== null) {
    if (unitTestCoverage >= 95.0) {
      unitTestCoverageColour = "green"
    }

    else if (unitTestCoverage < 95.0 && unitTestCoverage > 65.0) {
      unitTestCoverageColour = "orange"
    }

    else {
      unitTestCoverageColour = "red"
    }
  }

  else {
    unitTestCoverageColour = "var(--colour-text)"
  }

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{paper: {className: styles.container}}}
      >
        <DialogTitle className={styles['container-title']}>
          {name}
        </DialogTitle>
        <DialogContent>
          <br />
          <Paper className={styles['grid-container']}>
            {
              tags.map((tag) => (
                <Chip
                  key={tag.label}
                  label={tag.label}
                  color={tag.color}
                />
              ))
            }
          </Paper>
          <br />
          <TextField
            disabled
            id="summary"
            label="Summary"
            defaultValue={summary}
            variant="outlined"
            multiline
            InputLabelProps={{className: styles['container-input-label']}}
            InputProps={{className: styles['container-input-wrapper']}}
            inputProps={{className: styles['container-input']}}
          />
          <br />
          <br />
          <Paper className={styles['card-paper']} >
            <div className={styles['github-section']}>
              <div className={styles['ci-chips']}>
                {ciStatuses.map((ciStatus) => (
                  <Chip
                    key={ciStatus.workflow}
                    label={`${ciStatus.workflow}: ${ciStatus.status}`}
                    color={ciStatus.status === "Success" ? "success" : "error"}
                  />
                ))}
              </div>
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
            </div>
          </Paper>
          <br />
          <div className={styles['card-div']} >
            <Tooltip
              title="Latest Build Number"
              arrow
              placement="top"
              >
              <Paper
                className={styles['card-paper']}
                style={{flex: "1"}}
              >
                <Typography
                  variant="subtitle2"
                  color="var(--colour-text)"
                >
                  {latestBuildNumber}
                </Typography>
              </Paper>
            </Tooltip>
          
            <Tooltip
              title="Unit Test Coverage"
              arrow
              placement="top"
            >
              <Paper
                className={styles['card-paper']}
                style={{flex: "1"}}
              >
                <Typography
                  variant="subtitle2"
                  color={unitTestCoverageColour}
                >
                  {unitTestCoverage === null ? "No Unit Tests" : `${unitTestCoverage}%`}
                </Typography>
              </Paper>
            </Tooltip>
          </div>
        </DialogContent>
        <DialogActions className={styles['container-action']}>
          <Button
            type="submit"
            form="login-form"
            variant="contained"
          >
            View Item
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default SummaryBox;