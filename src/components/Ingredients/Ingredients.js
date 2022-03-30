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

  // 14

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
          // Method: 1
          // ...prevIngredient, { ...ingredient }
          ...prevIngredient,
          { id: responseData.name, ...ingredient }
        ])
      })
      .catch(e => { console.error('error: ', e) })
  }

  const removeHandler = index => {
    // Method: 1
    // const newUserIngredients = [...userIngredients]
    // newUserIngredients.splice(index, 1)
    // setUserIngredients(newUserIngredients)
    // [{},{}]
    // Method : 2
    setUserIngredients(prevIngredients => prevIngredients.filter(prevIngredient => prevIngredient.id !== index))
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeHandler} />
      </section>
    </div>
  );
}


export default Ingredients;
