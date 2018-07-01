import RadarViewer from "containers/RadarViewer/Main";
import Form from "containers/Form/Main";
import React from "react";
import * as styles from "./styles.scss";

class Layout extends React.Component {
  render() {
    return <div>
      <table className={styles.contentsFrame}>
        <tbody>
          <tr>
            <td className={styles.titleFrame}>
              <div className={styles.title}></div>
            </td>
            <td className={styles.colSpacer}></td>
            <td className={styles.adviceTitleFrame}>
              <div className={styles.adviceTitle}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className={styles.rowSpacer}></td>
          </tr>
          <tr>
            <td className={styles.radarFrame}>
              <RadarViewer />
            </td>
            <td className={styles.colSpacer}></td>
            <td rowSpan="3" className={styles.adviceFrame}>
              <div className={styles.advice}></div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className={styles.rowSpacer}></td>
          </tr>
          <tr>
            <td className={styles.formFrame}>
              <Form />
            </td>
            <td className={styles.colSpacer}></td>
          </tr>
          <tr>
            <td colSpan="3" className={styles.rowSpacer}></td>
          </tr>
          <tr>
            <td className={styles.infoFrame}>
              <div className={styles.info}>
                これは姓名判断ではありません。<br />
                ここで出力される結果は事実に即しておりませんので、<br />
                信用しないでください。
              </div>
            </td>
            <td colSpan="2" className={styles.colSpacer}></td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
}

export default Layout;