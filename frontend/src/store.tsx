// src/store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // You'll create this file next

/*

import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

// import new reducer
import { signupReducer } from "./components/signup/SignupReducer";

const createRootReducer = history =>
  combineReducers({
    router: connectRouter(history),
    createUser: signupReducer // <--- add it here
  });

  const store = createStore(createRootReducer);
*/
const store = createStore(rootReducer);
export default store;

//export default createRootReducer;