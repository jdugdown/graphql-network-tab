import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/sortBy";
import styles from "./HeadersTable.css";

export default function HeadersTable({ headers }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.headersTable}>
        <tbody>
          {sortBy(headers, "name").map(({ name, value }) => (
            <tr key={name}>
              <td className={styles.headerName}>{name}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

HeadersTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ).isRequired
};
