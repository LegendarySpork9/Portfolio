import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../../../Colours.css";
import styles from './GitHubInProgressTable.module.css';

import type { ItemGitHubInProgressBreakdownModel } from '../../../Types/Item';

const InProgressTable = ({ issueBreakdown }: { issueBreakdown: ItemGitHubInProgressBreakdownModel[] }) => {
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
            <TableCell>Id</TableCell>
            <TableCell>Assignee</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issueBreakdown.map((issue) => (
            <TableRow
              key={issue.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {issue.id}
              </TableCell>
              <TableCell component="th" scope="row">
                {issue.assignee}
              </TableCell>
              <TableCell component="th" scope="row">
                {issue.title}
              </TableCell>
              <TableCell component="th" scope="row">
                {issue.type}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default InProgressTable;