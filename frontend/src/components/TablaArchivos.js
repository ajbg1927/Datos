import React, { useEffect, useState } from "react";
import { getArchivos } from "../services/api";  
import { List, ListItemButton, ListItemText, Typography, Paper } from "@mui/material"; 

function TablaArchivos({ setSelectedFile }) {
  const [archivos, setArchivos] = useState([]);

  useEffect(() => {
    getArchivos()
      .then((data) => {
        if (Array.isArray(data)) {
          setArchivos(data);
        } else {
          console.error("Respuesta inesperada de archivos:", data);
          setArchivos([]);
        }
      })
      .catch((error) => console.error("Error cargando archivos:", error));
  }, []);

  return (
    <Paper style={{ padding: "10px", marginTop: "20px" }}>
      <Typography variant="h5">Archivos Subidos 📂</Typography>
      {archivos.length > 0 ? (
        <List>
          {archivos.map((archivo) => (
            <ListItemButton  
              key={archivo.id}
              onClick={() => setSelectedFile(archivo.id)}
            >
              <ListItemText primary={archivo.nombre} />
            </ListItemButton>
          ))}
        </List>
      ) : (
        <Typography>No hay archivos disponibles</Typography>
      )}
    </Paper>
  );
}

export default TablaArchivos;