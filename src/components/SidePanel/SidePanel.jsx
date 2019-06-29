import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";
import HeadersTable from "../HeadersTable/HeadersTable";
import DraggableColumn from "../DraggableColumn/DraggableColumn";
import styles from "./SidePanel.css";

const REQUEST = "Request";
const RESPONSE = "Response";
const TABS = [RESPONSE, REQUEST];

export default function SidePanel({ request, response, content, query, clearSelectedRequest }) {
  const [activeTab, setActiveTab] = useState(RESPONSE);
  const [currentWidth, setCurrentWidth] = useState(`${75}vw`);
  let formattedQuery = "";

  try {
    formattedQuery = print(
      gql`
        ${query.query}
      `
    );
  } catch (error) {
    console.error("Error trying to parse operation", error);
    formattedQuery = `Error trying to parse operation: ${error.message}`;
  }
  const closeClasses = clsx(styles.tabButton, styles.close);

  return (
    <div style={{ width: currentWidth }} className={styles.sidePanel}>
      <DraggableColumn callback={val => setCurrentWidth(val)} />
      <div className={styles.tabNav}>
        {TABS.map(tab => {
          const tabClasses = clsx(styles.tabButton, {
            [styles.activeTabButton]: tab === activeTab
          });
          return (
            <button
              key={tab}
              type="button"
              className={tabClasses}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          );
        })}
        <button type="button" className={closeClasses} onClick={clearSelectedRequest}>
          &times;
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === RESPONSE ? (
          <>
            <h3>Headers</h3>
            <HeadersTable headers={response.headers} />

            <h3>Response Data</h3>
            <pre className={styles.codeBlock}>
              <code>{JSON.stringify(content, null, 2)}</code>
            </pre>
          </>
        ) : (
          <>
            <h3>Query</h3>
            <pre className={styles.codeBlock}>
              <code>{formattedQuery}</code>
            </pre>

            {!isNil(query.variables) && !isEmpty(query.variables) && (
              <>
                <h3>Variables</h3>
                <pre className={styles.codeBlock}>
                  <code>{JSON.stringify(query.variables, null, 2)}</code>
                </pre>
              </>
            )}

            <h3>Headers</h3>
            <HeadersTable headers={request.headers} />
          </>
        )}
      </div>
    </div>
  );
}

SidePanel.propTypes = {
  request: PropTypes.shape({
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  response: PropTypes.shape({
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired
  }).isRequired,
  content: PropTypes.shape({
    data: PropTypes.shape({})
  }).isRequired,
  query: PropTypes.shape({
    query: PropTypes.string.isRequired,
    variables: PropTypes.shape({})
  }).isRequired,
  clearSelectedRequest: PropTypes.func.isRequired
};
