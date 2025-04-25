import { useState } from "react";
import * as XLSX from "xlsx";

export function useExcelParser() {
  const [sheets, setSheets] = useState([]);
  const [dependenciasPorHoja, setDependenciasPorHoja] = useState({});
  const [datosPorHoja, setDatosPorHoja] = useState({});

  const parseExcel = async (file) => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });

    const hojas = workbook.SheetNames;
    const dependencias = {};
    const datos = {};

    hojas.forEach((nombreHoja) => {
      const sheet = workbook.Sheets[nombreHoja];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      datos[nombreHoja] = json;

      // Buscar columna que tenga "dependencia"
      const colDependencia = Object.keys(json[0] || {}).find((col) =>
        col.toLowerCase().includes("dependencia")
      );

      if (colDependencia) {
        const únicas = [...new Set(json.map((row) => row[colDependencia]))];
        dependencias[nombreHoja] = únicas;
      } else {
        dependencias[nombreHoja] = [];
      }
    });

    setSheets(hojas);
    setDependenciasPorHoja(dependencias);
    setDatosPorHoja(datos);
  };

  return {
    sheets,
    dependenciasPorHoja,
    datosPorHoja,
    parseExcel,
  };
}