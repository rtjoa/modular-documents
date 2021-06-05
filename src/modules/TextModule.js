import React from 'react';
import ReactMarkdown from 'react-markdown'
const gfm = require('remark-gfm');

import '../styles/TextModule.scss';

export function TextModule(props) {
  //Editing: user changes text in textbox
  const onTextChange = (event) => {
      props.setData({ ...props.data, text: event.target.value });
  };

  //Editing: user changes the alignment drop-down menu
  const onAlignChange = (event) => {
      props.setData({ ...props.data, align: event.target.value });
  };

  if (props.editing) {
    return (
      <div className="text-module-edit">
        <textarea onChange={onTextChange} value={props.data.text}></textarea>
        Align: <select onChange={onAlignChange} value={props.data.align}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>
    );
  } else {
    return (
      <div className={`text-module-view align-${props.data.align}`}>
        { props.data.text.trim() ? props.data.text.split('\n').map((line, i) => (
          <ReactMarkdown linkTarget="_blank" remarkPlugins={[gfm]} key={i}>{line}</ReactMarkdown>
        )) : <EmptyText/> }
      </div>
    );
  }
}

//EmptyText when user doesn't set the text
function EmptyText(){
  return(
    <div>Double-click to edit this text</div>
  )
}

TextModule.initData = { text: '', align: 'left' };
TextModule.initTempData = null;
TextModule.moduleName = 'Text';
