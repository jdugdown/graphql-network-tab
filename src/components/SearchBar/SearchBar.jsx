import React from "react";
import PropTypes from "prop-types";
import styles from "./SearchBar.css";
import ClearIcon from "../ClearIcon/ClearIcon";

const SearchBar = ({ clearRequests, setOperationValue, filterValue, setFilterValue }) => {
  const onFilterChange = event => {
    setFilterValue(event.target.value);
  };
  return (
    <div className={styles.searchBar}>
      <button className={styles.clearButton} type="button" onClick={clearRequests}>
        <ClearIcon />
      </button>
      <div className={styles.filter}>
        <input type="text" onChange={onFilterChange} placeholder="Filter..." value={filterValue} />
        <button type="button" onClick={() => setFilterValue("")}>
          <ClearIcon />
        </button>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  clearRequests: PropTypes.func.isRequired,
  setOperationValue: PropTypes.func.isRequired,
  filterValue: PropTypes.string.isRequired,
  setFilterValue: PropTypes.func.isRequired
};

export default SearchBar;
