import React from "react";
import * as styles from "./styles.scss";

class Gauze extends React.Component {
  componentDidMount() {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("keydown", this.onKeyDown);
  }

  render() {
    return (
      <div className={styles.gauze} onMouseDown={this.onMouseDown} />
    );
  }

  onMouseDown = (event) => {
    this.props.onMouseDown(event.clientX, event.clientY);
  }

  onMouseMove = (event) => {
    this.props.onMouseMove(event.clientX, event.clientY);
  }

  onMouseUp = (event) => {
    this.props.onMouseUp(event.clientX, event.clientY);
  }

  onKeyDown = (event) => {
    if (event.keyCode == 13) {
      this.props.onKeyDown();
    }
  }
}

export default Gauze;
