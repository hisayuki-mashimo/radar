import { requestParameterType, requestUser } from "actions";
import React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import * as styles from "./styles.scss";

const mapDispatchToProps = (dispatch: Dispatch<{}>) => ({
  ...bindActionCreators({
    requestParameterType,
    requestUser,
  }, dispatch)
});

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sei: "",
      mei: "",
      distanceCoefficientSwitch: false,
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
            <input type="checkbox" onClick={this.setDistanceCoefficientSwitch} />
            <input type="text" onChange={this.setDistanceCoefficient} />
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

  setDistanceCoefficientSwitch = (event) => {
    const element = event.target;

    this.setState({
      distanceCoefficientSwitch: element.checked,
    });
  }

  setDistanceCoefficient = (event) => {
    if (! this.state.distanceCoefficientSwitch) return;

    const element = event.target;
    const distanceCoefficient = parseInt(element.value);

    if (distanceCoefficient > 0) {
      this.props.setDistanceCoefficient(distanceCoefficient);
    }
  }
}

export default connect(null, mapDispatchToProps)(Form);