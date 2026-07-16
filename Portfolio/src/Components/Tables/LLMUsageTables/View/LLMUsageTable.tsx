import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import "../../../../Colours.css";
import styles from './LLMUsageTable.module.css';

import type { ItemLLMUsageModel } from '../../../../Types/Item';

const LLMTable = ({ llm }: { llm: ItemLLMUsageModel }) => {
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
            <TableCell>Company</TableCell>
            <TableCell>Model</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow
            key={llm.company}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {llm.company}
            </TableCell>
            <TableCell component="th" scope="row">
              {llm.model}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LLMTable;