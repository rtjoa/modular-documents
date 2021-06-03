import React from 'react';
import '../styles/explore.scss';
import SearchBar from '../shared/SearchBar.js';
import { firestore } from '../firebase.js';

function Explore() {

  function searchDocumentTitleInExplore() {
    let query = "Jo"
    firestore.collection("Documents").where("title", ">=", query).where("title", "<=", query + '\uf8ff').where("view", "==", 1).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //send these doc.id's to get displayed
        console.log(doc.id);
      });
    });
  }
  return ( //call searchDocumentTitle somewhere here?
    <div>
      <div className="searchHeading"> {`Explore other people's work!`} </div>
      <SearchBar 
        placeholder="Search for a document by title" 
        searchFunction = {()=> searchDocumentTitleInExplore()}/>
      </div>
  );
}

export default Explore;
