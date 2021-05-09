
import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router';

function MyDocuments() {
  let { id } = useParams();
  return (
    <div>
      I am an MyDocuments component! Document ID: {id}
      <button onClick = { () => createDoc() }> Create Doc </button>
    </div>
  );
}

function createDoc(){
  alert("Not implemented yet\n This should take you to the EditDocument page, with an empty document.")
}

export default MyDocuments;
