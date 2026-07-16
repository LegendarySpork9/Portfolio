import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import "../../../../Colours.css";
import styles from './EditableBuildHistoryTable.module.css';

import type { ItemBuildHistoryModel } from '../../../../Types/Item';

interface EditableBuildHistoryTableProps {
  buildHistory: ItemBuildHistoryModel[];
  setBuildHistory: React.Dispatch<React.SetStateAction<ItemBuildHistoryModel[]>>;
}

const EditableBuildHistoryTable = ({ buildHistory, setBuildHistory }: EditableBuildHistoryTableProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ version: string; releaseDate: string }>({ version: '', releaseDate: '' });

  const handleAdd = () => {
    const now = new Date();
    const newIndex = buildHistory.length;
    setBuildHistory((prev) => [...prev, { version: '', releaseDate: now }]);
    setEditingIndex(newIndex);
    setEditValues({ version: '', releaseDate: formatDateTimeLocal(now) });
  };

  const handleEdit = (index: number) => {
    const build = buildHistory[index];
    setEditingIndex(index);
    setEditValues({
      version: build.version,
      releaseDate: formatDateTimeLocal(new Date(build.releaseDate))
    });
  };

  const handleSave = () => {
    if (editingIndex === null) return;
    if (!editValues.version.trim() || !editValues.releaseDate) return;

    setBuildHistory((prev) =>
      prev.map((build, i) =>
        i === editingIndex
          ? { version: editValues.version.trim(), releaseDate: new Date(editValues.releaseDate) }
          : build
      )
    );
    setEditingIndex(null);
  };

  const handleCancel = () => {
    if (editingIndex !== null && buildHistory[editingIndex].version === '') {
      setBuildHistory((prev) => prev.filter((_, i) => i !== editingIndex));
    }
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    setBuildHistory((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const formatDateTimeLocal = (date: Date): string => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatDisplayDate = (date: Date): string => {
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).replace(",", "");
  };

  return (
    <TableContainer
      className={styles['table']}
      component={Paper}
    >
      <Table
        size="small"
        aria-label="editable build history table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Version</TableCell>
            <TableCell>Release Date</TableCell>
            <TableCell>
              <IconButton onClick={handleAdd} disabled={editingIndex !== null} size="small">
                <AddIcon color={editingIndex !== null ? 'disabled' : 'success'} />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buildHistory.map((build, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {editingIndex === index ? (
                  <TextField
                    required
                    value={editValues.version}
                    onChange={(e) => setEditValues({ ...editValues, version: e.target.value })}
                    size="small"
                    variant="outlined"
                    placeholder="1.0.0"
                    InputProps={{ className: styles['edit-input'] }}
                    inputProps={{ className: styles['edit-input-text'] }}
                  />
                ) : (
                  build.version
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <TextField
                    required
                    type="datetime-local"
                    value={editValues.releaseDate}
                    onChange={(e) => setEditValues({ ...editValues, releaseDate: e.target.value })}
                    size="small"
                    variant="outlined"
                    InputProps={{ className: styles['edit-input'] }}
                    inputProps={{ className: styles['edit-input-text'] }}
                  />
                ) : (
                  formatDisplayDate(build.releaseDate)
                )}
              </TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <>
                    <IconButton onClick={handleSave} size="small">
                      <SaveIcon color="success" />
                    </IconButton>
                    <IconButton onClick={handleCancel} size="small">
                      <CancelIcon color="warning" />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton onClick={() => handleEdit(index)} disabled={editingIndex !== null} size="small">
                      <EditIcon color={editingIndex !== null ? 'disabled' : 'primary'} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(index)} disabled={editingIndex !== null} size="small">
                      <DeleteIcon color={editingIndex !== null ? 'disabled' : 'error'} />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default EditableBuildHistoryTable;
