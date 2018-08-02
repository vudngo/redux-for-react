import Raven from "raven-js";
import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import createRavenMiddleware from "../"; // "raven-for-redux"

const RAVEN_DSN = "https://e765643734ed4a22b79aac2e92f5c81e@sentry.io/1243031";
Raven.config(RAVEN_DSN, {
  release: "0c3998e51431972e37826388647b6d069dd2c0d2",
  allowDuplicates: true
}).install();

// A very error-prone reducer.
const reducer = (state = "Hello world!", action) => {
  switch (action.type) {
    case "CRASH_IN_THE_REDUCER":
      throw new Error("Whoops, we crashed in the reducer!");
    case "UPDATE_MY_STRING":
      return action.str;
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  applyMiddleware(
    createRavenMiddleware(Raven, {
      breadcrumbDataFromAction: action => {
        return { STRING: action.str };
      }
    })
  )
);

document.getElementById("crash").addEventListener("click", () => {
  var a = undefinedVariable;
  //throw new Error("Whoops! My application crashed!");
});
document.getElementById("crash-in-reducer").addEventListener("click", () => {
  store.dispatch({ type: "CRASH_IN_THE_REDUCER" });
});
document.getElementById("set-state").addEventListener("click", () => {
  store.dispatch({
    type: "UPDATE_MY_STRING",
    str: document.getElementById("state").value
  });
});

const Button = () => (
  <button
    onClick={() => {
      store.dispatch({ type: "CRASH_IN_THE_REDUCER" });
    }}
  >
    Click to crash
  </button>
);

render(<Button />, document.getElementById("react-app"));

/*
// This should leave a breadcrumb, and leave lastAction and state as context.
store.dispatch({ type: "UPDATE_MY_STRING", str: "I've reached step one!" });

// This should leave a breadcrumb, and leave lastAction as context, even though
// it will crash.

store.dispatch({ type: "UPDATE_MY_STRING", str: "I've reached step two!" });

// We should still see our current state and lastAction in our context, even
// though we crashed outside the reducer.
throw new Error("Whoops! I crashed somewhere in my application!");
*/
