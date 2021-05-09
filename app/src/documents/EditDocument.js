import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup'
import { useParams } from 'react-router';

import { TextModule } from './modules/TextModule'

function EditDocument() {
  let { id } = useParams();
  const [modules, setModules] = useState([])
  return (
    <div>
      <div>
        I am an EditDocument component! Document ID: {id}
      </div>
      
      <AddModulePopupMenu/>
    </div>
  );
}

function AddModulePopupMenu(){
  return(
    <Popup
      trigger={open => (
        <button className="button">Add Module</button>
      )}
      modal
      nested
    >
      <div className="module-popup">
        <span> Choose a module type: </span>
        <ol>
          <li> <AddModulePopup type='Text'/> </li>
          <li> <AddModulePopup type='Image'/> </li>
          <li> <AddModulePopup type='3'/> </li>
          <li> <AddModulePopup type='4'/> </li>
          <li> <AddModulePopup type='5'/> </li>
        </ol>
      </div>
    </Popup>
  )
}

function AddModulePopup(props){
  return(
  <div>
    <Popup
      trigger={open => (
        <button className="button">Add {props.type} Module</button>
      )}
      position="right center"
      closeOnDocumentClick
    >
      <HandleModuleInput type={props.type}/>
    </Popup>
  </div>
  )
}

function HandleModuleInput(props){
  switch(props.type){
    case 'Text':
      return( 
      <form onSubmit = {() => HandleTextInput()}>
        <input type="text" placeholder="Enter text here"/>
        <input type="submit" value="Submit"/>
      </form>
      ) 
    default:
      return(
        <span>{props.type}</span>
      )
  }
}

function HandleTextInput(){
  alert("Not yet implemented (text input)")
}
export default EditDocument;
