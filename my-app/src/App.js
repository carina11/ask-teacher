import React from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "firebase";
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import DeleteIcon from "@material-ui/icons/Delete";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

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

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Link to="/">SignIn</Link>
          <br />
          <Link to="/signup">SignUp</Link>
          <br />
          <Link to="/assignment">問題投稿</Link>
          <br />
          <Link to="/assignmentsearch">科目検索</Link>
          <br />
          <Link to="/index">インデックス</Link>
          <br />
          <Link to="/signout">SignOut</Link>
          <br />
          <br />
          <br />

          <Route exact path="/" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/assignment" component={Assignment} />
          <Route path="/assignmentsearch" component={AssignmentSearch} />
          <Route path="/index" component={Index} />
          <Route path="/signout" component={SignOut} />
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

class Assignment extends React.Component {
  assignment() {
    //alert(`${document.getElementById("kadai").value}${document.getElementById("subject").options[document.getElementById("subject").selectedIndex].value}`);
    let json = {
      assignmentName: document.getElementById("kadai").value,
      subject: document.getElementById("subject").options[
        document.getElementById("subject").selectedIndex
      ].value,
      assignmentURL: "",
      user: firebase.auth().currentUser.email,
      answer: {
        exist: false,
        answerURL: "",
        user: "ryoinagaki"
      }
    };
    //console.log(json.kadaiName);
    //console.log(json.subject);
    var database = firebase
      .database()
      .ref("test")
      .push(json);
    database.once("value", function(snapshot) {
      //console.log(snapshot.val().kadaiName);
      //console.log(snapshot.val().subject);
    });
  }

  render() {
    return (
      <div id="create">
        課題名
        <input type="text" id="kadai" />
        <br />
        科目選択&nbsp;
        <select id="subject">
          <option value=""></option>
          <option value="english">英語</option>
          <option value="math">数学</option>
          <option value="social_studies">社会</option>
          <option value="science">理科</option>
          <option value="japanese">国語</option>
        </select>
        <br />
        <button onClick={this.assignment.bind(this)}>送信</button>
      </div>
    );
  }
}

class AssignmentSearch extends React.Component {
  search() {
    var subject = document.getElementById("subjectSearch").options[
      document.getElementById("subjectSearch").selectedIndex
    ].value;
    var database = firebase.database().ref("test");
    database.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.val().subject === subject)
          console.log(childSnapshot.val().assignmentName);
      });
    });
  }

  render() {
    return (
      <div id="searchSubject">
        科目検索
        <br />
        <select id="subjectSearch">
          <option value=""></option>
          <option value="english">英語</option>
          <option value="math">数学</option>
          <option value="social_studies">社会</option>
          <option value="science">理科</option>
          <option value="japanese">国語</option>
        </select>
        <br />
        <input type="button" value="検索" onClick={this.search.bind(this)} />
      </div>
    );
  }
}

class SignUp extends React.Component {
  signup() {
    var email = document.getElementById("signUpEmail").value + "@navi.com";
    var password = document.getElementById("signUpPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (password === confirmPassword) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          console.log(errorCode);
          alert(errorMessage);
        });
    } else {
      alert("パスワードが一致しません");
    }
  }
  render() {
    return (
      <div id="signup">
        ユーザ登録
        <br />
        mail
        <input type="text" id="signUpEmail" />
        <br />
        password
        <input type="password" id="signUpPassword" />
        <br />
        再入力
        <input type="password" id="confirmPassword" />
        <br />
        <button onClick={this.signup.bind(this)}>送信</button>
      </div>
    );
  }
}
class SignIn extends React.Component {
  signin() {
    var email = document.getElementById("signInEmail").value + "@navi.com";
    var password = document.getElementById("signInPassword").value;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(firebase.auth().currentUser.email);
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        alert(error.message);
        // ...
      });
  }
  render() {
    return (
      <div id="signin">
        ユーザ認証
        <br />
        mail
        <input type="text" id="signInEmail" />
        <br />
        password
        <input type="password" id="signInPassword" />
        <br />
        <button onClick={this.signin.bind(this)}>送信</button>
      </div>
    );
  }
}

class Index extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      name: [
        "a", "b", "c" 
      ],
      subject: [
        "a", "math", "science"
      ],
      json: [],

    }

    
  }
  componentWillMount(){
    var database = firebase.database().ref("test");
    var assignment = [];
    var subject = [];
    var self = this;
    database.once("value", function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if (firebase.auth().currentUser)
          if (childSnapshot.val().user === firebase.auth().currentUser.email) {
            assignment.push(childSnapshot.val().assignmentName.toString());
            subject.push(childSnapshot.val().subject.toString());
            self.state.json = self.state.json.concat({
              name: childSnapshot.val().assignmentName, subject: childSnapshot.val().subject
            });
          }
      });
      console.log(self.state.json);
    });
    console.log(subject);
        //console.log(self.state.json);
    this.setState({ json: [{ name: "c", subject: "japanese"}]});
    
   // this.state.name = this.state.name.concat(a);
    this.setState({ json: [
      { name: "a", subject: "english"},
      { name: "b", subject: "mathmatics"}
    ]});
  }
  

  render() {
    return (
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          icons={tableIcons}
          title="Multiple Actions Preview"
          columns={[
            { title: "問題名", field: "name" },
            { title: "科目", field: "subject" }
          ]}
          
          data={this.state.json}
          actions={[
            {
              icon: DeleteIcon,
              tooltip: "問題の削除",
              onClick: (event, rowData) =>
                alert("You want to delete " + rowData.name)
            }
          ]}
        />
      </div>
    );
  }
}

const SignOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("サインアウトしました");
    });
  return <Redirect to="/" />;
};

export default App;
