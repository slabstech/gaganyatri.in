import { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import {Button, Typography} from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { SelectChangeEvent } from '@mui/material/Select';
import { Divider } from '@mui/material';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DataGrid, GridColDef, GridToolbarContainer, useGridApiContext}
  from '@mui/x-data-grid';
import dayjs,{ Dayjs } from 'dayjs';

import {fetchTaxDashboardData} from '../../../reducers/tax/TaxDashboardDataReducer';
import {RootState, AppDispatch} from '../../../reducers/store';
const models = new Map([
  ['mistral-nemo', 'open-mistral-nemo'],
  ['mistral-small', 'mistral-small-latest'],
  ['mistral-large', 'mistral-large-latest'],
]);


interface Message {
  id: bigint;
  appointment_day: string;
  appointment_time: string;
  doctor_name: string;
  status: string;
  observations: string;
}

const columns: GridColDef<Message>[] = [
  {field: 'id', headerName: 'ID', width: 90},
  {
    field: 'appointment_day',
    headerName: 'Day',
    width: 150,
    editable: false,
  },
  {
    field: 'appointment_time',
    headerName: 'Time',
    width: 150,
    editable: false,
  },
  {
    field: 'doctor_name',
    headerName: 'Doctor',
    width: 150,
    editable: false,
  },
  {
    field: 'status',
    width: 150,
    headerName: 'Status',
    editable: false,
  },
  {
    field: 'observations',
    headerName: 'Observations',
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
      const filteredData = taxDashboardDataList.filter((item:any) => {
        const itemDate = dayjs(item.appointment_day);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
      setTimerows(filteredData);
    } else {
      setTimerows(taxDashboardDataList);
    }
  }, [taxDashboardDataList, startDate, endDate]);



  const sendPromptToServer = async () => {
    setTableAIProgressLoading(true);

    const serverEndpoint = "http://localhost:8000/taxtech/tax_llm_url/";
    console.log(serverEndpoint);

    const model = models.get(textSelectedModel);

    const requestBody = {
      model,
      messages: [{ role: 'user', prompt: textPrompt }],
      stream: false,
      isOnline,
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

  return (
    <>
      <Box className="app-container">
        <Box>
          <h2>Tax Agent</h2>
          <Divider />
          <Box className="input-container">
            <TextField
              value={textPrompt}
              onChange={handleTextPromptChange}
              placeholder="Enter your prompt here..."
              fullWidth
              sx={{ backgroundColor: 'white', color: 'black' }}
            />
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
              <TextField value={JSON.stringify(textResponse, null, 2)} disabled multiline fullWidth rows={4} />
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
      <Box sx={{height: '100%'}}>
      <Typography variant="h6" gutterBottom>
        Appointment
      </Typography>
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
    <DataGrid
        rows={timerows}
        columns={columns}
        slots={{
          toolbar: CustomToolbar,
        }}
        slotProps={{
          toolbar: {
            csvOptions: {allColumns: true, fileName: 'gridData'},
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
      />
    </Box>
    </>
  );
};

export default TaxTechDemo;