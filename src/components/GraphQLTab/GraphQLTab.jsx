import clsx from "clsx";
import filter from "lodash/filter";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import some from "lodash/some";
import PropTypes from "prop-types";
import React from "react";
import { findById, formatRequestObject, getOrDefault } from "../../utils";
import RequestTable from "../RequestTable/RequestTable";
import SearchBar from "../SearchBar/SearchBar";
import SidePanel from "../SidePanel/SidePanel";
import styles from "./GraphQLTab.css";

export default class GraphQLTab extends React.PureComponent {
  state = {
    selectedRequest: {},
    selectedRequestId: "",
    requests: [],
    filterValue: ""
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

  clearRequests = () => {
    this.setState({
      requests: [],
      selectedRequestId: "",
      selectedRequest: {}
    });
  };

  setFilterValue = filterValue => {
    this.setState({
      filterValue
    });
  };

  doesObjectKeyContainFilter = obj => {
    const { filterValue } = this.state;
    return some(Object.keys(obj), key => key.toLowerCase().includes(filterValue.toLowerCase()));
  };

  render() {
    const { theme } = this.props;
    const { filterValue, requests, selectedRequest, selectedRequestId } = this.state;

    const themeClass = clsx(styles.appWrapper, {
      dark: theme === "dark"
    });

    const filteredRequests = filter(requests, request => {
      const {
        content: { data = {}, errors = {} }
      } = request;

      const hasDataMatch = this.doesObjectKeyContainFilter(data);
      const hasErrorMatch = this.doesObjectKeyContainFilter(errors);

      return hasDataMatch || hasErrorMatch;
    });

    return (
      <div className={themeClass}>
        <SearchBar
          clearRequests={this.clearRequests}
          filterValue={filterValue}
          setFilterValue={this.setFilterValue}
        />
        <RequestTable
          data={filterValue.length ? filteredRequests : requests}
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
