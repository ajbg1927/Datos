import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Button, Typography, Select, MenuItem, TextField, Box, CircularProgress, Checkbox, FormControlLabel,
  FormGroup, Grid, Accordion, AccordionSummary, AccordionDetails, Container, Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_URL = "https://backend-flask-0rnq.onrender.com";

const App = () => {
  const [archivos, setArchivos] = useState([]);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState("");
  const [hojas, setHojas] = useState([]);
  const [hojasSeleccionadas, setHojasSeleccionadas] = useState([]);
  const [datos, setDatos] = useState([]);
  const [archivoSubido, setArchivoSubido] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [filtroGlobal, setFiltroGlobal] = useState("");
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/archivos`)
      .then(res => setArchivos(res.data.archivos))
      .catch(error => console.error("Error obteniendo archivos:", error));
  }, [archivoSubido]);

  const subirArchivo = async (file) => {
    if (!file || (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls"))) {
      alert("Solo se permiten archivos Excel.");
      return;
    }
    setCargando(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_URL}/subir`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const nombre = res.data.archivo;
      setArchivoSubido(nombre);
      setArchivoSeleccionado(nombre);
      const hojasRes = await axios.get(`${API_URL}/hojas/${encodeURIComponent(nombre)}`);
      setHojas(hojasRes.data.hojas);
    } catch (e) {
      alert("Error subiendo o leyendo archivo");
    }
    setCargando(false);
  };

  const cargarDatos = async () => {
    if (!archivoSeleccionado || hojasSeleccionadas.length === 0) {
      alert("Selecciona un archivo y al menos una hoja");
      return;
    }
    setCargando(true);
    try {
      const res = await axios.post(`${API_URL}/datos/${encodeURIComponent(archivoSeleccionado)}`, {
        hojas: hojasSeleccionadas
      });
      setDatos(res.data.datos || []);
    } catch (e) {
      alert("Error cargando datos");
    }
    setCargando(false);
  };

  const columnas = datos.length > 0 ?
    Object.keys(datos[0]).map((key) => ({ field: key, headerName: key, flex: 1 })) : [];

  const datosFiltrados = useMemo(() => {
    return datos.filter(row => {
      let coincide = true;
      if (filtroGlobal) {
        coincide = Object.values(row).some(v => v?.toString().toLowerCase().includes(filtroGlobal.toLowerCase()));
      }
      if (fechaInicio && row["Fecha"]) {
        const fecha = new Date(row["Fecha"]);
        coincide = coincide && fecha >= fechaInicio;
      }
      if (fechaFin && row["Fecha"]) {
        const fecha = new Date(row["Fecha"]);
        coincide = coincide && fecha <= fechaFin;
      }
      return coincide;
    });
  }, [datos, filtroGlobal, fechaInicio, fechaFin]);

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>Gestión de Datos Excel 📊</Typography>

        <Box mb={2}>
          <input type="file" accept=".xlsx,.xls" onChange={(e) => subirArchivo(e.target.files[0])} />
        </Box>

        <Box mb={2}>
          <Select
            value={archivoSeleccionado}
            onChange={(e) => setArchivoSeleccionado(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Selecciona un archivo</MenuItem>
            {archivos.map((nombre, idx) => (
              <MenuItem key={idx} value={nombre}>{nombre}</MenuItem>
            ))}
          </Select>
        </Box>

        {hojas.length > 0 && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Seleccionar Hojas</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup row>
                {hojas.map((hoja, idx) => (
                  <FormControlLabel
                    key={idx}
                    control={<Checkbox
                      checked={hojasSeleccionadas.includes(hoja)}
                      onChange={() => setHojasSeleccionadas(prev =>
                        prev.includes(hoja) ? prev.filter(h => h !== hoja) : [...prev, hoja]
                      )}
                    />}
                    label={hoja}
                  />
                ))}
              </FormGroup>
              <Button onClick={cargarDatos} variant="contained" sx={{ mt: 2 }}>Cargar Datos</Button>
            </AccordionDetails>
          </Accordion>
        )}

        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Filtro Global"
                value={filtroGlobal}
                onChange={(e) => setFiltroGlobal(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <DatePicker
                selected={fechaInicio}
                onChange={setFechaInicio}
                placeholderText="Fecha Inicio"
                className="form-control"
              />
            </Grid>
            <Grid item xs={6} md={4}>
              <DatePicker
                selected={fechaFin}
                onChange={setFechaFin}
                placeholderText="Fecha Fin"
                className="form-control"
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={4} style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={datosFiltrados.map((row, index) => ({ id: index, ...row }))}
            columns={columnas}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default App;
