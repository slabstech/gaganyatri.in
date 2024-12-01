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

import {fetchTaxDashboardTaxAddData} from '../../../reducers/tax/TaxDashboardTaxAddDataReducer';
import {RootState, AppDispatch} from '../../../reducers/store';
const models = new Map([
  ['mistral-nemo', 'open-mistral-nemo'],
  ['mistral-small', 'mistral-small-latest'],
  ['mistral-large', 'mistral-large-latest'],
]);


interface Message {
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

const columns: GridColDef<Message>[] = [
  {field: 'id', headerName: 'ID', width: 90},
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
    field: 'quote',
    headerName: 'Quote',
    width: 150,
    editable: false,
  },
  {
    field: 'check_data',
    headerName: 'Check',
    width: 150,
    editable: false,
  },
  {
    field: 'pot_mehrsteuer',
    headerName: 'pot_mehrsteuer',
    width: 150,
    editable: false,
  },
  {
    field: 'de_minimis',
    headerName: 'de_minimis',
    width: 150,
    editable: false,
  },
  {
    field: 'five_percent_check',
    headerName: 'five_percent_check',
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
    field: 'salaries',
    headerName: 'Salaries',
    width: 150,
    editable: false,
  },
  {
    field: 'net_loss',
    headerName: 'Net Loss',
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


const TaxTechTaxDataDemo: React.FC<{ serverUrl: string; isOnline: boolean }> = ({ serverUrl, isOnline }) => {

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

  const taxDashboardDataTaxDataList = useSelector((state: RootState) =>
    state.taxDashboardDataTaxDataList.userDataTax);


  useEffect(() => {
    if (loading) {
    dispatch(
      fetchTaxDashboardTaxAddData({
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
      const filteredData = taxDashboardDataTaxDataList.filter((item:any) => {
        const itemDate = dayjs(item.appointment_day);
        return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
      });
      //setTimerows(filteredData);
    } else {
      setTimerows(taxDashboardDataTaxDataList);
    }
  }, [taxDashboardDataTaxDataList, startDate, endDate]);



  const sendPromptToServer = async () => {
    setTableAIProgressLoading(true);

    const onlineUrl  = import.meta.env.VITE_GAGANYATRI_BACKEND_APP_API_URL;
    const serverEndpoint = onlineUrl + "taxtech/tax_llm_tax_add_url/";
    //console.log(serverEndpoint);

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
          <Divider />
          <Box className="input-container">
            <TextField
              value={textPrompt}
              onChange={handleTextPromptChange}
              placeholder="Enter your prompt here..."
              fullWidth
              sx={{ backgroundColor: 'white', color: 'black' }}
              rows={20}
              multiline
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
              <TextField value={JSON.stringify(textResponse, null, 2)} disabled multiline fullWidth rows={50} />
            </Box>
          )}
        </Box>
        <Divider sx={{ my: 2 }} />
      </Box>
      <Box sx={{height: '100%'}}>
      <Typography variant="h6" gutterBottom>
        Master Tax Country Data
      </Typography>
      <div  style={{ display: 'none' }} >
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

export default TaxTechTaxDataDemo;