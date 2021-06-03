import {React, useState} from 'react';
import '../styles/explore.scss';
import SearchBar from '../shared/SearchBar.js';
import { firestore } from '../firebase.js';

import logo from '../shared/logo.png';
import DocumentCard from '../cards/DocumentCards.js';

function Explore() {

  const [searchDocs, setSearchDocs] = useState([])

  function searchDocumentTitleInExplore() {
    let query = "Jo"
    setSearchDocs([])
    firestore.collection("Documents").where("title", ">=", query).where("title", "<=", query + '\uf8ff').where("view", "==", 0).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setSearchDocs((searchDocs) => {
          const docs = searchDocs.slice();
          docs.push({
            id: doc.id,
            title: (doc.get('data')[0] && doc.get('data')[0]['data']['title'] != "" ? doc.get('data')[0]['data']['title'] : "Untitled Document")
          });
          return docs
        });
      });
    });
  }

  return (
    <div>
      <div className="searchHeading"> {`Explore other people's work!`} </div>
      <SearchBar 
        placeholder="Search for a document by title" 
        searchFunction = {()=> searchDocumentTitleInExplore()}/>
      {searchDocs.length  ? 
        searchDocs.map( (data) => (
                <div className='card-wrapper' key={data.id}>
                  <DocumentCard name={data.title} url={data.id} img={logo} />
                </div> )) 
        : console.log("No results found") }
    </div>
  );
}

export default Explore;
