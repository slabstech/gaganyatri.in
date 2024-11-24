import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import {combineReducers} from 'redux';
import TaxDashboardDataReducer from './tax/TaxDashboardDataReducer';

const reducer = combineReducers({
  taxDashboardDataList : TaxDashboardDataReducer,
});

export const store = configureStore({
  reducer: reducer,
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();