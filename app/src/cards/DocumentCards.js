import { Link } from 'react-router-dom';
import React from 'react';

import './DocumentCards.css';

/* eslint-disable react/prop-types */

function DocumentCards(props) {
  return (
    <div className="document-cards-container">
      <Link to={`/view/${props.name}`} id="link">
        <h3 className="document-cards-name">{props.name}</h3>
      </Link>
      <img src={props.img} alt={props.name} className="document-cards-image" />
    </div>
  );
}

export default DocumentCards;