import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import "./App.css";
import Loader from "./components/loader";
import TVShow from "./components/tvShow/tvshow";

const GET_SCHEDULE = gql`
  query TVShowList($after: String) {
    tvshows(after: $after) {
      hasMore
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

function SCHEDULE() {
  let { data, loading, error } = useQuery(GET_SCHEDULE);

  if (loading) return <Loader />;
  if (error) return <p>ERROR</p>;

  return (
    <Fragment>
      <div className="main">
        {data &&
          data.tvshows.tvshows &&
          data.tvshows.tvshows.map(tvshow => (
            <TVShow
              key={Math.random()}
              id={tvshow.id}
              name={tvshow.name}
              url={tvshow.url}
              summary={tvshow.summary}
              image={tvshow.image}
              rating={tvshow.rating}
            />
          ))}
      </div>
    </Fragment>
  );
}

export default SCHEDULE;