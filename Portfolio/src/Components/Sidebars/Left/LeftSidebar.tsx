import Button from "@mui/material/Button";
import Divider from '@mui/material/Divider';
import EditDocument from '@mui/icons-material/EditDocument';
import HomeIcon from '@mui/icons-material/Home';
import Logout from '@mui/icons-material/Logout';
import styles from './LeftSidebar.module.css';
import Typography from "@mui/material/Typography";
import { useAuth } from "../../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../../Colours.css";

function LeftSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [hovered, setHovered] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`${styles['sidebar-left']} ${hovered ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Button
        className={styles['sidebar-left-content']}
        disabled={!hovered}
        classes={{ root: styles['sidebar-left-button'] }}
        TouchRippleProps={{ style: { color: "var(--colour-text)" } }}
        sx={{ justifyContent: 'flex-start', pl: '0.75rem'}}
        onClick={() => navigate("/")}
      >
        <HomeIcon className={styles['sidebar-left-icon']} />
        <Typography
          className={styles['sidebar-left-text']}
          variant="body1"
        >
          Home
        </Typography>
      </Button>
      <Button
        className={`${styles['sidebar-left-content']} ${hovered ? styles.expanded : ""}`}
        disabled={!hovered}
        classes={{ root: styles['sidebar-left-button'] }}
        TouchRippleProps={{ style: { color: "var(--colour-text)" } }}
        sx={{ justifyContent: 'flex-start', pl: '0.75rem'}}
        onClick={() => navigate("/items")}
      >
        <EditDocument className={styles['sidebar-left-icon']} />
        <Typography
          className={styles['sidebar-left-text']}
          variant="body1"
        >
          Edit Items
        </Typography>
      </Button>
      <Button
        className={`${styles['sidebar-left-content']} ${hovered ? styles.expanded : ""}`}
        disabled={!hovered}
        classes={{ root: styles['sidebar-left-button'] }}
        TouchRippleProps={{ style: { color: "var(--colour-text)" } }}
        sx={{ justifyContent: 'flex-start', pl: '0.75rem'}}
        onClick={() => navigate("/filters")}
      >
        <img
          src="/filter.svg"
          alt="Language"
          className={styles['sidebar-left-icon']}
        />
        <Typography
          className={styles['sidebar-left-text']}
          variant="body1"
        >
          Edit Filters
        </Typography>
      </Button>

      <div className={styles['sidebar-left-bottom']}>
        <Divider />
        <Button
          className={`${styles['sidebar-left-content']} ${hovered ? styles.expanded : ""}`}
          disabled={!hovered}
          classes={{ root: styles['sidebar-left-button'] }}
          TouchRippleProps={{ style: { color: "var(--colour-text)" } }}
          sx={{ justifyContent: 'flex-start', pl: '0.75rem'}}
          onClick={() => handleLogout()}
        >
          <Logout className={styles['sidebar-left-icon']} />
          <Typography
            className={styles['sidebar-left-text']}
            variant="body1"
          >
            Logout
          </Typography>
        </Button>
      </div>
    </div>
  );
};

export default LeftSidebar;