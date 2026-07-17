import AlertSnackbar from "../../Components/Snackbar/AlertSnackbar";
import Button from "@mui/material/Button";
import Card from "../../Components/Cards/Filters/FilterCard";
import CircularProgress from "@mui/material/CircularProgress";
import FilterForm from '../../Components/Dialogs/FilterForm/FilterForm';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from "@mui/material/IconButton";
import LeftSidebar from '../../Components/Sidebars/Left/LeftSidebar';
import Navbar from '../../Components/Navbar/Navbar';
import styles from './Filters.module.css';
import { useAuth } from "../../Contexts/AuthContext";
import { useFilters } from "../../Hooks/UseFilter";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../Colours.css";

import type { FilterModel } from "../../Types/Filter";

function FiltersPage() {
  const { isAdmin } = useAuth();
  const { data: filters, isLoading, error } = useFilters(true);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [isUpdate] = useState(false);
  const [selectedFilter] = useState<FilterModel>();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  if (isLoading)
    return (
      <div className={styles['filter-container']}>
        <div className={styles['data-loading']}>
          <CircularProgress aria-label="Loading…" />
        </div> 
      </div>
    );
  
  if (error)
    return (
      <div className={styles['filter-container']}>
        <div className={styles['data-loading']}>
          Failed to load filters.
        </div>
      </div>
    );
  
  const allFilters = filters ?? [];

  const handleSuccess = (message: string) => {
    setAlertMessage(message);
    setOpenAlert(true);
  };

  if (isAdmin) {
    return (
      <div className={styles['filter-container']}>
        <div className={styles.button}>
          <Button variant="contained" onClick={ () => setOpen(true)}>
            Create Filter
          </Button>
        </div>

        <div className={styles['filter-grid']}>
          {
            allFilters.map((filter: FilterModel) => (
              <Card {...filter} onSuccess={handleSuccess} />
            ))
          }
        </div>

        <LeftSidebar/>

        <Navbar />

        <FilterForm
          isUpdate={isUpdate}
          filter={selectedFilter}
          open={open}
          setOpen={setOpen}
          onSuccess={handleSuccess} />

        <AlertSnackbar
          open={openAlert}
          setOpen={setOpenAlert}
          severity="success"
          message={alertMessage} />
      </div>
    );
  }

  else {
    return (
      <div className={styles['filter-container']}>
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

export default FiltersPage;