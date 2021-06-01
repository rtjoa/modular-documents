import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router'
import { TextModule } from './modules/TextModule.js';
import { ImageModule } from './modules/ImageModule.js';
import { QuizModule } from './modules/QuizModule.js';
import { TitleModule } from './modules/TitleModule.js';
import PropTypes from 'prop-types';
import { firestore, auth } from '../firebase.js';

import '../styles/ViewAndEditDocument.scss';

const MODULE_TYPES = { text: TextModule, image: ImageModule, quiz: QuizModule, title: TitleModule };

const capitalizeWord = (word) =>
  word ? word[0].toUpperCase() + word.substr(1) : '';
const capitalizeWords = (s) => s.split(' ').map(capitalizeWord).join(' ');

function EditDocument() {
  let { id } = useParams()
  const [owner, setOwner] = useState("");
  const [state, setState] = useState({
    DocID: id, 
    modules: [],
    nextKey: 0
  });

  useEffect(async () => {
    const doc = await firestore.collection("Documents").doc(id).get().then((doc) => {
        return doc
    }).catch(() => {return null})
    if(doc===null){
      setState( { status: 404 })
    }else{
      setState({
        ...state,
        modules: doc.get('data'),
        nextKey: doc.get('data').length,
      })
      setOwner(doc.get('DocOwner'))
    }
  }, [])

  useEffect(() => {
    var timer = setInterval(sendToDatabase, 30000)
    return () => {clearInterval(timer);}
  })    

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

  function setModuleData(i, data) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].data = data;
      return { ...state, modules: modules };
    });
  }


  function sendToDatabase() {
    console.log("Attemping to save...")
    const TOKEN = auth.currentUser.uid
    if(state.status !== 404 &&  TOKEN === owner){
      firestore.collection("Documents").doc(state.DocID).set({DocOwner: TOKEN, title: state.modules[0].data, data: state.modules, view: 0});
      console.log("Save successful!")
    }else{
      console.log("Save failed!")  
    } 
  }

  //the added button should probably be changed to some kind of timer
  function setModuleTempData(i, tempData) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].tempData = tempData;
      return { ...state, modules: modules };
    });
  }

  if(state.status === 404)
    return <div> Error 404 Page not Found </div>
  if(state.modules.length===0)
    addModule('title');

  return (
    <div className="edit-document-page">
      <div className="toolbar">
        <span className="toolbar-group">
          <AddModuleButton type={'text'} addModule={addModule} />
          <AddModuleButton type={'image'} addModule={addModule} />
          <AddModuleButton type={'quiz'} addModule={addModule} />
          <button onClick={sendToDatabase}>Save </button>
        </span>
      </div>
      <div className="document">
        {state.modules.map((m, i) => {
          const ModuleComponent = MODULE_TYPES[m.type];
          return (
            <div key={m.key} className="module-wrapper"
            onDoubleClick = {() => {
              setModuleEditing(i, !m.editing)
            }}
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
              <div className="module-buttons">
                <button onClick={() => setModuleEditing(i, !m.editing)}>
                  {m.editing ? 'Done' : 'Edit'}
                </button>
                {i != 0 && <div>
                  {i != 1 && <button onClick={() => moveModuleUp(i)}>&uarr;</button>}
                  {i != state.modules.length-1 && <button onClick={() => moveModuleDown(i)}>&darr;</button>}
                  <button onClick={() => deleteModule(i)}>x</button>
                </div>}
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
