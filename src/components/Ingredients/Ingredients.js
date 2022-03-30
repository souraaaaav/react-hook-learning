import React, { useEffect, useState } from 'react';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([])

  useEffect(() => {
    fetch("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json")
      .then(response => response.json())
      .then(data => {
        let newIngredient = []
        for (let key in data) {
          newIngredient.push({
            id: key,
            title: data[key].title,
            amount: data[key].amount
          })
        }
        setUserIngredients(newIngredient)
      })
  }, [])

  useEffect(() => {
    console.log("Re-Rendering ", userIngredients)
  }, [userIngredients])

  const addIngredientHandler = ingredient => {
    fetch("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error("Something went wrong")
      })
      .then(responseData => {
        setUserIngredients(prevIngredient => [
          ...prevIngredient,
          { id: responseData.name, ...ingredient }
        ])
      })
      .catch(e => { console.error('error: ', e) })
  }

  const removeHandler = index => {
    setUserIngredients(prevIngredients => prevIngredients.filter(prevIngredient => prevIngredient.id !== index))
  }

  const filteredIngredientHandler = (filteredIngredients) => {
    setUserIngredients(filteredIngredients)
  }

  return (
    <div className="App">
      <IngredientForm onLoadIngredients={addIngredientHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeHandler} />
      </section>
    </div>
  );
}


export default Ingredients;
