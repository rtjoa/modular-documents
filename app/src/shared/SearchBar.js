import React from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';
import search from './searchIcon.svg';

function SearchBar(props) {
  return (
    <div className="search">
      <input type="text" placeholder={props.placeholder} />
      <button className="searchButton">
        <img src={search} alt="search icon" />
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

export default SearchBar;
