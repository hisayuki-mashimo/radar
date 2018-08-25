import Gauze from "containers/Gauze/Main";
import PolyhedronBasisTheta from "models/PolyhedronBasisTheta";
import PolyhedronRadarBasisTheta from "models/PolyhedronRadarBasisTheta";
import React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as styles from "./styles.scss";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    parameterType: state.parameterType,
    parameters: state.parameters,
    distanceSwitch: state.distanceSwitch,
  };
};

class RadarViewer extends React.Component {
  constructor(props) {
    super(props);

    const operater = new PolyhedronBasisTheta();
    const radarOperater = new PolyhedronRadarBasisTheta(operater);

    const coordinateParams = {
      move_rotate_theta: (0) / 180 * Math.PI,
      move_vector_theta: (30) / 180 * Math.PI,
      move_length_theta: (0) / 180 * Math.PI,
      diff_vector_theta: (0.05) / 180 * Math.PI,
      diff_rotate_theta: (0) / 180 * Math.PI,
      diff_length_theta: (1.5) / 180 * Math.PI,
      rotate_theta_base: (15) / 180 * Math.PI,
      vector_theta_base: (0) / 180 * Math.PI,
      length_theta_base: (0) / 180 * Math.PI,
    };

    this.props.coordinateManager.setParams(coordinateParams);
    this.props.parameterManager.setParameters(props.parameters);

    this.state = {
      radarOperater: radarOperater,
      radarObject: null,
      radar_center_X: 0,
      radar_center_Y: 0,
      params: {
        alpha: 125,
        size: 350,
      },
      move_type: "vector",
      move_switch: false,
      progressCount: 100,
      animation: null,
      animation_switch: true,
    };
  }

