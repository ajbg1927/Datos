import { useMemo } from 'react';

const useGraficos = (datos, columnaAgrupacion, columnaValor) => {
  return useMemo(() => {
    if (!columnaAgrupacion || !columnaValor || !Array.isArray(datos) || datos.length === 0) return [];

    const agrupado = datos.reduce((acc, row) => {
      const clave = row[columnaAgrupacion];
      const valor = parseFloat(row[columnaValor]) || 0;

      if (clave) {
        acc[clave] = (acc[clave] || 0) + valor;
      }
      return acc;
    }, {});

    return Object.entries(agrupado).map(([nombre, valor]) => ({ nombre, valor }));
  }, [datos, columnaAgrupacion, columnaValor]);
};

export default useGraficos;