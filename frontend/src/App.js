import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, MenuItem, Select, FormControl,
  InputLabel, Grid, Paper, Button, CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import * as XLSX from 'xlsx';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './App.css';
import logo from './assets/logo_am.png';

const DragDropArea = styled('div')(({ theme }) => ({
  border: '2px dashed #ccc',
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f9f9f9',
  color: '#888',
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

    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        newFiles.push({ file, workbook });
        setFiles([...newFiles]);
        setSelectedFileIndex(newFiles.length - 1);
        setSheets(workbook.SheetNames);
        setSelectedSheet(workbook.SheetNames[0]);
      };
      reader.readAsArrayBuffer(file);
    });
    setLoading(false);
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
      const columns = Object.keys(jsonData[0] || {}).map((key, index) => ({
        field: key,
        headerName: key,
        width: 200,
        flex: 1,
      }));
      setColumns(columns);
    }
  }, [selectedFileIndex, selectedSheet]);

  return (
    <Box sx={{ bgcolor: '#fff', minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          borderBottom: '2px solid #eee',
        }}
      >
        <Box component="img" src={logo} alt="Logo" sx={{ height: 60, mr: 2 }} />
        <Typography variant="h5" fontWeight="bold" textAlign="center">
          Análisis de Datos – Municipio de Mosquera
        </Typography>
      </Box>

      <Container sx={{ py: 4 }}>
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
          <Grid container spacing={2} mt={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Archivo</InputLabel>
                <Select
                  value={selectedFileIndex ?? ''}
                  onChange={handleFileChange}
                  label="Archivo"
                >
                  {files.map((file, idx) => (
                    <MenuItem key={idx} value={idx}>{file.file.name}</MenuItem>
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
                    <MenuItem key={idx} value={sheet}>{sheet}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        <Box mt={4}>
          {loading ? (
            <CircularProgress />
          ) : (
            <Paper elevation={3} sx={{ height: 500 }}>
              <DataGrid
                rows={data.map((row, index) => ({ id: index, ...row }))}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
              />
            </Paper>
          )}
        </Box>
      </Container>

      <Box sx={{ bgcolor: '#f4f4f4', mt: 5, py: 2, textAlign: 'center', fontSize: 12 }}>
        <Typography variant="body2" gutterBottom>
          © {new Date().getFullYear()} Municipio de Mosquera
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <a href="https://www.facebook.com/AlcaldiaDeMosquera/" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.youtube.com/user/Mosqueratv" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://x.com/alcmosquera" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.instagram.com/alcaldiademosquera/?hl=es-la" target="_blank" rel="noopener noreferrer">Instagram</a>
        </Box>
      </Box>
    </Box>
  );
}

export default App;




