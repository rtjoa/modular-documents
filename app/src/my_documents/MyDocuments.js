import React from 'react';
import ReactDOM from 'react-dom';

import BaseModule from '../documents/modules/BaseModule'
//import './index.css';

  class MyDocuments extends React.Component {
    constructor()
    render() {
      return (
        <button className="create-doc" onClick = { () => createDoc() }>
          Hello World
        </button>
      );
    }

    createDoc(){
      return 
    }
  }
  
  // ========================================
  
//   ReactDOM.render(
//     <UserHomePage/>,
//     document.getElementById('root')
//   );
  