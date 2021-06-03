import React from 'react';
var Latex = require('react-latex');
// import Latex from 'react-latex-next';
import '../styles/LatexModule.scss';

export function LatexModule(props) {  
  const onTextChange = (event) => {
    props.setData({
      ...props.data,
      text: event.target.value
    });
  };

  const onInlineCheckboxChange = (event) => {
    props.setData({
      ...props.data,
      inline: event.target.checked
    });
  };

  if (props.editing) {
    const boxId = `latex-module-edit-${props.i}-box`;
    return (
      <div className="latex-module-edit">
        <textarea
          onChange={onTextChange}
          value={props.data.text}
          placeholder={"Type something like: $x^2 + y^2 = 1$"}
        />
        <input
          id={boxId}
          type="checkbox"
          onChange={onInlineCheckboxChange}
          checked={props.data.inline}
        />
        <label htmlFor={boxId}>Inline</label>
      </div>
    );
  } else {
    return (
      <div className="latex-module-view">
        { props.data.text.trim() ? props.data.text.split('\n').map((line, i) => (
        <div key={i}> 
          <Latex
            displayMode={!props.data.inline}
            throwOnError={false}
          >
              {line}
          </Latex>
        </div>
        )) : <EmptyText/> }
      </div>
    );
  }
}

function EmptyText(){
  return(
    <div>Double-click to edit this LaTeX</div>
  )
}

LatexModule.initData = { text: '', inline: false };
LatexModule.initTempData = null;
LatexModule.moduleName = 'LaTeX';
