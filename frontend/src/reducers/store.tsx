import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {combineReducers} from 'redux';
import TaxDashboardDataReducer from './tax/TaxDashboardDataReducer';
import TaxDashboardDataTaxDataReducer from './tax/TaxDashboardTaxAddDataReducer';
const reducer = combineReducers({
  taxDashboardDataList : TaxDashboardDataReducer,
  taxDashboardDataTaxDataList : TaxDashboardDataTaxDataReducer
});

export const store = configureStore({
  reducer: reducer,
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();