import Layout from "containers/Layout/Main";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux"
import reducer from "reducers";
import { applyMiddleware, createStore } from "redux";
//import createLogger from "redux-logger";
import thunk from "redux-thunk";

//const store = createStore(reducer);

//const logger = createLogger();
//const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
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
