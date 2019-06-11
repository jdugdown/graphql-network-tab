import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import styles from "./GraphQLTab.css";

export default class GraphQLTab extends React.Component {
  state = {
    greeting: "Whassup Fresh? It's our turn, baby"
  };

  render() {
    const { theme } = this.props;
    const { greeting } = this.state;

    const themeClass = clsx({
      [styles.dark]: theme === "dark"
    });

    return (
      <div className={themeClass}>
        <h1 className={styles.greets}>{`${greeting}`}</h1>
      </div>
    );
  }
}

GraphQLTab.propTypes = {
  theme: PropTypes.string.isRequired
};
