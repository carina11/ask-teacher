import React from "react";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";

const SignOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("サインアウトしました");
    });
  return <Redirect to="/" />;
};

export default SignOut;
