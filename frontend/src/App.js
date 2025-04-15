import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Grid, MenuItem, Select,
  FormControl, InputLabel, Paper, CircularProgress, Fab
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import * as XLSX from 'xlsx';
import { styled } from '@mui/material/styles';

import Header from './components/Header';
import Footer from './components/Footer';

const DragDropArea = styled('div')(({ theme }) => ({
  border: '2px dashed #ccc',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f9f9f9',
  color: '#888',
  marginBottom: theme.spacing(4),
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#f1f1f1',
  },
}));

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    processFiles(uploadedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const processFiles = (fileList) => {
    setLoading(true);
    const newFiles = [...files];
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        newFiles.push({ file, workbook });
        setFiles([...newFiles]);
        setSelectedFileIndex(newFiles.length - 1);
        setSheets(workbook.SheetNames);
        setSelectedSheet(workbook.SheetNames[0]);
        setLoading(false);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = (event) => {
    const index = event.target.value;
    setSelectedFileIndex(index);
    const workbook = files[index].workbook;
    setSheets(workbook.SheetNames);
    setSelectedSheet(workbook.SheetNames[0]);
  };

  const handleSheetChange = (event) => {
    setSelectedSheet(event.target.value);
  };

  useEffect(() => {
    if (selectedFileIndex !== null && selectedSheet) {
      const worksheet = files[selectedFileIndex].workbook.Sheets[selectedSheet];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      setData(jsonData);

      const keys = Object.keys(jsonData[0] || {});
      const generatedColumns = keys.map((key) => ({
        field: key,
        headerName: key,
        width: 200,
        flex: 1,
      }));
      setColumns(generatedColumns);

      const newFilters = {};
      keys.forEach((key) => {
        newFilters[key] = '';
      });
      setFilters(newFilters);
    }
  }, [selectedFileIndex, selectedSheet]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = data.filter((row) => {
    return Object.entries(filters).every(([key, value]) => {
      return value === '' || String(row[key]).toLowerCase().includes(value.toLowerCase());
    });
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, selectedSheet || 'Hoja1');
    XLSX.writeFile(wb, 'exportado.xlsx');
  };

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <DragDropArea onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <UploadFileIcon sx={{ fontSize: 40 }} />
          <Typography variant="body1" gutterBottom>
            Arrastra o pega un archivo aquí
          </Typography>
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
            Elegir archivo
            <input type="file" hidden multiple onChange={handleFileUpload} />
          </Button>
        </DragDropArea>

        {files.length > 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Archivo</InputLabel>
                <Select
                  value={selectedFileIndex ?? ''}
                  onChange={handleFileChange}
                  label="Archivo"
                >
                  {files.map((file, idx) => (
                    <MenuItem key={idx} value={idx}>
                      {file.file.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Hoja</InputLabel>
                <Select
                  value={selectedSheet}
                  onChange={handleSheetChange}
                  label="Hoja"
                >
                  {sheets.map((sheet, idx) => (
                    <MenuItem key={idx} value={sheet}>
                      {sheet}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {columns.length > 0 && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {columns.map((col) => (
              <Grid item xs={12} sm={6} md={4} key={col.field}>
                <TextField
                  fullWidth
                  label={`Filtrar por ${col.headerName}`}
                  value={filters[col.field] || ''}
                  onChange={(e) => handleFilterChange(col.field, e.target.value)}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Box mt={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Paper elevation={3} sx={{ height: 500 }}>
              <DataGrid
                rows={filteredData.map((row, index) => ({ id: index, ...row }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </Paper>
          )}
        </Box>
      </Container>

      <Footer />

      <Fab
        color="primary"
        aria-label="exportar"
        onClick={exportToExcel}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#ffcd00',
          color: '#000',
          '&:hover': {
            backgroundColor: '#e6b800',
          },
        }}
      >
        <SaveAltIcon />
      </Fab>
    </Box>
  );
}

export default App;







