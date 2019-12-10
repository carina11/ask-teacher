import React from "react";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      email: "",
      password: "",
      loading: false
    };
  }
  signin() {
    this.setState({
      loading: true
    });
    var email = document.getElementById("signInEmail").value + "@navi.com";
    var password = document.getElementById("signInPassword").value;
    var self = this;
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            console.log(firebase.auth().currentUser.email);
            console.log(firebase.auth().currentUser.displayName);
            self.setState({ redirect: true, loading: false });
          })
          .catch(function(error) {
            // Handle Errors here.
            console.log(error.code);
            alert(error.message);
            // ...
          });
      });
  }
  render() {
    if (this.state.redirect === true) {
      var redirect = <Redirect to="/index" />;
    }
    return (
      <div id="signin">
        <LoadingOverlay active={this.state.loading} spinner text="Loading...">
          <Container maxWidth="sm">
            <h2>ユーザ認証</h2>
            <br />
            ID
            <br />
            <input type="text" id="signInEmail" />
            {/*<TextField class="signInEmail"id="standard-basic" value={this.state.email} onChange={this.handleChange_email} label="ID"/>*/}
            <br />
            <br />
            Password
            <br />
            <input type="password" id="signInPassword" />
            {/*<TextField class="signInPassword"id="standard-basic" type="password" value={this.state.password} onChange={this.handleChange_password} label="Password"/>*/}
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.signin.bind(this)}
            >
              送信
            </Button>
            {redirect}
          </Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default SignIn;
