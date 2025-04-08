import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getDatosHoja } from "../services/api";
import axios from "axios";
import { DataGrid, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector, GridToolbarExport } from "@mui/x-data-grid";
import {
  Button, TextField, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControlLabel, Checkbox, Typography, Box
} from "@mui/material";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Parser } from "json2csv";
import jsPDF from "jspdf";
import Papa from "papaparse";
import "jspdf-autotable";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function TablaDatos({ fileId, sheetName }) {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [filtroGlobal, setFiltroGlobal] = useState("");
  const [filtroColumna, setFiltroColumna] = useState("");
  const [valorFiltro, setValorFiltro] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);
  const [columnaBusqueda, setColumnaBusqueda] = useState("");
  const [valorBusqueda, setValorBusqueda] = useState("");
  const [filasFiltradas, setFilasFiltradas] = useState([]);
  const [filters, setFilters] = useState({});
  const [reportLinks, setReportLinks] = useState(null);

const API_URL = process.env.REACT_APP_BACKEND_URL;

useEffect(() => {
  const cargarDatos = async () => {
      if (!fileId || !sheetName) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/datos/${fileId}/${sheetName}`);
        const datosConId = res.data.map((row, index) => ({
          id: row.id && row.id.toString().trim() !== "" ? row.id : `row-${index}`,
          ...row
        }));
        setDatos(datosConId);

        if (datosConId.length > 0) {
          const columnasGeneradas = Object.keys(datosConId[0])
            .filter(col => col.trim() !== "" && !col.startsWith("Unnamed"))
            .map((col) => ({
              field: col,
              headerName: col.toUpperCase(),
              width: 200,
              flex: 1,
              sortable: true
            }));
          setColumns(columnasGeneradas);
          setSelectedColumns(columnasGeneradas.map(col => col.field));
        }
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
      setLoading(false);
    };
    cargarDatos();
  }, [fileId, sheetName]);

const filasFiltradas = useMemo(() => {
    return datos.filter((row) => {
      const filtroPorColumna = Object.keys(filters).every((key) => {
        if (!filters[key]) return true;
        return String(row[key]).toLowerCase().includes(filters[key].toLowerCase());
      });

      const filtroGlobalMatch = Object.values(row).some(value =>
        value && value.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
      );

      return filtroPorColumna && filtroGlobalMatch;
    });
  }, [datos, filters, filtroGlobal]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

     const handleFiltroGlobal = (event) => {
        setFiltroGlobal(event.target.value);
    };

    const handleFiltroColumna = (event) => {
        setFiltroColumna(event.target.value);
    };

    const handleValorFiltro = (event) => {
        setValorFiltro(event.target.value);
    };

    const datosFiltrados = datos.filter((fila) => {
        const coincideGlobal = Object.values(fila).some((valor) =>
            valor.toString().toLowerCase().includes(filtroGlobal.toLowerCase())
        );
        const coincideColumna = filtroColumna
            ? fila[filtroColumna] && fila[filtroColumna].toString().toLowerCase().includes(valorFiltro.toLowerCase())
            : true;
        return coincideGlobal && coincideColumna;
    });

    const exportarExcel = useCallback(() => {
    const ws = XLSX.utils.json_to_sheet(filasFiltradas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos Filtrados");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "datos_filtrados.xlsx");
  }, [filasFiltradas]);


    const exportarCSV = useCallback(() => {
    const parser = new Parser({ fields: Object.keys(filasFiltradas[0] || {}) });
    const csv = parser.parse(filasFiltradas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "datos_filtrados.csv");
  }, [filasFiltradas]);

    const generarInforme = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Informe de Datos Filtrados", 10, 10);
    doc.autoTable({
      head: [columns.map(col => col.headerName)],
      body: filasFiltradas.map(row => columns.map(col => row[col.field] || "")),
      startY: 20
    });
    doc.save("informe_datos.pdf");
  }, [filasFiltradas, columns]);


      const handleExportarSeleccionadas = () => {
    const dataExportada = filasFiltradas.map(row =>
      selectedColumns.reduce((obj, key) => {
        obj[key] = row[key];
        return obj;
      }, {})
    );

    const ws = XLSX.utils.json_to_sheet(dataExportada);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Seleccionadas");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "columnas_seleccionadas.xlsx");

    setOpenModal(false);
  };

  return (
    <div style={{ height: 600, width: "100%" }}>
      <Typography variant="h6">Filtro Global 🔍:</Typography>
      <TextField
        label="Buscar en todos los datos..."
        variant="outlined"
        size="small"
        fullWidth
        value={filtroGlobal}
        onChange={(e) => setFiltroGlobal(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        {columns.map((col) => (
          <TextField
            key={col.field}
            label={`Filtrar ${col.headerName}`}
            variant="outlined"
            size="small"
            onChange={(e) => handleFilterChange(col.field, e.target.value)}
          />
        ))}
      </Box>

      <DataGrid
        rows={filasFiltradas}
        columns={columns.filter(col => selectedColumns.includes(col.field))}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20, 50, 100]}
        pagination
        loading={loading}
        getRowId={(row) => row.id || `fallback-${Math.random()}`}
        sortingMode="client"
        autoHeight
      />

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel>Selecciona una columna</InputLabel>
          <Select
            value={columnaBusqueda}
            onChange={(e) => setColumnaBusqueda(e.target.value)}
          >
            {columns.map((col) => (
              <MenuItem key={col.field} value={col.field}>
                {col.headerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Buscar"
          variant="outlined"
          value={valorBusqueda}
          onChange={(e) => setValorBusqueda(e.target.value)}
          disabled={!columnaBusqueda}
        />
      </div>

      <Button variant="contained" color="primary" onClick={exportarExcel} style={{ marginRight: "10px" }}>
        Exportar a Excel
      </Button>

      <Button variant="contained" color="secondary" onClick={exportarCSV}>
        Exportar CSV
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={() => setOpenModal(true)}
        style={{ marginLeft: "10px" }}
      >
        Seleccionar Columnas para Exportar
      </Button>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Seleccionar Columnas para Exportar</DialogTitle>
        <DialogContent>
          {columns.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={selectedColumns.includes(col.field)}
                  onChange={() => handleColumnToggle(col.field)}
                />
              }
              label={col.headerName}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>

     {reportLinks && (
        <div style={{ marginTop: "20px" }}>
          <h3>Informe Generado 📑</h3>
          {reportLinks.excel_url && (
            <p>
              📊 <a href={`${API_URL}${reportLinks.excel_url}`} download>Descargar Excel</a>
            </p>
          )}
          {reportLinks.pdf_url && (
            <p>
              📄 <a href={`${API_URL}${reportLinks.pdf_url}`} download>Descargar PDF</a>
            </p>
          )}
        </div>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Seleccionar Columnas para Exportar</DialogTitle>
        <DialogContent>
          {columns.map((col) => (
            <FormControlLabel
              key={col.field}
              control={
                <Checkbox
                  checked={selectedColumns.includes(col.field)}
                  onChange={() => handleColumnToggle(col.field)}
                />
              }
              label={col.headerName}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleExportarSeleccionadas} color="primary">
            Exportar
          </Button>
        </DialogActions>
      </Dialog>

         <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filasFiltradas}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={columns.length > 0 ? columns[0].field : ""} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={columns.length > 1 ? columns[1].field : ""} stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TablaDatos;