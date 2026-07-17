import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import styles from './ImageTable.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "../../../Colours.css";

import type { MediaModel } from "../../../Types/Media";

const sizes = [
  "B",
  "KB",
  "MB",
  "GB"
];

function formatSize(size: number) {
  let order = 0;

  while (size >= 1024 && order < (sizes.length - 1)) {
    order++;
    size /= 1024;
  }

  var finalSize = (Math.round(size * 100) / 100).toFixed(2);

  return `${finalSize} ${sizes[order]}`;
};

interface ImageTableProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  existingMedia?: MediaModel[];
  onDeleteMedia?: (media: MediaModel) => void;
};

const ImageTable = ({selectedFiles, setSelectedFiles, existingMedia, onDeleteMedia}: ImageTableProps) => {
  const handleRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <TableContainer
      className={styles['table']}
      component={Paper}
    >
      <Table
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Preview</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {existingMedia?.map((media) => (
            <TableRow
              key={`existing-${media.id}`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <img
                  src={media.url}
                  alt={media.name}
                  style={{ width: 60, height: 40, objectFit: "cover" }}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {media.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {formatSize(media.size)}
              </TableCell>
              <TableCell component="th" scope="row">
                {media.type.mimeType}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton onClick={() => onDeleteMedia?.(media)}>
                  <DeleteIcon color='error' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {selectedFiles.map((file, index) => (
            <TableRow
              key={file.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: 60, height: 40, objectFit: "cover" }}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                {file.name}
              </TableCell>
              <TableCell component="th" scope="row">
                {formatSize(file.size)}
              </TableCell>
              <TableCell component="th" scope="row">
                {file.type}
              </TableCell>
              <TableCell component="th" scope="row">
                <IconButton onClick={() => handleRemove(index)}>
                  <DeleteIcon color='error' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ImageTable;