  componentDidMount() {
    const frameNode = ReactDOM.findDOMNode(this.refs.radarFrame);
    const rect = frameNode.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const canvasNode = ReactDOM.findDOMNode(this.refs.radar);
    const canvasContext = canvasNode.getContext("2d");

    canvasNode.setAttribute("width", "351px");
    canvasNode.setAttribute("height", "351px");

    this.state.radarOperater.setCanvasContext(canvasContext);
    this.props.coordinateManager.setParams({
      center_X: (rect.left + scrollLeft) + (351 / 2),
      center_Y: (rect.top + scrollTop) + (351 / 2),
      max_radius: (351 / 2),
    });

    this.makeRadar(this.props);

    const ref = this;

    if (this.state.animation_switch === true) {
      if (this.state.animation) {
        clearInterval(this.state.animation);
      }

      this.setState({
        animation: setInterval(function () {
          ref.execute(ref.state);
        }, 50)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.parameterType !== this.props.parameterType) {
      this.makeRadar(nextProps);
    } else if (nextProps.parameters.toString() !== this.props.parameters.toString()) {
      this.props.parameterManager.setParameters(nextProps.parameters);
    }
  }

  render() {
    return <div
      ref="radarFrame"
      className={styles.radarFrame}
    >
      <canvas
        ref="radar"
        className={styles.radar}
      />
      <Gauze
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}
        onKeyDown={this.onKeyDown}
      />
    </div>;
  }

  makeRadar = (props) => {
    const parameterValue = this.getParameterTypeValue(props.parameterType);
    const radarObject = this.state.radarOperater.summons(parameterValue.objectCode, { ...this.state.params, ...parameterValue.params });
    this.props.parameterManager.setParameters(props.parameters);

    const state = {
      radarObject: radarObject,
    };

    this.setState(state);

    this.execute({
      ...this.state,
      ...state,
    });
  }

  execute = (state) => {
    const { radarObject } = state;

    if (this.state.move_switch === true) {
      this.props.coordinateManager.move();
    }

    this.props.coordinateManager.slide();

    const { rotate_theta, vector_theta, length_theta, viewTheta } = this.props.coordinateManager.params;

    radarObject.configureParam(this.props.parameterManager.params.parametersProgress);
    radarObject.setDirection(
      rotate_theta,
      vector_theta,
      length_theta,
      this.props.distanceSwitch ? viewTheta : undefined,
    );
    radarObject.output();
    this.props.parameterManager.progress();
  }

  onMouseDown = (x, y) => {
    this.setState({ move_switch: true });

    this.props.coordinateManager.resetAxis(x, y);
  }

  onMouseMove = (x, y) => {
    if (this.state.move_switch === true) {
      this.props.coordinateManager.changeAxis(x, y);
    }
  }

  onMouseUp = (x, y) => {
    if (this.state.move_switch === true) {
      this.setState({ move_switch: false });

      this.props.coordinateManager.setAxis(x, y);
    }
  }

  onKeyDown = () => {
    if (this.state.animation) {
      clearInterval(this.state.animation);
    }

    if (this.state.animation_switch === false) {
      this.setState({
        animation_switch: true,
        animation: setInterval(function (ref) {
          ref.execute(ref.state);
        }, 50, this)
      });
    } else {
      this.setState({ animation_switch: false });
    }
  }

  getParameterTypeValue = (parameterType) => {
    switch (parameterType) {
      case 4:
        return {
          objectCode: "TetrahedronTheta",
          params: {
            parameter_texts: ["天運", "健康運", "金運", "勝負運"],
            basis_fill_style: "rgba(0, 0, 0, 0.0)",
            basis_stroke_style: "rgba(0, 112, 64, 0.5)",
            shaft_fill_style: "rgba(0, 0, 0, 0.0)",
            shaft_stroke_style: "rgba(0, 112, 96, 0.4)",
            meter_fill_style: "rgba(0, 216, 96, 0.04)",
            meter_stroke_style: "rgba(0, 160, 0, 0.15)",
            param_fill_style: "rgba(112, 160, 64, 0.4)",
            param_stroke_style: "rgba(112, 160, 64, 0.8)",
            text_fill_style: "rgba(96, 156, 176, 0.3)",
            text_stroke_style: "rgba(255, 255, 255, 0.8)",
          }
        };

      case 6:
        return {
          objectCode: "HexahedronTheta",
          params: {
            parameter_texts: ["国語", "数学", "理科", "社会", "体育", "音楽", "美術", "外語"],
            basis_fill_style: "rgba(0, 0, 0, 0.0)",
            basis_stroke_style: "rgba(255, 128, 80, 0.5)",
            shaft_fill_style: "rgba(0, 0, 0, 0.0)",
            shaft_stroke_style: "rgba(255, 160, 128, 0.3)",
            meter_fill_style: "rgba(255, 128, 56, 0.05)",
            meter_stroke_style: "rgba(255, 128, 56, 0.15)",
            param_fill_style: "rgba(255, 64, 0, 0.4)",
            param_stroke_style: "rgba(255, 64, 0, 0.8)",
            text_fill_style: "rgba(255, 80, 40, 0.3)",
            text_stroke_style: "rgba(255, 255, 255, 0.8)",
          },
        };

      case 8:
        return {
          objectCode: "OctahedronTheta",
          params: {
            parameter_texts: ["行動力", "適応力", "独創性", "情熱性", "自然愛", "オーラ"],
            basis_fill_style: "rgba(0, 0, 0, 0.0)",
            basis_stroke_style: "rgba(96, 184, 240, 0.5)",
            shaft_fill_style: "rgba(255, 255, 255, 0.0)",
            shaft_stroke_style: "rgba(96, 184, 240, 0.4)",
            meter_fill_style: "rgba(0, 80, 192, 0.05)",
            meter_stroke_style: "rgba(0, 80, 192, 0.15)",
            param_fill_style: "rgba(112, 240, 192, 0.4)",
            param_stroke_style: "rgba(112, 240, 192, 0.8)",
            text_fill_style: "rgba(240, 0, 64, 0.3)",
            text_stroke_style: "rgba(255, 255, 255, 0.8)",
          },
        };

      case 12:
        return {
          objectCode: "DodecahedronTheta",
          params: {
            parameter_texts: ["体力", "攻撃", "防御", "知力", "魔力", "指揮", "話術", "操縦", "変装", "料理", "品位", "理力", "感性", "人徳", "技術", "包容", "直感", "視力", "霊感", "芸術"],
            basis_fill_style: "rgba(0, 0, 0, 0.0)",
            basis_stroke_style: "rgba(192, 0, 128, 0.5)",
            shaft_fill_style: "rgba(0, 0, 0, 0.0)",
            shaft_stroke_style: "rgba(184, 0, 32, 0.4)",
            meter_fill_style: "rgba(80, 0, 40, 0.15)",
            meter_stroke_style: "rgba(80, 0, 40, 0.4)",
            param_fill_style: "rgba(128, 20, 172, 0.4)",
            param_stroke_style: "rgba(128, 20, 172, 0.8)",
            text_fill_style: "rgba(0, 96, 112, 0.3)",
            text_stroke_style: "rgba(255, 255, 255, 0.8)",
          },
        };

      case 20:
        return {
          objectCode: "IcosahedronTheta",
          params: {
            parameter_texts: ["耐暑", "耐寒", "耐魔", "耐獣", "耐風", "耐水", "耐火", "耐Ｇ", "耐菌", "耐毒", "耐光", "耐闇"],
            basis_fill_style: "rgba(0, 0, 0, 0.0)",
            basis_stroke_style: "rgba(0, 0, 255, 0.5)",
            shaft_fill_style: "rgba(0, 0, 0, 0.0)",
            shaft_stroke_style: "rgba(0, 0, 160, 0.4)",
            meter_fill_style: "rgba(0, 0, 160, 0.1)",
            meter_stroke_style: "rgba(0, 0, 160, 0.2)",
            param_fill_style: "rgba(80, 80, 255, 0.4)",
            param_stroke_style: "rgba(80, 80, 255, 0.8)",
            text_fill_style: "rgba(0, 0, 160, 0.6)",
            text_stroke_style: "rgba(255, 255, 255, 0.8)",
          },
        };
    }
  }
}

export default connect(mapStateToProps, null)(RadarViewer);
