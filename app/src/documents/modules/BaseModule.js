import React from 'react';

export class BaseModule {
  constructor(){
    this.editing = false;
  }

  renderView(){
      throw new Error("Abstract function not implemented")
  }

  renderEdit(){
      throw new Error("Abstract function not implemented")
  }

  render(updateCallback) {
    if (this.editing) {
      return this.renderEdit(updateCallback);
    } else {
      return this.renderView(updateCallback);
    }
  }

  toJSON(){
      throw new Error("Abstract function not implemented")
  }

  fromJSON(){
      throw new Error("Abstract function not implemented")
  }
}