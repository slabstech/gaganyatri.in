// src/reducers/index.js
import { combineReducers } from 'redux';
import urlReducer from './urlReducer';

const rootReducer = combineReducers({
  url: urlReducer,
  // add more reducers here if needed
});

export default rootReducer;
