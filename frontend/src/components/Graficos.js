import React, { useEffect, useState } from "react";
import { getDatosHoja } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Graficos({ fileId, sheetName }) {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const data = await getDatosHoja(fileId, sheetName);
      setDatos(data);
    };
    cargarDatos();
  }, [fileId, sheetName]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={datos}>
        <XAxis dataKey="columna1" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="columna2" fill="#8884d8" />
        <Bar dataKey="columna3" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Graficos;