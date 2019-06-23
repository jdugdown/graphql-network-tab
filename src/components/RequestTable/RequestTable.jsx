import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import gql from "graphql-tag";
import isNil from "lodash/isNil";
import { getOrDefault } from "../../utils";
import IssuesCell from "../TableCells/IssuesCell";
import styles from "./RequestTable.css";

export default function RequestTable({ data, selectedRequestId, setSelectedRequest }) {
  return (
    <table cellSpacing="none" className={styles.requestTable}>
      <thead>
        <tr>
          <th>Operation</th>
          <th>Returned</th>
          <th className="narrowCell">Warnings</th>
          <th className="narrowCell">Errors</th>
          <th className="narrowCell">Status</th>
          <th className="narrowCell">Time</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ content, id, response, time, query }) => {
          const parsedQuery = gql`
            ${query.query}
          `;
          const rowClasses = clsx({
            [styles.selectedRow]: selectedRequestId === id
          });

          return (
            <tr
              key={id}
              onClick={e => {
                e.stopPropagation();
                setSelectedRequest(id);
              }}
              className={rowClasses}
            >
              <td>
                {!isNil(parsedQuery.definitions) &&
                  parsedQuery.definitions.map(({ operation, selectionSet }) => {
                    return (
                      <React.Fragment key={`${id}.${operation}`}>
                        <div>{operation}</div>
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
                {!isNil(content.data) &&
                  Object.keys(content.data).map(field => <div key={`${id}.${field}`}>{field}</div>)}
              </td>
              <IssuesCell issues={getOrDefault(content, "warnings", [])} cellType="warnings" />
              <IssuesCell issues={getOrDefault(content, "errors", [])} cellType="errors" />
              <td className="narrowCell">{getOrDefault(response, "status")}</td>
              <td className="narrowCell">{`${time} ms`}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

RequestTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
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
      time: PropTypes.number.isRequired,
      query: PropTypes.shape({
        query: PropTypes.string.isRequired
      }).isRequired,
      content: PropTypes.shape({
        data: PropTypes.shape({}).isRequired
      }).isRequired
    })
  ).isRequired,
  selectedRequestId: PropTypes.string.isRequired,
  setSelectedRequest: PropTypes.func.isRequired
};
