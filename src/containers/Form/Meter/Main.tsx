import { requestParameterType, requestUser } from "actions";
import ClassNames from "classnames";
import React from "react";
import * as ReactDOM from "react-dom";
import * as styles from "./styles.scss";

interface FormMeterProps {
  percentage: number;
  enable?: boolean;
}

class FormMeter extends React.Component<FormMeterProps> {
  constructor(props: FormMeterProps) {
    super(props);

    this.state = {
      changeSwitch: false,
      position: 0,
      mousePosition: 0,
      meterBoxWidth: 0,
      handleWidth: 0,
    };
  }

  componentDidMount() {
    const meterBoxStyle = window.getComputedStyle(this.meterBox, "");
    const meterBoxWidth = parseInt(meterBoxStyle.width.replace("px", ""));
    const handleStyle = window.getComputedStyle(this.handle, "");
    const handleWidth = parseInt(handleStyle.width.replace("px", ""));
    const position = (meterBoxWidth - handleWidth) * this.props.percentage;

    this.setState({
      position: position,
      meterBoxWidth,
      handleWidth,
    });

    document.addEventListener("mousemove", this.onChange);
    document.addEventListener("mouseup", this.onMouseUp);
  }

  render() {
    const { position } = this.state;

    const meterBoxClassNames = ClassNames({
      [styles.meterBox]: true,
      [styles.disable]: ! this.props.enable,
    });

    const handleClassNames = ClassNames({
      [styles.handle]: true,
      [styles.disable]: ! this.props.enable,
    });

    return (
      <div
        ref={this.setMeterBox}
        className={meterBoxClassNames}
        onMouseDown={this.onMouseDown}
      >
        <div
          ref={this.setHandle}
          className={handleClassNames}
          style={{ left: position }}
        />
      </div>
    );
  }

  meterBox: HTMLDivElement
  handle: HTMLDivElement

  setHandle = (handle: HTMLDivElement) => {
    this.handle = handle;
  }

  setMeterBox = (meterBox: HTMLDivElement) => {
    this.meterBox = meterBox;
  }

  onMouseDown = (event) => {
    if (! this.props.enable) return;

    const {
      handleWidth,
      meterBoxWidth,
    } = this.state;

    const element = this.meterBox;
    const elementRect = element.getBoundingClientRect();
    const minPosition = elementRect.x;
    const maxPosition = meterBoxWidth;
    const mousePosition = event.clientX;

    let position = mousePosition - minPosition - (handleWidth / 2);
    if (position < 0) position = 0;
    if (position > maxPosition) position = maxPosition;

    const percentage = position / maxPosition;

    this.props.onChange(percentage);

    this.setState({
      changeSwitch: true,
      position,
      mousePosition: mousePosition,
    });
  }

  onMouseUp = (event) => {
    this.setState({
      changeSwitch: false,
    });
  }

  onChange = (event) => {
    if (! this.props.enable) return;
    if (! this.state.changeSwitch) return;

    const prevPosition = this.state.mousePosition;
    const postPosition = event.clientX;
    const diffPosition = postPosition - prevPosition;
    const maxPosition = this.state.meterBoxWidth - this.state.handleWidth;

    let position = this.state.position + diffPosition;
    if (position < 0) position = 0;
    if (position > maxPosition) position = maxPosition;

    const percentage = position / maxPosition;

    this.props.onChange(percentage);

    this.setState({
      position,
      mousePosition: event.clientX,
    });
  }

  setViewThetaSwitch = (event) => {
    const element = event.target;

    this.setState({
      viewThetaSwitch: element.checked,
    });
  }

  setViewTheta = (event) => {
    if (! this.props.enable) return;
    if (! this.state.viewThetaSwitch) return;

    const element = event.target;
    const viewTheta = parseInt(element.value);

    if (viewTheta > 0) {
      this.props.setViewTheta(viewTheta);
    }
  }
}

export default FormMeter;
