import Layout from "containers/Layout/Main";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import reducer from 'reducers';
import { createStore } from 'redux';

const store = createStore(reducer);

ReactDOM.render(
  (
    <Provider store={store}>
      <Layout />
    </Provider>
  ),
  document.getElementById("app")
);
