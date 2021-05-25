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

  render() {
    if (this.editing) {
      return this.renderEdit();
    } else {
      return this.renderView();
    }
  }

  toJSON(){
      throw new Error("Abstract function not implemented")
  }

  fromJSON(){
      throw new Error("Abstract function not implemented")
  }
}