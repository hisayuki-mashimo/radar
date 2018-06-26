import React from "react";
import * as ReactDOM from "react-dom";

class Form extends React.Component {
  onChange() {
    ReactDOM.findDOMNode(this.refs.form).submit();
  }

  render() {
    return <div id="form">
      <form ref="form" action="" method="get">
        {/*
        姓:<input type="text" name="sei" size="10" value="" />
        名:<input type="text" name="mei" size="10" value="" />
        */}
        <input type="submit" value="診断" />
        <select ref="parameter_type"
          onChange={this.onChange}
          defaultValue="20"
        >
          <option value="4">基本</option>
          <option value="8">性格傾向</option>
          <option value="20">適正能力</option>
        </select>
      </form>
    </div>;
  }
}

export default Form;