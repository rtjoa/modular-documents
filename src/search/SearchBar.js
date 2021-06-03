import {React, useState} from 'react';
import PropTypes from 'prop-types';
import '../styles/SearchBar.scss';
import search from './searchIcon.svg';

function SearchBar(props) {

  const [inputText, setInputText] = useState("");

  const onInputChange = (event) => {
    setInputText(event.target.value);
  };
  
  return (
    <div className="search">
      <input onChange={onInputChange} value={inputText} type="text" placeholder="Search for a document by title" />
      <button onClick={() => props.searchFunction(inputText)} className="searchButton" >
        <img src={search} alt="search icon"/>
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  searchFunction: PropTypes.func,
};

export default SearchBar;
