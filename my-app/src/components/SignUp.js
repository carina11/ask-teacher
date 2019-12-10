import React from "react";
import firebase from "../firebase";

class SignUp extends React.Component {
  signup() {
    var email = document.getElementById("signUpEmail").value + "@navi.com";
    var password = document.getElementById("signUpPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var userType = document.getElementById("userType").value;

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
        <h2>ユーザ登録</h2>
        <br />
        ID
        <br />
        <input type="text" id="signUpEmail" />
        <br />
        Password
        <br />
        <input type="password" id="signUpPassword" />
        <br />
        再入力
        <br />
        <input type="password" id="confirmPassword" />
        <br />
        ユーザタイプ(先生：0, 生徒:1)
        <br />
        <input type="text" id="userType" />
        <br />
        <button onClick={this.signup.bind(this)}>送信</button>
      </div>
    );
  }
}

export default SignUp;
