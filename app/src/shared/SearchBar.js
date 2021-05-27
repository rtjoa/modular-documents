import React from 'react';
import './SearchBar.css';
import search from './searchIcon.svg';

/* eslint-disable react/prop-types */

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

export default SearchBar;
