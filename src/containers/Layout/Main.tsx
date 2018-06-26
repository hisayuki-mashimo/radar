import RadarViewer from "containers/RadarViewer/Main";
import Form from "containers/Form/Main";
import React from "react";

class Layout extends React.Component {
  render() {
    return <div>
      <table id="contents_frame">
        <tbody>
          <tr>
            <td id="title_frame">
              <div id="title"></div>
            </td>
            <td className="col_spacer"></td>
            <td id="advice_title_frame">
              <div id="advice_title"></div>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="row_spacer"></td>
          </tr>
          <tr>
            <td id="radar_frame">
              <RadarViewer />
            </td>
            <td className="col_spacer"></td>
            <td rowSpan="3" id="advice_frame">
              <div id="advice"></div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="row_spacer"></td>
          </tr>
          <tr>
            <td id="form_frame">
              <Form />
            </td>
            <td className="col_spacer"></td>
          </tr>
          <tr>
            <td colSpan="3" className="row_spacer"></td>
          </tr>
          <tr>
            <td id="info_frame">
              <div id="info">
                {/*
                これは姓名判断ではありません。<br />
                ここで出力される結果は事実に即しておりませんので、<br />
                信用しないでください。
                */}
                試験
              </div>
            </td>
            <td colSpan="2" className="col_spacer"></td>
          </tr>
        </tbody>
      </table>
    </div>;
  }
}

export default Layout;