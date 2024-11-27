import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// TODO - fix hardcoded value
const API_URL = "http://gaganyatri-django-spaces.hf.space/";
//import.meta.env.VITE_BACKEND_APP_API_URL;

export const fetchTaxDashboardTaxAddData = createAsyncThunk<
string[], 
  {
    page?: number;
    appointment_day_after?: string;
    appointment_day_before?: string;
    user_id?: number;
  } & { rejectValue: string }, { rejectValue: string }>(
      'gaganyatriApp/fetchTaxDashboardTaxAddData',
      async (args:any, thunkAPI:any) => {
        try {
          let url = API_URL + 'taxtech/taxdata/taxdata/?page=';
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
          const userDataTax = data.results.map((rawUser: any) => ({
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
          return userDataTax;
        } catch (error) {
          return thunkAPI.rejectWithValue('Failed to fetch user.');
        }
      }
  );
interface User {
  id: bigint;
  name: string;
  country: string;
  currency: string;
  ebt: string;
  taxes: string;
  revenues: string;
  wages: string;
  fixed_assets: string;
}
interface UserState {
  userDataTax: User[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
}
const initialState: UserState = {
  userDataTax: [],
  loading: false,
  error: null,
  page: 1,
  totalPages: 0,
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder:any) => {
    builder
        .addCase(fetchTaxDashboardTaxAddData.pending, (state:any) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTaxDashboardTaxAddData.fulfilled, (state:any, action:any) => {
          state.loading = false;
          state.userDataTax.push(...action.payload);
          state.totalPages = action.meta.arg.total_pages;
        })
        .addCase(fetchTaxDashboardTaxAddData.rejected, (state:any, action:any) => {
          state.loading = false;
          state.error = action.error.message || 'Something went wrong';
        });
  },
});
export default userSlice.reducer;