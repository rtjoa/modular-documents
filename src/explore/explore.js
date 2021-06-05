import {React, useEffect, useState} from 'react';
import '../styles/explore.scss';
import '../styles/MyDocuments.scss';

import SearchBar from '../search/SearchBar.js';
import { searchDocuments } from '../search/search.js';

import logo from '../assets/logo.png';
import DocumentCard from '../cards/DocumentCards.js';

function Explore() {
  useEffect(() => {
    document.title = "Explore - Modular Documents";
  }, []);

  const [searchDocs, setSearchDocs] = useState([])
  
  //Calls searchDocuments, and sets the resulting docs to be rendered
  async function onSearch(query) {
    const docs = await searchDocuments(query);
    setSearchDocs(docs);
  }

  //On load to call searchDocuments and set docs to be renderd
  useEffect(() => {
    onSearch("");
  }, []);

  return (
    <div className="explore-page">
      <div className="search-heading"> {`Explore other people's work!`} </div>
      <SearchBar searchFunction = {onSearch}/>
      <div className="document-cards-list-container">
        <div className="document-cards-list">
          {searchDocs.length ? 
            searchDocs.map((data) => (
              data.title && 
              <div className='card-wrapper' key={data.id}>
                <DocumentCard name={data.title} url={data.id} img={logo} />
              </div>))
            : (<div> No matching documents found.</div>)
          }
        </div>
      </div>
    </div>
  );
}

export default Explore;
