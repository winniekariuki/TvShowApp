import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/loader";
import "../components/styling/styling.css";
import Comment from "../components/comments";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import Header from '../components/navbar'

const GET_SINGLE_TV_SHOW = gql`
  query GetSchedule($id: String) {
    getSingleWatchSchedule(id: $id) {
      name
      message
      url
      status
      rating
      summary
      image
      _id
      favorite
    }
  }
`;

const TV_SHOW_IN_SCHEDULE = gql`
  mutation FavoriteTVShow($id: String!) {
    favoriteTvShow(id: $id) {
      message
      status
    }
  }
`;
const useStyles = makeStyles({
  root: {},
  media: {
    height: 340,
  },
});


function SingleWatchSchedule(props) {
  const id = props.match.params.id;
  const { data, loading, error } = useQuery(GET_SINGLE_TV_SHOW, {
    variables: { id },
  });
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

  const favoriteTvShowHandler = () => {
    favoriteTvShow({
      variables: {
        id,
      },
    });
  };

  if (loading || favoriteTVLoader) return <Loader />;
  if (error || favoriteTVLoaderError) return <p>An error occurred</p>;

  return (

    <div>
      <div id="toastBar"></div>
      <Header />
      {data.getSingleWatchSchedule && (
        <Card className={classes.root}>
          <CardHeader
            title={data.getSingleWatchSchedule.name}
          />
          <CardMedia
            className={classes.media}
            image={
              data.getSingleWatchSchedule.image
              && data.getSingleWatchSchedule.image

            }
            title={data.getSingleWatchSchedule.name}
          />
          <CardContent>
            <Typography variant='body5'>
              {data.getSingleWatchSchedule.rating &&
                `Rating ${data.getSingleWatchSchedule.rating}`}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {data.getSingleWatchSchedule.summary}
            </Typography>
          </CardContent>
          {data.getSingleWatchSchedule.favorite === "true" ? (
            <IconButton aria-label="add to favorites"
              onClick={() =>
                alert(
                  "Favorited Successfully"
                )
              }>
              <FavoriteBorderIcon />
            </IconButton>
          ) : (<IconButton aria-label="add to favorites"
            onClick={() => favoriteTvShowHandler()}>
            <FavoriteIcon />
          </IconButton>)}

          {data.getSingleWatchSchedule.url && (
            <a href={data.getSingleWatchSchedule.url} target="_blank" rel="noopener noreferrer">
              <Button variant="contained" color="primary" component="span">
                See Show Link
        </Button>
            </a>
          )}
        </Card>
      )}
      <Comment id={id} />
    </div>

  );
}

export default SingleWatchSchedule;