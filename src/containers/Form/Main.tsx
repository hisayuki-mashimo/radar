import React from "react";
import * as ReactDOM from "react-dom";

class Form extends React.Component {
  onlSelectChange() {
    ReactDOM.findDOMNode(this.refs.form).submit();
  }

  onSubmit() {

  }

  render() {
    return <div id="form">
      <form ref="form" action="" method="get">
        姓:<input type="text" name="sei" ref="sei" size="10" />
        名:<input type="text" name="mei" ref="mei" size="10" />
        <input type="button" onClick={this.onSubmit} value="診断" />
        <select ref="parameter_type"
          onChange={this.onSelectChange}
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