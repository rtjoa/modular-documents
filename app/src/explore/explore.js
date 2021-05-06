import React from 'react';
import ReactDOM from 'react-dom';
import './explore.css';
import search from './searchIcon.svg';

function Explore() {
  return (
    <div>
      <div class = 'searchHeading'>
          Explore other people's work!
      </div>
      <div class ='search'>
        <input 
                type="text" 
                placeholder="Search for a document by title or content"
            />
        <button class='searchButton'>
            <img src={search} alt="search icon"/>
        </button>
      </div>
    </div>
  );
}

export default Explore;
