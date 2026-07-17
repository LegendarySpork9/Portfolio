import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Markdown from "markdown-to-jsx";
import styles from './UpcomingProjects.module.css';
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { useUpcomingProjects } from "../../../Hooks/UseGitHub";
import "../../../Colours.css";

interface UpcomingProjectsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const UpcomingProjects = ({ open, setOpen }: UpcomingProjectsProps) => {
  const { data: markdown, isLoading, error } = useUpcomingProjects();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{ paper: { className: styles.container } }}
      >
        <DialogTitle className={styles['container-title']}>
          Upcoming Projects
        </DialogTitle>
        <DialogContent>
          {isLoading && (
            <div className={styles.loading}>
              <CircularProgress aria-label="Loading..." />
            </div>
          )}
          {error && (
            <Typography className={styles.error}>
              Failed to load upcoming projects.
            </Typography>
          )}
          {markdown && (
            <div className={styles['markdown-content']}>
              <Markdown>{markdown}</Markdown>
            </div>
          )}
        </DialogContent>
        <DialogActions className={styles['container-action']}>
          <Button
            variant="contained"
            onClick={handleClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default UpcomingProjects;
