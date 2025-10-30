import { useState } from "react";
import Button from "@mui/material/Button";
import EditDocument from '@mui/icons-material/EditDocument';
import Logout from '@mui/icons-material/Logout';
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import "../../../Colours.css";
import './LeftSidebar.css'

interface LeftSidebarProps {
  setAdmin: (value: boolean) => void;
}

function LeftSidebar({ setAdmin }: LeftSidebarProps) {
  const [hovered, setHovered] = useState(false);

  return (
<div
  className={`sidebar-left ${hovered ? "expanded" : "collapsed"}`}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
>
  <Button
    className={`sidebar-left-content ${hovered ? "expanded" : ""}`}
    disabled={!hovered}
    classes={{ root: "sidebar-left-button" }}
    TouchRippleProps={{ style: { color: "var(--colour-text)" } }}
  >
    <EditDocument className="sidebar-left-icon" />
    <Typography className="sidebar-left-text" variant="body1">
      Edit Items
    </Typography>
  </Button>

  <div className="sidebar-left-bottom">
    <Divider />
    <Button
      className={`sidebar-left-content ${hovered ? "expanded" : ""}`}
      disabled={!hovered}
      classes={{ root: "sidebar-left-button" }}
      TouchRippleProps={{ style: { color: "var(--colour-text)" } }}
      onClick={() => setAdmin(false)}
    >
      <Logout className="sidebar-left-icon" />
      <Typography className="sidebar-left-text" variant="body1">
        Logout
      </Typography>
    </Button>
  </div>
</div>
  );
}

export default LeftSidebar;