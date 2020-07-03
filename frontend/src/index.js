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
      Unfortunately, this website has stolen our game without asking us. 
      Also, our game is not Codenames. It is Those.codes. We are not affiliated with Codenames.
    </h2> 
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
