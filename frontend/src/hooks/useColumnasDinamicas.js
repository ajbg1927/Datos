import { useMemo } from 'react';

const useColumnasDinamicas = (datos, columna) => {
  const valoresUnicos = useMemo(() => {
    if (!columna || datos.length === 0) return [];
    const conjunto = new Set();
    datos.forEach(row => {
      const valor = row[columna];
      if (valor !== undefined && valor !== null) {
        conjunto.add(valor.toString());
      }
    });
    return Array.from(conjunto).sort();
  }, [datos, columna]);

  return valoresUnicos;
};

export default useColumnasDinamicas;
