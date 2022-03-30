import React, { useEffect, useState } from 'react';
import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnteredFilter] = useState('')

  useEffect(() => {
    const query = enteredFilter.length === 0 ? '' :
      `?orderBy="title"&equalTo="${enteredFilter}"`

    fetch("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json" + query)
      .then(response => response.json())
      .then(data => {
        let loadedIngredients = []
        for (let key in data) {
          loadedIngredients.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount
          })
        }
        onLoadIngredients(loadedIngredients)
      })
  }, [enteredFilter, onLoadIngredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
