// frontend/src/reducers/tax/TaxDashboardDataReducer.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { sendPromptToServer } from './TaxDashboardActions';

interface TaxUser {
  id: bigint;
  country: string;
  currency: string;
  ebt: string;
  taxes: string;
  quote: string;
  check_data : string;
  pot_mehrsteuer : string;
  de_minimis: string;
  five_percent_check : string;
  revenues: string;
  salaries: string;
  net_loss: string;
}

interface TaxDashboardDataState {
  userData: TaxUser[];
  loading: boolean;
  error: string | null;
  textResponse: string | null;
  tableAIProgressLoading: boolean;
  page: number;
  totalPages: number;
}

const initialState: TaxDashboardDataState = {
  userData: [],
  loading: false,
  error: null,
  textResponse: null,
  tableAIProgressLoading: false,
  page: 1,
  totalPages: 0,
};

// TODO - fix hardcoded value
const API_URL = "https://gaganyatri-django-spaces.hf.space/";
//import.meta.env.VITE_BACKEND_APP_API_URL;

export const fetchTaxDashboardData = createAsyncThunk<
string[], 
  {
    page?: number;
    appointment_day_after?: string;
    appointment_day_before?: string;
    user_id?: number;
  } & { rejectValue: string }, { rejectValue: string }>(
      'gaganyatriApp/fetchTaxDashboardData',
      async (args:any, thunkAPI:any) => {
        try {
          let url = API_URL + 'taxtech/taxdata/company/?page=';
          if (args.page) {
            url += args.page;
          }
          if (args.appointment_day_after) {
            url += `&appointment_day_after=${args.appointment_day_after}`;
          }
          if (args.appointment_day_before) {
            url += `&appointment_day_before=${args.appointment_day_before}`;
          }
          if (args.user_id) {
            url += `&user_id=${args.user_id}`;
          }
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          const userData = data.results.map((rawUser: any) => ({
            id: rawUser.id,
            name: rawUser.name,
            country: rawUser.country,
            currency: rawUser.currency,
            ebt: rawUser.ebt,
            taxes: rawUser.taxes,
            revenues: rawUser.revenues,
            wages: rawUser.wages,
            fixed_assets: rawUser.fixed_assets,
            // map other properties as needed
          }));
          return userData;
        } catch (error) {
          return thunkAPI.rejectWithValue('Failed to fetch user.');
        }
      }
  );
const taxDashboardDataSlice = createSlice({
  name: 'taxDashboardData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaxDashboardData.fulfilled, (state, action:any) => {
        state.loading = false;
        state.userData.push(...action.payload);
        state.totalPages = action.meta.arg.total_pages;
      })
      .addCase(fetchTaxDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(sendPromptToServer.pending, (state) => {
        state.tableAIProgressLoading = true;
      })
      .addCase(sendPromptToServer.fulfilled, (state, action) => {
        state.tableAIProgressLoading = false;
        state.textResponse = action.payload;
      })
      .addCase(sendPromptToServer.rejected, (state, action) => {
        state.tableAIProgressLoading = false;
        state.error = action.error.message || 'Failed to send prompt';
      });
  },
});

export default taxDashboardDataSlice.reducer;