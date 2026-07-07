import { useState, useRef } from "react";
import DropdownMUI from "../../Dropdowns/DropdownMUI/DropdownMUI";
import Badge from '@mui/material/Badge';
import "../../../Colours.css";
import styles from './RightSidebar.module.css';
import { FilterModel } from "../../../Types/Filter";

interface RightSidebarProps {
  filters: FilterModel[];
  selectedFilters: Record<string, string[]>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

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

  return (
    <div
      ref={sidebarRef}
      className={`${styles['sidebar-right']} ${hovered ? styles.expanded : styles.collapsed}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {filters.map(filter => (
        <div className={styles['sidebar-right-content']}>
          {hovered ? (
            <DropdownMUI
              label={filter.name}
              options={filter.values}
              selected={selectedFilters[filter.name] ?? []}
              setSelected={(values) => setSelectedFilters(prev => ({ ...prev, [filter.name]: values }))}
              onOpen={handleDropdownOpen}
              onClose={handleDropdownClose}
            />
          ) : (
            <Badge
              badgeContent={(selectedFilters[filter.name] ?? []).length}
              color="error"
              overlap="rectangular"
              invisible={(selectedFilters[filter.name] ?? []).length === 0}
              anchorOrigin={{ vertical: "top", horizontal: "right"}}
              classes={{ badge: styles['custom-badge'] }}
            >
              <img
                src="/filter.svg"
                alt="Language"
                className={styles['sidebar-right-image']}
              />
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

export default RightSidebar;