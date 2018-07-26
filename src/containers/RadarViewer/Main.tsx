import CybozuLabs from "models/CybozuLabs";
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
  };
};

class RadarViewer extends React.Component {
  constructor(props) {
    super(props);

    const operater = new PolyhedronBasisTheta();
    const radarOperater = new PolyhedronRadarBasisTheta(operater);

    const parameters = [];
    const parametersProgress = [];
    const parameterCount = 6;

    for (let i = 0; i < parameterCount; i++) {
      parameters.push(0);
      parametersProgress.push(0);
    }

    this.state = {
      radarOperater: radarOperater,
      radarObject: null,
      objectCode: 'OctahedronTheta',
      parameters: parameters,
      parametersProgress: parametersProgress,
      parameterCount: parameterCount,
      params: {
        alpha: 100,
        size: 350,
        parameter_texts: ['行動力', '適応力', '独創性', '情熱性', '自然愛', 'オーラ'],
        basis_fill_style: 'rgba(255, 255, 255, 0.0)',
        basis_stroke_style: 'rgba( 96, 184, 240, 0.5)',
        shaft_fill_style: 'rgba(255, 255, 255, 0.0)',
        shaft_stroke_style: 'rgba( 96, 184, 240, 0.5)',
        meter_fill_style: 'rgba(  0,  64, 160, 0.06)',
        meter_stroke_style: 'rgba(  0, 132, 255, 0.2)',
        param_fill_style: 'rgba(112, 240, 192, 0.5)',
        param_stroke_style: 'rgba(112, 240, 192, 0.8)',
        text_fill_style: 'rgba(240,   0,  64, 0.3)',
        text_stroke_style: 'rgba(255, 255, 255, 0.8)',
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
    const frame_node = ReactDOM.findDOMNode(this.refs.radar);
    const radarObject = this.state.radarOperater.summons(this.state.objectCode, frame_node, this.state.params);

    this.setState({ radarObject: radarObject });

    this.makeRadar(radarObject, "", "");
  }

  componentWillReceiveProps(nextProps) {
    const sei = nextProps.user.sei;
    const mei = nextProps.user.mei;

    this.initParameterProgress();
    this.makeRadar(this.state.radarObject, sei, mei);
  }

  makeRadar(radarObject, sei, mei) {
    if (sei || mei) {
      const parameters = this.state.parameters.slice();
      const md5String = CybozuLabs.MD5.calc(sei + '+=+' + mei);
      const strings = md5String.split('');

      for (var i = 0; i < this.state.parameterCount; i++) {
        var integer = 1;

        for (var j = 0; j < 2; j++) {
          var n = (i * 2) + j;

          switch (j) {
            case 0:
              switch (true) {
                case (strings[n].match(/[0-9]/) !== null): var unit_integer = parseInt(strings[n]); break;
                case (strings[n].match(/[a-b]/) !== null): var unit_integer = 0; break; // weight: 2
                case (strings[n].match(/[c-d]/) !== null): var unit_integer = 1; break; // weight: 2
                case (strings[n].match(/[e-g]/) !== null): var unit_integer = 2; break; // weight: 3
                case (strings[n].match(/[h-j]/) !== null): var unit_integer = 3; break; // weight: 3
                case (strings[n].match(/[k-m]/) !== null): var unit_integer = 4; break; // weight: 3
                case (strings[n].match(/[n-p]/) !== null): var unit_integer = 5; break; // weight: 3
                case (strings[n].match(/[q-s]/) !== null): var unit_integer = 6; break; // weight: 3
                case (strings[n].match(/[t-v]/) !== null): var unit_integer = 7; break; // weight: 3
                case (strings[n].match(/[w-x]/) !== null): var unit_integer = 8; break; // weight: 2
                case (strings[n].match(/[y-z]/) !== null): var unit_integer = 9; break; // weight: 2
              }

              var coefficient = 1;
              break;

            case 1:
              switch (true) {
                case (strings[n].match(/[0-9]/) !== null): var unit_integer = parseInt(strings[n]); break;
                case (strings[n].match(/a/) !== null): var unit_integer = 0; break; // weight: 1
                case (strings[n].match(/b/) !== null): var unit_integer = 1; break; // weight: 1
                case (strings[n].match(/[c-d]/) !== null): var unit_integer = 2; break; // weight: 2
                case (strings[n].match(/[e-h]/) !== null): var unit_integer = 3; break; // weight: 4
                case (strings[n].match(/[i-m]/) !== null): var unit_integer = 4; break; // weight: 5
                case (strings[n].match(/[n-r]/) !== null): var unit_integer = 5; break; // weight: 5
                case (strings[n].match(/[s-v]/) !== null): var unit_integer = 6; break; // weight: 4
                case (strings[n].match(/[w-x]/) !== null): var unit_integer = 7; break; // weight: 2
                case (strings[n].match(/y/) !== null): var unit_integer = 8; break; // weight: 1
                case (strings[n].match(/z/) !== null): var unit_integer = 9; break; // weight: 1
              }

              var coefficient = 10;
              break;
          }

          integer += unit_integer * coefficient;
        }

        parameters[i] = integer;
      }

      this.setState({ parameters: parameters });
      this.setState({ progress_count: 0 });
    }

    var frame_node = ReactDOM.findDOMNode(this.refs.radar);
    var rect = frame_node.getBoundingClientRect();

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var radar_center_X = (rect.left + scrollLeft) + radarObject.object_basis._center;
    var radar_center_Y = (rect.top + scrollTop) + radarObject.object_basis._center;

    this.execute(radarObject);

    const ref = this;

    document.onkeydown = function (event) {
      if (event.keyCode == 13) {
        if (ref.state.animation) {
          clearInterval(ref.state.animation);
        }

        if (ref.state.animation_switch === false) {
          ref.setState({ animation_switch: true });
          ref.setState({
            animation: setInterval(function () {
              ref.execute(radarObject);
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
          ref.execute(radarObject);
        }, 50)
      });
    }

    const radar_box = ReactDOM.findDOMNode(this.refs.radar);
    const gauze_node = ReactDOM.findDOMNode(this.refs.gauze);

    gauze_node.onmousedown = function (event) {
      ref.setState({ move_switch: true });
      ref.setState({ latest_move_X: event.clientX });
      ref.setState({ latest_move_Y: event.clientY });
      ref.setState({ latest_base_X: event.clientX });
      ref.setState({ latest_base_Y: event.clientY });

      var relative_diff_X = ref.state.latest_base_X - ref.state.radar_center_X;
      var relative_diff_Y = ref.state.latest_base_Y - ref.state.radar_center_Y;
      var relative_diff_radius = GeometryCalculator.getLengthByPytha(null, relative_diff_X, relative_diff_Y);

      if (relative_diff_radius <= ref.state.radarObject.max_radius) {
        ref.setState({ move_type: 'vector' });
      } else {
        ref.setState({ move_type: 'rotate' });
      }
    };

    document.onmousemove = function (event) {
      if (ref.state.move_switch === true) {
        ref.setState({ latest_move_X: event.clientX });
        ref.setState({ latest_move_Y: event.clientY });
      }
    };

    document.onmouseup = function (event) {
      if (ref.state.move_switch === true) {
        ref.setState({ move_switch: false });
        ref.setState({ latest_move_X: event.clientX });
        ref.setState({ latest_move_Y: event.clientY });
      }
    };
  }

  initParameterProgress() {
    const parametersProgress = [];

    for (let i = 0; i < this.state.parameterCount; i++) {
      parametersProgress.push(0);
    }

    console.log(1111);
    this.setState({ parametersProgress: parametersProgress });
    console.log(3222);
    this.setState({ progressCount: 0 });
    console.log(2222);
  }

  execute(radarObject) {
    let progressCount = this.state.progressCount;

    if (progressCount < 100) {
      let parametersProgress = this.state.parametersProgress.slice();

      for (let i = 0; i < this.state.parameterCount; i++) {
        if (parametersProgress[i] >= this.state.parameters[i]) {
          parametersProgress[i] = this.state.parameters[i];

          continue;
        }

        parametersProgress[i] += 2;
      }

      this.setState({ parametersProgress: parametersProgress });
      this.setState({ progressCount: progressCount + 1 });
      console.log(parametersProgress);
    }

    if (this.state.move_switch === true) {
      this.setState({ rotate_theta_base: this.state.rotate_theta });
      this.setState({ vector_theta_base: this.state.vector_theta });
      this.setState({ length_theta_base: this.state.length_theta });

      if (this.state.move_type === 'vector') {
        var diff_X = this.state.latest_move_X - this.state.latest_base_X;
        var diff_Y = this.state.latest_move_Y - this.state.latest_base_Y;

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
        var LD0X = this.state.latest_base_X - this.state.radar_center_X;
        var LD0Y = this.state.latest_base_Y - this.state.radar_center_Y;
        var LD1X = this.state.latest_move_X - this.state.radar_center_X;
        var LD1Y = this.state.latest_move_Y - this.state.radar_center_Y;

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

      this.setState({ latest_base_X: this.state.latest_move_X });
      this.setState({ latest_base_Y: this.state.latest_move_Y });
    }

    if (this.state.diff_length_theta > 0) {
      this.setState({ move_length_theta: this.state.move_length_theta + this.state.diff_length_theta });

      var thetas = GeometryCalculator.getThetasByRelative(
        this.state.rotate_theta_base,
        this.state.vector_theta_base,
        this.state.length_theta_base,
        this.state.move_rotate_theta,
        this.state.move_vector_theta,
        this.state.move_length_theta,
      );
      this.setState({ rotate_theta: thetas.rotate_theta });
      this.setState({ vector_theta: thetas.vector_theta });
      this.setState({ length_theta: thetas.length_theta });
    }
    else if (this.state.diff_rotate_theta != 0) {
      this.setState({ move_rotate_theta: this.state.move_rotate_theta + this.state.diff_rotate_theta });
      this.setState({ rotate_theta: this.state.rotate_theta_base + this.state.move_rotate_theta });
      this.setState({ vector_theta: this.state.vector_theta_base + this.state.move_rotate_theta });
    }

    radarObject.configureParam(this.state.parametersProgress);
    radarObject.setDirection(this.state.rotate_theta, this.state.vector_theta, this.state.length_theta);
    radarObject.output();
  }

  render() {
    return <div ref="radar" className={styles.radar}>
      <div ref="gauze" className={styles.gauze} />
    </div>;
  }
}

export default connect(
  mapStateToProps,
  null,
)(RadarViewer);