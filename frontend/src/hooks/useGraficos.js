import { useMemo } from 'react';

const useGraficos = (datos, columnaAgrupacion, columnaValor) => {
  const datosAgrupados = useMemo(() => {
    if (!columnaAgrupacion || !columnaValor || datos.length === 0) return [];

    const agrupado = datos.reduce((acc, row) => {
      const clave = row[columnaAgrupacion];
      const valor = parseFloat(row[columnaValor]) || 0;

      if (!clave) return acc;

      if (!acc[clave]) acc[clave] = 0;
      acc[clave] += valor;

      return acc;
    }, {});

    return Object.entries(agrupado).map(([key, value]) => ({
      nombre: key,
      valor: value
    }));
  }, [datos, columnaAgrupacion, columnaValor]);

  return datosAgrupados;
};

export default useGraficos;