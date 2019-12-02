import React from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import {Link, BrowserRouter, Route} from 'react-router-dom';

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
  

  
  render(){
    return(
      <div>
        
        <BrowserRouter>
        <Link to="/">SignIn</Link><br/>
        <Link to="/signup">SignUp</Link><br/>
        <Link to="/kadai">問題投稿</Link><br/>
        <Link to="/kadaisearch">科目検索</Link><br/>
        <br/><br/>

          <Route exact path='/' component={SignIn}/>
          <Route path='/signup' component={SignUp}/>
          <Route path='/kadai' component={Kadai}/>
          <Route path='/kadaisearch' component={KadaiSearch}/>

        </BrowserRouter>
        

        {/*<Kadai/>
        <br/><br/>
        <KadaiSearch/>
        <br/><br/>
        <SignUp/>
        <br/><br/>
        <SignIn/>*/}
      </div>
    );
  }
}

class Kadai extends React.Component{
  kadai(){
    //alert(`${document.getElementById("kadai").value}${document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value}`);
    let json ={
      "kadaiName": document.getElementById("kadai").value,
      "subject": document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value,
      "questionURL": "",
      "user": firebase.auth().currentUser.email,
      "kaisetsu":{
        "exist": false,
        "kaisetsuURL": "",
        "user": "ryoinagaki"
      }
    };
    //console.log(json.kadaiName);
    //console.log(json.subject);
    var database = firebase.database().ref("test").push(json);
    database.once("value",function(snapshot){
      //console.log(snapshot.val().kadaiName);
      //console.log(snapshot.val().subject);
    });
  }

  render(){
    return(
      <div id="create">
        課題名
        <input type="text" id="kadai"/><br/>
        科目選択&nbsp;
        <select id="subject">
          <option value=""></option>
          <option value="english">英語</option>
          <option value="math">数学</option>
          <option value="social_studies">社会</option>
          <option value="science">理科</option>
          <option value="japanese">国語</option>
        </select><br/>
        <button onClick={this.kadai.bind(this)}>送信</button>
        </div>
    );
  }
}

class KadaiSearch extends React.Component{
  search(){
    var subject = document.getElementById("subjectSearch").options[document.getElementById("subjectSearch").selectedIndex].value;
    var database = firebase.database().ref("test");
    database.once("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.val().subject === subject)console.log(childSnapshot.val().kadaiName);
      });
    });
  }

  render(){
    return(
      <div id="searchSubject">
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
        </div>

    );
  }
}

class SignUp extends React.Component{
  signup(){
    var email = document.getElementById("signUpEmail").value + "@navi.com";
    var password = document.getElementById("signUpPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if(password === confirmPassword){
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        console.log(errorCode);
        alert(errorMessage);
      });
    }else{
      alert("パスワードが一致しません");
    }
  }
  render(){
    return(
<div id="signup">
          ユーザ登録<br/>
          mail
          <input type="text" id="signUpEmail"/><br/>
          password
          <input type="password" id="signUpPassword"/><br/>
          再入力
          <input type="password" id="confirmPassword"/><br/>
          <button onClick={this.signup.bind(this)}>送信</button>
        </div>
    );
  }
}
class SignIn extends React.Component{
  signin(){
    var email = document.getElementById("signInEmail").value + "@navi.com";
    var password = document.getElementById("signInPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      console.log(error.code);
      alert(error.message);
      // ...
    });
    console.log(firebase.auth().currentUser.email);
  }
  render(){
    return(
  <div id="signin">
        ユーザ認証<br/>
          mail
          <input type="text" id="signInEmail"/><br/>
          password
          <input type="password" id="signInPassword"/><br/>
          <button onClick={this.signin.bind(this)}>送信</button>
        </div>
    );
  }
}


export default App;
