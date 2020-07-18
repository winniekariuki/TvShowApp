import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import SignUp from "../components/signup";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

// import "../components/modal/toast.css";


// sign up mutation
const REGISTER_USER = gql`
  mutation createUSer($email: String!, $password: String!, $username: String) {
    createUSer(email: $email, password: $password username:$username) {
      message
    }
  }
`;

function RegisterUser(props) {
  const client = useApolloClient();

  // sign up
  const [createUSer, { SignupLoader, SignupError }] = useMutation(REGISTER_USER, {
    onCompleted({ createUSer }) {
      if(createUSer.message === 'User Created Successfully'){
        props.history.push("/");
      }
      let toastDiv = document.getElementById("toastBar");
      toastDiv.className = "show";
      setTimeout(function () {
        toastDiv.className = toastDiv.className.replace("show", "");
      }, 3000);
      toastDiv.innerHTML = createUSer.message;
    },
  });

  return (
    <div>
      <div id="toastBar"></div>
      <SignUp signup={createUSer} />
    </div>
  );
}

export default RegisterUser;