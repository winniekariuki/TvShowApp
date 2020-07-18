import React, { Fragment } from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/loader";
import jwt from "jsonwebtoken";
import Schedule from "../components/watchSchedule";
import Header from '../components/navbar';

const GET_SCHEDULE = gql`
  query getWatchSchedule($email: String) {
    getWatchSchedule(email: $email) {
      getWatchSchedule {
        message
        name
        rating
        url
        image
        rating
        summary
        _id
        favorite
      }
    }
  }
`;
const token = localStorage.getItem("token");
const currentUsers = token && jwt.decode(token);

function WatchSchedule() {
  let { data, loading, error } = useQuery(GET_SCHEDULE, {
    variables: { email: currentUsers && currentUsers.email },
  });

  if (loading) return <Loader />;
  if (error) return <p>An error occurred</p>;

  return (
    <Fragment>
       <Header/>
      <div className="main">
        {data && data.getWatchSchedule.getWatchSchedule.length > 0 ? (
          data.getWatchSchedule.getWatchSchedule.map((tvshow) => (
            <Schedule
              key={tvshow._id}
              id={tvshow._id}
              name={tvshow.name}
              url={tvshow.url}
              summary={tvshow.summary}
              image={tvshow.image}
              rating={tvshow.rating}
              page="schedule"
              favorite={tvshow.favorite}
            />
          ))
        ) : (
          <p> No movie in the schedule</p>
        )}
      </div>
    </Fragment>
  );
}

export default WatchSchedule;