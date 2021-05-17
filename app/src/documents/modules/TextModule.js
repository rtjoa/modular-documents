import React from 'react';
import { BaseModule } from './BaseModule';

export class TextModule extends BaseModule{
  constructor(body){
    super(body)
  }

  render(index){
    return(
      <div key={index}>{this.body}</div>
    )
  }
}

