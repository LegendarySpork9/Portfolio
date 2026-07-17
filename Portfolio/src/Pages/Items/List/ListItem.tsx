import AlertSnackbar from "../../../Components/Snackbar/AlertSnackbar";
import Button from "@mui/material/Button";
import Card from "../../../Components/Cards/Items/ItemCard/ItemCard";
import CircularProgress from "@mui/material/CircularProgress";
import HomeIcon from '@mui/icons-material/Home';
import IconButton from "@mui/material/IconButton";
import LeftSidebar from '../../../Components/Sidebars/Left/LeftSidebar';
import Navbar from '../../../Components/Navbar/Navbar';
import styles from './ListItem.module.css';
import { useAuth } from "../../../Contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { usePortfolio } from "../../../Hooks/UsePortfolio";
import { useState, useEffect } from "react";
import "../../../Colours.css";

import type { ItemModel } from "../../../Types/Item";

function ListItemPage() {
  const { isAdmin } = useAuth();
  const { data: items, isLoading, error } = usePortfolio(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [openAlert, setOpenAlert] = useState(false);

  useEffect(() => {
    if (location.state?.created) {
      setOpenAlert(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  if (isLoading)
    return (
      <div className={styles['list-container']}>
        <div className={styles['data-loading']}>
          <CircularProgress aria-label="Loading…" />
        </div> 
      </div>
    );
    
    if (error)
      return (
        <div className={styles['list-container']}>
          <div className={styles['data-loading']}>
            Failed to load portfolio items.
          </div>
        </div>
      );

  const allItems = items ?? [];

  if (isAdmin) {
    return (
      <div className={styles['list-container']}>
        <div className={styles.button}>
          <Button variant="contained" onClick={ () => navigate("/item?mode=create")}>
            Create Item
          </Button>
        </div>

        <div className={styles['list-grid']}>
          {
            allItems.map((item: ItemModel) => (
              <Card {...item} />
            ))
          }
        </div>

        <LeftSidebar/>

        <Navbar />

        <AlertSnackbar
          open={openAlert}
          setOpen={setOpenAlert}
          severity="success"
          message="Item created successfully!"/>
      </div>
    );
  }

  else {
    return (
      <div className={styles['list-container']}>
        <div className={styles['data-loading']}>
          <div>
            You are not authorised to view this page.
            Click the icon to go home.
          </div>
          <IconButton
            aria-label="home"
            size="large"
            onClick={() => navigate("/")}
          >
            <HomeIcon className={styles['home-icon']} />
          </IconButton>
        </div>
      </div>
    );
  };
};

export default ListItemPage;