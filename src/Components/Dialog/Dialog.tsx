import { useState, FormEvent, Fragment } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import "../../Colours.css";
import './Dialog.css'

interface DialogBoxProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    setAdmin: (value: boolean) => void;
}

const DialogBox = ({open, setOpen, setAdmin}: DialogBoxProps) => {
  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setLoading(true)
    
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const username = formJson.username;
    const password = formJson.password;

    if (username === "Test" && password === "Test1234!"){
      setAdmin(true);
      handleClose();
    }

    setLoading(false)
  };

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} slotProps={{paper: {className: "container"}}}>
        <DialogTitle className="container-title">Login</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="login-form">
            <TextField
              required
              margin="dense"
              id="username"
              name="username"
              placeholder="Username"
              type="text"
              variant="outlined"
              InputLabelProps={{className: "container-input-label"}}
              inputProps={{className: "container-input"}}
            />
            <br />
            <TextField
              required
              margin="dense"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              variant="outlined"
              InputLabelProps={{className: "container-input-label"}}
              inputProps={{className: "container-input"}}
            />
          </form>
        </DialogContent>
        <DialogActions className="container-action">
          {loading && (
            <CircularProgress size={36.5} />
          )}
          {!loading && (
            <Button type="submit" form="login-form" variant="contained">Submit</Button>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default DialogBox;