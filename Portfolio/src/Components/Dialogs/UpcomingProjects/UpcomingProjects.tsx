import { Fragment } from "react";
import Markdown from "markdown-to-jsx";
import { useUpcomingProjects } from "../../../Hooks/UseGitHub";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import "../../../Colours.css";
import styles from './UpcomingProjects.module.css';

interface UpcomingProjectsProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

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
