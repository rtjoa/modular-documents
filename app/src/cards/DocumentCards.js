import { Link } from 'react-router-dom';

import './DocumentCards.css';

export default function DocumentCards(props) {
  return (
    <div className="document-cards-container">
      <Link to={`/view/${props.name}`} id="link">
        <h3 className="document-cards-name">{props.name}</h3>
      </Link>
      <img src={props.img} alt={props.name} className="document-cards-image" />
    </div>
  );
}
