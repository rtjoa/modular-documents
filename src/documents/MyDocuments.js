import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SearchBar from '../search/SearchBar.js';
import '../styles/MyDocuments.scss';
import { auth, firestore } from '../firebase.js';

import logo from '../assets/logo.png';
import DocumentCard from '../cards/DocumentCards.js';

import { searchDocuments } from '../search/search.js';

function MyDocuments() {
  useEffect(() => {
    document.title = "My Documents - Modular Documents";
  }, []);

  const [searchDocs, setSearchDocs] = useState([]);
  const [lastQuery, setLastQuery] = useState("");
  
  const history = useHistory();

  async function onSearch(query) {
    if (!auth.currentUser) return;
    const docs = await searchDocuments(query, auth.currentUser.uid);
    setSearchDocs(docs);
    setLastQuery(query);
  }
  
  useEffect(() => {
    onSearch(lastQuery);
  }, [auth.currentUser]);

  function checkForErrors() {
    if (!auth.currentUser) {
      return "Please sign in to see your documents!";
    }
    
    if (!searchDocs.length) {
      return lastQuery ?
        "No matching documents found." :
        "Click \"Create Doc\" to create a new document!";
    }
    return "";
  }

  const errorMessage = checkForErrors();
  
  return (
    <div className="my-docs-page">
      <div className="searchAndCreate">
        <div className="searchRegion">
          <SearchBar searchFunction = {onSearch}/>
        </div>
        <div>
          <button className="button" onClick={() => createDoc(history)}>
            Create Doc
          </button>
        </div>
      </div>
      <br />
      <div>
        {errorMessage ?
          <div className="user-message"> {errorMessage} </div> :
          <div className="document-cards-list">
            {searchDocs.map((data) =>
              <div className='card-wrapper' key={data.id}>
                <DocumentCard name={data.title ? data.title : "Untitled Document"} url={data.id} img={logo} />
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
}

export async function createDoc(history, title="", data=[]) {
  if (!auth.currentUser) {
    alert('Please sign in to create a document.');
    return;
  }
  
  title = title || "Untitled Document";
  
  await firestore.collection("Documents").add({
    DocOwner: auth.currentUser.uid, 
    visibility: 0,
    data: data,
    title: title,
    lowercaseTitle: title.toLowerCase(),
  }).then((docRef) => {
    history.push('/document/'+docRef.id)
    console.log("Document written with ID: ", docRef.id);
  }).catch((error) => {
    console.log(error);
    alert("Could not create document. See console for details");
  });
}

export default MyDocuments;

