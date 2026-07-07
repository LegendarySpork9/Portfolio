import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import IconButton from "@mui/material/IconButton";
import LoginForm from '../Dialogs/LoginForm/LoginForm';
import "../../Colours.css";
import styles from './Navbar.module.css';

function Navbar() {
  const [open, setOpen] = useState(false);

  const { isAdmin } = useAuth();
  
  return (
    <nav className={styles.navbar} >
      <a
        href="https://github.com/LegendarySpork9"
        style={{paddingLeft: "2rem"}}
      >
        <img
          src="/github.svg"
          alt="Github"
        />
      </a>
      <div>
        Toby Hunter's Portfolio
      </div>
      <div style={{paddingRight: "2rem"}}>
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
    </nav>
  );
};

export default Navbar;