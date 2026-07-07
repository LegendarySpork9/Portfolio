import React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import styles from './DropdownMUI.module.css';

const MenuProps: any = {
  PaperProps: {
    className: styles['dropdown-menu-paper'],
    style: { maxHeight: 48 * 4.5 + 8, marginLeft: 8 } 
  },
  MenuListProps: { 
    disablePadding: true, 
    autoFocusItem: false
  },
  disableAutoFocusItem: true
};

function GetStyles(name: string, selected: string[], theme: Theme) {
  return {
    fontWeight: selected.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

interface DropdownMUIProps {
  label: string;
  options: string[];
  selected: string[];
  setSelected: (value: string[]) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const DropdownMUI = ({ label, options, selected, setSelected, onOpen, onClose }: DropdownMUIProps) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    const { value } = event.target;
    setSelected(typeof value === "string" ? value.split(",") : value);
  };

  const renderValue = (selectedItems: string[]) => {
    const count = selectedItems.length;
    return count === 1 ? "1 selected" : `${count} selected`;
  };

  const allSelected = selected.length === options.length;
  const noneSelected = selected.length === 0;

  const selectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(options);
  };

  const selectNone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected([]);
  };

  return (
    <FormControl
      variant="outlined"
      className={styles['dropdown-container']}
    >
      <InputLabel
        id={`${label}-label`}
        className={styles['dropdown-label']}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`${label}-label`}
        id={`${label}-select`}
        multiple
        value={selected}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(val) => renderValue(val as string[])}
        onOpen={onOpen}
        onClose={onClose}
        MenuProps={MenuProps}
        className={styles['dropdown-select']}
      >
        <ListSubheader
          className={styles['dropdown-controls']}
          onMouseDown={(e) => e.preventDefault()}
          disableSticky
        >
          <button
            type="button"
            className={`${styles.btn} ${styles['btn-primary']}`}
            onClick={selectAll}
            disabled={allSelected}
          >
            Select All
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles['btn-primary']}`}
            onClick={selectNone}
            disabled={noneSelected}
          >
            Select None
          </button>
        </ListSubheader>
        <Divider className={styles['dropdown-divider']} />
        {options.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={GetStyles(name, selected, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default DropdownMUI;