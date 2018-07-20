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
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    var object_code = 'OctahedronTheta';
    var parameter_count = 6;
    var params = {
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
      text_stroke_style: 'rgba(255, 255, 255, 0.8)'
    };

    var frame_node = ReactDOM.findDOMNode(this.refs.radar);

    var parameters = [];
    var paramsters_progress = [];
    var progress_count = 100;
    var advice = new Array();

    var sei = nextProps.user.sei;
    var mei = nextProps.user.mei;

    for (var i = 0; i < parameter_count; i++) {
      parameters.push(0);
      paramsters_progress.push(0);
    }

    var OperaterTheta = new PolyhedronBasisTheta();
    var OperaterRadarTheta = new PolyhedronRadarBasisTheta(OperaterTheta);
    var RadarObjectTheta = OperaterRadarTheta.summons(object_code, frame_node, params);

    if (sei || mei) {
      var string_md5 = CybozuLabs.MD5.calc(sei + '+=+' + mei);
      var strings = string_md5.split('');

      for (var i = 0; i < parameter_count; i++) {
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

      progress_count = 0;
    }

    var rect = frame_node.getBoundingClientRect();

    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    var radar_center_X = (rect.left + scrollLeft) + RadarObjectTheta.object_basis._center;
    var radar_center_Y = (rect.top + scrollTop) + RadarObjectTheta.object_basis._center;

    var move_type = "vector";

    var move_switch = false;
    var latest_base_X = 0;
    var latest_base_Y = 0;
    var latest_move_X = 0;
    var latest_move_Y = 0;
    var move_rotate_theta = (0) / 180 * Math.PI;
    var move_vector_theta = (30) / 180 * Math.PI;
    var move_length_theta = (0) / 180 * Math.PI;
    var diff_vector_theta = (0.05) / 180 * Math.PI;
    var diff_rotate_theta = (0) / 180 * Math.PI;
    var diff_length_theta = (1.5) / 180 * Math.PI;
    var rotate_theta_base = (15) / 180 * Math.PI;
    var vector_theta_base = (0) / 180 * Math.PI;
    var length_theta_base = (0) / 180 * Math.PI;
    var rotate_theta = 0;
    var vector_theta = 0;
    var length_theta = 0;
    var theta_R = Math.PI / 2;

    var parseLength = function (len) {
      return Math.round(len * 100) / 100;
    };

    var parseTheta = function (theta, to_360) {
      var theta_quarity = (theta >= 0) ? 1 : -1;
      var theta_quantity = Math.abs(theta) % (Math.PI * 2);

      if (theta_quantity > Math.PI) {
        theta_quarity = theta_quarity * -1;
        theta_quantity = (Math.PI * 2) - theta_quantity;
      }

      theta = theta_quarity * theta_quantity;

      if (to_360 !== true) {
        theta = Math.round(theta / Math.PI * 1800) / 10;
      }

      return theta;
    };

    var execute = function () {
      if (progress_count < 100) {
        for (var i = 0; i < parameter_count; i++) {
          if (paramsters_progress[i] >= parameters[i]) {
            paramsters_progress[i] = parameters[i];
            continue;
          }
          paramsters_progress[i] += 2;
        }

        progress_count++;
      }

      if (move_switch === true) {
        rotate_theta_base = rotate_theta;
        vector_theta_base = vector_theta;
        length_theta_base = length_theta;

        if (move_type === 'vector') {
          var diff_X = latest_move_X - latest_base_X;
          var diff_Y = latest_move_Y - latest_base_Y;

          var direction_X = (diff_X > 0) ? -1 : 1;
          var direction_Y = (diff_Y > 0) ? 1 : -1;
          var abs_X = Math.abs(diff_X);
          var abs_Y = Math.abs(diff_Y);

          if (abs_X > 30) abs_X = 30;
          if (abs_Y > 30) abs_Y = 30;
          var theta_diff_X = (abs_X / 200) * direction_X;
          var theta_diff_Y = (abs_Y / 200) * direction_Y;

          move_rotate_theta = 0;
          move_vector_theta = GeometryCalculator.getThetaByLengthes('Y', theta_diff_X, theta_diff_Y) * -1 + Math.PI;
          move_length_theta = 0;
          diff_length_theta = GeometryCalculator.getLengthByPytha(null, theta_diff_X, theta_diff_Y);
          diff_rotate_theta = 0;
        } else {
          var LD0X = latest_base_X - radar_center_X;
          var LD0Y = latest_base_Y - radar_center_Y;
          var LD1X = latest_move_X - radar_center_X;
          var LD1Y = latest_move_Y - radar_center_Y;

          var TD0 = GeometryCalculator.getThetaByLengthes('Y', LD0X, LD0Y);
          var TD1 = GeometryCalculator.getThetaByLengthes('Y', LD1X, LD1Y);
          var TD2 = TD1 - TD0;

          var direction_T = (TD2 > 0) ? 1 : -1;
          var abs_T = Math.abs(TD2);
          if (abs_T > 0.2) abs_T = 0.2;
          var theta_diff = abs_T * direction_T;

          move_rotate_theta = 0;
          move_length_theta = 0;
          diff_length_theta = 0;
          diff_rotate_theta = theta_diff;
        }

        latest_base_X = latest_move_X;
        latest_base_Y = latest_move_Y;
      }

      if (diff_length_theta > 0) {
        move_length_theta += diff_length_theta;

        var thetas = GeometryCalculator.getThetasByRelative(
          rotate_theta_base,
          vector_theta_base,
          length_theta_base,
          move_rotate_theta,
          move_vector_theta,
          move_length_theta
        );
        rotate_theta = thetas.rotate_theta;
        vector_theta = thetas.vector_theta;
        length_theta = thetas.length_theta;
      }
      else if (diff_rotate_theta != 0) {
        move_rotate_theta += diff_rotate_theta;

        rotate_theta = rotate_theta_base + move_rotate_theta;
        vector_theta = vector_theta_base + move_rotate_theta;
      }

      RadarObjectTheta.configureParam(paramsters_progress);
      RadarObjectTheta.setDirection(rotate_theta, vector_theta, length_theta);
      RadarObjectTheta.output();
    };

    execute();

    var animation = null;
    var animation_switch = true;

    document.onkeydown = function (event) {
      if (event.keyCode == 13) {
        if (animation_switch === false) {
          animation_switch = true;
          animation = setInterval(function () {
            execute();
          }, 50);
        } else {
          animation_switch = false;
          clearInterval(animation);
        }
      }
    };

    if (animation_switch === true) {
      animation = setInterval(function () {
        execute();
      }, 50);
    }

    const radar_box = ReactDOM.findDOMNode(this.refs.radar);
    const gauze_node = ReactDOM.findDOMNode(this.refs.gauze);

    gauze_node.onmousedown = function (event) {
      move_switch = true;
      latest_move_X = event.clientX;
      latest_move_Y = event.clientY;
      latest_base_X = event.clientX;
      latest_base_Y = event.clientY;

      var relative_diff_X = latest_base_X - radar_center_X;
      var relative_diff_Y = latest_base_Y - radar_center_Y;
      var relative_diff_radius = GeometryCalculator.getLengthByPytha(null, relative_diff_X, relative_diff_Y);

      if (relative_diff_radius <= RadarObjectTheta.max_radius) {
        move_type = 'vector';
      } else {
        move_type = 'rotate';
      }
    };

    document.onmousemove = function (event) {
      if (move_switch === true) {
        latest_move_X = event.clientX;
        latest_move_Y = event.clientY;
      }
    };

    document.onmouseup = function (event) {
      if (move_switch === true) {
        move_switch = false;

        latest_move_X = event.clientX;
        latest_move_Y = event.clientY;
      }
    };
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