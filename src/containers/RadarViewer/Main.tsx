import Gauze from "containers/Gauze/Main";
import GeometryCalculator from "models/GeometryCalculator";
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
  };
};

class RadarViewer extends React.Component {
  constructor(props) {
    super(props);

    const operater = new PolyhedronBasisTheta();
    const radarOperater = new PolyhedronRadarBasisTheta(operater);

    this.state = {
      radarOperater: radarOperater,
      radarObject: null,
      parametersProgress: [],
      radar_center_X: 0,
      radar_center_Y: 0,
      params: {
        alpha: 100,
        size: 350,
      },
      move_type: "vector",
      move_switch: false,
      latest_base_X: 0,
      latest_base_Y: 0,
      latest_move_X: 0,
      latest_move_Y: 0,
      move_rotate_theta: (0) / 180 * Math.PI,
      move_vector_theta: (30) / 180 * Math.PI,
      move_length_theta: (0) / 180 * Math.PI,
      diff_vector_theta: (0.05) / 180 * Math.PI,
      diff_rotate_theta: (0) / 180 * Math.PI,
      diff_length_theta: (1.5) / 180 * Math.PI,
      rotate_theta_base: (15) / 180 * Math.PI,
      vector_theta_base: (0) / 180 * Math.PI,
      length_theta_base: (0) / 180 * Math.PI,
      rotate_theta: 0,
      vector_theta: 0,
      length_theta: 0,
      theta_R: Math.PI / 2,
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
    const canvasContext = canvasNode.getContext('2d');

    canvasNode.setAttribute('width', '351px');
    canvasNode.setAttribute('height', '351px');

    this.setState({
      //radar_center_X: (rect.left + scrollLeft) + radarObject.object_basis._center,
      //radar_center_Y: (rect.top + scrollTop) + radarObject.object_basis._center,
      radar_center_X: (rect.left + scrollLeft) + (351 / 2),
      radar_center_Y: (rect.top + scrollTop) + (351 / 2),
      canvasContext: canvasContext,
    });
    console.log(this.state);

    this.makeRadar(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.parameterType !== this.props.parameterType) {
      this.makeRadar(nextProps);
    } else {
      this.initParameterProgress(nextProps);
    }
  }

  makeRadar(props) {
    const parameterValue = this.getParameterTypeValue(props.parameterType);
    const radarObject = this.state.radarOperater.summons(parameterValue.objectCode, this.state.canvasContext, { ...this.state.params, ...parameterValue.params });
    const parameterProgress = this.initParameterProgress(props);

    const state = {
      radar_center_X: (rect.left + scrollLeft) + radarObject.object_basis._center,
      radar_center_Y: (rect.top + scrollTop) + radarObject.object_basis._center,
      radarObject: radarObject,
    };

    this.setState(state);

    this.execute(props, {
      ...this.state,
      ...state,
      ...parameterProgress,
    });

    const ref = this;

    document.onkeydown = function (event) {
      if (event.keyCode == 13) {
        if (ref.state.animation) {
          clearInterval(ref.state.animation);
        }

        if (ref.state.animation_switch === false) {
          ref.setState({
            animation_switch: true,
            animation: setInterval(function () {
              ref.execute(ref.props, ref.state);
            }, 50)
          });
        } else {
          ref.setState({ animation_switch: false });
        }
      }
    };

    if (ref.state.animation_switch === true) {
      if (ref.state.animation) {
        clearInterval(ref.state.animation);
      }

      ref.setState({
        animation: setInterval(function () {
          ref.execute(ref.props, ref.state);
        }, 50)
      });
    }
  }

  initParameterProgress = (props) => {
    const state = {
      parametersProgress: [],
      progressCount: 0
    };

    if (props.parameters) {
      props.parameters.forEach(function () {
        state.parametersProgress.push(0);
      });
    }

    this.setState(state);

    return state;
  }

  execute = (props, state) => {
    const { radarObject } = state;

    let progressCount = state.progressCount;

    if (progressCount < 100) {
      const ref = this;

      let parametersProgress = state.parametersProgress.slice();

      props.parameters.forEach(function (parameter, i) {
        if (parametersProgress[i] >= props.parameters[i]) {
          parametersProgress[i] = props.parameters[i];
        } else {
          parametersProgress[i] += 2;
        }
      });

      this.setState({
        parametersProgress: parametersProgress,
        progressCount: progressCount + 1,
      });
    }

    if (this.state.move_switch === true) {
      this.setState({
        rotate_theta_base: state.rotate_theta,
        vector_theta_base: state.vector_theta,
        length_theta_base: state.length_theta,
      });

      if (state.move_type === "vector") {
        var diff_X = state.latest_move_X - state.latest_base_X;
        var diff_Y = state.latest_move_Y - state.latest_base_Y;

        var direction_X = (diff_X > 0) ? -1 : 1;
        var direction_Y = (diff_Y > 0) ? 1 : -1;
        var abs_X = Math.abs(diff_X);
        var abs_Y = Math.abs(diff_Y);

        if (abs_X > 30) abs_X = 30;
        if (abs_Y > 30) abs_Y = 30;
        var theta_diff_X = (abs_X / 200) * direction_X;
        var theta_diff_Y = (abs_Y / 200) * direction_Y;

        this.setState({ move_rotate_theta: 0 });
        this.setState({ move_vector_theta: GeometryCalculator.getThetaByLengthes('Y', theta_diff_X, theta_diff_Y) * -1 + Math.PI });
        this.setState({ move_length_theta: 0 });
        this.setState({ diff_length_theta: GeometryCalculator.getLengthByPytha(null, theta_diff_X, theta_diff_Y) });
        this.setState({ diff_rotate_theta: 0 });
      } else {
        var LD0X = state.latest_base_X - state.radar_center_X;
        var LD0Y = state.latest_base_Y - state.radar_center_Y;
        var LD1X = state.latest_move_X - state.radar_center_X;
        var LD1Y = state.latest_move_Y - state.radar_center_Y;

        var TD0 = GeometryCalculator.getThetaByLengthes('Y', LD0X, LD0Y);
        var TD1 = GeometryCalculator.getThetaByLengthes('Y', LD1X, LD1Y);
        var TD2 = TD1 - TD0;

        var direction_T = (TD2 > 0) ? 1 : -1;
        var abs_T = Math.abs(TD2);
        if (abs_T > 0.2) abs_T = 0.2;
        var theta_diff = abs_T * direction_T;

        this.setState({ move_rotate_theta: 0 });
        this.setState({ move_length_theta: 0 });
        this.setState({ diff_length_theta: 0 });
        this.setState({ diff_rotate_theta: theta_diff });
      }

      this.setState({ latest_base_X: state.latest_move_X });
      this.setState({ latest_base_Y: state.latest_move_Y });
    }

    if (state.diff_length_theta > 0) {
      var thetas = GeometryCalculator.getThetasByRelative(
        state.rotate_theta_base,
        state.vector_theta_base,
        state.length_theta_base,
        state.move_rotate_theta,
        state.move_vector_theta,
        state.move_length_theta,
      );

      this.setState({
        move_length_theta: state.move_length_theta + state.diff_length_theta,
        rotate_theta: thetas.rotate_theta,
        vector_theta: thetas.vector_theta,
        length_theta: thetas.length_theta,
      });
    } else if (state.diff_rotate_theta != 0) {
      this.setState({
        move_rotate_theta: state.move_rotate_theta + state.diff_rotate_theta,
        rotate_theta: state.rotate_theta_base + state.move_rotate_theta,
        vector_theta: state.vector_theta_base + state.move_rotate_theta,
      });
    }

    radarObject.configureParam(state.parametersProgress);
    radarObject.setDirection(state.rotate_theta, state.vector_theta, state.length_theta);
    radarObject.output();
  }

  resetAxis = (x, y) => {
    this.setState({ move_switch: true });
    this.setState({ latest_move_X: x });
    this.setState({ latest_move_Y: y });
    this.setState({ latest_base_X: x });
    this.setState({ latest_base_Y: y });

    var relative_diff_X = this.state.latest_base_X - this.state.radar_center_X;
    var relative_diff_Y = this.state.latest_base_Y - this.state.radar_center_Y;
    var relative_diff_radius = GeometryCalculator.getLengthByPytha(null, relative_diff_X, relative_diff_Y);

    if (relative_diff_radius <= this.state.radarObject.max_radius) {
      this.setState({ move_type: "vector" });
    } else {
      this.setState({ move_type: "rotate" });
    }
  };

  changeAxis = (x, y) => {
    if (this.state.move_switch === true) {
      this.setState({
        latest_move_X: x,
        latest_move_Y: y,
      });
    }
  };

  setAxis = (x, y) => {
    if (this.state.move_switch === true) {
      this.setState({
        move_switch: false,
        latest_move_X: x,
        latest_move_Y: y,
      });
    }
  };

  getParameterTypeValue = (parameterType) => {
    switch (parameterType) {
      case 4:
        return {
          objectCode: 'TetrahedronTheta',
          params: {
            parameter_texts: ['天運', '健康運', '金運', '勝負運'],
            basis_fill_style: 'rgba(255, 255, 255, 0.0)',
            basis_stroke_style: 'rgba(0, 112, 64, 0.5)',
            shaft_fill_style: 'rgba(255, 255, 255, 0.0)',
            shaft_stroke_style: 'rgba(0, 112, 96, 0.5)',
            meter_fill_style: 'rgba(0, 216, 96, 0.07)',
            meter_stroke_style: 'rgba(0, 160, 0, 0.2)',
            param_fill_style: 'rgba( 64, 160, 64, 0.5)',
            param_stroke_style: 'rgba( 56, 156, 56, 0.8)',
            text_fill_style: 'rgba( 96, 156, 176, 0.3)',
            text_stroke_style: 'rgba(255, 255, 255, 0.8)',
          }
        };

      case 8:
        return {
          objectCode: 'OctahedronTheta',
          params: {
            parameter_texts: ['行動力', '適応力', '独創性', '情熱性', '自然愛', 'オーラ'],
            basis_fill_style: 'rgba(255, 255, 255, 0.0)',
            basis_stroke_style: 'rgba(96, 184, 240, 0.5)',
            shaft_fill_style: 'rgba(255, 255, 255, 0.0)',
            shaft_stroke_style: 'rgba(96, 184, 240, 0.5)',
            meter_fill_style: 'rgba(0, 64, 160, 0.06)',
            meter_stroke_style: 'rgba(0, 132, 255, 0.2)',
            param_fill_style: 'rgba(112, 240, 192, 0.5)',
            param_stroke_style: 'rgba(112, 240, 192, 0.8)',
            text_fill_style: 'rgba(240, 0, 64, 0.3)',
            text_stroke_style: 'rgba(255, 255, 255, 0.8)',
          },
        };

      case 20:
        return {
          objectCode: 'IcosahedronTheta',
          params: {
            parameter_texts: ['体力', '攻撃', '防御', '知力', '魔力', '指揮', '話術', '操縦', '変装', '料理', '品位', '理力'],
            basis_fill_style: 'rgba(64, 0, 32, 0.07)',
            basis_stroke_style: 'rgba(160, 0, 160, 0.2)',
            shaft_fill_style: 'rgba(255, 255, 255, 0.0)',
            shaft_stroke_style: 'rgba(184, 0, 32, 0.4)',
            meter_fill_style: 'rgba(64, 0, 32, 0.08)',
            meter_stroke_style: 'rgba(160, 0, 160, 0.1)',
            param_fill_style: 'rgba(0, 80, 255, 0.5)',
            param_stroke_style: 'rgba(0, 80, 255, 0.8)',
            text_fill_style: 'rgba(0, 96, 112, 0.3)',
            text_stroke_style: 'rgba(255, 255, 255, 0.8)',
          },
        };
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
        onMouseDown={this.resetAxis}
        onMouseMove={this.changeAxis}
        onMouseUp={this.setAxis}
      />
    </div>;
  }
}

export default connect(
  mapStateToProps,
  null,
)(RadarViewer);