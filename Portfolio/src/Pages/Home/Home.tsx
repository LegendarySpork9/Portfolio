import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { usePortfolio } from "../../Hooks/UsePortfolio";
import { useFilters } from "../../Hooks/UseFilter";
import Navbar from '../../Components/Navbar/Navbar'
import LeftSidebar from '../../Components/Sidebars/Left/LeftSidebar'
import RightSidebar from '../../Components/Sidebars/Right/RightSidebar'
import CircularProgress from "@mui/material/CircularProgress";
import Card from '../../Components/Cards/ItemCard/ItemCard'
import AlertSnackbar from "../../Components/Snackbar/AlertSnackbar";
import "../../Colours.css";
import styles from './Home.module.css';

import type { ItemModel } from "../../Types/Item";

function Home() {
 const { isAdmin } = useAuth();

  const { data: items, isLoading, error } = usePortfolio();
  const { data: filters, isLoading: filtersLoading, error: filtersError } = useFilters();

  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState("");

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const prevIsAdmin = useRef(isAdmin);

  useEffect(() => {
    if (prevIsAdmin.current === isAdmin) return;

    if (isAdmin) {
      setAlertMessage("Successfully logged in!");
      setAlertSeverity("success");
    } else {
      setAlertMessage("Successfully logged out!");
      setAlertSeverity("info");
    }

    setOpenAlert(true);
    prevIsAdmin.current = isAdmin;
  }, [isAdmin]);

  if (isLoading || filtersLoading)
    return (
      <div className={styles['home-container']}>
        <div className={styles['data-loading']}>
          <CircularProgress aria-label="Loading…" />
        </div>
      </div>
    );

  if (error || filtersError)
    return (
      <div className={styles['home-container']}>
        <div className={styles['data-loading']}>
          Failed to load portfolio items or filters.
        </div>
      </div>
    );

  const allItems = items ?? [];
  const allFilters = filters ?? [];

  const hasActiveFilters = Object.values(selectedFilters).some(v => v.length > 0);

  let displayItems = hasActiveFilters ? allItems.filter((item: ItemModel) => 
    Object.entries(selectedFilters).some(([filterName, values]) => {
      if (values.length === 0)
        return true;

      const key = filterName.toLowerCase() as keyof ItemModel;
      const itemValues = item[key];

      return Array.isArray(itemValues) && itemValues.some(v => typeof v === "string" && values.includes(v));
    })
  ) : allItems;

  return (
    <div className={styles['home-container']}>
      <div className={styles['grid-container']}>
        {
          displayItems.map((item: ItemModel) => (
            <Card
              key={item.id}
              {...item}
            />
          ))
        }
      </div>

      {isAdmin && (
        <LeftSidebar/>
      )}
      
      {allFilters.length > 0 && (
        <RightSidebar 
          filters={allFilters}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      )}

      <Navbar />

      <AlertSnackbar
        open={openAlert}
        setOpen={setOpenAlert}
        severity={alertSeverity}
        message={alertMessage}/>
    </div>
  );
}

export default Home;