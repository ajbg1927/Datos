import { useMemo } from 'react';

const esFilaVacia = (fila) => {
  return Object.values(fila || {}).every((valor) => valor === null || valor === undefined || valor === '');
};

const useCuadrosExcel = (datos) => {
  return useMemo(() => {
    if (!Array.isArray(datos) || datos.length === 0) return [];

    const cuadros = [];
    let cuadroActual = [];

    datos.forEach((fila) => {
      if (esFilaVacia(fila)) {
        if (cuadroActual.length > 0) {
          cuadros.push([...cuadroActual]);
          cuadroActual = [];
        }
      } else {
        cuadroActual.push(fila);
      }
    });

    if (cuadroActual.length > 0) {
      cuadros.push([...cuadroActual]);
    }

    return cuadros;
  }, [datos]);
};

export default useCuadrosExcel;