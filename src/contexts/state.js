import { createContext } from "react";
import constants from "../constants";

const { IS_24_HOUR } = constants.state;

const initialState = {
  transactions: new Date().getTime(),
};

const StateContext = createContext({
  updateTransactions: () => {},
  ...initialState,
});

const stateReducer = (prevState, action) => {
  switch (action.type) {
    case IS_24_HOUR:
      return {
        ...prevState,
        transactions: new Date().getTime(),
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
