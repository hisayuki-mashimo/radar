import GeometryCalculator from "models/GeometryCalculator";

class CoordinateManager {
  params = {
    center_X: 0,
    center_Y: 0,
    max_radius: 0,
    move_type: "vector",
    latest_base_X: 0,
    latest_base_Y: 0,
    latest_move_X: 0,
    latest_move_Y: 0,
    move_rotate_theta: 0,
    move_vector_theta: 0,
    move_length_theta: 0,
    diff_vector_theta: 0,
    diff_rotate_theta: 0,
    diff_length_theta: 0,
    rotate_theta_base: 0,
    vector_theta_base: 0,
    length_theta_base: 0,
    rotate_theta: 0,
    vector_theta: 0,
    length_theta: 0,
  };

  constructor(params = undefined) {
    if (params) {
      this.setParams(params);
    }
  }

  setParams(params) {
    for (let key in params) {
      if (this.params[key] !== undefined) {
        this.params[key] = params[key];
      }
    }
  }

  move() {
    this.params.rotate_theta_base = this.params.rotate_theta;
    this.params.vector_theta_base = this.params.vector_theta;
    this.params.length_theta_base = this.params.length_theta;

    if (this.params.move_type === "vector") {
      const diff_X = this.params.latest_move_X - this.params.latest_base_X;
      const diff_Y = this.params.latest_move_Y - this.params.latest_base_Y;

      const direction_X = (diff_X > 0) ? -1 : 1;
      const direction_Y = (diff_Y > 0) ? 1 : -1;

      let abs_X = Math.abs(diff_X);
      let abs_Y = Math.abs(diff_Y);
      if (abs_X > 30) abs_X = 30;
      if (abs_Y > 30) abs_Y = 30;

      const theta_diff_X = (abs_X / 200) * direction_X;
      const theta_diff_Y = (abs_Y / 200) * direction_Y;

      this.params.move_rotate_theta = 0;
      this.params.move_vector_theta = GeometryCalculator.getThetaByLengthes('Y', theta_diff_X, theta_diff_Y) * -1 + Math.PI;
      this.params.move_length_theta = 0;
      this.params.diff_length_theta = GeometryCalculator.getLengthByPytha(null, theta_diff_X, theta_diff_Y);
      this.params.diff_rotate_theta = 0;
    } else {
      const LD0X = this.params.latest_base_X - this.params.center_X;
      const LD0Y = this.params.latest_base_Y - this.params.center_Y;
      const LD1X = this.params.latest_move_X - this.params.center_X;
      const LD1Y = this.params.latest_move_Y - this.params.center_Y;

      const TD0 = GeometryCalculator.getThetaByLengthes('Y', LD0X, LD0Y);
      const TD1 = GeometryCalculator.getThetaByLengthes('Y', LD1X, LD1Y);
      const TD2 = TD1 - TD0;

      const direction_T = (TD2 > 0) ? 1 : -1;

      let abs_T = Math.abs(TD2);
      if (abs_T > 0.2) abs_T = 0.2;

      const theta_diff = abs_T * direction_T;

      this.params.move_rotate_theta = 0;
      this.params.move_length_theta = 0;
      this.params.diff_length_theta = 0;
      this.params.diff_rotate_theta = theta_diff;
    }

    this.params.latest_base_X = this.params.latest_move_X;
    this.params.latest_base_Y = this.params.latest_move_Y;
  }

  slide() {
    if (this.params.diff_length_theta > 0) {
      this.params.move_length_theta += this.params.diff_length_theta;

      const thetas = GeometryCalculator.getThetasByRelative(
        this.params.rotate_theta_base,
        this.params.vector_theta_base,
        this.params.length_theta_base,
        this.params.move_rotate_theta,
        this.params.move_vector_theta,
        this.params.move_length_theta,
      );

      this.params.rotate_theta = thetas.rotate_theta;
      this.params.vector_theta = thetas.vector_theta;
      this.params.length_theta = thetas.length_theta;
    } else if (this.params.diff_rotate_theta != 0) {
      this.params.move_rotate_theta += this.params.diff_rotate_theta;
      this.params.rotate_theta = this.params.rotate_theta_base + this.params.move_rotate_theta;
      this.params.vector_theta = this.params.vector_theta_base + this.params.move_rotate_theta;
    }
  }

  resetAxis = (x, y) => {
    this.params.latest_move_X = x;
    this.params.latest_move_Y = y;
    this.params.latest_base_X = x;
    this.params.latest_base_Y = y;

    const relative_diff_X = this.params.latest_base_X - this.params.center_X;
    const relative_diff_Y = this.params.latest_base_Y - this.params.center_Y;
    const relative_diff_radius = GeometryCalculator.getLengthByPytha(null, relative_diff_X, relative_diff_Y);

    if (relative_diff_radius <= this.params.max_radius) {
      this.params.move_type = "vector";
    } else {
      this.params.move_type = "rotate";
    }
  }

  changeAxis(x, y) {
    this.params.latest_move_X = x;
    this.params.latest_move_Y = y;
  };

  setAxis(x, y) {
    this.params.latest_move_X = x;
    this.params.latest_move_Y = y;
  }
}

export default CoordinateManager;
