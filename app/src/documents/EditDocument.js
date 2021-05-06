import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router';

function EditDocument() {
  let { id } = useParams();
  return (
    <div>
      I am an EditDocument component! Document ID: {id}
    </div>
  );
}

export default EditDocument;
