import RadarViewer from "containers/RadarViewer/Main";
import Title from "containers/Title/Main";
import Form from "containers/Form/Main";
import CoordinateManager from "models/CoordinateManager";
import ParameterManager from "models/ParameterManager";
import React from "react";
import * as styles from "./styles.scss";

class Layout extends React.Component {
  constructor(props) {
    super(props);

    const coordinateManager = new CoordinateManager();
    const parameterManager = new ParameterManager();

    this.state = {
      coordinateManager,
      parameterManager,
    };
  }

  render() {
    return (
      <div className={styles.contentsFrame}>
        <div className={styles.titleFrame}>
          <Title />
        </div>
        <div className={styles.radarFrame}>
          <RadarViewer
            coordinateManager={this.state.coordinateManager}
            parameterManager={this.state.parameterManager}
          />
        </div>
        <div className={styles.formFrame}>
          <Form
          setViewTheta={this.setViewTheta}
          />
        </div>
      </div>
    );
  }

  setViewTheta = (viewTheta: number) => {
    this.state.coordinateManager.setParams({
      viewTheta,
    });
  }
}

export default Layout;