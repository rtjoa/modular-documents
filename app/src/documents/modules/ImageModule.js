import React, { useState } from 'react';
import { storage } from '../../firebase.js';

export function ImageModule(props) {
  const [image, setImage] = useState(null);
  const storageRef = storage.ref();

  const onImageChange = (e) => {
    console.log(props.data)
    const reader = new FileReader();
    let file = e.target.files[0]; 
    if (file) {
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImage(file);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setImage(null);
    }
    console.log(props.data)
  };

  async function uploadToFirebase(){
    console.log("Upload started")
    if (image) {
      storageRef.child(image.name).put(image).then(() => {
        alert("Image has been uploaded successfully!");
        if(props.data.status === "complete"){
          deleteFromFirebase(props.data.name)
        }
        props.setData({
          ...props.data,
          status: "loading",
          name: image.name,
        })
        getFromFirebase()
      }).catch((error) => {
        alert("An error occurred while uploading the image")
        console.log(error)
      });
    } else {
      alert("Please upload an image first.");
      console.log("Upload failed, no image chosen")
    }
    console.log(props.data)
  }

  async function getFromFirebase(){
    console.log("Request started")
    if(image){
      storageRef.child(image.name).getDownloadURL().then((url) => {
        props.setData({ 
          src: url, 
          status: "complete",
          name: image.name
        });
        console.log("Image retrieval succeeded")
        console.log(props.data)
      }).catch(() => {
        console.log("Error retrieving image");
      });
    }else{
      console.log("Request failed, image is not set")
    }
  }

  async function deleteFromFirebase(name){
    const storageRef = storage.ref();
    const imageRef = storageRef.child(name);
      imageRef.delete().then(() => {
        console.log("Image deleted from database");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (props.editing) {
    return (
      <div className="image-upload-wrapper">
        <input type="file" accept="image/x-png,image/jpeg" onChange={(e) => {onImageChange(e); }}/>
        <button onClick={uploadToFirebase}>Upload Image</button>
      </div>
    );
  } else {
    console.log(props.data)
    return (
      <div className="image-module">
        {props.data.status === "loading" ? "Loading..." : <img src={props.data.src}></img>}
       </div>
    );
  }
}

ImageModule.initData = { src: '/noImage.png', status: "no_image", name: "/noImage.png" };
ImageModule.initTempData = null
ImageModule.moduleName = 'Image';