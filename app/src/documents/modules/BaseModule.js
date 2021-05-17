import React from 'react';

export class BaseModule{
  constructor(body){
    this.body = body;
  }

  getBody(){
    return this.body
  }

  setBody(other){
   this.body = other
  }

  render(index){
      throw new Error("Abstract function not implemented")
  }
}

