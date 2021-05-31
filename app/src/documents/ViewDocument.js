import { React } from 'react';

// import { TextModule } from './modules/TextModule.js';
// import { ImageModule } from './modules/ImageModule.js';
// import { QuizModule } from './modules/QuizModule.js';

import '../styles/EditDocument.scss';

// const MODULE_TYPES = { text: TextModule, image: ImageModule, quiz: QuizModule };

function ViewDocument() {
  return (
    <div className="document">
    {/* {state.modules.map((m, i) => {
      const ModuleComponent = MODULE_TYPES[m.type];
      return (
        <div key={m.key} className="module-wrapper">
          <ModuleComponent
            data={m.data}
            setData={(data) => setModuleData(i, data)}
            i={i}
          />
        </div>
      );
    })} */}
  </div>
  )
}

export default ViewDocument;
