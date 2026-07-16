import { useNavigate } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import "../../../../Colours.css";
import styles from './ItemCard.module.css';

import type { ItemModel } from '../../../../Types/Item';

const ItemCard = (item: ItemModel) => {
  const navigate = useNavigate();

  return (
    <div>
      <Card className={styles.card} >
        <CardActionArea
          className={styles['card-action']}
          onClick={() => navigate(`/item/${item.id}?mode=update`)}
        >
          <CardContent>
            <Paper className={styles['card-paper']} >
              <Typography
                variant="subtitle2"
                color={item.isDeleted ? "red" : "white"}
              >
                {item.name}
              </Typography>
            </Paper>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  );
}

export default ItemCard;