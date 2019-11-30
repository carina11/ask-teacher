import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyDNT2NvrxwArQrNZJQTozcveab7cH3ngf4",
  authDomain: "ask-teacher-0211.firebaseapp.com",
  databaseURL: "https://ask-teacher-0211.firebaseio.com",
  projectId: "ask-teacher-0211",
  storageBucket: "ask-teacher-0211.appspot.com",
  messagingSenderId: "45700314741",
  appId: "1:45700314741:web:ee03cc032881993b232a3c",
  measurementId: "G-PD016DXDC5"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();


class App extends React.Component{
  text(){
    //alert(`${document.getElementById("kadai").value}${document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value}`);
    let json ={
      "kadaiName": document.getElementById("kadai").value,
      "subject": document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value
    };
    //console.log(json.kadaiName);
    //console.log(json.subject);
    var database = firebase.database().ref("test").push(json);
    database.once("value",function(snapshot){
      console.log(snapshot.val().kadaiName);
      console.log(snapshot.val().subject);
    });
  }

  search(){
    var subject = document.getElementById("subjectSearch").options[document.getElementById("subjectSearch").selectedIndex].value;
    var database = firebase.database().ref("test");
    database.once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().subject === subject)console.log(childSnapshot.val().kadaiName);
      });
    });
  }

  signup(){
    var email = document.getElementById("signUpEmail").value;
    var password = document.getElementById("signUpPassword").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
      console.log(errorCode);
      console.log(errorMessage);
    });
  }
  
  render(){
    return(
      <div>
        課題名
        <input type="text" id="kadai"/><br/><br/>
        科目選択&nbsp;
        <select id="subject">
          <option value=""></option>
          <option value="english">英語</option>
          <option value="math">数学</option>
          <option value="social_studies">社会</option>
          <option value="science">理科</option>
          <option value="japanese">国語</option>
        </select><br/><br/>
        <button onClick={this.text.bind(this)}>送信</button>
        <br/><br/><br/>
        科目検索<br/>
        <select id="subjectSearch">
          <option value=""></option>
          <option value="english">英語</option>
          <option value="math">数学</option>
          <option value="social_studies">社会</option>
          <option value="science">理科</option>
          <option value="japanese">国語</option>
        </select>
        <br/>
        <input type="button" value="検索" onClick={this.search.bind(this)}/>

        <br/><br/>
        ユーザ登録<br/>
        mail
        <input type="text" id="signUpEmail"/><br/>
        password
        <input type="text" id="signUpPassword"/><br/>
        <button onClick={this.signup.bind(this)}>送信</button>
      </div>
    );
  }
}


export default App;
