import { createContext } from "react";
import constants from "../constants";

const { IS_24_HOUR } = constants.state;

const initialState = {
  is24Hour: false,
};

const StateContext = createContext({
  updateIs24Hour: (is24Hour = false) => {},
  ...initialState,
});

const stateReducer = (prevState, action) => {
  switch (action.type) {
    case IS_24_HOUR:
      return {
        ...prevState,
        is24Hour: action.is24Hour,
      };
    default:
      return prevState;
  }
};

export { initialState, StateContext, stateReducer };
