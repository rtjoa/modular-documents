import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Popup from 'reactjs-popup';
import { useParams } from 'react-router';

class TextModule extends React.Component{
  constructor(props){
    super(props)
    this.state={
      body: props.body,
    }
  }

  edit(props){
   this.setState({
    body: props.body
   })
  }


}

export default TextModule
