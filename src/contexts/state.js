import { createContext } from "react";
import constants from "../constants";

const { TRANSACTIONS } = constants.state;

const initialState = {
  transactions: "",
};

const StateContext = createContext({
  updateTransactions: () => {},
  ...initialState,
});

const stateReducer = (prevState, action) => {
  switch (action.type) {
    case TRANSACTIONS:
      return {
        ...prevState,
        transactions: new Date().getTime(),
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
