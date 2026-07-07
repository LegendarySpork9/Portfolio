import React, { useState } from "react";
import styles from './Dropdown.module.css';

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
    <div className={styles['dropdown-wrapper']}>
      <div className={styles['dropdown-label']}>
        {label}
      </div>
      <div className={styles['dropdown-container']}>
        <div
          className={styles['dropdown-header']}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {selected.length} selected
          </span>
          <span className={styles['dropdown-arrow']}>
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
        {isOpen && (
          <div className={styles['dropdown-body']}>
            <div className={styles['dropdown-buttons']}>
              <button
                className={styles['btn-select-all']}
                onClick={toggleSelectAll}
                disabled={selected.length === values.length}
              >
                Select All
              </button>
              <button
                className={styles['btn-select-none']}
                onClick={toggleSelectNone}
                disabled={selected.length === 0}
              >
                Select None
              </button>
            </div>
            {values.map((item: string) => (
              <div
                key={item}
                className={`${styles['dropdown-item']} ${isSelected(item) ? styles.selected : ""}`}
                onClick={() => toggleItem(item)}
              >
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