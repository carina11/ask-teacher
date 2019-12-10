import React from "react";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import MaterialTable from "material-table";
import tableIcons from "./Icons";


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      json: [],
      assignment: "",
      action: "",
      redirect: "",
      editable: "",
      reload: ""
    };
  }
  componentWillMount() {
    var database = firebase.database().ref("test");
    var self = this;
    if (firebase.auth().currentUser === null) {
      this.setState({
        assignment: <Redirect to="/" />
      });
    } else if (firebase.auth().currentUser.displayName === "student") {
      self.setState({
        assignment: (
          <Button
            variant="contained"
            color="primary"
            onClick={this.assignment.bind(this)}
          >
            新規問題投稿
          </Button>
        ),
        editable: {
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                {
                  firebase
                    .storage()
                    .ref()
                    .child(oldData.key + ".png")
                    .delete();
                  firebase
                    .database()
                    .ref("test/" + oldData.key)
                    .once("value", function(snapshot) {
                      if (snapshot.val().answer.exist === true)
                        firebase
                          .storage()
                          .ref()
                          .child(oldData.key + "-answer.png")
                          .delete();
                    })
                    .then(() => {
                      firebase
                        .database()
                        .ref("test/" + oldData.key)
                        .remove();
                    });

                  let data = this.state.json;
                  const index = data.indexOf(oldData);
                  data.splice(index, 1);
                  this.setState({ data }, () => resolve());
                }
                resolve();
              }, 1000);
            })
        }
      });
      database.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (firebase.auth().currentUser)
            if (
              childSnapshot.val().user === firebase.auth().currentUser.email
            ) {
              self.setState({
                json: self.state.json.concat({
                  key: childSnapshot.key,
                  name: childSnapshot.val().assignmentName,
                  subject: childSnapshot.val().subject,
                  date: `${childSnapshot.val().date.month}/${
                    childSnapshot.val().date.day
                  }`,
                  questionURL: childSnapshot.val().assignmentURL,
                  answerURL: childSnapshot.val().answer.answerURL
                })
              });
            }
        });
      });
    } else if (firebase.auth().currentUser.displayName === "teacher") {
      self.setState({
        action: [
          {
            icon: AddIcon,
            tooltip: "解答の追加",
            onClick: (event, rowData) => {
              var r = window.confirm(rowData.name + "に解答を追加しますか？ ");
              var data = rowData.key;
              var name = rowData.name;
              var subject = rowData.subject;
              if (r === true)
                self.setState({
                  redirect: (
                    <Redirect
                      to={{
                        pathname: "/answer",
                        state: {
                          key: data,
                          name: name,
                          subject: subject
                        }
                      }}
                    />
                  )
                });
            }
          }
        ]
      });
      database.once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          if (firebase.auth().currentUser) {
            self.setState({
              json: self.state.json.concat({
                key: childSnapshot.key,
                name: childSnapshot.val().assignmentName,
                subject: childSnapshot.val().subject,
                date: `${childSnapshot.val().date.month}/${
                  childSnapshot.val().date.day
                }`,
                questionURL: childSnapshot.val().assignmentURL,
                answerURL: childSnapshot.val().answer.answerURL
              })
            });
          }
        });
      });
    } else {
      this.state({
        assignment: <Redirect to="/" />
      });
    }
  }
  signout() {
    this.setState({
      redirect: <Redirect to="/signout" />
    });
  }
  assignment() {
    this.setState({
      redirect: <Redirect to="/assignment" />
    });
  }
  reload() {
    this.setState({
      redirect: <Redirect to="/redirect" />
    });
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
            {
              title: "問題",
              field: "questionURL",
              render: rowData => (
                <img src={rowData.questionURL} style={{ width: 60 }} />
              )
            },
            {
              title: "解答",
              field: "AnswerURL",
              render: rowData => (
                <img src={rowData.answerURL} style={{ width: 60 }} />
              )
            }
          ]}
          data={this.state.json}
          actions={this.state.action}
          editable={this.state.editable}
        />
        <br />
        {this.state.assignment}
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={this.signout.bind(this)}
        >
          サインアウト
        </Button>
        <br />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={this.reload.bind(this)}
        >
          リロード
        </Button>
        <br />
        <br />
        {this.state.redirect}
        <br />
      </div>
    );
  }
}

export default Index;
