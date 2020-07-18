import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import Loader  from "../../components/loader";


const CREATE_COMMENT = gql`
  mutation createComment($watchScheduleId: ID!, $comment: String) {
    createTVShowComment(watchScheduleId: $watchScheduleId, comment: $comment) {
      status
      message
      comment
      watchScheduleId
    }
  }
`;

// get all comments query
const GET_COMMENTS = gql`
  query getTvShowComment($watchScheduleId: String!) {
    getTvShowComment(watchScheduleId: $watchScheduleId) {
      message
      status
      getTvShowComment {
          comment
          createdAt
          updatedAt
      }
    }
  }`

function Comment(props) {
  const [comment, setComment] = useState("");

//   Get all comments
let { data, loading, error } = useQuery(GET_COMMENTS, {
    variables: { watchScheduleId: props.id },
  });

//   create comment mutation 
  const [createTVShowComment, { commentsLoader, commentsError }] = useMutation(
    CREATE_COMMENT,
    {
      onCompleted({ createTVShowComment }) {
        let toastDiv = document.getElementById("toastBar");
        toastDiv.className = "show";
        setTimeout(function () {
          toastDiv.className = toastDiv.className.replace("show", "");
        }, 3000);
        toastDiv.innerHTML = createTVShowComment.message;
      },
    }
  );

  //   on change event for email
  const commentHandler = (e) => {
    setComment(e.target.value);
  };

  //   submit comment
  const addCommentHandler = () => {
    if (comment === "") {
      let toastDiv = document.getElementById("toastBar");
      toastDiv.className = "show";
      setTimeout(function () {
        toastDiv.className = toastDiv.className.replace("show", "");
      }, 3000);
      toastDiv.innerHTML = "Comment is Required";
      return toastDiv;
    }
    createTVShowComment({
      variables: {
        watchScheduleId: props.id,
        comment,
      },
    });
    window.location.reload()
  };

  if (loading || commentsLoader) return <Loader />;
  if (error || commentsError) return <p>An error occurred {error}</p>;

  return (
    <div className="commentsWrapper">
      <div id="toastBar"></div>
      <label htmlFor="comment"><b>Comments</b></label>
      <br />
      <textarea 
        cols="100"
        size="60"
        rows="5"
        id="comment"
        value={comment}
        placeholder="Some comment text here ..."
        className="auth-input"
        onChange={commentHandler}
      />
      <br />
      <button
        style={{
          marginTop: "0.4rem",
          padding: "0.4rem",
          background: "white",
          color: "#000",
          border: 0,
          borderRadius: "3px",
        }}
        type="button"
        onClick={() => addCommentHandler()}
      >
        Comment
      </button>

        <br />
        <br />

      {/* all comments display */}
      {data && data.getTvShowComment.getTvShowComment && <div>
          {data.getTvShowComment.getTvShowComment.map(comment => {
              return <div className="singleComment" key={Math.random()}>
                <p>{comment.comment}</p>
                <span className="commentDate">Date</span>
              </div>
          })}
      </div>}
    </div>
  );
}

export default Comment;