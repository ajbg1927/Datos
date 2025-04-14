import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#fefefe", color: "#000", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src="/logo AM.png"
            alt="Logo Municipio de Mosquera"
            style={{ height: 50, marginRight: 16 }}
          />
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "#004d00" }}>
            Análisis de Datos – Municipio de Mosquera
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
