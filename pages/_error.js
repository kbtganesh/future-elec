import React, { Component } from "react";
import Router from "next/router";

export default class _error extends Component {
  componentDidMount = (a,b,c) => {
    console.log("kbt: componentDidMount -> a,b,c", a,b,c);
    Router.push("/");
  };

  render() {
    return <div />;
  }
}
