import React from 'react';
import './SearchBar.css';
import search from './searchIcon.svg';

function SearchBar(props) {
  return (
    <div class="search">
      <input type="text" placeholder={props.placeholder} />
      <button class="searchButton">
        <img src={search} alt="search icon" />
      </button>
    </div>
  );
}

export default SearchBar;
