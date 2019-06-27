import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import gql from "graphql-tag";
import isNil from "lodash/isNil";
import { getOrDefault } from "../../utils";
import IssuesCell from "../TableCells/IssuesCell";
import styles from "./RequestTableRow.css";

export default function RequestTableRow({
  content,
  id,
  response,
  time,
  query,
  selectedRequestId,
  setSelectedRequest
}) {
  let parsedQuery = {};
  try {
    parsedQuery = gql`
      ${query.query}
    `;
  } catch (error) {
    console.error("Error trying to parse operation", error);
  }
  const rowClasses = clsx({
    [styles.selectedRow]: selectedRequestId === id
  });
  const status = getOrDefault(response, "status");
  const statusClasses = clsx("narrowCell", {
    [styles.statusSuccess]: status < 300,
    [styles.statusWarning]: status >= 300 && status < 400,
    [styles.statusError]: status >= 400
  });

  return (
    <tr
      onClick={e => {
        e.stopPropagation();
        setSelectedRequest(id);
      }}
      className={rowClasses}
    >
      <td>
        {!isNil(parsedQuery.definitions) &&
          parsedQuery.definitions.map(({ name, operation, selectionSet }) => {
            const operationDisplayText = !isNil(name)
              ? `${operation} ${getOrDefault(name, "value")}`
              : operation;
            return (
              <React.Fragment key={`${id}.${operationDisplayText}`}>
                <div>{operationDisplayText}</div>
                {selectionSet.selections.map(({ name }) => (
                  <div className={styles.selection} key={`${id}.${name.value}`}>
                    {name.value}
                  </div>
                ))}
              </React.Fragment>
            );
          })}
      </td>
      <td>
        {!isNil(content) &&
          Object.keys(content).map(contentKey => {
            return (
              <React.Fragment key={contentKey}>
                <div>{contentKey}</div>
                {contentKey === "data" &&
                  !isNil(content.data) &&
                  Object.keys(content.data).map(selection => (
                    <div className={styles.selection} key={selection}>
                      {selection}
                    </div>
                  ))}
              </React.Fragment>
            );
          })}
      </td>
      <IssuesCell issues={getOrDefault(content, "warnings", [])} cellType="warnings" />
      <IssuesCell issues={getOrDefault(content, "errors", [])} cellType="errors" />
      <td className={statusClasses}>{status}</td>
      <td className="narrowCell">{`${time} ms`}</td>
    </tr>
  );
}

RequestTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  response: PropTypes.shape({
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
      })
    ).isRequired,
    status: PropTypes.number.isRequired
  }).isRequired,
  time: PropTypes.number.isRequired,
  query: PropTypes.shape({
    query: PropTypes.string.isRequired
  }).isRequired,
  content: PropTypes.shape({
    data: PropTypes.shape({})
  }).isRequired,
  selectedRequestId: PropTypes.string.isRequired,
  setSelectedRequest: PropTypes.func.isRequired
};
