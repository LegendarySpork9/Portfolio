import { useState, FormEvent, Fragment } from "react";
import axios from "axios";
import { useAuth } from "../../../Contexts/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from '@mui/material/TextField';
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import "../../../Colours.css";
import styles from './LoginForm.module.css';

interface LoginFormProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const LoginForm = ({open, setOpen}: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  
  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const encoded = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-512", encoded);
    const hashedPassword = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    try {
      await login({ username, password: hashedPassword });

      handleClose();
    }

    catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data;

        setError(typeof data === "string" ? data : data.message || "Login failed.");
      }
      
      else {
        setError("Login failed.");
      }
    }

    finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{paper: {className: styles.container}}}
      >
        <DialogTitle className={styles['container-title']}>
          Login
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit}
            id="login-form"
          >
            <TextField
              required
              margin="dense"
              id="username"
              label="Username"
              name="username"
              placeholder="Username"
              type="text"
              variant="outlined"
              InputLabelProps={{className: styles['container-input-label']}}
              inputProps={{className: styles['container-input']}}
            />
            <br />
            <TextField
              required
              margin="dense"
              id="password"
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
              variant="outlined"
              InputLabelProps={{className: styles['container-input-label']}}
              inputProps={{className: styles['container-input']}}
            />
            {error && (
              <p className={styles['container-error']}>{error}</p>
            )}
          </form>
        </DialogContent>
        <DialogActions className={styles['container-action']}>
          {loading ? (
            <CircularProgress size={36.5} />
          ) : (
            <Button
              type="submit"
              form="login-form"
              variant="contained"
            >
              Submit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

export default LoginForm;