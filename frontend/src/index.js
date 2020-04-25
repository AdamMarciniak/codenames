import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

const AntiIframeComponent = () => (
  <>
  <h1>Shit!</h1>
  <h2>
    Unfortunately, this website has stolen our game without asking us so we can't let you see it. Have a nice day.
  </h2>
  <h1>блять!</h1>
  <h2>
    К сожалению, этот сайт украл нашу игру, не спросив нас, поэтому мы не можем позволить вам увидеть ее. Хорошего дня.
  </h2>
  <iframe width="560" height="315" src="https://www.youtube.com/embed/Ca3uJOAObRo?autoplay=1&controls=0&amp;start=133" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  </>
)

function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}


  ReactDOM.render(
  <React.StrictMode>
  {inIframe() ? <AntiIframeComponent/> : <App history={history} /> }
  </React.StrictMode>,
  document.getElementById("root")
  );


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
