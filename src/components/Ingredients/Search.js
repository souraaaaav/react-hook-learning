import React, { useEffect, useRef, useState } from 'react';
import useHttp from '../../hooks/http';
import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnteredFilter] = useState('')
  const { isLoading, data, error, sendRequest, extra, identifier, close } = useHttp()
  const inputRef = useRef()
  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' :
          `?orderBy="title"&equalTo="${enteredFilter}"`
        sendRequest("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json" + query, 'GET')
      }
    }, 500);
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, onLoadIngredients, sendRequest])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = []
      for (let key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        })
      }
      onLoadIngredients(loadedIngredients)
    }
  }, [data, isLoading, error, onLoadIngredients])

  return (
    <section className="search">
      {error && <ErrorModal onClose={close}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>loading...</span>}
          <input type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
