import React, { useState } from 'react';
import { TextModule } from './modules/TextModule.js';
import { ImageModule } from './modules/ImageModule.js';
import { QuizModule } from './modules/QuizModule.js';
import { firestore } from '../firebase.js';

import '../styles/EditDocument.scss';

const MODULE_TYPES = { text: TextModule, image: ImageModule, quiz: QuizModule };

function ViewDocument() {
  const [state, setState] = useState({
    DocID: window.location.pathname.split("/")[2], 
    title: "new document",
    modules: [],
    nextKey: 0,
  });


  firestore.collection("Documents").doc(state.DocID).get().then(function(doc) {
    setState({
      ...state,
      modules: doc.get('data')
    })
  })

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

  return (
    <div className="edit-document-page">
      <div className="document">
        {state.modules.map((m, i) => {
          const ModuleComponent = MODULE_TYPES[m.type];
          return (
            <div key={m.key} className="module-wrapper"
            >
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
