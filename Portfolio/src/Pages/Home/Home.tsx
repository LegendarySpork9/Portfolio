import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { usePortfolio } from "../../Hooks/UsePortfolio";
import { useFilters } from "../../Hooks/UseFilter";
import Navbar from '../../Components/Navbar/Navbar'
import LeftSidebar from '../../Components/Sidebars/Left/LeftSidebar'
import RightSidebar from '../../Components/Sidebars/Right/RightSidebar'
import CircularProgress from "@mui/material/CircularProgress";
import Card from '../../Components/Cards/Items/PortfolioCard/PortfolioCard'
import UpcomingProjects from '../../Components/Dialogs/UpcomingProjects/UpcomingProjects'
import AlertSnackbar from "../../Components/Snackbar/AlertSnackbar";
import "../../Colours.css";
import styles from './Home.module.css';

import type { ItemModel } from "../../Types/Item";
import type { FilterModel } from "../../Types/Filter";

function resolvePath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}

function matchesFilter(item: ItemModel, filter: FilterModel, selectedValues: string[]): boolean {
  if (selectedValues.length === 0) return true;

  const filterType = filter.type ?? "tag";

  if (filterType === "tag") {
    const key = filter.name.toLowerCase() as keyof ItemModel;
    const itemValues = item[key];
    return Array.isArray(itemValues) && itemValues.some(v => typeof v === "string" && selectedValues.includes(v));
  }

  const itemValue = resolvePath(item as unknown as Record<string, unknown>, filter.path ?? "");
  const operator = (filter.operator ?? "").toLowerCase();

  switch (filterType) {
    case "numeric": {
      if (itemValue == null || typeof itemValue !== "number") return false;
      const num = parseFloat(selectedValues[0]);

      switch (operator) {
        case "equals": return itemValue === num;
        case "not equals": return itemValue !== num;
        case "greater than": return itemValue > num;
        case "less than": return itemValue < num;
        case "between": {
          const num2 = parseFloat(selectedValues[1] ?? "0");
          return itemValue >= Math.min(num, num2) && itemValue <= Math.max(num, num2);
        }
        default: return false;
      }
    }

    case "text": {
      if (itemValue == null || typeof itemValue !== "string") return false;
      const itemStr = itemValue.toLowerCase();
      const filterStr = selectedValues[0]?.toLowerCase() ?? "";

      switch (operator) {
        case "contains": return itemStr.includes(filterStr);
        case "not contains": return !itemStr.includes(filterStr);
        case "equals": return itemStr === filterStr;
        case "not equals": return itemStr !== filterStr;
        case "starts with": return itemStr.startsWith(filterStr);
        case "ends with": return itemStr.endsWith(filterStr);
        default: return false;
      }
    }

    case "boolean": {
      const wantsTrue = selectedValues[0] === "yes";
      switch (operator) {
        case "is true": return wantsTrue ? itemValue === true : itemValue === false;
        case "is false": return wantsTrue ? itemValue === false : itemValue === true;
        default: return false;
      }
    }

    case "null": {
      const wantsMatch = selectedValues[0] === "yes";
      const hasValue = itemValue !== null && itemValue !== undefined;
      switch (operator) {
        case "has value": return wantsMatch ? hasValue : !hasValue;
        case "has no value": return wantsMatch ? !hasValue : hasValue;
        default: return false;
      }
    }

    default:
      return true;
  }
}

let hasShownUpcoming = false;

function Home() {
 const { isAdmin } = useAuth();

  const { data: items, isLoading, error } = usePortfolio();
  const { data: filters, isLoading: filtersLoading, error: filtersError } = useFilters();

  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [alertMessage, setAlertMessage] = useState("");

  const [upcomingOpen, setUpcomingOpen] = useState(() => {
    if (hasShownUpcoming) return false;
    hasShownUpcoming = true;
    return true;
  });
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
    Object.entries(selectedFilters).every(([filterName, values]) => {
      if (values.length === 0) return true;

      const filter = allFilters.find((f: FilterModel) => f.name === filterName);
      if (!filter) return true;

      return matchesFilter(item, filter, values);
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

      <UpcomingProjects
        open={upcomingOpen}
        setOpen={setUpcomingOpen}
      />

      <AlertSnackbar
        open={openAlert}
        setOpen={setOpenAlert}
        severity={alertSeverity}
        message={alertMessage}/>
    </div>
  );
}

export default Home;