import React from 'react';
import { useParams, useHistory } from 'react-router';
import SearchBar from '../shared/SearchBar.js';
import '../styles/MyDocuments.scss';
import { auth, firestore } from '../firebase.js';

import tempIMG from '../cards/temp.png';
import DocumentCard from '../cards/DocumentCards.js';

function getUserDocuments() {
  var userdocs = [
    {
      id: 1,
      title: "test 1"
    },
    {
      id: 2,
      title: "test 2"
    },
    {
      id: 3,
      title: "test 3"
    }
  ];
  if (!auth.currentUser) {
    console.log("Not Signed In");
    return userdocs;
  }
  firestore.collection("Documents").where("DocOwner", "==", auth.currentUser.uid).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //send these doc.id's to get displayed
      userdocs.push({
        id: doc.id,
        title: 'Untitled Document' //(doc.get('data'))[0] ? doc.get('data')[0] :)
      });
      console.log(userdocs)
    });
  });
  return userdocs;
}

function searchDocumentTitle(query) {
  if (!auth.currentUser) {
    console.log("Not Signed In");
    return;
  }
  firestore.collection("Documents").where("DocOwner", "==", auth.currentUser.uid).where("title", ">=", query).where("title", "<=", query + '\uf8ff').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //send these doc.id's to get displayed
      console.log(doc.id);
    });
  });
}

function MyDocuments() {
  getUserDocuments();
  searchDocumentTitle("");
  const history = useHistory()
  let { id } = useParams();
  return (
    <div>
      <div className="searchAndCreate">
        <div className="searchRegion">
          <SearchBar placeholder="Search for a document by title or content" />
          <createIcon />
        </div>
        <div>
          <button className="button" onClick={() => createDoc(history)}>
            {' '}
            Create Doc{' '}
          </button>
        </div>
      </div>
      <br />
      <div className="document-cards-list">
        {getUserDocuments().map( (data) => (
            <div className='card-wrapper' key={data.id}>
              <DocumentCard name={data.title} img={tempIMG} />
          </div>
        ))}
      </div>
      I am an MyDocuments component! Document ID: {id}
    </div>
  );
}

function createDoc(history) {
  if (!auth.currentUser) {
    alert(
      'Need to be signed in to Create a Doc'
    );
    return;
  }
  else {
    firestore.collection("Documents").add({
      DocOwner: auth.currentUser.uid, 
      view: 0, 
      data: [],
    }).then(function(docRef){
      history.push('/document/'+docRef.id)
      console.log("Document written with ID: ", docRef.id);
  })}
}

export default MyDocuments;

