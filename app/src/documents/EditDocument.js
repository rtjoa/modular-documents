import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup'
import ImageUploader from 'react-images-upload'
import { useParams } from 'react-router';

import { ShowModules } from './ShowModules.js';
import { TextModule } from './modules/TextModule.js'
import { ImageModule } from './modules/ImageModule.js'

import './EditDocument.css';

//TODO: Split a lot of this stuff up into its own files.
//Figure out the class structure and design of modules (skeleton somewhat exists)
//Figure out how to store and render each module

function EditDocument() {
  let { id } = useParams();

  return (
    <div>
      <div>
        here's the document
      </div>
      <ViewDocument/>
    </div>
  );
}


function ViewDocument()
{
  const [modules, setModules] = useState([])
  return (
    <div className="documentModules">
    <ShowModules modules={modules}/>
    <AddModulePopupMenu modules={modules} setModules={setModules}/>
    </div>
  )
}


//Popup that appears in the middle of the screen when user requests to add a module
function AddModulePopupMenu(props){
  return(
    <div className="addModulePopup">
      <Popup
        trigger={open => (
          <button className="addModuleButton">Add Module</button>
        )}
        modal
        nested
      >
        <div className="module-popup">
          <span> Choose a module type: </span>
          <ol>
            <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='Text'/> </li>
            <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='Image'/> </li>
            {/* <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='3'/> </li>
            <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='4'/> </li>
            <li> <AddModulePopup modules={props.modules} setModules={props.setModules} type='5'/> </li> */}
          </ol>
        </div>
      </Popup>
    </div>
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
  const [body, setBody] = useState(null)
 
  function handleSubmit(e){
    e.preventDefault()
    props.setModules([...props.modules, new TextModule(body)])
  }

  function uploadImage(image) {
    const temp = URL.createObjectURL(new Blob(image));
    setBody(temp)
    console.log(body)
    console.log(temp)
    props.setModules([...props.modules, new ImageModule(temp)])
  }
  
  switch(props.type){
    case 'Text':
      return(  
        <form onSubmit={e => handleSubmit(e)}>
          <input
            type="text" 
            placeholder="Copy-Paste Suggested"
            onChange={e => setBody(e.target.value)}
          />
          <button className="submitModule"> submit </button> 
        </form>
      ) 
      case 'Image':
        return (
          <ImageUploader
                withIcon={true}
                buttonText='Choose Image'
                onChange={uploadImage}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                singleImage={true}
                label=""
            />
        )
    default:
      return(
        <span>{props.modules.length}</span>
      )
  }
}



export default EditDocument;
