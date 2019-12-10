import React from "react";
import firebase from "../firebase";
import { Redirect } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

class Answer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: "",
      image: "",
      loading: false
    };
  }

  answer() {
    var self = this;
    this.setState({
      loading: true
    });
    var storageRef = firebase
      .storage()
      .ref()
      .child(this.props.location.state.key + "-answer.png");
    storageRef.put(this.state.image).then(() => {
      storageRef = firebase
        .storage()
        .ref()
        .child(this.props.location.state.key + "-answer.png");
      var key = this.props.location.state.key;
      console.log(key);
      storageRef.getDownloadURL().then(function(url) {
        console.log(url);
        firebase
          .database()
          .ref("test/" + key)
          .update({
            answer: {
              exist: true,
              answerURL: url,
              user: firebase.auth().currentUser.email
            }
          });
        self.setState({
          redirect: <Redirect to="/index" />,
          loading: false
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
      redirect: <Redirect to="/index" />
    });
  }
  render() {
    return (
      <div>
        <div id="answer">
          <LoadingOverlay active={this.state.loading} spinner text="Loading...">
            <Container maxWidth="sm">
              <h2>解答を追加</h2>
              <br />
              問題名:<h3>{this.props.location.state.name}</h3>
              <br />
              科目: <h3>{this.props.location.state.subject}</h3>
              <br />
              <br />
              解答画像をアップロード
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
                onClick={this.answer.bind(this)}
              >
                追加
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
              {this.state.redirect}
            </Container>
          </LoadingOverlay>
        </div>
      </div>
    );
  }
}

export default Answer;
