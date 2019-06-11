import React from "react";
import ReactDOM from "react-dom";
import GraphQLTab from "./components/GraphQLTab";
import "./assets/css/main.css";

function initializePanel() {
  // eslint-disable-next-line no-undef
  const { create, themeName } = chrome.devtools.panels;

  create("GraphQL", null, "./dist/index.html", ({ onShown }) => {
    onShown.addListener(({ document }) => {
      ReactDOM.render(<GraphQLTab theme={themeName} />, document.getElementById("root"));
    });
  });
}

initializePanel();
