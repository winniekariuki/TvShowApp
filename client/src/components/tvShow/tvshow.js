import React, { useState } from "react";
import { gql } from "apollo-boost";
import jwt from "jsonwebtoken";
import "../styling/styling.css";
import SingleTVShow from "../../pages/tvShowDetails";
import { useMutation } from "@apollo/react-hooks";
import "../toast/toast.css";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth:345 ,
    marginLeft: '10px',
    marginBottom:'10px'
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}));
 
const ADD_WATCH_SCHEDULE = gql`
  mutation createWatchSchedule(
    $url: String!
    $email: String
    $name: String
    $image: String
    $summary: String
    $rating: String
  ) {
    createWatchSchedule(
      url: $url
      email: $email
      name: $name
      image: $image
      summary: $summary
      rating: $rating
    ) {
      message
      url
      name
      rating
      summary
      image
    }
  }
`;

function TVShow(props) {
  const classes = useStyles();
  const [createWatchSchedule] = useMutation(
    ADD_WATCH_SCHEDULE,
    {
      onCompleted({ createWatchSchedule }) {
        let toastDiv = document.getElementById("toastBar");
        toastDiv.className = "show";
        setTimeout(function () {
          toastDiv.className = toastDiv.className.replace("show", "");
        }, 3000);
        toastDiv.innerHTML = createWatchSchedule.message;
      },
    }
  );

  const addToWatchScheduleHandler = (
    url,
    email,
    name,
    summary,
    image,
    rating
  ) => {
    createWatchSchedule({
      variables: {
        url,
        email,
        name,
        summary,
        image,
        rating,
      },
    });
  };
  const navigateToShowDetails = () => {
    return(<SingleTVShow id={props.id} />)
    

    // props.history.push(`/tvShowDetails/${props.id}`)
  }

  const token = localStorage.getItem("token");
const currentUsers = token && jwt.decode(token);

  return (
    <Card className={classes.root}>
       <CardHeader
       title= {<Link to={`/show/${props.id}`}>{props.name.substr(0, 20)}</Link>}
      />
      <CardMedia
        className={classes.media}
        image= {props.image && props.image}
       
      />
      <CardContent>
      {props.rating && `Rating ${props.rating}`}
        <Typography variant="body2" color="textSecondary" component="p">
        {props.summary && (
        <p
          dangerouslySetInnerHTML={{
            __html: props.summary.substr(0, 150).concat("..."),
          }}
        ></p>
      )}

        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites"
         onClick={() =>
                  addToWatchScheduleHandler(
                    props.url,
                    currentUsers && currentUsers.email ,
                    props.name,
                    props.summary,
                    props.image,
                    props.rating
                  )
                }>
          <WatchLaterIcon />
        </IconButton>
      </CardActions>
      <div id="toastBar"></div>
    </Card>
   
  );
}

export default TVShow;