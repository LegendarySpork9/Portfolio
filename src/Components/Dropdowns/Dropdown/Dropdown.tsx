import React, { useState } from "react";
import "./Dropdown.css";

interface DropdownProps {
  label: string;
  values: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, values }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelectAll = () => setSelected(values);
  const toggleSelectNone = () => setSelected([]);

  const isSelected = (item: string) => selected.includes(item);

  const toggleItem = (item: string) => {
    if (isSelected(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <div className="dropdown-wrapper">
      <div className="dropdown-label">{label}</div>
      <div className="dropdown-container">
        <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
          <span>{selected.length} selected</span>
          <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
        </div>
        {isOpen && (
          <div className="dropdown-body">
            <div className="dropdown-buttons">
              <button className="btn-select-all" onClick={toggleSelectAll} disabled={selected.length === values.length}>
                Select All
              </button>
              <button className="btn-select-none" onClick={toggleSelectNone} disabled={selected.length === 0}>
                Select None
              </button>
            </div>
            {values.map((item: string) => (
              <div key={item} className={`dropdown-item ${isSelected(item) ? "selected" : ""}`} onClick={() => toggleItem(item)}>
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;