import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router';

function ViewDocument() {
  let { id } = useParams();
  return <div>I am a ViewDocument component! Document ID: {id}</div>;
}

export default ViewDocument;
