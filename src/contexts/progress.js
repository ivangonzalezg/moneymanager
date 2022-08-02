import { createContext } from "react";
import constants from "../constants";

const initialProgress = {
  visible: false,
  label: "",
  showProgressDialog: (label = "") => {},
  hideProgressDialog: () => {},
};

const ProgressContext = createContext(initialProgress);

const progressReducer = (prevState, action) => {
  switch (action.type) {
    case constants.progress.VISIBLE:
      return {
        ...prevState,
        visible: true,
        label: action.label,
      };
    case constants.progress.HIDDEN:
      return {
        label: "",
        visible: false,
      };
    default:
      return prevState;
  }
};

export { initialProgress, ProgressContext, progressReducer };
