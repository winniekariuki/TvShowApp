import React from "react";
import { gql } from "apollo-boost";
import "../styling/styling.css";
import { useMutation } from "@apollo/react-hooks";
import Loader from "../loader";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import { Link } from "react-router-dom";

// tv show schedule query
const TV_SHOW_IN_SCHEDULE = gql`
  mutation FavoriteTVShow($id: String!) {
    favoriteTvShow(id: $id) {
      message
      status
    }
  }
`;
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

function Schedule(props) {
  const classes = useStyles();
  const [
    favoriteTvShow,
    { favoriteTVLoader, favoriteTVLoaderError },
  ] = useMutation(TV_SHOW_IN_SCHEDULE, {
    onCompleted({ favoriteTvShow }) {
      let toastDiv = document.getElementById("toastBar");
      toastDiv.className = "show";
      setTimeout(function () {
        toastDiv.className = toastDiv.className.replace("show", "");
      }, 3000);
      toastDiv.innerHTML = favoriteTvShow.message;
    },
  });

  // favorite handler
  const favoriteTvShowHandler = (id) => {
    
    favoriteTvShow({
      variables: {
        id,
      },
    });
  };

  if (favoriteTVLoader) return <Loader />;
  if (favoriteTVLoaderError) return <p>An error occurred</p>;

  return (
          <Card className={classes.root}>
      <CardHeader
       title= {<Link to={`/schedule/${props.id}`}>{props.name.substr(0, 20)}</Link>}
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
      {props.favorite === "true" ? (
        <IconButton aria-label="add to favorites"
         onClick={() =>
          alert(
           "Favorited Successfully"
          )
        }>
         <FavoriteBorderIcon/>
        </IconButton>
      ) : ( <IconButton aria-label="add to favorites"
      onClick= {() => favoriteTvShowHandler(props.id)}>
      <FavoriteIcon/>
     </IconButton>
      )}
        {props.summary && (
        <p
          dangerouslySetInnerHTML={{
            __html: props.summary.substr(0, 150).concat("..."),
          }}
        ></p>
      )}
      <br />
      </CardActions>
      <div id="toastBar"></div>
      </Card>
  );
}

export default Schedule;