import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

const AntiIframeComponent = () => (
  <>
    <h1>Woops!</h1>
    <h2>
      Unfortunately, this website has stolen our game without asking us. So
      please visit us directly at:
    </h2>
    <h2>
      К сожалению, этот сайт украл нашу игру, не спрашивая нас. Поэтому,
      пожалуйста, посетите нас по адресу:
    </h2>
    <a
      style={{ fontSize: "40px", textDecoration: "underline" }}
      target="_blank"
      href="http://those.codes"
    >
      http://those.codes
    </a>
  </>
);

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

ReactDOM.render(
  <React.StrictMode>
    {inIframe() ? <AntiIframeComponent /> : <App history={history} />}
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
