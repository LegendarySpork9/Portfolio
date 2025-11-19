import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from "react-router-dom";
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
  id: number;
}

const ItemCard = ({image, title, status, date, id}: ItemCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/viewitem/${id}`);
  };

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
    <Card className="card" >
      <CardActionArea className="card-action" onClick={handleClick} >
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
            <Tooltip className="card-tooltip" title={message} arrow placement="top" >
              <Paper className="card-paper" >
                <Circle style={{color: status, fontSize: 14}} />
              </Paper>
            </Tooltip>

            <Tooltip className="card-tooltip" title="Last Release Date" arrow placement="top" >
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