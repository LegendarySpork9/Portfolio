import IconButton from "@mui/material/IconButton";
import Dialog from '../Dialog/Dialog';
import "../../Colours.css";
import './Navbar.css';

interface NavebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  setAdmin: (value: boolean) => void;
}

function Navbar({open, setOpen, setAdmin}: NavebarProps) {
  
  return (
    <nav className="navbar" >
      <a href="https://github.com/LegendarySpork9" style={{paddingLeft: "2rem"}}>
        <img src="/github.svg" alt="Github" />
      </a>
      <div>
        Toby Hunter's Portfolio
      </div>
      <div style={{paddingRight: "2rem"}}>
        <IconButton onClick={() => setOpen(true)} style={{width: 36, height: 36}}>
          <img src="/account.png" alt="Account" />
        </IconButton>
      </div>
      <Dialog open={open} setOpen={setOpen} setAdmin={setAdmin} />
    </nav>
  );
};

export default Navbar;