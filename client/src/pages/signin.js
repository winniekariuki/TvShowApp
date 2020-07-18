import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import SignInSide from "../components/signIn";
import { makeStyles } from '@material-ui/core/styles';


const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      message
    }
  }
`;
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

function Login(props) {
  const client = useApolloClient();
  // login
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      if (login.message === "Login successful") {
        props.history.push("/home");
      }
      if(!login.token) {
        return alert(login.message)
      }
      if (login.message === "Login successful") {
        localStorage.setItem("token", login.token);
        if (login) {
          client.writeData({ data: { isLoggedIn: true } });
        }
      }
    },
  });

  return (
    <div>
      <div id="toastBar"></div>
      <SignInSide login={login} />
    </div>
  );
}

export default Login;