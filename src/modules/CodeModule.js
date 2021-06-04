import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { ghcolors } from 'react-syntax-highlighter/dist/esm/styles/prism';

import '../styles/CodeModule.scss';

const PRISM_LANGUAGE_LIST = "https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/HEAD/AVAILABLE_LANGUAGES_PRISM.MD";

export function CodeModule(props) {
  const onTextChange = (event) => {
      props.setData({ ...props.data, text: event.target.value });
  };

  const onLanguageChange = (event) => {
      props.setData({ ...props.data, language: event.target.value });
  };

  const onLineNumsCheckboxChange = (event) => {
    props.setData({
      ...props.data,
      lineNums: event.target.checked
    });
  };

  if (props.editing) {
    const boxId = `code-module-edit-${props.i}-box`;
    return (
      <div className="code-module-edit">
        <textarea onChange={onTextChange} value={props.data.text}></textarea>
        Language (<a href={PRISM_LANGUAGE_LIST} target='_blank' rel="noreferrer">list</a>): 
        <input className="lang-input" onChange={onLanguageChange} value={props.data.language} />
        
        <input
          className="line-nums-box"
          id={boxId}
          type="checkbox"
          onChange={onLineNumsCheckboxChange}
          checked={props.data.lineNums}
        />
        <label htmlFor={boxId}>Line numbers</label>
      </div>
    );
  } else {
    return (
      <div className={`code-module-view`}>
        <SyntaxHighlighter
          language={props.data.language}
          showLineNumbers={props.data.lineNums}
          style={ghcolors}
        >
          {props.data.text || "Double-click to edit" }
        </SyntaxHighlighter>
      </div>
    );
  }
}

CodeModule.initData = { text: '', language: 'text', lineNums: false };
CodeModule.initTempData = null;
CodeModule.moduleName = 'Code';
