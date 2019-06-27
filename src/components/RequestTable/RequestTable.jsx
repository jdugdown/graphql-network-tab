import React from "react";
import PropTypes from "prop-types";
import styles from "./RequestTable.css";
import RequestTableRow from "../RequestTableRow/RequestTableRow";

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
        {data.map(({ content, id, response, time, query }) => (
          <RequestTableRow
            key={id}
            content={content}
            id={id}
            response={response}
            time={time}
            query={query}
            selectedRequestId={selectedRequestId}
            setSelectedRequest={setSelectedRequest}
          />
        ))}
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
        ).isRequired,
        status: PropTypes.number.isRequired
      }).isRequired,
      time: PropTypes.number.isRequired,
      query: PropTypes.shape({
        query: PropTypes.string.isRequired
      }).isRequired,
      content: PropTypes.shape({
        data: PropTypes.shape({})
      }).isRequired
    })
  ).isRequired,
  selectedRequestId: PropTypes.string.isRequired,
  setSelectedRequest: PropTypes.func.isRequired
};
