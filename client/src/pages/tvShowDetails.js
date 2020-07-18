import React from "react";
import { gql } from "apollo-boost";
import Header from '../components/navbar'
import "../components/styling/styling.css";
import { useQuery} from "@apollo/react-hooks";
import Loader from "../components/loader";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {},
  media: {
    height: 340,
  },
});

const GET_SINGLE_TV_SHOW = gql`
  query getTVShowById($id: ID!) {
    tvshow(id: $id) {
      name
      episode
      genre
      language
      duration
      status
      rating
      url
      status
      premiered
      summary
      image
    }
  }
`;

const SingleTVShow = (props) => {
  const id = props.match.params.id;
  const { data, error, loading } = useQuery(GET_SINGLE_TV_SHOW, {
    variables: { id },
  });
  const classes = useStyles();

  if (loading) return <Loader />;
  if (error) return <p>An error occurred</p>;

  return (
    <div >
         <Header />
        {data && (
         <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={data.tvshow.image && data.tvshow.image}
          title={data.tvshow.name}
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {/* tv show genre */}
            {data.tvshow.genre &&
                `${data.tvshow.genre.map(
                  (genre) => genre
                )} &nbsp;&nbsp;|&nbsp;&nbsp;`}
              {/* tv show rating */}
              {data.tvshow.rating
                ? `Rating:  ${data.tvshow.rating}`
                : "No Rating"}
          </Typography>
          <Typography>
          {data.tvshow.language && (
              <span> Language: {data.tvshow.language}</span>
            )}
            {data.tvshow.season && (
              <span>
                {/* tv show season and episode details */}
                Season {data.tvshow.season} Episode {data.tvshow.episode}
              </span>
            )}
          {/* tv show summary */}
          {data.tvshow.summary && (
            <p
              dangerouslySetInnerHTML={{
                __html: data.tvshow.summary,
              }}
            ></p>
          )}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
      </CardActions>
    </Card>
         )}
    </div>
  );
};

export default SingleTVShow;