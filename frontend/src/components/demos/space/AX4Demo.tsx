import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Select, MenuItem, LinearProgress, Box, Divider } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DataGrid, GridColDef, GridToolbarContainer, useGridApiContext } from '@mui/x-data-grid';
import dayjs, { Dayjs } from 'dayjs';
import { fetchTaxDashboardData } from '../../../reducers/tax/TaxDashboardDataReducer';
import { sendPromptToServer } from '../../../reducers/tax/TaxDashboardActions';
import { RootState, AppDispatch } from '../../../reducers/store';
import Grid from '@mui/material/Grid2'; // Note: Grid is part of the unstable package

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
const nextSevenDays = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);

const AX4Demo: React.FC<{ serverUrl: string; isOnline: boolean }> = ({ serverUrl, isOnline }) => {
  ////console.log(serverUrl);
  const [textPrompt, setTextPrompt] = useState<string>('');
  const [textSelectedModel, setTextSelectedModel] = useState<string>('mistral-nemo');
  const [timerows, setTimerows] = useState<Array<Message>>([]);
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
  const taxDashboardDataList = useSelector((state: RootState) => state.taxDashboardDataList.userData);
  const tableAIProgressLoading = useSelector((state: RootState) => state.taxDashboardDataList.tableAIProgressLoading);
  const textResponse = useSelector((state: RootState) => state.taxDashboardDataList.textResponse);

  useEffect(() => {
    dispatch(
      fetchTaxDashboardData({
        page: 1,
        appointment_day_after: todayDate,
        appointment_day_before: nextSevenDays,
        user_id: userId,
        rejectValue: 'Failed to fetch Appointment.',
      })
    );
  }, [dispatch, todayDate, nextSevenDays, userId]);

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

  const handleSendPrompt = () => {
    dispatch(sendPromptToServer({ textPrompt, textSelectedModel, isOnline, selectedRows }));
  };

  return (
    <>
      <Box className="app-container">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        AX4 Mission
      </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 2 }} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Mission Timeline
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AX4Demo;