import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup'
import ImageUploader from 'react-images-upload'
import { useParams } from 'react-router';
import { firestore }from "../firebase"

import { ShowModules } from './ShowModules.js';
import { TextModule } from './modules/TextModule.js'
import { ImageModule } from './modules/ImageModule.js'

import './EditDocument.scss';

//TODO: Split a lot of this stuff up into its own files.
//Figure out the class structure and design of modules (skeleton somewhat exists)
//Figure out how to store and render each module



function EditDocument() {
  let { id } = useParams();
  const [modules, setModules] = useState([]);

  function addModule(type) {
    console.log(type);
    const nextModules = modules.slice();
    nextModules.push(new type());
    setModules(nextModules);
  }

  function editModule(i) {
    const nextModules = modules.slice();
    nextModules[i].editing = !nextModules[i].editing;
    setModules(nextModules);
  }

  return (
    <div className="edit-document-page">
      <div className="toolbar">
        <span className="toolbar-group">
          <AddModuleButton type={TextModule} addModule={addModule} />
          <AddModuleButton type={ImageModule} addModule={addModule} />
        </span>
      </div>
      <div className="document">
          {modules.map((m, i) => (
            <div key={i} class='module-wrapper'>
              {m.render()} {m.editing}
              <button onClick={() => editModule(i)}>{m.editing? "View":"Edit"}</button>
            </div>
          ))}
      </div>

    </div>
  )
}

function AddModuleButton(props) {
  return (
    <button className="toolbar-button" onClick={() => props.addModule(props.type)}>+ {props.type.moduleName}</button>
  );
}

// //Handles how input is received based on the type of module requested
// function HandleModuleInput(props){
//   const [body, setBody] = useState(null)
 
//   function handleSubmit(e){
//     e.preventDefault()
//     firestore.collection("Documents").add({
//       Text: "hi",
//     })
//     console.log(typeof(body))
//     props.setModules([...props.modules, new TextModule(body)])
//   }

//   function uploadImage(image) {
//     const temp = URL.createObjectURL(new Blob(image));
//     props.setModules([...props.modules, new ImageModule(temp)])
//   }
  
//   switch(props.type){
//     case 'Text':
//       return(  
//         <form onSubmit={e => handleSubmit(e)}>
//           <textarea
//               onChange={(e)=> setBody(e.target.value)}
//               rows="5"
//               cols="30"
//           />
//           <input type="submit" value="submit"></input> 
//         </form>
//       ) 
//       case 'Image':
//         return (
//           <ImageUploader
//                 withIcon={true}
//                 buttonText='Choose Image'
//                 onChange={uploadImage}
//                 imgExtension={['.jpg', '.gif', '.png', '.gif']}
//                 maxFileSize={5242880}
//                 singleImage={true}
//                 label=""
//             />
//         )
//     default:
//       return(
//         <span>{props.modules.length}</span>
//       )
//   }
// }



export default EditDocument;
