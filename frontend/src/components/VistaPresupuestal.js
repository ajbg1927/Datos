import React, { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import useCuadrosPresupuestales from '../hooks/useCuadrosPresupuestales';
import SelectorDeCuadro from './SelectorDeCuadro';
import InformePresupuestal from './InformePresupuestal';

const VistaPresupuestal = ({ cuadros = [], datosContratistas = [] }) => {
  const cuadrosPresupuestales = useCuadrosPresupuestales(cuadros);
  const [cuadroSeleccionadoId, setCuadroSeleccionadoId] = useState('');

  const cuadroSeleccionado = cuadrosPresupuestales.find(
    (c) => c.id === cuadroSeleccionadoId
  );

  return (
    <Paper sx={{ p: 3, my: 3 }}>
      <Typography variant="h5" gutterBottom>
        Informe Presupuestal
      </Typography>

      <SelectorDeCuadro
        cuadros={cuadrosPresupuestales}
        seleccionarCuadro={setCuadroSeleccionadoId}
        cuadroSeleccionado={cuadroSeleccionadoId}
        label="Cuadro Presupuestal"
        obtenerValor={(c) => c.id}
        obtenerEtiqueta={(c) => c.nombre}
      />

      {cuadroSeleccionado ? (
        <InformePresupuestal
          datos={cuadroSeleccionado.datos}
          datosContratistas={datosContratistas}
        />
      ) : (
        <Typography variant="body2" color="textSecondary">
          Selecciona un cuadro presupuestal para ver su análisis.
        </Typography>
      )}
    </Paper>
  );
};

export default VistaPresupuestal;