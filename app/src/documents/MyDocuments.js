import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import SearchBar from '../shared/SearchBar.js';
import '../styles/MyDocuments.scss';
import { auth, firestore } from '../firebase.js';

import logo from '../shared/logo.png';
import DocumentCard from '../cards/DocumentCards.js';

/* async function searchDocumentTitle(query){
  console.log("Query: " + query)
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
} */

function MyDocuments() {
  const [userDocs, setUserDocs] = useState([])
  const [searchDocs, setSearchDocs] = useState([])
  
  useEffect(async () => { 
    while (!auth.currentUser) {
      console.log("Not Signed In...");
      await new Promise(r => setTimeout(r, 1000))
    }
    await firestore.collection("Documents").where("DocOwner", "==", auth.currentUser.uid).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //send these doc.id's to get displayed
        setUserDocs((userDocs) => {
          const docs = userDocs.slice();
          docs.push({
            id: doc.id,
            title: (doc.get('data')[0] && doc.get('data')[0]['data']['title'] != "" ? doc.get('data')[0]['data']['title'] : "Untitled Document")
          });
          return docs
        });
      });
    }).catch( ()=> console.log("An error has occured in acquiring the user's documents") );
  }, [])
  
  //searchDocumentTitle("");
  const history = useHistory()

  function searchDocumentTitleInMyDocs() {
    let query = "Test"
    firestore.collection("Documents").where("title", ">=", query).where("title", "<=", query + '\uf8ff').where("DocOwner", "==", auth.currentUser.uid).get().then((querySnapshot) => {
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
    }).catch( ()=> console.log("An error has occured in acquiring the user's documents") );
  }

  return (
    <div>
      <div className="searchAndCreate">
        <div className="searchRegion">
          <SearchBar 
            placeholder="Search for a document by title" 
            searchFunction = {()=>searchDocumentTitleInMyDocs()}/>
          {/* idk the purpose of this line, im doing this to supress errors <createIcon />*/}
        </div>
        <div>
          <button className="button" onClick={() => createDoc(history)}>
            {' '}
            Create Doc{' '}
          </button>
        </div>
      </div>
      <br />
      <div>
        {!auth.currentUser ? <div className="user-message"> Please sign in to see your documents! </div> 
          :
          userDocs.length === 0 ? 
            <div className="user-message"> Click <q>Create Doc</q> to create a new document!</div> 
            :
            <div className="document-cards-list">
              {searchDocs.length  ? (
                  console.log("searched"),
                  searchDocs.map( (data) => (
                    <div className='card-wrapper' key={data.id}>
                      <DocumentCard name={data.title} url={data.id} img={logo} />
                    </div>)
              )) : (
                console.log("no search results"),
                userDocs.map( (data) => (
                  <div className='card-wrapper' key={data.id}>
                    <DocumentCard name={data.title} url={data.id} img={logo} />
                  </div>
                )))
              }
            </div>
        }
      </div>
    </div>
  );
}

export async function createDoc(history, data=[]) {
  if (!auth.currentUser) {
    alert('Please sign in to create a document.');
    return;
  }
  
  await firestore.collection("Documents").add({
    DocOwner: auth.currentUser.uid, 
    view: 0, 
    data: data,
  }).then((docRef) => {
    history.push('/document/'+docRef.id)
    console.log("Document written with ID: ", docRef.id);
  }).catch((error) => {
    console.log(error);
    alert("Could not create document. See console for details");
  });
}

export default MyDocuments;

