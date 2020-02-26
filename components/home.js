import React from "react";
import Items from "./items";

export class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Items {...this.props} />;
  }
}
