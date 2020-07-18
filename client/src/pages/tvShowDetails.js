import React from "react";
import { gql } from "apollo-boost";
import jwt from 'jsonwebtoken'
import Header from '../components/navbar'
import "../components/styling/styling.css";
import { useQuery } from "@apollo/react-hooks";
import Loader from "../components/loader";

const GET_SINGLE_TV_SHOW = gql`
  query GetSingleTVShow($id: ID!) {
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

const SingleTVShow = ({ id, addToSchedule }) => {
  let { data, loading, error } = useQuery(GET_SINGLE_TV_SHOW, {
    variables: { id },
  });

  const token = localStorage.getItem("token");
  const currentUser = token && jwt.decode(token);

  if (loading) return <Loader />;
  if (error) return <p>ERROR in this page</p>;

  return (
    <div className="singleTvShowWrapper">
      <Header/>
      {/* check if data exists; escapes undefined error */}
      {data && (
        <div>
          <div className="modalHeader">
            {/* tv show title */}
            <h3>{data.tvshow.name}</h3>
            <span>
              {/* tv show genre */}
              {data.tvshow.genre &&
                `${data.tvshow.genre.map(
                  (genre) => genre
                )} &nbsp;&nbsp;|&nbsp;&nbsp;`}
              {/* tv show rating */}
              {data.tvshow.rating
                ? `Rating:  ${data.tvshow.rating}`
                : "No Rating"}
            </span>
          </div>
          <hr />
          {/* tv show image */}
            <center>
              <img
                src={data.tvshow.image ? data.tvshow.image : ''}
                alt="TV Show thumbnail"
                height="300"
                width="250"
              />
              <hr />
            </center>
            
          {/* toast snack bar button */}
          <div id="toastBar"></div>

          <div className="tvshowDetails">
            {/* add to watch schedule */}
            {addToSchedule && (
              <button
                type="button"
                className="auth-input watchScheduleBtn"
                onClick={() =>
                  addToSchedule(
                    data.tvshow.url && data.tvshow.url,
                    currentUser && currentUser.email,
                    data.tvshow.name && data.tvshow.name,
                    data.tvshow.summary && data.tvshow.summary,
                    data.tvshow.image && data.tvshow.image,
                    data.tvshow.rating && data.tvshow.rating
                  )
                }
              >
                Add to Watch Schedule
              </button>
            )}

            {/* tv show language */}
            {data.tvshow.language && (
              <span> Language: {data.tvshow.language}</span>
            )}
            {data.tvshow.season && (
              <span>
                {/* tv show season and episode details */}
                Season {data.tvshow.season} Episode {data.tvshow.episode}
              </span>
            )}
          </div>
          {/* tv show summary */}
          {data.tvshow.summary && (
            <p
              dangerouslySetInnerHTML={{
                __html: data.tvshow.summary,
              }}
            ></p>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleTVShow;