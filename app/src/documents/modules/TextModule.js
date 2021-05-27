import React from 'react';

export function TextModule(props) {
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
        {props.data.text.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>
    );
  }
}

TextModule.initData = { text: 'Click "Edit" to change this text' };
TextModule.moduleName = 'Text';
