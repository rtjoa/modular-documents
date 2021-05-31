import React from 'react';
import PropTypes from 'prop-types';
import '../styles/SearchBar.scss';
import search from './searchIcon.svg';
import { firestore } from '../firebase.js';

function SearchBar(props) {
  return (
    <div className="search">
      <input type="text" placeholder={props.placeholder} />
      <button className="searchButton">
        <img src={search} alt="search icon" onClick={searchDocumentTitle("a")}/>
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
};

function searchDocumentTitle(query) {
  firestore.collection("Documents").where("title", ">=", query).where("title", "<=", query + '\uf8ff').where("view", "==", 1).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //send these doc.id's to get displayed
      console.log(doc.id);
    });
  });
}

export default SearchBar;
