import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import styles from "./GraphQLTab.css";

export default class GraphQLTab extends React.Component {
  state = {
    requests: []
  };

  componentDidMount() {
    const { onRequestFinished } = this.props;
    onRequestFinished.addListener(request => this.handleRequest(request));
  }

  handleRequest(request) {
    console.log(request);
    request.getContent(content => {
      this.setState(prev => {
        const prevRequests = prev.requests;
        const nextRequest = {
          request: request.request,
          response: request.response,
          time: Math.round(request.time),
          startedDateTime: request.startedDateTime,
          content: JSON.parse(content)
        };
        return {
          ...prev,
          requests: [...prevRequests, nextRequest]
        };
      });
    });
  }

  render() {
    const { theme } = this.props;
    const { requests } = this.state;

    const themeClass = clsx({
      [styles.dark]: theme === "dark"
    });

    return (
      <div className={themeClass}>
        <table>
          <thead>
            <th>Operation</th>
            <th>Warnings</th>
            <th>Errors</th>
            <th>Status</th>
            <th>Time</th>
            <th>Method</th>
            <th>Type</th>
          </thead>
          <tbody>
            {requests.map(({ request, response, time }) => (
              <tr>
                <td>Operation name goes here</td>
                <td>0</td>
                <td>0</td>
                <td>{response.status}</td>
                <td>{`${time} ms`}</td>
                <td>{request.method}</td>
                <td>{response.content.mimeType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

GraphQLTab.propTypes = {
  onRequestFinished: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired
};
