import React from "react";
import * as ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as styles from "./styles.scss";

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

  onChange(event) {
    const element = event.target;

    this.setState({[element.name]: element.value});
  }

  onSelectChange = (event) => {
    const element = event.target;

    this.props.dispatch({
      type: "SET_PARAMETER_TYPE",
      parameterType: parseInt(element.value),
    });
  }

  onSubmit() {
    this.props.dispatch({
      type: "SET_USER",
      user: {
        sei: this.state.sei,
        mei: this.state.mei,
      },
    });
  }

  render() {
    return <div className={styles.form}>
      <form action="" method="get">
        姓:<input type="text" name="sei" onChange={this.onChange} size="10" />
        名:<input type="text" name="mei" onChange={this.onChange} size="10" />
        <input type="button" onClick={this.onSubmit} value="診断" />
        <select ref="parameter_type"
          onChange={this.onSelectChange}
          defaultValue="8"
        >
          <option value="4">基本</option>
          <option value="6">教科</option>
          <option value="8">性格傾向</option>
          <option value="12">適正能力</option>
          <option value="20">耐性能力</option>
        </select>
      </form>
    </div>;
  }
}

export default connect()(Form);