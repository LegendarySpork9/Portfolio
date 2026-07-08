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

import type { ItemModel } from '../../../Types/Item';

const ItemCard = (item: ItemModel) => {
  const [openSummary, setOpenSummary] = useState(false);

  var lastReleaseDateString = new Date(item.buildHistory[item.buildHistory.length - 1].releaseDate).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).replace(",", "")
  var status: string
  var message: string

  if (item.gitHubInformation.issueBreakdown.totalIssues === 0) {
    status = "Green";
    message = "There are no GitHub issues for this item."
  }

  else if (item.gitHubInformation.issueBreakdown.newFeatures > item.gitHubInformation.issueBreakdown.bugs) {
    status = "Yellow";
    message = "There are more GitHub issues that are new features than bugs for this item."
  }

  else {
    status = "Red"
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
            image={item.iconURL}
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
                {item.name}
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
                    {lastReleaseDateString}
                  </Typography>
                </Paper>
              </Tooltip>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>

      <SummaryBox
        id={item.id}
        name={item.name}
        summary={item.summary}
        frameworks={item.frameworks}
        languages={item.languages}
        environments={item.environments}
        ciStatuses={item.gitHubInformation.ciStatus}
        issueBreakdown={item.gitHubInformation.issueBreakdown}
        latestBuildNumber={item.buildHistory[item.buildHistory.length - 1].version}
        unitTestCoverage={item.unitTestCoverage ?? null}
        open={openSummary}
        setOpen={setOpenSummary}
      />
    </div>
  );
}

export default ItemCard;