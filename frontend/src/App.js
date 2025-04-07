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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    axios.get(`${API_URL}/archivos`)
      .then(res => {
        setArchivos(Array.isArray(res.data.archivos) ? res.data.archivos : []);
      })
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

    const datosExportados = datos.map(row =>
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

  const datosExportados = datos.map(row =>
      Object.fromEntries(Object.entries(row).filter(([key]) => columnasSeleccionadas.includes(key)))
    );


    const encabezados = columnasSeleccionadas.join(",");
    const filas = datosFiltrados.map(row =>
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
    
    const datosExportados = datos.map(row => columnasSeleccionadas.map(col => row[col] || ""));

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
    setSelectedSheets(typeof event.target.value === "string" ?[event.target.value] : event.target.value);
  };


return (
  <div style={{ padding: 40 }}>
    <Typography variant="h4" gutterBottom>
      Gestión de Datos Excel 📊
    </Typography>

    <input type="file" onChange={(e) => subirArchivo(e.target.files[0])} style={{ marginBottom: 25 }} />

    <div
      onDrop={manejarDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{ border: "2px dashed gray", padding: 20, textAlign: "center", marginBottom: 20 }}
    >
      <p>Arrastra y suelta un archivo aquí</p>
      <input type="file" onChange={manejarArchivo} style={{ display: "none" }} />
      {cargando && <CircularProgress />}
    </div>

    <Box display="flex" gap={5} alignItems="center" flexWrap="wrap" marginBottom={3}>
      <Select
        value={archivoSeleccionado}
        onChange={(e) => {
          setArchivoSeleccionado(e.target.value);
          setHojasSeleccionadas([]);
          obtenerHojas(e.target.value);
        }}
        displayEmpty
        style={{ width: 300, marginBottom: 20 }}
      >
        <MenuItem value="">Seleccionar Archivo</MenuItem>
        {archivos.map((archivo, index) => (
          <MenuItem key={index} value={archivo}>{archivo}</MenuItem>
        ))}
      </Select>

      <Select
        multiple
        value={hojasSeleccionadas}
        onChange={(e) => {
          const value = e.target.value;
          setHojasSeleccionadas(Array.isArray(value) ? value : []);
        }}
        displayEmpty
        style={{ width: 300, marginBottom: 20 }}
        renderValue={(selected) => selected.length > 0 ? selected.join(", ") : "Seleccionar Hojas"}
      >
        {hojas.map((hoja, index) => (
          <MenuItem key={index} value={hoja}>
            <Checkbox checked={hojasSeleccionadas.includes(hoja)} />
            {hoja}
          </MenuItem>
        ))}
      </Select>

      <Button variant="contained" color="primary" onClick={cargarDatos} style={{ marginBottom: 20 }}>
        Cargar Datos
      </Button>
    </Box>

    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Filtros Avanzados 🔍</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TextField
          fullWidth
          label="Buscar en todo el archivo"
          variant="outlined"
          size="small"
          value={filtroGlobal}
          onChange={(e) => setFiltroGlobal(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <DatePicker selected={fechaInicio} onChange={setFechaInicio} placeholderText="Fecha Inicio 📅" />
          </Grid>
          <Grid item xs={6}>
            <DatePicker selected={fechaFin} onChange={setFechaFin} placeholderText="Fecha Fin 📅" />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>

    <Box display="flex" gap={2} flexWrap="wrap" marginTop={2} marginBottom={3}>
      <TextField
        label="Filtrar por dependencia 🏢"
        variant="outlined"
        size="small"
        value={dependencia}
        onChange={(e) => setDependencia(e.target.value)}
      />

      <TextField
        label="Pago mínimo 💰"
        variant="outlined"
        size="small"
        type="number"
        value={pagosMin}
        onChange={(e) => setPagosMin(e.target.value)}
      />

      <TextField
        label="Pago máximo 💰"
        variant="outlined"
        size="small"
        type="number"
        value={pagosMax}
        onChange={(e) => setPagosMax(e.target.value)}
      />

      <Select
        multiple
        value={columnasSeleccionadas}
        onChange={(e) => setColumnasSeleccionadas(e.target.value)}
        displayEmpty
        style={{ width: 250, marginRight: 10 }}
      >
        <MenuItem value="">Seleccionar Columnas</MenuItem>
        {Object.keys(datos[0] || {}).map((columna, index) => (
          <MenuItem key={index} value={columna}>
            <Checkbox checked={columnasSeleccionadas.includes(columna)} />
            {columna}
          </MenuItem>
        ))}
      </Select>

      <TextField
        label="Valor a buscar"
        variant="outlined"
        size="small"
        value={valorBusqueda}
        onChange={(e) => setValorBusqueda(e.target.value)}
      />
    </Box>

    {cargando ? <CircularProgress /> : (
      <DataGrid
        rows={datosFiltrados.map((row, id) => ({ id, ...row }))}
        columns={Object.keys(datos.length > 0 ? datos[0] : {}).map(key => ({ field: key, headerName: key, flex: 1 }))}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
      />
    )}


    <Button variant="contained" color="secondary" onClick={exportarExcel} style={{ marginRight: 10 }}>
      Exportar a Excel
    </Button>
    <Button variant="contained" color="secondary" onClick={exportarCSV}>
      Exportar a CSV
    </Button> 

    {datosFiltrados.length > 0 && (
      <>
        <Typography variant="h6" style={{ marginTop: 30 }}>
          Gráficos 📊
        </Typography>

        <Box display="flex" justifyContent="space-around" flexWrap="wrap">
          <ResponsiveContainer width="45%" height={300}>
            <BarChart data={datosParaGraficos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Dependencia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="TotalPagos" fill="#8884d8" name="Total de Pagos" />
            </BarChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="45%" height={300}>
            <LineChart data={datosParaGraficos}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Dependencia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="TotalPagos" stroke="#82ca9d" name="Total de Pagos" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Button variant="contained" color="primary" onClick={exportarPDF} style={{ marginTop: 20 }}>
        Generar Informe PDF
      </Button>
     </>
    )}
  </div>
);

}

export default App;