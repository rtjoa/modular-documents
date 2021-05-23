import React from 'react';
import { BaseModule } from './BaseModule';

export class ImageModule extends BaseModule{
  constructor(body){
    super(body)
  }

  render(index){
    return(
      <img key={index} src={this.body}/>
    )
  }
}

