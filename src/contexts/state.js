import { createContext } from "react";
import constants from "../constants";

const category = {
  id: 0,
  position: 0,
  name: "",
  icon: "",
};

const client = {
  id: 0,
  name: "",
  phone: "",
};

const initialState = {
  transactions: "",
  category,
  categories: [category],
  clients: [client],
};

const StateContext = createContext({
  updateTransactions: () => {},
  updateCategory: () => {},
  updateCategories: () => {},
  updateClients: () => {},
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
    case constants.state.CLIENTS:
      return {
        ...prevState,
        clients: action.clients,
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
