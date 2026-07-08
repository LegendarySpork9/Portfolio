import { useAuth } from "../../../Contexts/AuthContext";
import { usePortfolio } from "../../../Hooks/UsePortfolio";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Card from "../../../Components/Cards/Items/ItemCard/ItemCard";
import Navbar from '../../../Components/Navbar/Navbar'
import LeftSidebar from '../../../Components/Sidebars/Left/LeftSidebar'
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';
import "../../../Colours.css";
import styles from './ListItem.module.css';

import type { ItemModel } from "../../../Types/Item";

function ListItemPage() {
  const { isAdmin } = useAuth();
  const { data: items, isLoading, error } = usePortfolio(true);
  const navigate = useNavigate();

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
          <Button variant="contained" onClick={ () => navigate("/item")}>
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
      </div>
    )
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
    )
  }
}

export default ListItemPage;