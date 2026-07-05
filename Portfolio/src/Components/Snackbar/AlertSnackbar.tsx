import { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AlertSnackbarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  event: string;
}

type Severity = 'success' | 'info' | 'warning' | 'error';

const AlertSnackbar = ({open, setOpen, event}: AlertSnackbarProps) => {
  const [severity, setSeverity] = useState<Severity>('success');
  const [message, setMessage] = useState("");

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  useEffect(() => {
    if (event === "Login") {
      setMessage("Successfully logged in!");
      setSeverity("success");
      setOpen(true);
    }
    
    else if (event === "Logout") {
      setMessage("Successfully logged out!");
      setSeverity("info");
      setOpen(true);
    }
  }, [event, setOpen]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{ width: '100%' }}
          variant="filled"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AlertSnackbar;