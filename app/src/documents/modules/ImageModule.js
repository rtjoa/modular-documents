import React from 'react';
import { BaseModule } from './BaseModule';
import ImageUploader from 'react-images-upload'

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

  uploadImage(image,updateCallback){
    super.editing=false;
    this.href = URL.createObjectURL(new Blob(image));
    updateCallback(this);
  }

  renderEdit(updateCallback){
    return(
      <ImageUploader
        withIcon={true}
        buttonText='Choose Image'
        onChange={(image) => this.uploadImage(image, updateCallback)}
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
        singleImage={true}
        label=""
      />
    )
  }
}

