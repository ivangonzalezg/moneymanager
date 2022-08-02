import { createContext } from "react";
import constants from "../constants";

const category = {
  id: 0,
  position: 0,
  name: "",
  icon: "",
};

const initialState = {
  transactions: "",
  category,
  categories: [category],
};

const StateContext = createContext({
  updateTransactions: () => {},
  updateCategory: () => {},
  updateCategories: () => {},
  ...initialState,
});

const stateReducer = (prevState, action) => {
  switch (action.type) {
    case constants.state.TRANSACTIONS:
      return {
        ...prevState,
        transactions: new Date().getTime(),
      };
    case constants.state.CATEGORY:
      return {
        ...prevState,
        category: action.category,
      };
    case constants.state.CATEGORIES:
      return {
        ...prevState,
        categories: action.categories,
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
