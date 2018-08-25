import Layout from "containers/Layout/Main";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import reducer from "reducers";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
  (
    <Provider store={store}>
      <Layout />
    </Provider>
  ),
  document.getElementById("app")
);
