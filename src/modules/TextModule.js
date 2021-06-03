import React from 'react';
import ReactMarkdown from 'react-markdown'
const gfm = require('remark-gfm');

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
        { props.data.text.trim() ? props.data.text.split('\n').map((line, i) => (
          <ReactMarkdown remarkPlugins={[gfm]} key={i}>{line}</ReactMarkdown>
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
