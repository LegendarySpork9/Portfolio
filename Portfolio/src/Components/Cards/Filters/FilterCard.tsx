import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import FilterForm from '../../Dialogs/FilterForm/FilterForm';
import "../../../Colours.css";
import styles from './FilterCard.module.css';

import type { FilterModel } from '../../../Types/Filter';

const FilterCard = (filter: FilterModel) => {
  const [openFilterForm, setFilterForm] = useState(false);

  return (
    <div>
      <Card className={styles.card} >
        <CardActionArea
          className={styles['card-action']}
          onClick={() => setFilterForm(true)}
        >
          <CardContent>
            <Paper className={styles['card-paper']} >
              <Typography
                variant="subtitle2"
                color={filter.isDeleted ? "red" : "white"}
              >
                {filter.name}
              </Typography>
            </Paper>
          </CardContent>
        </CardActionArea>
      </Card>

      <FilterForm
        isUpdate={true}
        filter={filter}
        open={openFilterForm}
        setOpen={setFilterForm}
      />
    </div>
  );
}

export default FilterCard;