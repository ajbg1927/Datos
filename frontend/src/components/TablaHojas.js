import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Paper } from "@mui/material";
import TablaDatos from "./TablaDatos";
import { getHojas } from "../services/api";

function TablaHojas({ fileId }) {
  const [hojas, setHojas] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);

  useEffect(() => {
    const cargarHojas = async () => {
      const data = await getHojas(fileId);
      setHojas(data);
    };
    cargarHojas();
  }, [fileId]);

  return (
    <div>
      <Paper style={{ padding: "10px", marginTop: "20px" }}>
        <Typography variant="h5">Hojas del archivo 📄</Typography>
        {hojas.length > 0 ? (
          <List>
            {hojas.map((hoja, index) => (
              <ListItem key={index} button onClick={() => setSelectedSheet(hoja)}>
                <ListItemText primary={hoja} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No hay hojas disponibles</Typography>
        )}
      </Paper>

      {selectedSheet && <TablaDatos fileId={fileId} sheetName={selectedSheet} />}
    </div>
  );
}

export default TablaHojas;