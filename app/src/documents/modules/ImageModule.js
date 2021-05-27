import React from 'react';
import ImageUploader from 'react-images-upload';

export function ImageModule(props) {
  const onImageUpload = (image) => {
    props.setEditing(false);
    props.setData({ src: URL.createObjectURL(new Blob(image)) });
  };

  if (props.editing) {
    return (
      <ImageUploader
        withIcon={true}
        buttonText="Choose Image"
        onChange={onImageUpload}
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
        singleImage={true}
        label=""
      />
    );
  } else {
    return (
      <div className="image-module">
        <img src={props.data.src} />
      </div>
    );
  }
}

ImageModule.initData = { src: '/noImage.png' };
ImageModule.moduleName = 'Image';
