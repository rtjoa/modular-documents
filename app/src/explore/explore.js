import React from 'react';
import '../styles/explore.scss';
import SearchBar from '../shared/SearchBar.js';

function Explore() {
  return ( //call searchDocumentTitle somewhere here?
    <div>
      <div className="searchHeading"> {`Explore other people's work!`} </div>
      <SearchBar placeholder="Search for a document by title or content" />
    </div>
  );
}

export default Explore;
