import React from 'react';
import { storage, auth } from '../firebase.js';

import '../styles/ImageModule.scss';

export function ImageModule(props) {
  const storageRef = storage.ref();

  //Editing: When user chooses an image to upload, read it in, and send it to firebase after it has been read
  const onImageChange = (e) => {
    const reader = new FileReader();
    let file = e.target.files[0]; 
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          uploadToFirebase(file);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  //Editing: Uploads to firebase storage using their .put() function. 
  //Also gets the downloard url at the same time, so that src can be set and the image can be rendered.
  async function uploadToFirebase(image) {
    try {
      props.setTempData({uploading: true});
      const fileName = (auth.currentUser && auth.currentUser.uid) + '-' + image.name;
      const snapshot = await storageRef.child(fileName).put(image);
      const downloadURL = await snapshot.ref.getDownloadURL();
      props.setData({src: downloadURL});
      props.doneEditing();
    } catch(error) {
      console.log(error);
      alert("An error occurred while uploading.");
    } finally {
      props.setTempData({uploading: false});
    }
  }

  //If editing, render the upload button / the uploading message
  if (props.editing) {
    return (
      <div className="image-upload-wrapper">
        <input type="file" accept="image/x-png,image/jpeg" onChange={onImageChange}/>
        {props.tempData.uploading && <span>Uploading...</span>}
      </div>
    );
  } else {
    //If viewing, render the image, or noImage if there is no src.
    return (
      <div className="image-module">
        <img src={props.data.src || '/noImage.png'}></img>
      </div>
    );
  }
}

ImageModule.initData = {src: ''};
ImageModule.initTempData = {uploading: false};
ImageModule.moduleName = 'Image';