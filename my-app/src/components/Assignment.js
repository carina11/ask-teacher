import React from "react";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      image: "",
      address: "",
      loading: false,
      index: ""
    };
  }
  assignment() {
    this.setState({
      loading: true
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
      var storageRef = firebase
        .storage()
        .ref()
        .child(snapshot.key + ".png");
      storageRef.put(self.state.image).then(() => {
        storageRef = firebase
          .storage()
          .ref()
          .child(snapshot.key + ".png");
        var key = snapshot.key;
        storageRef.getDownloadURL().then(function(url) {
          console.log(url);
          firebase
            .database()
            .ref("test/" + key)
            .update({
              assignmentURL: url
            });
          self.setState({ redirect: true, loading: false });
        });
      });
    });
  }

  getImage(event) {
    var image = event.target.files[0];
    this.setState({
      image: image
    });
  }
  index() {
    this.setState({
      index: <Redirect to="/index" />
    });
  }
  render() {
    if (this.state.redirect === true) {
      var redirect = <Redirect to="/index" />;
    }
    return (
      <div id="create">
        <LoadingOverlay active={this.state.loading} spinner text="Loading...">
          <Container maxWidth="sm">
            <h2>問題投稿</h2>
            <br />
            問題名
            <br />
            <input type="text" id="kadai" />
            <br />
            <br />
            科目選択&nbsp;
            <select id="subject">
              <option value=""></option>
              <option value="英語">英語</option>
              <option value="数学">数学</option>
              <option value="社会">社会</option>
              <option value="理科">理科</option>
              <option value="国語">国語</option>
            </select>
            <br />
            <br />
            画像アップロード
            <br />
            <input
              type="file"
              accept="image/*"
              onChange={event => {
                this.getImage(event);
              }}
            />
            <br />
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.assignment.bind(this)}
            >
              投稿
            </Button>
            <br />
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={this.index.bind(this)}
            >
              戻る
            </Button>
            <br />
            <br />
            {redirect}
            {this.state.index}
          </Container>
        </LoadingOverlay>
      </div>
    );
  }
}

export default Assignment;
