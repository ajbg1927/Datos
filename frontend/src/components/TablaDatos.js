import React from 'react';
import { Box, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const TablaDatos = ({ data, columns }) => {
  return (
    <Box mt={4}>
      <Paper elevation={3} sx={{ height: 500 }}>
        <DataGrid
          rows={data.map((row, i) => ({ id: i, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Paper>
    </Box>
  );
};

export default TablaDatos;
