import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router'
import { TextModule } from './modules/TextModule.js';
import { ImageModule } from './modules/ImageModule.js';
import { QuizModule } from './modules/QuizModule.js';
import { TitleModule } from './modules/TitleModule.js';
import { firestore } from '../firebase.js';

import '../styles/EditDocument.scss';
import '../styles/ViewDocument.scss';

const MODULE_TYPES = { text: TextModule, image: ImageModule, quiz: QuizModule, title: TitleModule };

function ViewDocument() {
  let { id } = useParams()

  const [state, setState] = useState({
    DocID: id, 
    modules: [],
  });

  useEffect(() => {
    firestore.collection("Documents").doc(id).get().then((doc) => {
        setState({
          ...state,
          modules: doc.get('data'),
          nextKey: doc.get('data').length,
        })
    }).catch(() => { setState({ status: 404 }) })
  }, [])
  
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

  function setModuleData(i, data) {
    setState((state) => {
      const modules = state.modules.slice();
      modules[i].data = data;
      return { ...state, modules: modules };
    });
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
      <div className="document">
        {state.modules.map((m, i) => {
          const ModuleComponent = MODULE_TYPES[m.type];
          return (
            <div key={m.key} className="module-wrapper">
              <ModuleComponent
                data={m.data}
                setData={(data) => setModuleData(i, data)}
                tempData={m.tempData}
                setTempData={(tempData) => setModuleTempData(i, tempData)}
                i={i}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ViewDocument;
