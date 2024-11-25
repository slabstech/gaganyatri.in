import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  LinearProgress,
  Box,
  Divider,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  useGridApiContext,
} from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';

import { fetchTaxDashboardData } from '../../../reducers/tax/TaxDashboardDataReducer';
import { RootState, AppDispatch } from '../../../reducers/store';

const models = new Map([
  ['mistral-nemo', 'open-mistral-nemo'],
  ['mistral-small', 'mistral-small-latest'],
  ['mistral-large', 'mistral-large-latest'],
]);

interface Message {
  id: bigint;
  appointment_day: string;
  company_name: string;
  status: string;
  observations: string;
}

const columns: GridColDef<Message>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'appointment_day', headerName: 'Day', width: 150 },
  { field: 'company_name', headerName: 'Company Name', width: 150 },
  { field: 'status', headerName: 'Status', width: 150 },
  { field: 'observations', headerName: 'Observations', width: 150 },
];

function CustomExportButton() {
  const apiRef = useGridApiContext();

  const handleExport = () => {
    apiRef.current.exportDataAsCsv();
  };

  return <Button onClick={handleExport}>Download CSV</Button>;
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <CustomExportButton />
    </GridToolbarContainer>
  );
}

const TaxTechDemo: React.FC<{ serverUrl: string; isOnline: boolean }> = ({
  serverUrl,
  isOnline,
}) => {
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textResponse, setTextResponse] = useState<string | null>(null);
  const [textSelectedModel, setTextSelectedModel] = useState<string>('mistral-nemo');
  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);
  const [timerows, setTimerows] = useState<Array<Message>>([]);
  
  const dispatch = useDispatch<AppDispatch>();
  
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const userId = 1;

  const taxDashboardDataList = useSelector(
    (state: RootState) => state.taxDashboardDataList.userData
  );

  const todayDate = new Date().toISOString().slice(0, 10);
  
  useEffect(() => {
    dispatch(
      fetchTaxDashboardData({
        page: 1,
        appointment_day_after: todayDate,
        appointment_day_before: dayjs().add(7, 'day').format('YYYY-MM-DD'),
        user_id: userId,
        rejectValue: 'Failed to fetch Appointment.',
      })
    ).then(() => setIsLoading(false));
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch]);


const sendPromptToServer = async () => {
    setTableAIProgressLoading(true);

    serverUrl = 'https://localhost:8000/api/v1';
    try {
      const response = await axios.post('http://localhost:8000/taxtech/tax_llm_url/', {
        model: models.get(textSelectedModel),
        messages: [{ role: 'user', prompt: textPrompt }],
        stream: false,
        isOnline,
      });
      
      setTextResponse(response.data.response);
      
    } catch (error) {
      console.error('Error processing Text Prompt:', error);
      
    } finally {
      setTableAIProgressLoading(false);
    }
};

const handleTextPromptChange = (event) => {
    setTextPrompt(event.target.value);
};

const handleTextModelChange = (event) => {
    setTextSelectedModel(event.target.value);
};

const handleSubmit = () => {
  sendPromptToServer();

};

const gridRef = useRef(null);

return (
    <>
      <Box className="app-container">
        <Box>
          <Typography variant="h4">Tax Sphere</Typography>
          <Divider />
          <Box className="input-container">
          <TextField
  value={textPrompt}
  onChange={handleTextPromptChange}
  placeholder="Enter your prompt here..."
  fullWidth
  multiline
  rows={20}
  sx={{
    backgroundColor: 'white',
    '& .MuiOutlinedInput-root': {
      '& > fieldset': {
        borderColor: 'text.primary',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: 3,
      fontSize: 18,
    },
  }}
/>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
            <Select value={textSelectedModel} onChange={handleTextModelChange}>
              {Array.from(models.keys()).map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box id="botResult">{tableAIProgressLoading && <LinearProgress />}</Box>
          {textResponse && (
            <Box className="response-container">
              <Typography variant="h6">Response:</Typography>
              <TextField
                value={JSON.stringify(textResponse, null, 2)}
                disabled
                multiline
                fullWidth
                rows={50}
              />
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
      <Box sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Master Tax Data
        </Typography>
        <DataGrid
          rows={timerows}
          columns={columns}
          slots={{
            toolbar: CustomToolbar,
          }}
          slotProps={{
            toolbar: {
              csvOptions: { allColumns: true, fileName: 'gridData' },
            },
          }}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          ref={gridRef}
        />
      </Box>
    </>
);
};

export default TaxTechDemo;
