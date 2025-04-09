import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Button, Typography, Select, MenuItem, TextField, Box, CircularProgress, Checkbox, FormControlLabel, FormGroup, Grid, Divider, TablePagination, Accordion,
  AccordionSummary, AccordionDetails
 } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [dependencia, setDependencia] = useState("");
  const [pagosMin, setPagosMin] = useState("");
  const [pagosMax, setPagosMax] = useState("");
  const [columnaSeleccionada, setColumnaSeleccionada] = useState("");
  const [valorEspecifico, setValorEspecifico] = useState("");
  const [columnasSeleccionadas, setColumnasSeleccionadas] = useState([]);
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [selectedSheets, setSelectedSheets] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


 useEffect(() => {
    axios.get(`${API_URL}/archivos`)
      .then(res => {
        setArchivos(Array.isArray(res.data.archivos) ? res.data.archivos : []);
      })
      .catch(error => console.error("Error obteniendo archivos:", error));
  }, [archivoSubido]);

 const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  setSelectedFile(file);
};

const onClick = async () => {
  if (!selectedFile) {
    alert("Por favor selecciona un archivo Excel.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile); 

  try {
    const response = await axios.post(
      "https://backend-flask-0rnq.onrender.com/datos/${nombreArchivo}", 
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Datos obtenidos:", response.data);
    setDatos(response.data);
  } catch (error) {
    console.error("Error obteniendo datos:", error);
  }
};

  const subirArchivo = async (file) => {
    if (!file || (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls"))) {
      alert("Solo se permiten archivos Excel.");
      return;
    }

    setCargando(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/subir`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Archivo subido exitosamente");
      setArchivoSubido(file.name);
      setArchivos([...archivos, file.name]);
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert("Error al subir el archivo.");
    }
    setCargando(false);
  };

  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    subirArchivo(file);
  };

  const manejarDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    subirArchivo(file);
  };

  const obtenerHojas = async (archivo) => {
    if (!archivo) return;
    try {
      const res = await axios.get(`${API_URL}/hojas/${encodeURIComponent(archivo)}`);
      setHojas(res.data.hojas || []);
    } catch (error) {
      console.error("Error obteniendo hojas:", error);
      setHojas([]);
    }
  };

  const cargarDatos = async () => {
    if (!archivoSeleccionado || hojasSeleccionadas.length === 0) {
      alert("Selecciona un archivo y al menos una hoja antes de cargar los datos.");
      return;
    }

    setCargando(true);
    try {
      const res = await axios.post(`${API_URL}/datos/${encodeURIComponent(archivoSeleccionado)}`, {
        hojas: hojasSeleccionadas
      });
      setDatos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error obteniendo datos:", error);
      alert("Error al obtener datos.");
      setDatos([]);
    }
    setCargando(false);
  };

  const toggleHojaSeleccionada = (hoja) => {
    setHojasSeleccionadas(prev =>
      prev.includes(hoja) ? prev.filter(h => h !== hoja) : [...prev, hoja]
    );
  };

  const exportarExcel = () => {
    if (columnasSeleccionadas.length === 0) {
      alert("Selecciona al menos una columna para exportar.");
      return;
    }
    const datosExportados = datosFiltrados.map(row =>
      Object.fromEntries(Object.entries(row).filter(([key]) => columnasSeleccionadas.includes(key)))
    );
    const ws = XLSX.utils.json_to_sheet(datosExportados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Filtrados");
    XLSX.writeFile(wb, "datos_filtrados.xlsx");
  };

  const exportarCSV = () => {
    if (columnasSeleccionadas.length === 0) {
      alert("Selecciona al menos una columna para exportar.");
      return;
    }
    const datosExportados = datosFiltrados.map(row =>
      Object.fromEntries(Object.entries(row).filter(([key]) => columnasSeleccionadas.includes(key)))
    );
    const encabezados = columnasSeleccionadas.join(",");
    const filas = datosExportados.map(row =>
      columnasSeleccionadas.map(col => `"${row[col] || ""}"`).join(",")
    );
    const contenidoCSV = [encabezados, ...filas].join("\n");
    const blob = new Blob([contenidoCSV], { type: "text/csv" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "datos_filtrados.csv";
    enlace.click();
  };

  const columnas = datos.length > 0
    ? Object.keys(datos[0]).map((key) => ({ field: key, headerName: key, flex: 1, sortable: true }))
    : [];

  const exportarPDF = () => {
    if (datos.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const doc = new jsPDF();
    doc.text("Informe de Datos Filtrados", 10, 10);
    const datosExportados = datosFiltrados.map(row => columnasSeleccionadas.map(col => row[col] || ""));
    autoTable(doc, {
      head: [columnasSeleccionadas],
      body: datosExportados
    });
    doc.save("Informe_Datos_Filtrados.pdf");
  };

  const datosFiltrados = useMemo(() => {
    const datosArray = Array.isArray(datos) ? datos : [];
    return datosArray.filter(row => {
      let coincide = true;
      if (filtroGlobal) {
        coincide = Object.values(row).some(val => val?.toString().toLowerCase().includes(filtroGlobal.toLowerCase()));
      }
      if (fechaInicio && row["Fecha"]) {
        const fechaRow = new Date(row["Fecha"]);
        coincide = coincide && fechaRow >= fechaInicio;
      }
      if (fechaFin && row["Fecha"]) {
        const fechaRow = new Date(row["Fecha"]);
        coincide = coincide && fechaRow <= fechaFin;
      }
      if (dependencia) {
        coincide = coincide && (row.Dependencia?.toLowerCase() === dependencia.toLowerCase());
      }
      if (pagosMin || pagosMax) {
        const pagos = parseFloat(row["Pagos"] || 0);
        if (pagosMin) coincide = coincide && pagos >= parseFloat(pagosMin);
        if (pagosMax) coincide = coincide && pagos <= parseFloat(pagosMax);
      }
      if (columnaSeleccionada && valorEspecifico) {
        const valorColumna = row[columnaSeleccionada]?.toString().toLowerCase() || "";
        coincide = coincide && valorColumna.includes(valorEspecifico.toLowerCase());
      }
      return coincide;
    });
  }, [datos, filtroGlobal, fechaInicio, fechaFin, dependencia, pagosMin, pagosMax, columnaSeleccionada, valorEspecifico]);

  const datosParaGraficos = Object.values(
    datosFiltrados.reduce((acc, row) => {
      const dep = row.Dependencia || "Desconocido";
      const pagos = parseFloat(row.Pagos) || 0;
      if (!acc[dep]) {
        acc[dep] = { Dependencia: dep, TotalPagos: 0 };
      }
      acc[dep].TotalPagos += pagos;
      return acc;
    }, {})
  );

  const generarInforme = () => {
    if (datosFiltrados.length === 0) {
      alert("No hay datos filtrados para generar un informe.");
      return;
    }
    let contenido = "INFORME DE DATOS FILTRADOS\n\n";
    contenido += `Fecha de Generación: ${new Date().toLocaleString()}\n\n`;
    contenido += "**Filtros Aplicados:**\n";
    contenido += `- Filtro Global: ${filtroGlobal || "Ninguno"}\n`;
    contenido += `- Fecha Inicio: ${fechaInicio ? fechaInicio.toLocaleDateString() : "No aplicada"}\n`;
    contenido += `- Fecha Fin: ${fechaFin ? fechaFin.toLocaleDateString() : "No aplicada"}\n`;
    contenido += `- Dependencia: ${dependencia || "No aplicada"}\n`;
    contenido += `- Pagos Mínimos: ${pagosMin || "No aplicados"}\n`;
    contenido += `- Pagos Máximos: ${pagosMax || "No aplicados"}\n\n`;
    contenido += "**Datos Filtrados:**\n\n";
    datosFiltrados.forEach((fila, index) => {
      contenido += `Registro ${index + 1}:\n`;
      Object.entries(fila).forEach(([key, value]) => {
        contenido += `   - ${key}: ${value}\n`;
      });
      contenido += "\n";
    });
    const blob = new Blob([contenido], { type: "text/plain" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "Informe_Datos_Filtrados.txt";
    enlace.click();
  };

  const handleSheetChange = (event) => {
    setSelectedSheets(typeof event.target.value === "string" ? [event.target.value] : event.target.value);
  };

  return (
    <div style={{ padding: 40 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Datos Excel 📊
      </Typography>

      <div
        onDrop={manejarDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{ border: "2px dashed gray", padding: 20, textAlign: "center", marginBottom: 20 }}
      >
        <p>Arrastra y suelta un archivo aquí o selecciona uno:</p>
        <input type="file" accept=".xlsx,.xls" onChange={manejarArchivo} />
        {cargando && <CircularProgress />}
      </div>

       <Box mb={2}>
        <Select
          value={archivoSeleccionado}
          onChange={(e) => {
            setArchivoSeleccionado(e.target.value);
            obtenerHojas(e.target.value);
          }}
          displayEmpty
          style={{ marginLeft: 10, minWidth: 200 }}
        >
          <MenuItem value="" disabled>
            Selecciona un archivo
          </MenuItem>
          {archivos.map((archivo, idx) => (
            <MenuItem key={idx} value={archivo}>
              {archivo}
            </MenuItem>
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
                control={
                  <Checkbox
                    checked={hojasSeleccionadas.includes(hoja)}
                    onChange={() => toggleHojaSeleccionada(hoja)}
                  />
                }
                label={hoja}
              />
            ))}
          </FormGroup>
          <Button variant="contained" onClick={cargarDatos}>
            Cargar Datos
          </Button>
        </AccordionDetails>
      </Accordion>
    )}

    <Box mt={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Filtro Global 🔍"
            value={filtroGlobal}
            onChange={(e) => setFiltroGlobal(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <DatePicker
            selected={fechaInicio}
            onChange={(date) => setFechaInicio(date)}
            placeholderText="Fecha Inicio 📅"
            className="form-control"
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <DatePicker
            selected={fechaFin}
            onChange={(date) => setFechaFin(date)}
            placeholderText="Fecha Fin 📅"
            className="form-control"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            label="Dependencia 🏢"
            value={dependencia}
            onChange={(e) => setDependencia(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={2}>
          <TextField
            label="Pagos Mín 💰"
            value={pagosMin}
            onChange={(e) => setPagosMin(e.target.value)}
            type="number"
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField
            label="Pagos Máx 💰"
            value={pagosMax}
            onChange={(e) => setPagosMax(e.target.value)}
            type="number"
            fullWidth
          />
        </Grid>

        <Grid item xs={6} md={4}>
          <TextField
            label="Columna Específica"
            value={columnaSeleccionada}
            onChange={(e) => setColumnaSeleccionada(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextField
            label="Valor a Buscar"
            value={valorEspecifico}
            onChange={(e) => setValorEspecifico(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </Box>

    <Box mt={3}>
      <Typography variant="h6">Selecciona columnas para exportar:</Typography>
      <FormGroup row>
        {columnas.map((col) => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                checked={columnasSeleccionadas.includes(col.field)}
                onChange={() =>
                  setColumnasSeleccionadas((prev) =>
                    prev.includes(col.field)
                      ? prev.filter((c) => c !== col.field)
                      : [...prev, col.field]
                  )
                }
              />
            }
            label={col.headerName}
          />
        ))}
      </FormGroup>

      <Box mt={2}>
        <Button variant="contained" onClick={exportarExcel} sx={{ mr: 1 }}>
          Exportar a Excel
        </Button>
        <Button variant="contained" onClick={exportarCSV} sx={{ mr: 1 }}>
          Exportar a CSV
        </Button>
        <Button variant="contained" onClick={exportarPDF} sx={{ mr: 1 }}>
          Exportar a PDF
        </Button>
        <Button variant="outlined" onClick={generarInforme}>
          Generar Informe TXT
        </Button>
      </Box>
    </Box>

    <Box mt={4} style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={datosFiltrados.map((row, index) => ({ id: index, ...row }))}
        columns={columnas}
        pageSize={rowsPerPage}
        onPageSizeChange={(newPageSize) => setRowsPerPage(newPageSize)}
        pagination
        paginationModel={{ pageSize: rowsPerPage, page: page }}
        onPaginationModelChange={({ page }) => setPage(page)}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        disableRowSelectionOnClick
      />
    </Box>

    {datosParaGraficos.length > 0 && (
      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Gráfico de Total de Pagos por Dependencia 📊
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosParaGraficos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Dependencia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalPagos" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    )}
  </div>
);

}

export default App;