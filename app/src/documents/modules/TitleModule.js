import React from 'react';

export function TitleModule(props) {
  const onTextChange = (event) => {
    // if(event.target.value !== "")
      props.setData({ title: event.target.value });
    // else
    //   props.setData({ text: " " });
  };

  if (props.editing) {
    return (
      <div className="title-module-edit">
        <textarea placeholder="Enter title here" onChange={onTextChange} value={props.data.title}></textarea>
      </div>
    );
  } else {
    return (
      <div className="title-module-view">
        {props.data.title.split('\n').map((line, i) => (
          <div key={i}>{props.data.title.trim() ? line : <EmptyText/>}</div>
        ))}
      </div>
    );
  }
}

function EmptyText(){
  return(
    <div>Double click to set your title!</div>
  )
}

TitleModule.initData = { title: '' };
TitleModule.initTempData = null;
TitleModule.moduleName = 'Title';
