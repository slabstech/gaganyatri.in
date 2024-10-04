import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

interface DataTableProps {
  data: Array<{ [key: string]: any }>;
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (data.length === 0) return <p>No data available</p>;

  const headers = Object.keys(data[0]);

  const renderCellValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'; // Convert boolean to "Yes" or "No"
    }
    return value; // Return the value as is for other types
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex}>{renderCellValue(item[header])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
