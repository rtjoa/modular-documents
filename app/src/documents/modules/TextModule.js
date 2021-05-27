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
        {props.data.text.split('\n').map((line, i) => (
          <div key={i}>{line.trim() ? line : <EmptyText/>}</div>
        ))}
      </div>
    );
  }
}

function EmptyText(){
  return(
    <div>Click &quot;Edit&quot; to change this text</div>
  )
}

TextModule.initData = { text: '' };
TextModule.moduleName = 'Text';
