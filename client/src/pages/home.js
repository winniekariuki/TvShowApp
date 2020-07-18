import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Header from "../components/navbar";
import TVShow from "../components/tvShow/tvshow";
import  Loader  from "../components/loader";
import "../components/tvShow/tvshow.css"

// GET all tv shows query
const GET_ALL_TV_SHOWS = gql`
  query TVShowList($after: String) {
    tvshows(after: $after) {
      tvshows {
        id
        name
        url
        summary
        image
        rating
      }
    }
  }
`;


function AllTVShows() {
  let { data, loading, error } = useQuery(GET_ALL_TV_SHOWS);

  if (loading) return <Loader />;
  if (error) return <p>ERROR</p>;

  return (
    <Fragment>
      <Header/>
      <div className="main">
        {data &&
          data.tvshows.tvshows &&
          data.tvshows.tvshows.map((tvshow) => (
            <TVShow
              key={Math.random()}
              id={tvshow.id}
              name={tvshow.name}
              url={tvshow.url}
              summary={tvshow.summary}
              image={tvshow.image}
              rating={tvshow.rating}
              page="home"
            />
          ))}
      </div>
    </Fragment>
  );
}

export default AllTVShows;