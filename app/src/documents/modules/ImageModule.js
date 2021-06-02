import React, { useState } from 'react';
import { storage } from '../../firebase.js';


export function ImageModule(props) {
  const [image, setImage] = useState(null);
  const storageRef = storage.ref();

  const onImageChange = (e) => {
    const reader = new FileReader();
    let file = e.target.files[0]; 
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          console.log(file);
          setImage(file);
          props.setData({ src: file.name })
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  async function uploadToFirebase(){
    if (image) {
      storageRef.child(image.name).put(image).then(() => {
        alert("Image has been uploaded successfully!");
      }).catch((error) => {
        console.log(error)
      });
    } else {
      alert("Please upload an image first.");
    }
  }

  async function getFromFirebase(){
    console.log("Request started")
    if(image)
      return await storageRef.child(image.name).getDownloadURL().then((url) => {
        return url;
      }).catch(() => {
        console.log("Error retrieving image");
      });
    console.log("request failed")
  }

   /*const deleteFromFirebase = () => {
    const storageRef = storage.ref();
    const imageRef = storageRef.child(props.data.src);
      imageRef.delete().then(() => {
        console.log("Image deleted from database");
      })
      .catch((err) => {
        console.log(err);
      });
  }; */

  if (props.editing) {
    return (
      <div className="image-upload-wrapper">
        <input type="file" accept="image/x-png,image/jpeg" onChange={(e) => {onImageChange(e); }}/>
        <button onClick={uploadToFirebase}>Upload Image</button>
        <button onClick={() => getFromFirebase()}>
            Get image for display
        </button>
      </div>
    );
  } else {
    return (
      <div className="image-module">
        <img src={getFromFirebase()}></img>
       </div>
    );
  }
}

ImageModule.initData = { src: '/noImage.png' };
ImageModule.initTempData = null
ImageModule.moduleName = 'Image';