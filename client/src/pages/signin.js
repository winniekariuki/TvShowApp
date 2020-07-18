import React from "react";
import { useApolloClient, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import SignInSide from "../components/signIn";

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      message
    }
  }
`;


function Login(props) {
  const client = useApolloClient();
  // login
  const [login] = useMutation(LOGIN_USER, {
    onCompleted({ login }) {
      if (login.message === "Login successful") {
        props.history.push("/home");
      }
      if (!login.token) {
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