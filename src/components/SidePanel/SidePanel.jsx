import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";
import HeadersTable from "../HeadersTable/HeadersTable";
import styles from "./SidePanel.css";

const REQUEST = "Request";
const RESPONSE = "Response";
const TABS = [RESPONSE, REQUEST];

export default function SidePanel({ request, response, content, query, clearSelectedRequest }) {
  const [activeTab, setActiveTab] = useState(RESPONSE);
  const formattedQuery = print(
    gql`
      ${query.query}
    `
  );
  const closeClasses = clsx(styles.tabButton, styles.close);

  return (
    <div className={styles.sidePanel}>
      <div className={styles.tabNav}>
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
            <HeadersTable headers={request.headers} />
          </>
        ) : (
          <>
            <h3>Response Data</h3>
            <pre className={styles.codeBlock}>
              <code>{JSON.stringify(content, null, 2)}</code>
            </pre>

            <h3>Headers</h3>
            <HeadersTable headers={response.headers} />
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
    query: PropTypes.string.isRequired
  }).isRequired,
  clearSelectedRequest: PropTypes.func.isRequired
};
