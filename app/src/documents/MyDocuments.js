
import React from 'react';
import { useParams } from 'react-router';
import SearchBar from '../shared/SearchBar.js';
import './MyDocuments.css';

function MyDocuments() {
  let { id } = useParams();
  return (
    <div>
      <div className="searchAndCreate">
        <div className="searchRegion">
          <SearchBar placeholder="Search for a document by title or content" />
          <createIcon/>
        </div>
        <div>
          <button className="button" onClick = { () => createDoc() }> Create Doc </button>
        </div>
      </div>
      <br/>
      I am an MyDocuments component! Document ID: {id}
    </div>
  );
}

function createDoc(){
  alert("Not implemented yet\n This should take you to the EditDocument page, with an empty document.")
}

export default MyDocuments;
