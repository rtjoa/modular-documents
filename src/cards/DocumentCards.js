import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/DocumentCards.scss';


function DocumentCard(props) {
  return (
    <Link to={`/document/${props.url}`}>
      <div className="document-card-container">
          <div className="document-card-name-container">
            <h3 className="document-card-name">{props.name}</h3>
          </div>
          <div className="document-card-image-container">
            <img src={props.img} alt={props.name} className="document-card-image" />
          </div>
      </div>
    </Link>
  );
}

DocumentCard.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  img: PropTypes.string,
};

export default DocumentCard;