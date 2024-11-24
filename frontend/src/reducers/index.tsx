// src/reducers/index.js
import { combineReducers } from 'redux';
import urlReducer from './urlReducer';
import TaxDashboardDataReducer from './tax/TaxDashboardDataReducer';

const rootReducer = combineReducers({
  url: urlReducer,
  taxDashboardDataList : TaxDashboardDataReducer,
  // add more reducers here if needed
});

export default rootReducer;
