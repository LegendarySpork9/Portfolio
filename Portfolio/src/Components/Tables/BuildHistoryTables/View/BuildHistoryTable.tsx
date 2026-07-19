import Paper from '@mui/material/Paper';
import styles from './BuildHistoryTable.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import "../../../../Colours.css";

import type { ItemBuildHistoryModel } from '../../../../Types/Item';

const BuildTable = ({ buildHistory }: { buildHistory: ItemBuildHistoryModel[] }) => {
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
            <TableCell>Version</TableCell>
            <TableCell>Release Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buildHistory.map((build) => (
            <TableRow
              key={build.version}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {build.version}
              </TableCell>
              <TableCell>{new Date(build.releaseDate).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).replace(",", "")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BuildTable;