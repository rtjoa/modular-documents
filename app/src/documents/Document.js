import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router'
import PropTypes from 'prop-types';
import { firestore, auth } from '../firebase.js';

import { TextModule } from './modules/TextModule.js';
import { ImageModule } from './modules/ImageModule.js';
import { QuizModule } from './modules/QuizModule.js';
import { TitleModule } from './modules/TitleModule.js';
import { createDoc } from './MyDocuments.js';

import '../styles/Document.scss';

const MODULE_TYPES = Object.freeze({
  text: TextModule,
  image: ImageModule,
  quiz: QuizModule,
  title: TitleModule,
});

const STATUSES = Object.freeze({
  ok: 0,
  loading: 1,
  not_found: 2,
  unknown_error: 3,
});

const capitalizeWord = (word) =>
  word ? word[0].toUpperCase() + word.substr(1) : '';
const capitalizeWords = (s) => s.split(' ').map(capitalizeWord).join(' ');

function Document () {
  const { id } = useParams();
  const history = useHistory();
  const [state, setState] = useState({
    DocID: id, 
    modules: [],
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
    if (i === 0 || i === 1) return;

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
    if (i === 0) return

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
      title: state.modules[0].data,
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
      return <div>Loading</div>;
    case STATUSES.not_found:
      return <div>Sorry, the document you have requested does not exist.</div>;
    case STATUSES.unknown_error:
      return <div>Error loading document. See console for details.</div>;
    default:
      if(state.modules.length === 0)
        addModule('title');
      break;
  }


  return (
    <div className="document-page">
      <div className="toolbar">
        {state.editing &&
          <>
            <span className="toolbar-group">
                <AddModuleButton type={'text'} addModule={addModule}/>
                <AddModuleButton type={'image'} addModule={addModule} />
                <AddModuleButton type={'quiz'} addModule={addModule} />
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
      <div className="document">
        {state.modules.map((m, i) => {
          const ModuleComponent = MODULE_TYPES[m.type];
          return (
            <div key={m.key} className="module-container">
              <div
                className="module-wrapper"
                onDoubleClick = {() => startEditingModule(i)}
              >
                <ModuleComponent
                  data={m.data}
                  setData={(data) => setModuleData(i, data)}
                  tempData={m.tempData}
                  setTempData={(tempData) => setModuleTempData(i, tempData)}
                  editing={m.editing}
                  setEditing={(editing) => setModuleEditing(i, editing)}
                  i={i}
                />
              </div>
              {m.editing &&
                <div className="module-buttons">
                  <button className="module-toggle-edit-button" onClick={() => setModuleEditing(i, false)}>
                    Done
                  </button>
                  {i != 0 &&
                    [
                      <button onClick={() => moveModuleUp(i)} disabled={i == 1} key={1}>&uarr;</button>,
                      <button onClick={() => moveModuleDown(i)} disabled={i == state.modules.length-1} key={2}>&darr;</button>,
                      <button onClick={() => deleteModule(i)} key={3}>&#10005;</button>,
                    ]
                  }
                </div>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddModuleButton(props) {
  return (
    <button
      className="toolbar-button"
      onClick={() => props.addModule(props.type)}
    >
      + {capitalizeWords(props.type)}
    </button>
  );
}

AddModuleButton.propTypes = {
  type: PropTypes.string,
  addModule: PropTypes.func,
};

export default Document;
