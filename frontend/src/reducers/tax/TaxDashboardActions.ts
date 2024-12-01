// frontend/src/reducers/tax/actions.ts

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const models = new Map([
  ['mistral-nemo', 'open-mistral-nemo'],
  ['mistral-small', 'mistral-small-latest'],
  ['mistral-large', 'mistral-large-latest'],
]);

export const sendPromptToServer = createAsyncThunk(
  'tax/sendPromptToServer',
  async ({ textPrompt, textSelectedModel, isOnline, selectedRows }: any, { rejectWithValue }) => {
    const onlineUrl  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
    const serverEndpoint = onlineUrl + "taxtech/tax_llm_url/";
    const model = models.get(textSelectedModel);

    const requestBody = {
      model,
      messages: [{ role: 'user', prompt: textPrompt }],
      stream: false,
      isOnline,
      selectedRows,
    };

    try {
      const response = await axios.post(serverEndpoint, requestBody);
      return response.data.response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);