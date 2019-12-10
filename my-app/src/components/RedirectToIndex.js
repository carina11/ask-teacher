import React from "react";
import { Redirect } from "react-router-dom";

class RedirectToIndex extends React.Component {
  render() {
    return <Redirect to="/index" />;
  }
}

export default RedirectToIndex;
