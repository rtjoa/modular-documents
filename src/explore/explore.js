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
  
  async function onSearch(query) {
    const docs = await searchDocuments(query);
    setSearchDocs(docs);
  }

  useEffect(() => {
    onSearch("");
  }, []);

  return (
    <div className="explore-page">
      <div className="search-heading"> {`Explore other people's work!`} </div>
      <SearchBar searchFunction = {onSearch}/>
      <div className="document-cards-list">
        {searchDocs.length ? 
          searchDocs.map((data) => (
            <div className='card-wrapper' key={data.id}>
              <DocumentCard name={data.title} url={data.id} img={logo} />
            </div>))
          : (<div> No matching documents found.</div>)
            }
      </div>
    </div>
  );
}

export default Explore;
