import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import Logo from "./Logo";
import axios from "./axios";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./Reducers";
import { init } from "./socket"; //////////////
//
//
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
// The Redux store will be responsible for managing the state
let elem = (init(store),
(
    <Provider store={store}>
        <App />
    </Provider>
));

if (location.pathname == "/welcome") {
    ReactDOM.render(<Welcome />, document.querySelector("main"));
} else {
    ReactDOM.render(elem, document.querySelector("main"));
}
