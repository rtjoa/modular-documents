import React, { useState } from 'react';
import { useParams } from 'react-router';
import { TextModule } from './modules/TextModule.js'
import { ImageModule } from './modules/ImageModule.js'

import './EditDocument.scss';

const MODULE_TYPES = {text: TextModule, image: ImageModule};

const capitalizeWord = word => word ? word[0].toUpperCase() + word.substr(1) : '';
const capitalizeWords = s => s.split(' ').map(capitalizeWord).join(' ');

function EditDocument() {
  let { id } = useParams();
  const [modules, setModules] = useState([]);

  function addModule(type) {
    setModules(modules => {
      modules = modules.slice();
      modules.push({
        type: type,
        data: MODULE_TYPES[type].initData,
      });
      return modules;
    });
  }
  
  function setModuleEditing(i, editing) {
    setModules(modules => {
      modules = modules.slice();
      modules[i].editing = editing;
      return modules;
    });
  }

  function setModuleData(i, newData) {
    setModules(modules => {
      modules = modules.slice();
      modules[i].data = newData;
      return modules;
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
          {modules.map((m, i) => {
            const ModuleComponent = MODULE_TYPES[m.type];
            return (
              <div key={i} class='module-wrapper'>
                <ModuleComponent
                  data={m.data}
                  setData={data => setModuleData(i, data)}
                  editing={m.editing}
                  setEditing={editing => setModuleEditing(i, editing)}
                />
                <button onClick={() => setModuleEditing(i, !m.editing)}>
                  {m.editing? "Done":"Edit"}
                </button>
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