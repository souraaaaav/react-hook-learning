import React, { useCallback, useEffect, useReducer } from 'react';
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

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...currentHttpState, loading: false }
    case 'ERROR':
      return { loading: false, error: action.errData }
    case "CLOSE":
      return { loading: false, error: null }
    default:
      throw new Error("Should not be reached")
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, httpDispatch] = useReducer(httpReducer, { loading: false, error: null })
  // const [userIngredients, setUserIngredients] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [error, setError] = useState()

  useEffect(() => {
    console.log("Re-Rendering ", userIngredients)
  }, [userIngredients])

  const addIngredientHandler = ingredient => {
    httpDispatch({ type: "SEND" })
    fetch("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        httpDispatch({ type: "RESPONSE" })
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
      .catch(e => httpDispatch({
        type: "ERROR",
        errData: "Something went wrong"
      }))
  }

  const removeHandler = index => {
    httpDispatch({ type: "SEND" })
    fetch(`https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${index}.json`, {
      method: "DELETE",
    })
      .then(response => {
        httpDispatch({ type: "RESPONSE" })
        dispatch({
          type: "DELETE",
          id: index
        })
        // setUserIngredients(prevIngredients => prevIngredients.filter(prevIngredient => prevIngredient.id !== index))
      })
      .catch(err => {
        httpDispatch({
          type: "ERROR",
          errData: "Something went wrong"
        })
      })
  }
  const modalClose = () => {
    httpDispatch({ type: "CLOSE" })
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
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={httpState.loading} />
      {httpState.error && <ErrorModal onClose={modalClose}>{httpState.error}</ErrorModal>}
      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        <IngredientList ingredients={userIngredients} onRemoveItem={removeHandler} />
      </section>
    </div>
  );
}


export default Ingredients;
