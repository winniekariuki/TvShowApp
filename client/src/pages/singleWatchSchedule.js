import React, { Fragment } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Loader from "../components/loader";
import "../components/styling/styling.css";
import Comment from "../components/comments";

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

function SingleWatchSchedule(props) {
  const id = props.match.params.id;
  const { data, loading, error } = useQuery(GET_SINGLE_TV_SHOW, {
    variables: { id },
  });

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
    <Fragment>
      <div id="toastBar"></div>
      <div className="singleWatchScheduleWrapper">
        {data.getSingleWatchSchedule && (
          <>
            <center>
              <h3>{data.getSingleWatchSchedule.name}</h3>
              <img
                src={
                  data.getSingleWatchSchedule.image
                    && data.getSingleWatchSchedule.image
                    
                }
                alt="TV Show thumbnail"
                height="200"
                width="150"
                // onClick={() => setShowModal(!showModal)}
              />
            </center>
            <hr />

            <div
              style={{
                padding: "0 1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* action buttons: favorite tv show in schedule */}
              {data.getSingleWatchSchedule.favorite === "true" ? (
                <button
                  type="button"
                  className="auth-input watchScheduleBtn"
                  onClick={() =>
                    alert(
                      "Yoo!! This functionality isn't yet accomplished. Let's say, it's in Development."
                    )
                  }
                >
                  Unfavorite
                </button>
              ) : (
                <button
                  type="button"
                  className="auth-input watchScheduleBtn"
                  onClick={() => favoriteTvShowHandler()}
                >
                  Favorite
                </button>
              )}
              <div style={{ paddingTop: `0.3rem`, color: "#797878" }}>
                {data.getSingleWatchSchedule.rating &&
                  `Rating ${data.getSingleWatchSchedule.rating}`}
              </div>
              {data.getSingleWatchSchedule.url && (
                <a href={data.getSingleWatchSchedule.url} target="_blank" rel="noopener noreferrer">
                  TV Show Link
                </a>
              )}
            </div>
            <div id="toastBar"></div>

            <p
              dangerouslySetInnerHTML={{
                __html: data.getSingleWatchSchedule.summary,
              }}
            ></p>
          </>
        )}


        {/* comment */}
        <Comment id={id}/>
      </div>
    </Fragment>
  );
}

export default SingleWatchSchedule;