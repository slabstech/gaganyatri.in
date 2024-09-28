import React from 'react';

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
    <table className="dataTable" >
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, colIndex) => (
              <td key={colIndex}>{renderCellValue(item[header])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;