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
    const serverEndpoint = "https://gaganyatri-django-spaces.hf.space/taxtech/tax_llm_url/";
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