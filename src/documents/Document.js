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
import { createDoc } from './MyDocuments.js';

import '../styles/Document.scss';

const MODULE_TYPES = Object.freeze({
  text: TextModule,
  image: ImageModule,
  multipleChoice: MultipleChoiceModule,
  latex: LatexModule,
});

const STATUSES = Object.freeze({
  ok: 0,
  loading: 1,
  not_found: 2,
  unknown_error: 3,
});

function Document(props) {
  const id = props.id || props.match.params.id;
  const history = useHistory();
  const [state, setState] = useState({
    DocID: id, 
    modules: [],
    title: "",
    nextKey: 0,
    status: STATUSES.loading,
    editing: false,
  });

  useEffect(() => {
    const fetchDoc = async () => {
      await firestore.collection("Documents").doc(id).get().then(doc => {
        if (doc.exists) {
          let modules = doc.get('data');
          for (let i = 0; i < modules.length; i++) {
            modules[i].tempData = MODULE_TYPES[modules[i].type].initTempData;
            modules[i].editing = false;
            modules[i].key = i;
          }
          setState({
            ...state,
            modules: modules,
            nextKey: modules.length,
            status: STATUSES.ok,
            editing: auth.currentUser && doc.get('DocOwner') === auth.currentUser.uid,
            title: doc.get('title'),
          });
        } else {
          setState({
            ...state,
            status: STATUSES.not_found,
          });
        }
      }).catch((error) => {
        console.log(error);
        setState({
          ...state,
          status: STATUSES.unknown_error,
        });
      });
    };
    fetchDoc();
  }, [id, auth.currentUser]);

  function addModule(type) {
    setState((state) => {
      const modules = state.modules.slice();
      modules.push({
        type: type,
        data: MODULE_TYPES[type].initData,
        tempData: MODULE_TYPES[type].initTempData,
        key: state.nextKey,
        editing: true,
      });
      return {
        ...state,
        modules: modules,
        nextKey: state.nextKey + 1,
      };
    });
  }

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

  function moveModuleDown(i) {
    setState((state) => {
      if (i === state.modules.length - 1) return state;

      const modules = state.modules.slice();
      modules[i + 1] = state.modules[i];
      modules[i] = state.modules[i + 1];
      return { ...state, modules: modules };
    });
  }

  function deleteModule(i) {
    setState((state) => {
      const modules = state.modules.slice();
      modules.splice(i, 1);
      return { ...state, modules: modules };
    });
  }

  function setModuleEditing(i, editing) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].editing = editing;
      // Reset tempData
      modules[i].tempData = MODULE_TYPES[modules[i].type].initTempData;

      return { ...state, modules: modules };
    });
  }

  function startEditingModule(i) {
    if (state.editing) {
      setModuleEditing(i, true);
    } else {
      alert("You do not have permission to edit this document."
        + " Click \"Make a copy\" to get an editable version");
    }
  }

  function setModuleData(i, data) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].data = data;
      return { ...state, modules: modules };
    });
  }

  function promptTitle() {
    const newTitle = prompt("Set document title:", state.title);
    setState((state) => ({ ...state, title: newTitle }));
  }

  function sendToDatabase() {
    console.log("Attemping to save...")

    if (!state.editing) { // TODO: validate this server-side
      console.log("Save failed: not document owner");
      return;
    }

    if (state.status !== STATUSES.ok) {
      console.log("Save failed: status is " + state.status);
      return;
    }
    
    firestore.collection("Documents").doc(state.DocID).update({
      title: state.title,
      data: state.modules,
      view: 0,
    });
    console.log("Save successful!");
  }

  //the added button should probably be changed to some kind of timer
  function setModuleTempData(i, tempData) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].tempData = tempData;
      return { ...state, modules: modules };
    });
  }

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

  switch(state.status){
    case STATUSES.loading:
      return <div className="user-message">Loading</div>;
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
            </span>
            <span className="toolbar-group">
                <button className="toolbar-button" onClick={sendToDatabase}>Save</button>
            </span>
          </>}
        <span className="toolbar-group">
          <button className="toolbar-button" onClick={() => createDoc(history, state.modules)}>Make a Copy</button>
        </span>
        {state.editing && <span className="toolbar-group">
          <button className="toolbar-button" onClick={() => deleteDoc()}>Delete Document</button>
        </span>}
      </div>
      <div className="document-container">
        <div className="document">
          {state.modules.length ?
            state.modules.map((m, i) => {
              const ModuleComponent = MODULE_TYPES[m.type];
              const className = 'module-container '
                + (m.editing ? 'module-container-edit' : 'module-container-view');
              return (
                <div key={m.key} className={className}>
                  <div className="module-wrapper">
                    <DoubleClickOrTapWrapper onDoubleClickOrTap={() => startEditingModule(i)}>
                      <ModuleComponent
                        data={m.data}
                        setData={(data) => setModuleData(i, data)}
                        tempData={m.tempData}
                        setTempData={(tempData) => setModuleTempData(i, tempData)}
                        editing={m.editing}
                        setEditing={(editing) => setModuleEditing(i, editing)}
                        i={i}
                      />
                    </DoubleClickOrTapWrapper>
                  </div>
                  {m.editing &&
                    <div className="module-buttons">
                      <button className="module-toggle-edit-button" onClick={() => setModuleEditing(i, false)}>
                        Done
                      </button>
                      <button onClick={() => moveModuleUp(i)} disabled={i === 0}>&uarr;</button>
                      <button onClick={() => moveModuleDown(i)} disabled={i === state.modules.length-1}>&darr;</button>
                      <button onClick={() => deleteModule(i)}>&#10005;</button>
                    </div>
                  }
                </div>
              );
            })
            : <div className="empty-document">
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
