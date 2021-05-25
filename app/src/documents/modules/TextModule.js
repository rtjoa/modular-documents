import React from 'react';
import { BaseModule } from './BaseModule';
export class TextModule extends BaseModule {
  static moduleName = "Text";

  constructor(){
    super();
    this.text = "Click \"Edit\" to change this text";
  }

  renderView(){
    return(
      <div className='text-module-view'>
        {this.text.split('\n').map(line => 
          <div>{line}</div>
        )}
      </div>
    )
  }

  onTextChange(event, updateCallback) {
    this.text = event.target.value;
    updateCallback(this);
  }

  renderEdit(updateCallback) {
    return(
      <div className='text-module-edit'>
        <textarea onChange={(event) => this.onTextChange(event, updateCallback)} value={this.text}></textarea>
      </div>
    )
  }
}

