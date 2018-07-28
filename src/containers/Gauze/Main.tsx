import React from "react";
import * as styles from "./styles.scss";

class Gauze extends React.Component {
  onMouseDown = (event) => {
    this.props.onMouseDown(event.clientX, event.clientY);
  }

  render() {
    return <div
      className={styles.gauze}
      onMouseDown={this.onMouseDown}
    />
  }
}

export default Gauze;