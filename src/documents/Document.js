import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router'
import PropTypes from 'prop-types';
import { firestore, auth } from '../firebase.js';
import { useDoubleTap } from 'use-double-tap';
import { isMobile } from 'react-device-detect';

import { TextModule } from '../modules/TextModule.js';
import { ImageModule } from '../modules/ImageModule';
import { MultipleChoiceModule } from '../modules/MultipleChoiceModule.js';
import { LatexModule } from '../modules/LatexModule.js';
import { CodeModule } from '../modules/CodeModule.js';
import { UnknownTypeModule } from '../modules/UnknownTypeModule.js';
import { createDoc } from './MyDocuments.js';
import {ErrorBoundary} from 'react-error-boundary'

import '../styles/Document.scss';

const MODULE_TYPES = Object.freeze({
  text: TextModule,
  image: ImageModule,
  multipleChoice: MultipleChoiceModule,
  latex: LatexModule,
  code: CodeModule,
});

const STATUSES = Object.freeze({
  ok: 0,
  loading: 1,
  not_found: 2,
  unknown_error: 3,
});

// Document component displays and holds modules for a document
function Document(props) {
  // Document id can be passed from either props or URL params; prioritizes props
  const paramsId = props.match && props.match.params && props.match.params.id;
  const id = props.id || paramsId;

  const history = useHistory();
  const [state, setState] = useState({
    modules: [],
    title: "",
    nextKey: 0,
    status: STATUSES.loading,
    moduleEditing: null,
  });

  // Fetch the document corresponding to the given id
  useEffect(() => {
    const fetchDoc = async () => {
      await firestore.collection("Documents").doc(id).get().then(doc => {
        if (doc.exists) {
          let modules = doc.get('data');

          // Initialize temporary data and key for each module
          for (let i = 0; i < modules.length; i++) {
            modules[i].tempData = (MODULE_TYPES[modules[i].type] || UnknownTypeModule).initTempData;
            modules[i].key = i;
          }

          setState({
            ...state,
            modules: modules,
            nextKey: modules.length,
            status: STATUSES.ok,
            editing: auth.currentUser && doc.get('owner') === auth.currentUser.uid,
            title: doc.get('title'),
            moduleEditing: null,
          });
        } else { // doc does not exist
          setState({
            ...state,
            status: STATUSES.not_found,
          });
        }
      }).catch((error) => { // .get() fails
        console.log(error);
        setState({
          ...state,
          status: STATUSES.unknown_error,
        });
      });
    };
    fetchDoc();
  }, [id, auth.currentUser]); // Re-fetch if the id or user changes

  // Set page title
  useEffect(() => {
    document.title = (state.title || 'Untitled Document') + ' - Modular Documents';
  }, [state.title]);

  // Append a module of the specified to the end of the document
  function addModule(type) {
    setState((state) => {
      const modules = state.modules.slice();
      modules.push({
        type: type,
        data: MODULE_TYPES[type].initData,
        tempData: MODULE_TYPES[type].initTempData,
        key: state.nextKey,
      });
      return {
        ...state,
        modules: modules,
        nextKey: state.nextKey + 1,
        moduleEditing: state.nextKey
      };
    });
  }

  // Move the ith module up, if it's not at the top
  function moveModuleUp(i) {
    if (i === 0) return;

    setState((state) => {
      const modules = state.modules.slice();
      modules[i - 1] = state.modules[i];
      modules[i] = state.modules[i - 1];
      return {
        ...state,
        modules: modules,
      };
    });
  }

  // Move the ith module down, if it's not at the bottom
  function moveModuleDown(i) {
    setState((state) => {
      if (i === state.modules.length - 1) return state;

      const modules = state.modules.slice();
      modules[i + 1] = state.modules[i];
      modules[i] = state.modules[i + 1];
      return { ...state, modules: modules };
    });
  }

  // Delete the ith module
  function deleteModule(i) {
    setState((state) => {
      const modules = state.modules.slice();
      modules.splice(i, 1);
      return { ...state, modules: modules };
    });
  }

  // Set the currently-edited module to given index
  function setModuleEditing(i) {
    setState((state) => {
      const modules = state.modules.slice();

      // Reset tempData of previously-editing module
      if (state.moduleEditing !== null) {
        const activeModule = modules[state.moduleEditing];
        const activeModuleType =(MODULE_TYPES[activeModule.type] || UnknownTypeModule);
        activeModule.tempData = activeModuleType.initTempData;
      }

      // Update state
      return { ...state, modules: modules, moduleEditing: i};
    });
  }

  // Stop editing the currently-editing module
  function doneEditing() {
    setModuleEditing(null);
  }

  // Start editing the module at index i
  function startEditingModule(i) {
    if (state.editing) {
      setModuleEditing(i);
    } else {
      alert("You do not have permission to edit this document."
        + " Click \"Make a copy\" to get an editable version");
    }
  }

  // Set the encapsulated data of the ith module
  // Used to generate setData callbacks for each module
  function setModuleData(i, data) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].data = data;
      return { ...state, modules: modules };
    });
  }

  // Set the encapsulated temporary data of the ith module. Temp data is not
  // saved, and reset whenever we finish editing a module. The below function is
  // used to generate setData callbacks for each module.
  function setModuleTempData(i, tempData) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].tempData = tempData;
      return { ...state, modules: modules };
    });
  }

  // Prompt the user to set a new title
  function promptTitle() {
    const newTitle = prompt("Set document title:", state.title);
    if (newTitle === null) return;
    setState((state) => ({ ...state, title: newTitle }));
  }

  // Save the document to the database
  function sendToDatabase() {
    console.log("Attemping to save...")

    if (state.status !== STATUSES.ok) {
      console.log("Save failed: status is " + state.status);
      return;
    }
    
    const title = state.title || "Untitled Document";

    firestore.collection("Documents").doc(id).update({
      title: title,
      lowercaseTitle: title.toLowerCase(),
      data: state.modules,
    }).then(() => {
      console.log("Save successful!");
    }).catch((error) => {
      switch (error.code) {
        case 'permission-denied':
          alert("Save failed: permission denied.");
          break;
        default:
          console.log(error);
          alert("Save failed. Error: " + console.log(error.code));
          break;
      }
    });
  }

  // Delete the current document.
  async function deleteDoc(){
    if(state.editing){
      if(confirm("Are you sure you want to delete?")){
        await firestore.collection("Documents").doc(id).delete().then(() => {
          console.log("Document successfully deleted.")
          history.push("/")
        }).catch(() => {
          console.log("Error deleting document.")
        });
      }else{
        console.log("Delete cancelled by user.")
      }
    }else{
      alert("You can't delete a document you don't own!")
    }
  }

  // Handle non-ok statuses
  switch(state.status){
    case STATUSES.loading:
      return(
        <div className="loading-wrapper">
          <div className="loader"></div> 
          <div className="user-message">Loading</div>
        </div>
      ) 
    case STATUSES.not_found:
      return <div className="user-message">Sorry, the document you have requested does not exist.</div>;
    case STATUSES.unknown_error:
      return <div className="user-message"> Error loading document. See console for details.</div>;
  }

  return (
    <div className={`document-page ${state.editing?'document-page-editing':''}`}>
      <div className="toolbar">
        <span className="title" onClick={state.editing?promptTitle:null}>
          {state.title || "Untitled Document"}
        </span>
        {state.editing &&
          <>
            <span className="toolbar-group">
                <AddModuleButton type={'text'} addModule={addModule}/>
                <AddModuleButton type={'image'} addModule={addModule} />
                <AddModuleButton type={'multipleChoice'} addModule={addModule} />
                <AddModuleButton type={'latex'} addModule={addModule} />
                <AddModuleButton type={'code'} addModule={addModule} />
            </span>
            <span className="toolbar-group">
                <button className="toolbar-button" onClick={sendToDatabase}>Save</button>
            </span>
          </>}
        <span className="toolbar-group">
          <button
            className="toolbar-button"
            onClick={() => createDoc(history, "Copy of " + state.title, state.modules)}>
            Make a Copy
          </button>
        </span>
        {state.editing && <span className="toolbar-group">
          <button className="toolbar-button" onClick={() => deleteDoc()}>Delete Document</button>
        </span>}
      </div>
      <div className="document-container">
        <div className="document">
          {state.modules.length ?
            state.modules.map((m, i) => {
              const ModuleComponent = (MODULE_TYPES[state.modules[i].type] || UnknownTypeModule);
              const className = 'module-container '
                + ( (state.moduleEditing===m.key) ? 'module-container-edit' : 'module-container-view');
              return (
                <div key={m.key} className={className}>
                  <div className="module-wrapper">
                    <DoubleClickOrTapWrapper onDoubleClickOrTap={() => startEditingModule(i)}>
                      <ErrorBoundary
                        fallbackRender={() => 
                          <div className="module-error">
                            Error when rendering module of type &ldquo;{m.type}.&rdquo;
                          </div>}
                        resetKeys={[JSON.stringify(m)]}
                      >
                        <ModuleComponent
                          data={m.data}
                          setData={(data) => setModuleData(i, data)}
                          tempData={m.tempData}
                          setTempData={(tempData) => setModuleTempData(i, tempData)}
                          editing={m.key == state.moduleEditing}
                          i={i}
                          type={m.type}
                          doneEditing={doneEditing}
                        />
                      </ErrorBoundary>
                    </DoubleClickOrTapWrapper>
                  </div>
                  {state.moduleEditing===m.key &&
                    <div className="module-buttons">
                      <button className="module-toggle-edit-button" onClick={doneEditing}>
                        Done
                      </button>
                      <button onClick={() => moveModuleUp(i)} disabled={i === 0}>&uarr;</button>
                      <button onClick={() => moveModuleDown(i)} disabled={i === state.modules.length-1}>&darr;</button>
                      <button onClick={() => deleteModule(i)}>&#10005;</button>
                    </div>
                  }
                </div>
              );
            }) :
            <div className="empty-document">
              <em>
                Empty document.
                {state.editing && " Add modules with the buttons in the toolbar!"}
              </em>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

Document.propTypes = {
  type: PropTypes.string,
  addModule: PropTypes.func,
  match: PropTypes.shape({
    params: PropTypes.shape({ 
      id: PropTypes.string,
    }),
  }),
  id: PropTypes.string,
};

// Component that appropriately binds a double-click or double-tap listener
// based on the device type
function DoubleClickOrTapWrapper(props) {
  const bind = useDoubleTap(isMobile?props.onDoubleClickOrTap:null);
  return (
    <div {...bind} onDoubleClick={props.onDoubleClickOrTap}>
      {props.children}
    </div>
  );
}

DoubleClickOrTapWrapper.propTypes = {
  children: PropTypes.node,
  onDoubleClickOrTap: PropTypes.func,
};

// Button used to add a new module the specified type to the document
function AddModuleButton(props) {
  return (
    <button
      className="toolbar-button"
      onClick={() => props.addModule(props.type)}
    >
      + {MODULE_TYPES[props.type].moduleName}
    </button>
  );
}

AddModuleButton.propTypes = {
  type: PropTypes.string,
  addModule: PropTypes.func,
};

export default Document;
