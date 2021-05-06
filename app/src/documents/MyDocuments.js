import React from 'react';
import ReactDOM from 'react-dom';

import BaseModule from './modules/BaseModule'
class MyDocuments extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        <p>
          I am a MyDocuments Component!
        </p>
        <button className="create-doc" onClick = { () => this.createDoc() }>
          Create Doc
        </button>
      </div>
    );
  }

  createDoc(){
    return 
  }
}

export default MyDocuments;
