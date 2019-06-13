import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { formatRequestObject, getOrDefault } from "../utils";
import styles from "./GraphQLTab.css";

export default class GraphQLTab extends React.Component {
  state = {
    requests: []
  };

  componentDidMount() {
    const { onRequestFinished } = this.props;
    onRequestFinished.addListener(request => this.handleRequest(request));
  }

  clearRequests = () => this.setState({ requests: [] });

  handleRequest(request) {
    console.log("Handling request: ", request);
    request.getContent(content => this.setRequestInState(request, content));
  }

  setRequestInState(request, content) {
    this.setState(prev => {
      const prevRequests = prev.requests;
      console.log("Attempting to format request with content: ", content);
      const nextRequest = formatRequestObject(request, content);
      console.log("Setting request in state: ", nextRequest);
      return {
        ...prev,
        requests: [...prevRequests, nextRequest]
      };
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
        <button type="button" onClick={this.clearRequests}>
          Clear
        </button>
        <table>
          <thead>
            <tr>
              <th>Operation(s)</th>
              <th>Warnings</th>
              <th>Errors</th>
              <th>Status</th>
              <th>Time</th>
              <th>Method</th>
              <th>Content-Type</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(({ content, id, response, request, startedDateTime, time }) => (
              <tr key={id}>
                <td>
                  {content.data &&
                    Object.keys(content.data).map(operation => (
                      <div key={`${startedDateTime}.${operation}`}>{operation}</div>
                    ))}
                </td>
                <td>{getOrDefault(content, "warnings", []).length}</td>
                <td>{getOrDefault(content, "errors", []).length}</td>
                <td>{getOrDefault(response, "status")}</td>
                <td>{`${time} ms`}</td>
                <td>{getOrDefault(request, "method")}</td>
                <td>{getOrDefault(response, ["content", "mimeType"])}</td>
              </tr>
              // <tr>
              //   <td colSpan="7">
              //     <pre>
              //       <code>{JSON.stringify(content, null, 2)}</code>
              //     </pre>
              //   </td>
              // </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

GraphQLTab.propTypes = {
  onRequestFinished: PropTypes.shape({
    addListener: PropTypes.func.isRequired
  }).isRequired,
  theme: PropTypes.string.isRequired
};
