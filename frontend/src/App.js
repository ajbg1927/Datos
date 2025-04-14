import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  Paper,
  CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DataGrid } from "@mui/x-data-grid";
import { Search } from "@mui/icons-material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import logo from "./logo AM.png";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [entidadFilter, setEntidadFilter] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [minPago, setMinPago] = useState("");
  const [maxPago, setMaxPago] = useState("");
  const [loading, setLoading] = useState(false);

  const backendURL = "https://backend-flask-0rnq.onrender.com";

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("file", selectedFile);
    setLoading(true);
    try {
      const response = await axios.post(`${backendURL}/upload`, formData);
      setSheetNames(response.data.sheet_names);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSheetSelect = async (sheet) => {
    setSelectedSheet(sheet);
    try {
      const response = await axios.get(`${backendURL}/data/${sheet}`);
      const formattedData = response.data.map((row, index) => ({ id: index, ...row }));
      setData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching sheet data:", error);
    }
  };

  useEffect(() => {
    let filtered = data;

    if (searchText) {
      filtered = filtered.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }

    if (sectorFilter) {
      filtered = filtered.filter((row) => row["Sector"] === sectorFilter);
    }

    if (entidadFilter) {
      filtered = filtered.filter((row) => row["Entidad"] === entidadFilter);
    }

    if (startDate) {
      filtered = filtered.filter((row) => new Date(row["Fecha Compromiso"]) >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter((row) => new Date(row["Fecha Compromiso"]) <= endDate);
    }

    if (minPago !== "") {
      filtered = filtered.filter((row) => parseFloat(row["Pago"] || 0) >= parseFloat(minPago));
    }

    if (maxPago !== "") {
      filtered = filtered.filter((row) => parseFloat(row["Pago"] || 0) <= parseFloat(maxPago));
    }

    setFilteredData(filtered);
  }, [searchText, sectorFilter, entidadFilter, startDate, endDate, minPago, maxPago, data]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Filtrados");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "datos_filtrados.xlsx");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <img src={logo} alt="Logo" style={{ height: 50, marginRight: 20 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Seguimiento a la Ejecución Presupuestal
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* CONTENIDO PRINCIPAL */}
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            <Button variant="contained" onClick={handleUpload} sx={{ mt: 1 }}>
              Cargar archivo
            </Button>
          </Grid>
          {sheetNames.length > 0 && (
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Seleccionar hoja</InputLabel>
                <Select value={selectedSheet} onChange={(e) => handleSheetSelect(e.target.value)}>
                  {sheetNames.map((name) => (
                    <MenuItem key={name} value={name}>{name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {filteredData.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4}>
                <TextField
                  label="Buscar"
                  variant="outlined"
                  fullWidth
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField label="Sector" variant="outlined" fullWidth value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField label="Entidad" variant="outlined" fullWidth value={entidadFilter} onChange={(e) => setEntidadFilter(e.target.value)} />
              </Grid>
              <Grid item xs={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker label="Desde" value={startDate} onChange={setStartDate} renderInput={(params) => <TextField {...params} fullWidth />} />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker label="Hasta" value={endDate} onChange={setEndDate} renderInput={(params) => <TextField {...params} fullWidth />} />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField label="Pago mínimo" type="number" fullWidth value={minPago} onChange={(e) => setMinPago(e.target.value)} />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField label="Pago máximo" type="number" fullWidth value={maxPago} onChange={(e) => setMaxPago(e.target.value)} />
              </Grid>
            </Grid>

            <Box sx={{ height: 600, mt: 4 }}>
              <DataGrid rows={filteredData} columns={Object.keys(filteredData[0]).map((key) => ({ field: key, headerName: key, flex: 1 }))} pageSize={10} rowsPerPageOptions={[10, 20, 50]} checkboxSelection />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Gráfico de Pagos por Sector
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getSectorData(filteredData)}>
                  <XAxis dataKey="sector" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalPago" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={exportToExcel}
              sx={{ position: "fixed", bottom: 16, right: 16 }}
            >
              Exportar a Excel
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );

  function getSectorData(data) {
    const result = {};
    data.forEach((row) => {
      const sector = row["Sector"];
      const pago = parseFloat(row["Pago"] || 0);
      if (sector in result) {
        result[sector] += pago;
      } else {
        result[sector] = pago;
      }
    });
    return Object.entries(result).map(([sector, totalPago]) => ({ sector, totalPago }));
  }
}

export default App;
