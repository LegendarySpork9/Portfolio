import { Fragment } from "react"; 
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import "../../../Colours.css";
import styles from './SummaryBox.module.css';

const items = [
  {
    id: 1,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "NASA Image Report",
    status: "Green",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 2,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "GitHub to Codecks",
    status: "Yellow",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 3,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Hunter Industries API",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", "CSS", "SQL", ".NET Framework", "ASP.NET", "Website"]
  },
  {
    id: 4,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Server Status",
    status: "Green",
    date: "30 September 2025 21:20",
    tags: ["C#", "HTML", "CSS", ".NET", "MSTest", "Website"]
  },
  {
    id: 5,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Server Backup Tool",
    status: "Yellow",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "MSTest", "Windows"]
  },
  {
    id: 6,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Database BLM Creator",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 7,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "RAG V3",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET", "Windows"]
  },
  {
    id: 8,
    image: "https://raw.githubusercontent.com/LegendarySpork9/Other-Projects/refs/heads/main/NASA%20Image%20Report/NASA%20Image%20Report/Content/Logo.ico",
    title: "Google Drive Sync",
    status: "Red",
    date: "30 September 2025 21:20",
    tags: ["C#", ".NET Framework", "MSTest", "Windows"]
  }
]

interface SummaryBoxProps {
  itemId: number;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SummaryBox = ({itemId, open, setOpen}: SummaryBoxProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} slotProps={{paper: {className: styles.container}}}>
        <DialogTitle className={styles['container-title']}>{items.find(i => i.id === itemId)?.title}</DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions className={styles['container-action']}>
          <Button type="submit" form="login-form" variant="contained">View Item</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default SummaryBox;