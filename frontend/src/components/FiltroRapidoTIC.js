import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Box, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Chip,
  Tooltip
} from '@mui/material';
import ComputerIcon from '@mui/icons-material/Computer';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FiltroRapidoTIC = ({ 
  columns, 
  setFiltrosActivos,
  filtrosActivos,
  data
}) => {
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState('');
  const [filtroTICActivo, setFiltroTICActivo] = useState(false);

  useEffect(() => {
    const columnasDependencia = ['dependencia', 'direccion', 'area', 'sector'];
    const hayFiltroTIC = Object.keys(filtrosActivos).some(key => {
      const keyLower = key.toLowerCase();
      return columnasDependencia.some(col => keyLower.includes(col)) && 
             Array.isArray(filtrosActivos[key]) && 
             filtrosActivos[key].some(val => 
               val && val.toString().toLowerCase().includes('tic')
             );
    });
    
    setFiltroTICActivo(hayFiltroTIC);
  }, [filtrosActivos]);

  const aplicarFiltroTIC = () => {
    const columnasPosibles = ['dependencia', 'direccion', 'area', 'sector', 'oficina'];
    
    const columnasEncontradas = columns.filter(col => 
      columnasPosibles.some(posible => 
        col.toLowerCase().includes(posible.toLowerCase())
      )
    );
    
    if (columnasEncontradas.length > 0) {
      const columnaSeleccionada = columnasEncontradas[0];
      
      const tieneDataTIC = data.some(row => {
        const valor = row[columnaSeleccionada];
        return valor && 
               valor.toString().toLowerCase().includes('tic');
      });
      
      if (tieneDataTIC) {
        const nuevosFiltros = {
          ...filtrosActivos,
          [columnaSeleccionada]: ['TIC', 'DIRECCION DE LAS TIC', 'Dirección de las TIC', 'DIRECCIÓN DE LAS TIC']
        };
        
        setFiltrosActivos(nuevosFiltros);
        setFiltroTICActivo(true);
        setMensajeConfirmacion('Filtro por Dirección de las TIC aplicado');
        
        setTimeout(() => {
          setMensajeConfirmacion('');
        }, 3000);
      } else {
        setDialogoAbierto(true);
      }
    } else {
      setDialogoAbierto(true);
    }
  };

  const quitarFiltroTIC = () => {
    const columnasPosibles = ['dependencia', 'direccion', 'area', 'sector', 'oficina'];
    const nuevosFiltros = {...filtrosActivos};
    
    Object.keys(nuevosFiltros).forEach(key => {
      if (columnasPosibles.some(col => key.toLowerCase().includes(col.toLowerCase()))) {
        delete nuevosFiltros[key];
      }
    });
    
    setFiltrosActivos(nuevosFiltros);
    setFiltroTICActivo(false);
    setMensajeConfirmacion('Filtro por Dirección de las TIC removido');
    
    setTimeout(() => {
      setMensajeConfirmacion('');
    }, 3000);
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
      {!filtroTICActivo ? (
        <Tooltip title="Filtrar por Dirección de las TIC">
          <Button
            variant="contained"
            color="primary"
            onClick={aplicarFiltroTIC}
            startIcon={<ComputerIcon />}
            sx={{ 
              backgroundColor: '#00796b', 
              '&:hover': { backgroundColor: '#004d40' } 
            }}
          >
            Dirección de las TIC
          </Button>
        </Tooltip>
      ) : (
        <Chip
          icon={<ComputerIcon />}
          label="Filtro TIC Activo"
          color="primary"
          onDelete={quitarFiltroTIC}
          sx={{ 
            backgroundColor: '#00796b',
            '& .MuiChip-deleteIcon': {
              color: 'white',
              '&:hover': { color: '#ff5252' }
            }
          }}
        />
      )}
      
      {mensajeConfirmacion && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'success.main',
            animation: 'fadeIn 0.5s'
          }}
        >
          {mensajeConfirmacion}
        </Typography>
      )}
      
      <Dialog open={dialogoAbierto} onClose={() => setDialogoAbierto(false)}>
        <DialogTitle>
          No se encontraron datos de la Dirección TIC
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            No se pudo encontrar información de la "Dirección de las TIC" en este archivo.
            Por favor, verifique que el archivo contenga información relacionada con esta dependencia.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogoAbierto(false)} color="primary">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FiltroRapidoTIC;