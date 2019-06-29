import React from "react";
import Draggable from "react-draggable";
import styles from "./DraggableColumn.css";

export default function DraggableColumn({ callback }) {
  return (
    <Draggable axis="x" onDrag={e => callback(`${e.view.innerWidth - e.clientX}px`)}>
      <div className={styles.draggableDivider} />
    </Draggable>
  );
}
