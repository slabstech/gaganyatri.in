// src/reducers/urlReducer.js
import { Action } from 'redux';
const initialState = {
    url: 'initialUrl',
  };
  
  interface UrlAction extends Action {
    payload: any; // Replace `any` with the actual type of your payload
  }
  const urlReducer = (state = initialState, action: UrlAction) => {
    switch (action.type) {
      case 'SET_URL':
        return {
          ...state,
          url: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default urlReducer;
  