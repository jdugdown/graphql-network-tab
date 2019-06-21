import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";
import HeadersTable from "../HeadersTable/HeadersTable";
import styles from "./SidePanel.css";

const REQUEST = "Request";
const RESPONSE = "Response";
const TABS = [REQUEST, RESPONSE];

export default function SidePanel({ request, clearSelectedRequest }) {
  const [activeTab, setActiveTab] = useState(REQUEST);
  const { request: requestObj, response: responseObj } = request;
  const formattedQuery = print(
    gql`
      ${request.query.query}
    `
  );
  const closeClasses = clsx(styles.tabButton, styles.close);

  return (
    <div className={styles.sidePanel}>
      <div className={styles.tabNav}>
        {/* TODO: close side panel on click */}
        <button type="button" className={closeClasses} onClick={clearSelectedRequest}>
          &times;
        </button>
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
      </div>

      <div className={styles.tabContent}>
        {activeTab === REQUEST ? (
          <>
            <h3>Query</h3>
            <pre className={styles.codeBlock}>
              <code>{formattedQuery}</code>
            </pre>

            <h3>Headers</h3>
            <HeadersTable headers={requestObj.headers} />
          </>
        ) : (
          <>
            <h3>Response Data</h3>
            <pre className={styles.codeBlock}>
              <code>{JSON.stringify(request.content, null, 2)}</code>
            </pre>

            <h3>Headers</h3>
            <HeadersTable headers={responseObj.headers} />
          </>
        )}
      </div>
    </div>
  );
}

// TODO: create common type file for request format
SidePanel.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
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
    query: PropTypes.shape({
      query: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  clearSelectedRequest: PropTypes.func.isRequired
};
