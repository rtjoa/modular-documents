import React from 'react';
var Latex = require('react-latex');
// import Latex from 'react-latex-next';
import '../styles/LatexModule.scss';

export function LatexModule(props) {  
    const onTextChange = (event) => {
      props.setData({ text: event.target.value });
  };

  if (props.editing) {
    return (
      <div className="text-module-edit">
        <textarea onChange={onTextChange} value={props.data.text}></textarea>
      </div>
    );
  } else {
    return (
      <div className="text-module-view">
        { props.data.text.trim() ? props.data.text.split('\n').map((line, i) => (
        <div key={i}> 
                <Latex displayMode={true}>{line}</Latex>
        </div>
        )) : <EmptyText/> }
      </div>
    );
  }
}

function EmptyText(){
  return(
    <div>Double-click to edit this Latex</div>
  )
}

LatexModule.initData = { text: '' };
LatexModule.initTempData = null;
LatexModule.moduleName = 'Latex';
