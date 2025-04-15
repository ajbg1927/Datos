import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import MosqueraLogo from "../../public/logo_am.png";

const Header = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        padding: 2,
        borderBottom: "2px solid #4CAF50",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo_am.png"
          alt="Logo Mosquera"
          style={{ height: 60, marginRight: 16 }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          flexGrow: 1,
          textAlign: "center",
          fontWeight: "bold",
          color: "#2E7D32",
          minWidth: "300px",
        }}
      >
        Análisis de Datos – Municipio de Mosquera
      </Typography>
      <Box sx={{ width: 60 }} />
    </Box>
  );
};

export default Header;

