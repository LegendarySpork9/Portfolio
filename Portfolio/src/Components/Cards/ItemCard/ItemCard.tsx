import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import Circle from '@mui/icons-material/Circle';
import Tooltip from '@mui/material/Tooltip';
import SummaryBox from '../../Dialogs/SummaryBox/SummaryBox';
import "../../../Colours.css";
import styles from './ItemCard.module.css';

interface ItemCardProps {
  image: string;
  title: string;
  status: string;
  date: string;
  id: number;
}

const ItemCard = ({image, title, status, date, id}: ItemCardProps) => {
  const [openSummary, setOpenSummary] = useState(false);

  var message: string
  
  if (status === "Green"){
    message = "There are no GitHub issues for this item."
  }

  else if (status === "Yellow"){
    message = "There are more GitHub issues that are new features than bugs for this item."
  }

  else {
    message = "There are more GitHub issues that are bugs than new features for this item."
  }

  return (
    <div>
      <Card className={styles.card} >
        <CardActionArea
          className={styles['card-action']}
          onClick={() => setOpenSummary(true)}
        >
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt="Item Image"
            className={styles['card-media']}
            sx={{ objectFit: 'contain' }}
          />

          <CardContent>
            <Paper className={styles['card-paper']} >
              <Typography
                variant="subtitle2"
                color="var(--colour-text)"
              >
                {title}
              </Typography>
            </Paper>

            <div
              className={styles['card-div']}
              style={{marginTop: "10px"}}
            >
              <Tooltip
                title={message}
                arrow
                placement="top"
              >
                <Paper className={styles['card-paper']} >
                  <Circle style={{color: status, fontSize: 14}} />
                </Paper>
              </Tooltip>

              <Tooltip
                title="Last Release Date"
                arrow
                placement="top"
              >
                <Paper
                  className={styles['card-paper']}
                  style={{flex: "1"}}
                >
                  <Typography
                    variant="subtitle2"
                    color="var(--colour-text)"
                  >
                    {date}
                  </Typography>
                </Paper>
              </Tooltip>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>

      <SummaryBox
        itemId={id}
        open={openSummary}
        setOpen={setOpenSummary}
      />
    </div>
  );
}

export default ItemCard;