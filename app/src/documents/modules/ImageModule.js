import React from 'react';
import { BaseModule } from './BaseModule';

import './modules.scss';
export class ImageModule extends BaseModule {
  static moduleName = "Image";

  constructor(){
    super();
    this.href = "/noImage.png";
  }

  renderView(){
    return(
      <div className='image-module'>
        <img src={this.href} />
      </div>
    );
  }
}

