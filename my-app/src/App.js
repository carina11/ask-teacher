import React from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from './firebase';
import { Link, BrowserRouter, Route, Redirect } from "react-router-dom";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import InfoIcon from '@material-ui/icons/Info';
import LoadingOverlay from 'react-loading-overlay';

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

class App extends React.Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Route exact path="/" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/assignment" component={Assignment} />
          <Route path="/index" component={Index} />
          <Route path="/signout" component={SignOut} />
          <Route path="/answer" component={Answer}/>
        </BrowserRouter>
      </div>
    );
  }
}

class Assignment extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      image: '',
      address: '',
      loading: false,
    }
  }
  assignment() {
    this.setState({
      loading: true,
    });
    var date = new Date();    
    var month = date.getMonth() + 1;
    var day = date.getDay() + 1;
    var self = this;
    let json = {
      assignmentName: document.getElementById("kadai").value,
      subject: document.getElementById("subject").options[
        document.getElementById("subject").selectedIndex
      ].value,
      assignmentURL: "",
      user: firebase.auth().currentUser.email,
      date: {
        month: month,
        day: day
      },
      answer: {
        exist: false,
        answerURL: "",
        user: "ryoinagaki"
      }
    };
    var database = firebase
      .database()
      .ref("test")
      .push(json);
    database.once("value", function(snapshot) {
      var storageRef = firebase.storage().ref().child(snapshot.key + '.png');
      storageRef.put(self.state.image).then(()=>{
        storageRef = firebase.storage().ref().child(snapshot.key+'.png');
      var key = snapshot.key;
      storageRef.getDownloadURL().then(function(url){
        console.log(url);
        firebase.database().ref("test/"+key).update({
          assignmentURL: url,
        });
        self.setState({ redirect: true, loading: false});
      });
      });
      
    });
  }

  getImage(event){
    var image = event.target.files[0];
    this.setState({
      image: image,
    });
  }
  render() {
    if(this.state.redirect === true){
      var redirect = <Redirect to="/index"/>;
    }
    return (
      <div id="create">
        <LoadingOverlay active={this.state.loading} spinner text="Loading...">
        <Container maxWidth="sm">
        <h2>問題投稿</h2><br/>
        問題名<br/>
        <input type="text" id="kadai" />
        <br /><br/>
        科目選択&nbsp;
        <select id="subject">
          <option value=""></option>
          <option value="英語">英語</option>
          <option value="数学">数学</option>
          <option value="社会">社会</option>
          <option value="理科">理科</option>
          <option value="国語">国語</option>
        </select><br/><br/>
        画像アップロード<br/>
        <input type="file" accept="image/*" onChange ={(event)=>{this.getImage(event)}}/>
        <br /><br/><br/>
        <Button variant="contained" color="primary" onClick={this.assignment.bind(this)}>送信</Button>
        {redirect}
        </Container>
        </LoadingOverlay>
      </div>
    );
  }
}



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
        .then(function(){
          firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(firebase.auth().currentUser.email);
        if(userType === '0')firebase.auth().currentUser.updateProfile({
          displayName: "teacher"
        });
        if(userType === '1')firebase.auth().currentUser.updateProfile({
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
        ID<br/>
        <input type="text" id="signUpEmail" />
        <br />
        Password<br/>
        <input type="password" id="signUpPassword" />
        <br />
        再入力<br/>
        <input type="password" id="confirmPassword" />
        <br />
        ユーザタイプ(先生：0, 生徒:1)<br/>
        <input type="text" id="userType"/>
        <br/>
        <button onClick={this.signup.bind(this)}>送信</button>
      </div>
    );
  }
}
class SignIn extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      redirect: false,
      email: '',
      password: '',
      loading: false,
    };
  }
  signin() {
    this.setState({
      loading: true,
    });
    var email = document.getElementById("signInEmail").value + "@navi.com";
    var password = document.getElementById("signInPassword").value;
    var self = this;
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() =>{
      firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log(firebase.auth().currentUser.email);
        console.log(firebase.auth().currentUser.displayName);
        self.setState({redirect: true, loading: false});
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        alert(error.message);
        // ...
      });
    } );
    
  }
  render() {
    if(this.state.redirect === true){
      var redirect = <Redirect to="/index"/>;
    }
    return (
      <div id="signin" >
        <LoadingOverlay active={this.state.loading} spinner text='Loading...'>
        <Container maxWidth="sm">
        <h2>ユーザ認証</h2>
        <br />
        ID<br/>
        <input type="text" id="signInEmail" />
        {/*<TextField class="signInEmail"id="standard-basic" value={this.state.email} onChange={this.handleChange_email} label="ID"/>*/}
        <br /><br/>
        Password<br/>
        <input type="password" id="signInPassword" />
        {/*<TextField class="signInPassword"id="standard-basic" type="password" value={this.state.password} onChange={this.handleChange_password} label="Password"/>*/}
        <br /><br/>
        <Button variant="contained" color="primary" onClick={this.signin.bind(this)}>送信</Button>
        {redirect}
        </Container>
        </LoadingOverlay>
      </div>
    );
  }
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ["a", "b", "c"],
      subject: ["a", "math", "science"],
      json: [],
      assignment: '',
      action: '',
      redirect: '',
      editable: '',
    };
  }
  componentWillMount() {
    var database = firebase.database().ref("test");
    var self = this;
    if(firebase.auth().currentUser === null){
      this.setState({
        assignment: <Redirect to="/"/>
      });
    }
    else if(firebase.auth().currentUser.displayName === "student"){
      self.setState({
        assignment: <Link to="/assignment" color="primary">問題の新規投稿</Link>,
        editable: {
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                { 
                  
                  firebase.storage().ref().child(oldData.key+'.png').delete();
                  firebase.database().ref("test/"+oldData.key).once("value",function(snapshot){
                    if(snapshot.val().answer.exist === true)firebase.storage().ref().child(oldData.key+'-answer.png').delete();
                  }).then(()=>{
                    firebase.database().ref("test/"+oldData.key).remove();
                  });
                  
                  let data = this.state.json;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.setState({ data }, () => resolve());
                }
                resolve()
              }, 1000)
            }),
        },
      });
      database.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (firebase.auth().currentUser)
            if (childSnapshot.val().user === firebase.auth().currentUser.email) {
              self.setState({
                json: self.state.json.concat({
                  key: childSnapshot.key,
                  name: childSnapshot.val().assignmentName,
                  subject: childSnapshot.val().subject,
                  date: `${childSnapshot.val().date.month}/${childSnapshot.val().date.day}`,
                  questionURL: childSnapshot.val().assignmentURL,
                  answerURL: childSnapshot.val().answer.answerURL,
                })
              });
              /*if(childSnapshot.val().answer.exist === true){
                self.setState({
                  json: self.state.json.concat({
                    answerURL: childSnapshot.val().answer.answerURL,
                  })
                });
              }*/
            }
        });
      });
    } else if(firebase.auth().currentUser.displayName === "teacher"){
      self.setState({
        action: [
          {
            icon: AddIcon,
            tooltip: "解答の追加",
            onClick: (event, rowData) =>{
              alert(rowData.name + "に解答を追加しますか？ " ); 
              alert(rowData.key );
              var data = rowData.key;
              var name = rowData.name;
              var subject = rowData.subject;
              self.setState({
                redirect: <Redirect to={{
                  pathname: '/answer',
                  state: {
                    key: data,
                    name: name,
                    subject: subject,
                  }
                }}/>
              })
            }
          }
        ],
      });
      database.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (firebase.auth().currentUser) {
              self.setState({
                json: self.state.json.concat({
                  key: childSnapshot.key,
                  name: childSnapshot.val().assignmentName,
                  subject: childSnapshot.val().subject,
                  date: `${childSnapshot.val().date.month}/${childSnapshot.val().date.day}`,
                  questionURL: childSnapshot.val().assignmentURL,
                  answerURL: childSnapshot.val().answer.answerURL,
                })
              });
          }
        });
      });
    }else{
      this.state({
        assignment: <Redirect to="/"/>
      });
    }
  }

  render() {
    return (
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          icons={tableIcons}
          title="投稿した問題一覧"
          columns={[
            { title: "問題名", field: "name" },
            { title: "科目", field: "subject" },
            { title: "問題", field: "questionURL", render: rowData => <img src={rowData.questionURL} style={{width: 60}}/>},
            { title: "解答", field: "AnswerURL", render: rowData => <img src={rowData.answerURL}style={{width: 60}}/>},
          ]}
          data={this.state.json}
          actions={this.state.action}
          editable={this.state.editable}
        />
        <br/><br/>
        {this.state.assignment}<br/>
        <Link to="/signout" color="primary">サインアウト</Link><br/>
        {this.state.redirect}<br/>

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

class Answer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      redirect: '',
      image: '',
      loading: false,
    }
  }
  componentWillMount(){
    console.log(this.props.location.state.key);
    console.log("hello");
  }
  answer(){
    var self = this;
    this.setState({
      loading: true,
    });
    var storageRef = firebase.storage().ref().child(this.props.location.state.key + '-answer.png');
    storageRef.put(this.state.image).then(()=>{
      storageRef = firebase.storage().ref().child(this.props.location.state.key+'-answer.png');
    var key = this.props.location.state.key;
    console.log(key);
    storageRef.getDownloadURL().then(function(url){
      console.log(url);
      firebase.database().ref("test/"+key).update({
        answer: {
          exist: true,
          answerURL: url,
          user: firebase.auth().currentUser.email,
        }
      });
      self.setState({ 
        redirect: <Redirect to="/index"/>, 
        loading: false});
    });
    });
    
  }
  getImage(event){
    var image = event.target.files[0];
    this.setState({
      image: image,
    });
  }
  render(){
    return(
      <div>
        <div id="answer">
        <LoadingOverlay active={this.state.loading} spinner text="Loading...">
        <Container maxWidth="sm">
        <h2>解答を追加</h2><br/>
        問題名:<h3>{this.props.location.state.name}</h3><br/>
        科目: <h3>{this.props.location.state.subject}</h3><br/>
        <br/>
        解答画像をアップロード<br/>
        <input type="file" accept="image/*" onChange ={(event)=>{this.getImage(event)}}/>
        <br /><br/><br/>
        <Button variant="contained" color="primary" onClick={this.answer.bind(this)}>送信</Button>
        {this.state.redirect}
        </Container>
        </LoadingOverlay>
      </div>
        
      </div>
    );
  }
}

export default App;
