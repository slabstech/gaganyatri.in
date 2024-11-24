import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, Container, Typography } from '@mui/material';

// Define the structure of our row data
interface RowData {
  id: number;
  col1: string;
  col2: string;
}

const TaxApp: React.FC = () => {
  // Sample data for the grid
  const rows: RowData[] = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGrid', col2: 'Material-UI' },
    { id: 3, col1: 'React', col2: 'Awesome' },
    { id: 4, col1: 'TypeScript', col2: 'Typed' },
    { id: 5, col1: 'Grid', col2: 'Rows' },
  ];

  // Define the columns for the grid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'col1', headerName: 'Column 1', width: 130 },
    { field: 'col2', headerName: 'Column 2', width: 130 },
  ];

  // State to keep track of selected rows
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  // Handler for submit button click
  const handleSubmit = () => {
    console.log('Selected Row IDs:', selectedRows);

    // Find the selected rows based on their IDs
    const selectedData = rows.filter(row => selectedRows.includes(row.id));
    console.log('Selected Rows:', selectedData);

    // You can perform further actions with the selected rows here
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Material-UI DataGrid Example
      </Typography>
      <div style={{ height: 400, width: '100%', marginBottom: '20px' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelection) => {
            setSelectedRows(newSelection);
          }}
          selectionModel={selectedRows}
          keepNonExistentRowsSelected
        />
      </div>
      <Button variant="contained" onClick={handleSubmit}>
        Submit Selected Rows
      </Button>
    </Container>
  );
};

export default TaxApp;