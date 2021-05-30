import React from 'react';
import { useParams } from 'react-router';
import SearchBar from '../shared/SearchBar.js';
import '../styles/MyDocuments.scss';
import { auth, firestore } from '../firebase.js';

import tempIMG from '../cards/temp.png';
import DocumentCard from '../cards/DocumentCards.js';

function MyDocuments() {
  let { id } = useParams();
  return (
    <div>
      <div className="searchAndCreate">
        <div className="searchRegion">
          <SearchBar placeholder="Search for a document by title or content" />
          <createIcon />
        </div>
        <div>
          <button className="button" onClick={() => createDoc()}>
            {' '}
            Create Doc{' '}
          </button>
        </div>
      </div>
      <br />
      <div className="document-cards-list">
        <DocumentCard name="Test1" img={tempIMG} />
        <DocumentCard name="Test2" img={tempIMG} />
        <DocumentCard name="Test3" img={tempIMG} />
      </div>
      I am an MyDocuments component! Document ID: {id}
    </div>
  );
}

function createDoc() {
  alert(
    'Not implemented yet\n This should take you to the EditDocument page, with an empty document.'
  );

  firestore.collection("Documents").add({DocOwner: auth.currentUser.uid, view: 0, url_code: "XXXXXXXX"}).then(function(docRef){
    //give docRef.id to the new document to store
    console.log("Document written with ID: ", docRef.id);
  })
}

export default MyDocuments;
