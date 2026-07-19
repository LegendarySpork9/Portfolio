import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import SaveIcon from '@mui/icons-material/Save';
import styles from './EditableLLMUsageTable.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import "../../../../Colours.css";

import type { ItemLLMUsageModel } from '../../../../Types/Item';

interface EditableLLMUsageTableProps {
  llmUsage: ItemLLMUsageModel | null;
  setLLMUsage: React.Dispatch<React.SetStateAction<ItemLLMUsageModel | null>>;
  disabled?: boolean;
};

const EditableLLMUsageTable = ({ llmUsage, setLLMUsage, disabled }: EditableLLMUsageTableProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<{ company: string; model: string }>({ company: '', model: '' });

  const handleAdd = () => {
    setLLMUsage({ company: '', model: '' });
    setIsEditing(true);
    setEditValues({ company: '', model: '' });
  };

  const handleEdit = () => {
    if (!llmUsage) return;
    setIsEditing(true);
    setEditValues({ company: llmUsage.company, model: llmUsage.model });
  };

  const handleSave = () => {
    setLLMUsage({ company: editValues.company, model: editValues.model });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (llmUsage && llmUsage.company === '' && llmUsage.model === '') {
      setLLMUsage(null);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    setLLMUsage(null);
    setIsEditing(false);
  };

  return (
    <TableContainer
      className={styles['table']}
      component={Paper}
    >
      <Table
        size="small"
        aria-label="editable LLM usage table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Company</TableCell>
            <TableCell>Model</TableCell>
            <TableCell>
              {!llmUsage && (
                <IconButton onClick={handleAdd} disabled={disabled} size="small">
                  <AddIcon color={disabled ? 'disabled' : 'success'} />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {llmUsage && (
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {isEditing ? (
                  <TextField
                    value={editValues.company}
                    onChange={(e) => setEditValues({ ...editValues, company: e.target.value })}
                    size="small"
                    variant="outlined"
                    placeholder="Anthropic"
                    InputProps={{ className: styles['edit-input'] }}
                    inputProps={{ className: styles['edit-input-text'] }}
                  />
                ) : (
                  llmUsage.company
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <TextField
                    value={editValues.model}
                    onChange={(e) => setEditValues({ ...editValues, model: e.target.value })}
                    size="small"
                    variant="outlined"
                    placeholder="Claude"
                    InputProps={{ className: styles['edit-input'] }}
                    inputProps={{ className: styles['edit-input-text'] }}
                  />
                ) : (
                  llmUsage.model
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
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
                    <IconButton onClick={handleEdit} disabled={disabled} size="small">
                      <EditIcon color={disabled ? 'disabled' : 'primary'} />
                    </IconButton>
                    <IconButton onClick={handleDelete} disabled={disabled} size="small">
                      <DeleteIcon color={disabled ? 'disabled' : 'error'} />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EditableLLMUsageTable;
