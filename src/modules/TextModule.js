import React from 'react';

export function TextModule(props) {
  const onTextChange = (event) => {
    // if(event.target.value !== "")
      props.setData({ text: event.target.value });
    // else
    //   props.setData({ text: " " });
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
          <div key={i}>{line}</div>
        )) : <EmptyText/> }
      </div>
    );
  }
}

function EmptyText(){
  return(
    <div>Double-click to edit this text</div>
  )
}

TextModule.initData = { text: '' };
TextModule.initTempData = null;
TextModule.moduleName = 'Text';