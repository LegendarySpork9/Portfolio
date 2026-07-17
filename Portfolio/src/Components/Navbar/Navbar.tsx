import IconButton from "@mui/material/IconButton";
import LoginForm from '../Dialogs/LoginForm/LoginForm';
import NewReleasesOutlinedIcon from "@mui/icons-material/NewReleasesOutlined";
import styles from './Navbar.module.css';
import UpcomingProjects from '../Dialogs/UpcomingProjects/UpcomingProjects';
import { useAuth } from "../../Contexts/AuthContext";
import { useState } from "react";
import "../../Colours.css";

function Navbar() {
  const { isAdmin } = useAuth();

  const [open, setOpen] = useState(false);
  const [upcomingOpen, setUpcomingOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <a
        href="https://github.com/LegendarySpork9"
        style={{paddingLeft: "10px"}}
      >
        <img
          src="/github.svg"
          alt="Github"
        />
      </a>
      <div>
        Toby Hunter's Portfolio
      </div>
      <div style={{paddingRight: "14px", display: "flex", alignItems: "center", gap: "4px"}}>
        <IconButton
          onClick={() => setUpcomingOpen(true)}
          style={{width: 36, height: 36, color: "var(--colour-text)"}}
        >
          <NewReleasesOutlinedIcon />
        </IconButton>
        <IconButton
          onClick={() => setOpen(true)}
          disabled={isAdmin}
          style={{width: 36, height: 36}}
        >
          <img
            src="/account.png"
            alt="Account"
          />
        </IconButton>
      </div>
      {!isAdmin && (
        <LoginForm
          open={open}
          setOpen={setOpen}
        />
      )}
      <UpcomingProjects
        open={upcomingOpen}
        setOpen={setUpcomingOpen}
      />
    </nav>
  );
};

export default Navbar;