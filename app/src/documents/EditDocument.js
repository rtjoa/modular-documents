import React, { useState } from 'react';
import { useParams } from 'react-router';
import { TextModule } from './modules/TextModule.js'
import { ImageModule } from './modules/ImageModule.js'

import './EditDocument.scss';

const MODULE_TYPES = {text: TextModule, image: ImageModule};

const capitalizeWord = word => word ? word[0].toUpperCase() + word.substr(1) : '';
const capitalizeWords = s => s.split(' ').map(capitalizeWord).join(' ');

function EditDocument() {
  const [state, setState] = useState({
    modules: [],
    nextKey: 0,
  });

  function addModule(type) {
    setState(state => {
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

    setState(state => {
      const modules = state.modules.slice();
      modules[i - 1] = state.modules[i];
      modules[i] = state.modules[i - 1];
      return {
        ...state,
        modules: modules
      };
    });
  }

  function moveModuleDown(i) {
    setState(state => {
      if (i === state.modules.length - 1) return state;

      const modules = state.modules.slice();
      modules[i + 1] = state.modules[i];
      modules[i] = state.modules[i + 1];
      return {...state, modules: modules};
    });
  }

  function setModuleEditing(i, editing) {
    setState(state => {
      const modules = state.modules.slice();
      modules[i].editing = editing;
      return {...state, modules: modules};
    });
  }

  function setModuleData(i, data) {
    setState(state => {
      const modules = state.modules.slice();
      modules[i].data = data;
      return {...state, modules: modules};
    });
  }

  return (
    <div className="edit-document-page">
      <div className="toolbar">
        <span className="toolbar-group">
          <AddModuleButton type={'text'} addModule={addModule} />
          <AddModuleButton type={'image'} addModule={addModule} />
        </span>
      </div>
      <div className="document">
          {state.modules.map((m, i) => {
            const ModuleComponent = MODULE_TYPES[m.type];
            return (
              <div key={m.key} class='module-wrapper'>
                <ModuleComponent
                  data={m.data}
                  setData={data => setModuleData(i, data)}
                  editing={m.editing}
                  setEditing={editing => setModuleEditing(i, editing)}
                />
                <div class='module-buttons'>
                  <button onClick={() => setModuleEditing(i, !m.editing)}>
                    {m.editing? "Done":"Edit"}
                  </button>
                  <button onClick={() => moveModuleUp(i)}>&uarr;</button>
                  <button onClick={() => moveModuleDown(i)}>&darr;</button>
                </div>
              </div> 
            );
          })}
      </div>

    </div>
  )
}

function AddModuleButton(props) {
  return (
    <button className="toolbar-button" onClick={() => props.addModule(props.type)}>
      + {capitalizeWords(props.type)}
    </button>
  );
}

export default EditDocument;