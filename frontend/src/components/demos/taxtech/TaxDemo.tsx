import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Button, Typography } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import { Divider } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid, GridColDef, GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid';
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
  name: string;
  country: string;
  currency: string;
  ebt: string;
  taxes: string;
  revenues: string;
  wages: string;
  fixed_assets: string;
}

const columns: GridColDef<Message>[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Company Name',
    width: 150,
    editable: false,
  },
  {
    field: 'country',
    width: 150,
    headerName: 'Country',
    editable: false,
  },
  {
    field: 'currency',
    headerName: 'Currency',
    width: 150,
    editable: false,
  },
  {
    field: 'ebt',
    headerName: 'EBT',
    width: 150,
    editable: false,
  },
  {
    field: 'taxes',
    headerName: 'Taxes',
    width: 150,
    editable: false,
  },
  {
    field: 'revenues',
    headerName: 'Revenues',
    width: 150,
    editable: false,
  },
  {
    field: 'wages',
    headerName: 'Wages',
    width: 150,
    editable: false,
  },
  {
    field: 'fixed_assets',
    headerName: 'fixed_assets',
    width: 150,
    editable: false,
  },
];

/** render
 * @return {return}
 */
function CustomExportButton() {
  const apiRef = useGridApiContext();

  const handleExport = () => {
    apiRef.current.exportDataAsCsv();
  };

  return (
    <Button onClick={handleExport}>
      Download CSV
    </Button>
  );
}

/** render
 * @return {return}
 */
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <CustomExportButton />
    </GridToolbarContainer>
  );
}

const todayDate = new Date().toISOString().slice(0, 10);
const today = new Date();
const nextSevenDays = new Date(today.getTime() +
  (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);

const TaxTechDemo: React.FC<{ serverUrl: string; isOnline: boolean }> = ({ serverUrl, isOnline }) => {

  console.log(serverUrl);
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [textResponse, setTextResponse] = useState<string | null>(null);
  const [textSelectedModel, setTextSelectedModel] = useState<string>('mistral-nemo');
  const [tableAIProgressLoading, setTableAIProgressLoading] = useState<boolean>(false);

  const [timerows, setTimerows] = useState<Array<Message>>([]);
  const [loading, setLoading] = useState(true); // add loading state
  const [selectedRows, setSelectedRows] = useState<Array<Message>>([]); // add selected rows state

  const [promptOptions, setPromptOptions] = useState<Array<string>>([
    'What is the tax rate for this company?',
    'How much revenue did this company generate last year?',
    'What are the wages for this company?'
  ]);
  const [selectedPromptOption, setSelectedPromptOption] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const userId = 1;

  const taxDashboardDataList = useSelector((state: RootState) =>
    state.taxDashboardDataList.userData);

  useEffect(() => {
    if (loading) {
      dispatch(
        fetchTaxDashboardData({
          page: 1,
          appointment_day_after: todayDate,
          appointment_day_before: nextSevenDays,
          user_id: userId,
          rejectValue: 'Failed to fetch Appointment.',
        })
      ).then(() => setLoading(false));
    }
  }, [dispatch, todayDate, nextSevenDays, userId, loading]);

  useEffect(() => {
    if (startDate && endDate) {
      const filteredData = taxDashboardDataList.filter((item: any) => {
        const itemDate = dayjs(item.appointment_day);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
      //setTimerows(filteredData);
    } else {
      setTimerows(taxDashboardDataList);
    }
  }, [taxDashboardDataList, startDate, endDate]);

  const sendPromptToServer = async () => {
    setTableAIProgressLoading(true);

    const serverEndpoint = "https://gaganyatri-django-spaces.hf.space/taxtech/tax_llm_url/";
    //const serverEndpoint = "https://localhost:8000/taxtech/tax_llm_url/";
    const model = models.get(textSelectedModel);

    const requestBody = {
      model,
      messages: [{ role: 'user', prompt: textPrompt }],
      stream: false,
      isOnline,
      selectedRows, // include selected rows in the request body
    };

    try {
      const response = await axios.post(serverEndpoint, requestBody);
      const messageContent = response.data.response;
      setTableAIProgressLoading(false);
      setTextResponse(messageContent);
    } catch (error) {
      console.error('Error processing Text Prompt:', error);
      setTableAIProgressLoading(false);
    }
  };

  const handleTextPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextPrompt(event.target.value);
  };

  const handleTextModelChange = (event: SelectChangeEvent<string>) => {
    setTextSelectedModel(event.target.value);
  };

  const handleRowSelection = (newSelectedRows: Array<Message>) => {
    setSelectedRows(newSelectedRows);
  };

  const handlePromptOptionChange = (event: SelectChangeEvent<string>) => {
    const selectedOption = event.target.value;
    setSelectedPromptOption(selectedOption);
    setTextPrompt(selectedOption);
  };

  return (
    <>
      <Box className="app-container">
        <Box>
          <h2>TAXSPHAERA</h2>
          <Divider />
          <Box className="input-container">
            <TextField
              value={textPrompt}
              onChange={handleTextPromptChange}
              placeholder="Enter your prompt here..."
              fullWidth
              sx={{ backgroundColor: 'white', color: 'black' }}
              rows={10}
              multiline
            />
            <Select
              value={selectedPromptOption}
              onChange={handlePromptOptionChange}
              displayEmpty
              sx={{ marginLeft: 2 }}
            >
              <MenuItem value="" disabled>
                Select a prompt
              </MenuItem>
              {promptOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            <Button variant="contained" onClick={sendPromptToServer} disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit'}
            </Button>
            <Select value={textSelectedModel} onChange={handleTextModelChange}>
              {Array.from(models.entries()).map(([key]) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box id="botResult">{tableAIProgressLoading && <LinearProgress />}</Box>
          {textResponse && (
            <Box className="response-container">
              <h4>Response:</h4>
              <TextField value={JSON.stringify(textResponse, null, 2)} disabled multiline fullWidth rows={20} />
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
      <Box sx={{ height: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Master Tax Company Data
        </Typography>
        <div style={{ display: 'none' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => {
                setStartDate(newValue);
              }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => {
                setEndDate(newValue);
              }}
            />
          </LocalizationProvider>
        </div>
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
          getRowId={(row) => row.id.toString()} // Ensure bigint IDs are handled correctly
          onRowSelectionModelChange={(newSelection) => {
            const selectedIDs = new Set(newSelection);
            const selectedRows = timerows.filter((row) =>
              selectedIDs.has(row.id.toString()) // Convert bigint to string
            );
            handleRowSelection(selectedRows);
          }}
        />
      </Box>
    </>
  );
};

export default TaxTechDemo;