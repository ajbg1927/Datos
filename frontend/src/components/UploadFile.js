import React from 'react';
import { Box, Button } from '@mui/material';

const UploadFile = ({ handleFileUpload }) => {
  return (
    <Box display="flex" justifyContent="center" m={2}>
      <input
        accept=".xls,.xlsx"
        style={{ display: 'none' }}
        id="upload-excel"
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor="upload-excel">
        <Button variant="contained" component="span" color="primary">
          Subir archivo Excel
        </Button>
      </label>
    </Box>
  );
};

export default UploadFile;