import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import useHttp from '../../hooks/http';
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
  const { isLoading, data, error, sendRequest, extra, identifier, close } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && identifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: extra })
    }
    else if (!isLoading && !error && identifier === 'ADD_INGREDIENT') {
      dispatch({
        type: "ADD",
        ingredient: {
          id: data.name,
          ...extra
        }
      })
    }
  }, [data, extra, identifier, error, isLoading])

  const addIngredientHandler = useCallback(ingredient => {
    sendRequest("https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients.json", "POST",
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    )
  }, [sendRequest])

  const removeIngredientHandler = useCallback(index => {
    sendRequest(`https://react-hooks-update-adbe0-default-rtdb.asia-southeast1.firebasedatabase.app/ingredients/${index}.json`,
      'DELETE',
      null,
      index,
      'REMOVE_INGREDIENT'
    )
  }, [sendRequest])
  const modalClose = useCallback(() => {
    close()
  }, [close])
  const filteredIngredientHandler = useCallback((filteredIngredients) => {
    dispatch({
      type: "SET",
      ingredients: filteredIngredients
    })
  }, [])

  const ingredientList = useMemo(() => {
    return (
      <IngredientList ingredients={userIngredients} onRemoveItem={removeIngredientHandler} />
    )
  }, [userIngredients, removeIngredientHandler])

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading} />
      {error && <ErrorModal onClose={modalClose}>{error}</ErrorModal>}
      <section>
        <Search onLoadIngredients={filteredIngredientHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
