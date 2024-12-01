import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_URL  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
  
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
            country: rawUser.country,
            currency: rawUser.currency,
            ebt: rawUser.ebt,
            taxes: rawUser.taxes,
            quote: rawUser.quote,
            check_data: rawUser.check_data,
            pot_mehrsteuer : rawUser.pot_mehrsteuer,
            de_minimis: rawUser.de_minimis,
            five_percent_check :rawUser.five_percent_check,
            revenues: rawUser.revenues,
            salaries: rawUser.salaries,
            net_loss: rawUser.net_loss,
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