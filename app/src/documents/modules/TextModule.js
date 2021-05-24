import React from 'react';
import { BaseModule } from './BaseModule';

export class TextModule extends BaseModule{
  constructor(body){
    super(body)
    this.lines = []
    var temp = ""
    for(var i = 0; i < this.body.length; i++){
      if(this.body.charCodeAt(i) === 10){
        this.lines.push(temp)
        temp = ""
      }else{
        temp += this.body[i]
      }
    }
  }

  render(index){
    return(        
      <div key={index}> 
        {this.lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    )
  }
}

