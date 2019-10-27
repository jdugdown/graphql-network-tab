import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { formatRequestObject, findById, getOrDefault } from "../../utils";
import RequestTable from "../RequestTable/RequestTable";
import SidePanel from "../SidePanel/SidePanel";
import styles from "./GraphQLTab.css";

export default class GraphQLTab extends React.PureComponent {
  state = {
    selectedRequest: {},
    selectedRequestId: "",
    requests: []
  };

  componentDidMount() {
    const { onRequestFinished } = this.props;
    onRequestFinished.addListener(request => this.handleRequest(request));
  }

  handleRequest(request) {
    // TODO: improve checking if this request was a graphql operation
    if (!isNil(get(request, ["request", "postData", "text"]))) {
      try {
        request.getContent(content => {
          if (!isNil(content) && !isEmpty(content)) {
            this.setRequestInState(request, content);
          }
        });
      } catch (error) {
        console.error(error);
      }
    }
  }

  setRequestInState(request, content) {
    this.setState(prev => {
      const prevRequests = prev.requests;
      const nextRequest = formatRequestObject(request, content);
      return {
        ...prev,
        requests: [...prevRequests, nextRequest]
      };
    });
  }

  setSelectedRequest = id => {
    this.setState(prev => ({
      selectedRequestId: prev.selectedRequestId === id ? "" : id,
      selectedRequest: prev.selectedRequestId === id ? {} : findById(prev.requests, id)
    }));
  };

  clearSelectedRequest = () => {
    this.setState({
      selectedRequestId: "",
      selectedRequest: {}
    });
  };

  render() {
    const { theme } = this.props;
    const { requests, selectedRequest, selectedRequestId } = this.state;

    const themeClass = clsx(styles.appWrapper, {
      dark: theme === "dark"
    });

    return (
      <div className={themeClass}>
        <RequestTable
          data={requests}
          selectedRequestId={selectedRequestId}
          setSelectedRequest={this.setSelectedRequest}
        />
        {!isEmpty(selectedRequestId) && (
          <SidePanel
            request={getOrDefault(selectedRequest, "request", {})}
            response={getOrDefault(selectedRequest, "response", {})}
            content={getOrDefault(selectedRequest, "content", {})}
            query={getOrDefault(selectedRequest, "query", {})}
            clearSelectedRequest={this.clearSelectedRequest}
            theme={theme}
          />
        )}
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
