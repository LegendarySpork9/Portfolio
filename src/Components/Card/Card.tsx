import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography';
import Circle from '@mui/icons-material/Circle';
import Tooltip from '@mui/material/Tooltip';
import "../../Colours.css";
import './Card.css';

interface ItemCardProps {
  image: string;
  title: string;
  status: string;
  date: string;
}

const ItemCard = ({image, title, status, date}: ItemCardProps) => {
  return (
    <Card className="card" >
      <CardActionArea className="card-action" >
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt="Item Image"
          className="card-Media"
        />

        <CardContent>
          <Paper className="card-paper" >
            <Typography variant="subtitle2" color="var(--colour-text)" >
              {title}
            </Typography>
          </Paper>

          <div className="card-div" style={{marginTop: "10px"}} >
            <Tooltip className="card-tooltip" title="Issue Indicator: Green = 0, Yellow = < New Features, Red = < Bugs" arrow placement="top" >
              <Paper className="card-paper" >
                <Circle style={{color: status, fontSize: 14}} />
              </Paper>
            </Tooltip>

            <Tooltip className="card-tooltip" title="Last Modified Date" arrow placement="top" >
              <Paper className="card-paper" style={{flex: "1"}} >
                <Typography variant="subtitle2" color="var(--colour-text)" >
                  {date}
                </Typography>
              </Paper>
            </Tooltip>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ItemCard;