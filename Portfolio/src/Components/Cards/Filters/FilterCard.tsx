import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import FilterForm from '../../Dialogs/FilterForm/FilterForm';
import Paper from '@mui/material/Paper';
import styles from './FilterCard.module.css';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import "../../../Colours.css";

import type { FilterModel } from '../../../Types/Filter';

interface FilterCardProps extends FilterModel {
  onSuccess?: (message: string) => void;
}

const FilterCard = ({ onSuccess, ...filter }: FilterCardProps) => {
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
        onSuccess={onSuccess}
      />
    </div>
  );
};

export default FilterCard;