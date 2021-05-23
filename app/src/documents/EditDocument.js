import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup'
import { useParams } from 'react-router';

import { ShowModules } from './ShowModules.js';
import { TextModule } from './modules/TextModule.js'

import './EditDocument.css';

//TODO: Split a lot of this stuff up into its own files.
//Figure out the class structure and design of modules (skeleton somewhat exists)
//Figure out how to store and render each module

function EditDocument() {
  let { id } = useParams();
  const [modules, setModules] = useState([])

  return (
    <div>
      <div>
        I am an EditDocument component! Document ID: {id}
      </div>
      <ShowModules modules={modules}/>
      <AddModulePopupMenu modules={modules} setModules={setModules}/>
    </div>
  );
}

//Popup that appears in the middle of the screen when user requests to add a module
function AddModulePopupMenu(props){
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
          <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='Text'/> </li>
          <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='Image'/> </li>
          <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='3'/> </li>
          <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='4'/> </li>
          <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='5'/> </li>
        </ol>
      </div>
    </Popup>
  )
}

//The individual buttons that handle each type of module 
//Each button will create its own popup menu, of which the contents is determined by `HandleModuleInput`
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
      <HandleModuleInput modules={props.modules} setModules={props.setModules} type={props.type}/>
    </Popup>
  </div>
  )
}

//Handles how input is received based on the type of module requested
function HandleModuleInput(props){
  const [body, setBody] = useState("")
 
  function handleSubmit(e){
    e.preventDefault()
    props.setModules([...props.modules, new TextModule(body)])
  }
  
  switch(props.type){
    case 'Text':
      return(  
        <form onSubmit={e => handleSubmit(e)}>
          <input
            type="text" 
            placeholder="Search for a document by title or content"
            onChange={e => setBody(e.target.value)}
          />
          <button className="submitModule"> submit </button> 
        </form>
      ) 
    default:
      return(
        <span>{props.modules.length}</span>
      )
  }
}



export default EditDocument;
