import RadarViewer from "containers/RadarViewer/Main";
import Title from "containers/Title/Main";
import Form from "containers/Form/Main";
import React from "react";
import * as styles from "./styles.scss";

class Layout extends React.Component {
  render() {
    return <div className={styles.contentsFrame}>
      <div className={styles.titleFrame}>
        <Title />
      </div>
      <div className={styles.radarFrame}>
        <RadarViewer />
      </div>
      <div className={styles.formFrame}>
        <Form />
      </div>
    </div>;
  }
}

export default Layout;