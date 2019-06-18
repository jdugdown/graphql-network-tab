/* global chrome */
import React from "react";
import ReactDOM from "react-dom";
import GraphQLTab from "./components/GraphQLTab/GraphQLTab";
import "./assets/css/main.css";

function initializePanel() {
  const { create, themeName } = chrome.devtools.panels;
  const { onRequestFinished } = chrome.devtools.network;

  create("GraphQL", null, "./dist/index.html", ({ onShown }) => {
    onShown.addListener(({ document }) => {
      ReactDOM.render(
        <GraphQLTab theme={themeName} onRequestFinished={onRequestFinished} />,
        document.getElementById("root")
      );
    });
  });
}

initializePanel();
