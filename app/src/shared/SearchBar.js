import {React} from 'react';
import PropTypes from 'prop-types';
import '../styles/SearchBar.scss';
import search from './searchIcon.svg';

function SearchBar(props) {

  // const [inputText, setInputText] = useState("")

  return (
    <div className="search">
      <input type="text" placeholder={props.placeholder} />
      <button onClick={props.searchFunction} className="searchButton" >
        <img src={search} alt="search icon"/>
      </button>
    </div>
  );
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  searchFunction: PropTypes.func,
};

export default SearchBar;
