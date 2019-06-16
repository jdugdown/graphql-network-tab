import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import styles from "./TableCells.css";

export default function IssuesCell({ issues, cellType }) {
  const numberOfIssues = issues.length;
  const isWarningCell = cellType === "warnings";
  const isErrorCell = cellType === "errors";

  const cellClasses = clsx("narrowCell", {
    [styles.warning]: numberOfIssues > 0 && isWarningCell,
    [styles.error]: numberOfIssues > 0 && isErrorCell
  });

  return <td className={cellClasses}>{numberOfIssues}</td>;
}

IssuesCell.defaultProps = {
  issues: []
};

IssuesCell.propTypes = {
  issues: PropTypes.array,
  cellType: PropTypes.oneOf(["warnings", "errors"]).isRequired
};
