import React from 'react';
import { BaseModule } from './BaseModule';

export class ImageModule extends BaseModule{
  constructor(body){
    super(body)
  }

  render(index){
    return(
      <img key={index} src={this.body} 
        style={{
          maxWidth:"80vw",
          maxHeight: "60vh",
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}/>
    )
  }
}

