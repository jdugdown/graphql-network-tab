import React from "react";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import styles from "./DraggableColumn.css";

export default function DraggableColumn({ callback }) {
  return (
    <Draggable axis="x" onDrag={e => callback(`${e.view.innerWidth - e.clientX}px`)}>
      <div className={styles.draggableDivider} />
    </Draggable>
  );
}

DraggableColumn.propTypes = {
  callback: PropTypes.func.isRequired
};
