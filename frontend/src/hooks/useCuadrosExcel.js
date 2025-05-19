import { useMemo } from 'react';

const esFilaVacia = (fila) => {
  return Object.values(fila || {}).every((valor) => valor === null || valor === undefined || valor === '');
};

const detectarNombreCuadro = (cuadro) => {
  if (!cuadro || cuadro.length === 0) return 'Cuadro sin nombre';

  const posiblesTitulos = cuadro.slice(0, 3); 
  for (const fila of posiblesTitulos) {
    for (const valor of Object.values(fila)) {
      if (typeof valor === 'string' && valor.trim().length > 3) {
        const texto = valor.trim().toUpperCase();
        if (
          texto.includes('CUADRO') ||
          texto.includes('PRESUPUEST') ||
          texto.includes('REGISTRO') ||
          texto.includes('PAGOS') ||
          texto.includes('EJECUCIÓN') ||
          /^[A-Z\s]+$/.test(texto)
        ) {
          return texto;
        }
      }
    }
  }

  return 'Cuadro sin nombre';
};

const useCuadrosExcel = (datos) => {
  return useMemo(() => {
    if (!Array.isArray(datos) || datos.length === 0) return [];

    const cuadros = [];
    let cuadroActual = [];

    datos.forEach((fila) => {
      if (esFilaVacia(fila)) {
        if (cuadroActual.length > 0) {
          const nombre = detectarNombreCuadro(cuadroActual);
          cuadros.push({
            id: cuadros.length,
            nombre,
            datos: [...cuadroActual],
          });
          cuadroActual = [];
        }
      } else {
        cuadroActual.push(fila);
      }
    });

    if (cuadroActual.length > 0) {
      const nombre = detectarNombreCuadro(cuadroActual);
      cuadros.push({
        id: cuadros.length,
        nombre,
        datos: [...cuadroActual],
      });
    }

    return cuadros;
  }, [datos]);
};

export default useCuadrosExcel;