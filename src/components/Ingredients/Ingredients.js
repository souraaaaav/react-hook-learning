import React, { useCallback, useEffect, useReducer, useState } from 'react';
import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients
    case "ADD":
      return [...currentIngredients, action.ingredient]
    case "DELETE":
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error("Shouldnt get there")
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // const [userIngredients, setUserIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    console.log("Re-Rendering ", userIngredients)
  }, [userIngredients])

  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    fetch("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setIsLoading(false)
        if (response.ok) {
          return response.json()
        }
        throw new Error("Something went wrong")
      })
      .then(responseData => {
        dispatch({
          type: "ADD",
          ingredient: {
            id: responseData.name,
            ...ingredient
          }
        })
        // setUserIngredients(prevIngredient => [
        //   ...prevIngredient,
        //   { id: responseData.name, ...ingredient }
        // ])
      })
      .catch(e => setError("something went wrong"))
  }

  const removeHandler = index => {
    setIsLoading(true)
    fetch(`https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${index}.json`, {
      method: "DELETE",
    })
      .then(response => {
        setIsLoading(false)
        dispatch({
          type: "DELETE",
          id: index
        })
        // setUserIngredients(prevIngredients => prevIngredients.filter(prevIngredient => prevIngredient.id !== index))
      })
      .catch(err => {
        setError("something went wrong")
      })
  }
  const modalClose = () => {
    setError(null)
    setIsLoading(false)
  }
  const filteredIngredientHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients)
    dispatch({
      type: "SET",
      ingredients: filteredIngredients
    })
  }, [])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading} />
      {error && <ErrorModal onClose={modalClose}>{error}</ErrorModal>}
      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeHandler} />
      </section>
    </div>
  );
}


export default Ingredients;
