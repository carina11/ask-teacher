import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";

//各コンポーネントのインポート
import Assignment from "./components/Assignment";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Index from "./components/Index";
import SignOut from "./components/SignOut";
import Answer from "./components/Answer";
import RedirectToIndex from "./components/RedirectToIndex";

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
          <Route path="/answer" component={Answer} />
          <Route path="/redirect" component={RedirectToIndex} />
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
