import React from "react";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import { Button, Container } from "@material-ui/core";
import LoadingOverlay from "react-loading-overlay";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: "",
      loading: false
    };
  }
  signup() {
    this.setState({
      loading: true
    });
    var email = document.getElementById("signUpEmail").value + "@navi.com";
    var password = document.getElementById("signUpPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var userType = document.getElementById("userType").value;
    var self = this;
    if (password === confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(function() {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              console.log(firebase.auth().currentUser.email);
              if (userType === "0")
                firebase.auth().currentUser.updateProfile({
                  displayName: "teacher"
                });
              if (userType === "1")
                firebase.auth().currentUser.updateProfile({
                  displayName: "student"
                });
              self.setState({
                redirect: <Redirect to="/signout" />,
                loading: false
              });
            })
            .catch(function(error) {
              // Handle Errors here.
              console.log(error.code);
              alert(error.message);
              // ...
            });
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(errorCode);
          alert(errorMessage);
        });
    } else {
      alert("入力した２つのパスワードが一致しません");
    }
  }
  render() {
    return (
      <div id="signup">
        <LoadingOverlay active={this.state.loading} spinner text="Loading...">
          <Container maxWidth="sm">
            <h2>ユーザ登録</h2>
            <br />
            ID
            <br />
            <input type="text" id="signUpEmail" />
            <br />
            <br />
            Password
            <br />
            <input type="password" id="signUpPassword" />
            <br />
            <br />
            再入力
            <br />
            <input type="password" id="confirmPassword" />
            <br />
            <br />
            ユーザタイプ(先生：0, 生徒:1)
            <br />
            <input type="text" id="userType" />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.signup.bind(this)}
            >
              送信
            </Button>
            {this.state.redirect}
          </Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default SignUp;
