import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import { print } from "graphql/language/printer";
import gql from "graphql-tag";
import styles from "./SidePanel.css";

export default function SidePanel({ request }) {
  const { request: requestObj, response: responseObj } = request;
  const formattedQuery = print(
    gql`${request.query.query}`
  );

  return (
    <div className={styles.sidePanel}>
      {/* TODO: tabbed navigation between request and response */}
      <div className={styles.tabContent}>
        <h2>Request</h2>
        <h3>Headers</h3>
        {/* TODO: abstract to <HeadersTable /> component */}
        <table className={styles.headersTable}>
          <tbody>
            {sortBy(requestObj.headers, "name").map(({ name, value }) => (
              <tr key={name}>
                <td className={styles.headerName}>{name}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Query</h3>
        <pre>
          <code>{formattedQuery}</code>
        </pre>

        <br />
        <br />
        <hr />
        <br />
        <br />

        <h2>Response</h2>
        <h3>Headers</h3>
        {/* TODO: abstract to <HeadersTable /> component */}
        <table className={styles.headersTable}>
          <tbody>
            {sortBy(responseObj.headers, "name").map(({ name, value }) => (
              <tr key={name}>
                <td className={styles.headerName}>{name}</td>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Response Data</h3>
        <pre>
          <code>{JSON.stringify(request.content, null, 2)}</code>
        </pre>
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
    }).isRequired
  }).isRequired
};
