import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import styles from "./RequestTable.css";
import RequestTableRow from "../RequestTableRow/RequestTableRow";

/* eslint-disable react/no-unused-state */
export default class RequestTable extends React.PureComponent {
  state = {
    scrollHeight: 0
  };

  tableWrapper = React.createRef();

  bottomOfList = React.createRef();

  componentDidMount() {
    this.updateScrollHeight();
  }

  componentDidUpdate({ data: prevData }, { scrollHeight }) {
    const { data, selectedRequestId } = this.props;
    const hasNewRequests = prevData.length < data.length;
    const isScrolledToBottom =
      this.tableWrapper.current.clientHeight + this.tableWrapper.current.scrollTop === scrollHeight;

    if (hasNewRequests) {
      this.updateScrollHeight();
    }

    if (hasNewRequests && isScrolledToBottom && isEmpty(selectedRequestId)) {
      this.bottomOfList.current.scrollIntoViewIfNeeded();
    }
  }

  updateScrollHeight = () => {
    this.setState({ scrollHeight: this.tableWrapper.current.scrollHeight });
  };

  render() {
    const { data, selectedRequestId, setSelectedRequest } = this.props;

    return (
      <div className={styles.tableWrapper} ref={this.tableWrapper}>
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
        <div ref={this.bottomOfList} />
      </div>
    );
  }
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
