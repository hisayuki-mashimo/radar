import { requestParameterType, requestUser, setDistanceSwitch } from "actions";
import FormMeter from "containers/Form/Meter/Main";
import React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import * as styles from "./styles.scss";

const MIN_DISTANCE_COEFFICIENT = 2;
const MAX_DISTANCE_COEFFICIENT = 20;

const mapStateToProps = (state) => ({
  distanceSwitch: state.distanceSwitch,
});

const mapDispatchToProps = (dispatch: Dispatch<{}>) => ({
  ...bindActionCreators({
    requestParameterType,
    requestUser,
    setDistanceSwitch,
  }, dispatch)
});

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sei: "",
      mei: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  render() {
    return (
      <div className={styles.form}>
        <form action="" method="get">
          姓:<input type="text" name="sei" onChange={this.onChange} size="10" />
          名:<input type="text" name="mei" onChange={this.onChange} size="10" />
          <input type="button" onClick={this.onSubmit} value="診断" />
          <div>
            <select ref="parameter_type" onChange={this.onSelectChange} defaultValue="8">
              <option value="4">基本</option>
              <option value="6">教科</option>
              <option value="8">性格傾向</option>
              <option value="12">適正能力</option>
              <option value="20">耐性能力</option>
            </select>
            <input type="checkbox"
              checked={this.props.distanceSwitch}
              onClick={this.onSwitchCheck}
            />
            <FormMeter
              percentage={1}
              enable={this.props.distanceSwitch}
              onChange={this.setDistanceCoefficient}
            />
          </div>
        </form>
      </div>
    );
  }

  onChange = (event) => {
    const element = event.target;

    this.setState({ [element.name]: element.value });
  }

  onSelectChange = async (event) => {
    const element = event.target;

    await this.props.requestParameterType(
      parseInt(element.value),
    );
  }

  onSubmit = async () => {
    await this.props.requestUser(
      this.state.sei,
      this.state.mei,
    );
  }

  onSwitchCheck = (event) => {
    const element = event.target;

    this.props.setDistanceSwitch(element.checked);
  }

  setDistanceCoefficient = (percentage: number) => {
    if (! this.props.distanceSwitch) return;

    const min = MIN_DISTANCE_COEFFICIENT;
    const max = MAX_DISTANCE_COEFFICIENT;
    const distanceCoefficient = percentage * (max - min) + min;

    this.props.setDistanceCoefficient(distanceCoefficient);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
