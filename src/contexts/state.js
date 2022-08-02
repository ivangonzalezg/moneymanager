import { createContext } from "react";
import constants from "../constants";

const { TRANSACTIONS, CATEGORY, CATEGORIES } = constants.state;

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
    case TRANSACTIONS:
      return {
        ...prevState,
        transactions: new Date().getTime(),
      };
    case CATEGORY:
      return {
        ...prevState,
        category: action.category,
      };
    case CATEGORIES:
      return {
        ...prevState,
        categories: action.categories,
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
