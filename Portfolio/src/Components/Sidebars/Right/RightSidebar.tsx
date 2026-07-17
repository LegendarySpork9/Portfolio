import Badge from '@mui/material/Badge';
import DropdownMUI from "../../Dropdowns/DropdownMUI/DropdownMUI";
import styles from './RightSidebar.module.css';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { FilterModel } from "../../../Types/Filter";
import { useState, useRef } from "react";
import "../../../Colours.css";

interface RightSidebarProps {
  filters: FilterModel[];
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
};

function RightSidebar({ filters, selectedFilters, setSelectedFilters }: RightSidebarProps) {
  const [hovered, setHovered] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownOpenRef = useRef(false);

  const handleMouseLeave = () => {
    if (!dropdownOpenRef.current) {
      setHovered(false);
    }
  };

  const handleDropdownOpen = () => {
    dropdownOpenRef.current = true;
  };

  const handleDropdownClose = () => {
    dropdownOpenRef.current = false;
    setTimeout(() => {
      if (sidebarRef.current && !sidebarRef.current.matches(':hover')) {
        setHovered(false);
      }
    }, 100);
  };

  const getActiveCount = (filter: FilterModel): number => {
    const values = selectedFilters[filter.name] ?? [];

    if (filter.type === "tag") {
      return values.length;
    }

    return values.length > 0 ? 1 : 0;
  };

  const renderFilterControl = (filter: FilterModel) => {
    const filterType = filter.type ?? "tag";

    switch (filterType) {
      case "tag":
        return (
          <DropdownMUI
            label={filter.name}
            options={filter.values}
            selected={selectedFilters[filter.name] ?? []}
            setSelected={(values) => setSelectedFilters(prev => ({ ...prev, [filter.name]: values }))}
            onOpen={handleDropdownOpen}
            onClose={handleDropdownClose}
          />
        );

      case "numeric":
      case "text":
      case "comparison": {
        const isActive = (selectedFilters[filter.name] ?? []).length > 0;

        return (
          <div className={styles['filter-input-group']}>
            <Typography className={styles['filter-label']}>{filter.name}</Typography>
            <ToggleButtonGroup
              value={isActive ? "yes" : null}
              exclusive
              onChange={(_, val) => {
                setSelectedFilters(prev => ({
                  ...prev,
                  [filter.name]: val === "yes" ? filter.values : []
                }));
              }}
              size="small"
              className={styles['filter-toggle-group']}
            >
              <ToggleButton value="yes" className={styles['filter-toggle-button']}>
                On
              </ToggleButton>
              <ToggleButton value="off" className={styles['filter-toggle-button']}>
                Off
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        );
      };

      case "boolean":
      case "null":
        return (
          <div className={styles['filter-input-group']}>
            <Typography className={styles['filter-label']}>{filter.name}</Typography>
            <ToggleButtonGroup
              value={selectedFilters[filter.name]?.[0] ?? null}
              exclusive
              onChange={(_, val) => {
                setSelectedFilters(prev => ({ ...prev, [filter.name]: val ? [val] : [] }));
              }}
              size="small"
              className={styles['filter-toggle-group']}
            >
              <ToggleButton value="yes" className={styles['filter-toggle-button']}>
                Yes
              </ToggleButton>
              <ToggleButton value="no" className={styles['filter-toggle-button']}>
                No
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        );

      default:
        return null;
    };
  };

  return (
    <div
      ref={sidebarRef}
      className={`${styles['sidebar-right']} ${hovered ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {filters.map(filter => (
        <div key={filter.id} className={styles['sidebar-right-content']}>
          {hovered ? (
            renderFilterControl(filter)
          ) : (
            <Badge
              badgeContent={getActiveCount(filter)}
              color="error"
              overlap="rectangular"
              invisible={getActiveCount(filter) === 0}
              anchorOrigin={{ vertical: "top", horizontal: "right"}}
              classes={{ badge: styles['custom-badge'] }}
            >
              <img
                src="/filter.svg"
                alt={filter.name}
                className={styles['sidebar-right-image']}
              />
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
};

export default RightSidebar;
