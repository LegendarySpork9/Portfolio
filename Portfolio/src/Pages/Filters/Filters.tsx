import { useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { useFilters } from "../../Hooks/UseFilter";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Card from "../../Components/Cards/Filters/FilterCard";
import LeftSidebar from '../../Components/Sidebars/Left/LeftSidebar'
import Navbar from '../../Components/Navbar/Navbar'
import FilterForm from '../../Components/Dialogs/FilterForm/FilterForm'
import IconButton from "@mui/material/IconButton";
import HomeIcon from '@mui/icons-material/Home';
import "../../Colours.css";
import styles from './Filters.module.css';

import type { FilterModel } from "../../Types/Filter";

function FiltersPage() {
  const [open, setOpen] = useState(false);
  const [isUpdate] = useState(false);
  const [selectedFilter] = useState<FilterModel>();
  
  const { isAdmin } = useAuth();
  const { data: filters, isLoading, error } = useFilters(true);
  const navigate = useNavigate();

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
              <Card {...filter} />
            ))
          }
        </div>

        <LeftSidebar/>

        <Navbar />

        <FilterForm
          isUpdate={isUpdate}
          filter={selectedFilter}
          open={open}
          setOpen={setOpen} />
      </div>
    )
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
    )
  }
}

export default FiltersPage;