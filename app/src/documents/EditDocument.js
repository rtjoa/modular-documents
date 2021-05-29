import React, { useState } from 'react';
import { TextModule } from './modules/TextModule.js';
import { ImageModule } from './modules/ImageModule.js';
import PropTypes from 'prop-types';
import { firestore } from '../firebase.js';
import { auth } from '../firebase.js'

import '../styles/EditDocument.scss';
var user = auth.currentUser;

const MODULE_TYPES = { text: TextModule, image: ImageModule };
const capitalizeWord = (word) =>
  word ? word[0].toUpperCase() + word.substr(1) : '';
const capitalizeWords = (s) => s.split(' ').map(capitalizeWord).join(' ');

function EditDocument() {
  const [state, setState] = useState({
    modules: [],
    nextKey: 0,
    DocId: "Test Doc", //change this to be variable 
  });

  function addModule(type) {
    setState((state) => {
      const modules = state.modules.slice();
      modules.push({
        type: type,
        data: MODULE_TYPES[type].initData,
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
      return { ...state, modules: modules };
    });
  }

  function setModuleData(i, data) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].data = data;
      return { ...state, modules: modules };
    });
  }

  function sendToDatabase() {
    var Token = user.uid;
    firestore.collection("Documents").doc(state.DocId).set({DocOwner: Token, data: state.modules, view: 0, url_code: "XXXXXXXX"});
  }

  //the added button should probably be changed to some kind of timer
  return (
    <div className="edit-document-page">
      <div className="toolbar">
        <span className="toolbar-group">
          <AddModuleButton type={'text'} addModule={addModule} />
          <AddModuleButton type={'image'} addModule={addModule} />
          <button onClick={sendToDatabase} />
        </span>
      </div>
      <div className="document">
        {state.modules.map((m, i) => {
          const ModuleComponent = MODULE_TYPES[m.type];
          return (
            <div key={m.key} className="module-wrapper">
              <ModuleComponent
                data={m.data}
                setData={(data) => setModuleData(i, data)}
                editing={m.editing}
                setEditing={(editing) => setModuleEditing(i, editing)}
              />
              <div className="module-buttons">
                <button onClick={() => setModuleEditing(i, !m.editing)}>
                  {m.editing ? 'Done' : 'Edit'}
                </button>
                <button onClick={() => moveModuleUp(i)}>&uarr;</button>
                <button onClick={() => moveModuleDown(i)}>&darr;</button>
                <button onClick={() => deleteModule(i)}>x</button>
              </div>
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

export default EditDocument;
