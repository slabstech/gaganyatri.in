// src/store.js
import { createStore } from 'redux';
import rootReducer from './reducers'; // You'll create this file next

const store = createStore(rootReducer);

export default store;
