
import React from 'react';
import { useParams } from 'react-router';
import SearchBar from '../shared/SearchBar.js';


function MyDocuments() {
  let { id } = useParams();
  return (
    <div>
      <div>
         <SearchBar placeholder="Search for a document by title or content"/>
         <createIcon/>
      </div>
      I am an MyDocuments component! Document ID: {id}
      <button onClick = { () => createDoc() }> Create Doc </button>
    </div>
  );
}

function createDoc(){
  alert("Not implemented yet\n This should take you to the EditDocument page, with an empty document.")
}

export default MyDocuments;
