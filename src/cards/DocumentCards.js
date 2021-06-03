import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/DocumentCards.scss';


function DocumentCards(props) {
  return (
    <Link to={`/document/${props.url}`}>
      <div className="document-cards-container">
          <h3 className="document-cards-name">{props.name}</h3>
        <img src={props.img} alt={props.name} className="document-cards-image" />
      </div>
    </Link>
  );
}

DocumentCards.propTypes = {
  name: PropTypes.string,
  url: PropTypes.string,
  img: PropTypes.string,
};

export default DocumentCards;