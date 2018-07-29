import React from "react";
import * as styles from "./styles.scss";

class Gauze extends React.Component {
  onMouseDown = (event) => {
    this.props.onMouseDown(event.clientX, event.clientY);
  };

  onMouseMove = (event) => {
    this.props.onMouseMove(event.clientX, event.clientY);
  };

  onMouseUp = (event) => {
    this.props.onMouseUp(event.clientX, event.clientY);
  };

  render() {
    return <div
      className={styles.gauze}
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
    />
  }
}

export default Gauze;