import React from 'react';
import { useParams } from 'react-router';
import SearchBar from '../shared/SearchBar.js';
import './MyDocuments.css';

import tempIMG from '../cards/temp.png';
import DocumentCard from '../cards/DocumentCards.js';

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
      <div className="document-cards-list">
        <DocumentCard name="Test1" img={tempIMG} />
        <DocumentCard name="Test2" img={tempIMG} />
        <DocumentCard name="Test3" img={tempIMG} />
      </div>
      I am an MyDocuments component! Document ID: {id}
    </div>
  );
}

function createDoc(){
  alert("Not implemented yet\n This should take you to the EditDocument page, with an empty document.")
}

export default MyDocuments;
