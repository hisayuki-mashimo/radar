import React from "react";
import { connect } from "react-redux";
import * as styles from "./styles.scss";

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

class Title extends React.Component {
  componentWillReceiveProps(nextProps) {
    const sei = nextProps.user.sei;
    const mei = nextProps.user.mei;
  }

  render() {
    const { user } = this.props;
    const sei = user && user.sei;
    const mei = user && user.mei;

    return <div
      className={styles.title}
    >
      {sei} {mei}
    </div>
  }
}

export default connect(
  mapStateToProps,
  null,
)(Title);