import { useMemo } from 'react';
import { normalizarTexto } from './utils'; 

const useContratistasPorRP = (datosContratistas) => {
  return useMemo(() => {
    if (!Array.isArray(datosContratistas)) return {};

    const columnas = Object.keys(datosContratistas[0]);
    const claveRP = columnas.find((col) => normalizarTexto(col).includes('rp'));
    const claveNombre = columnas.find((col) =>
      ['contratista', 'nombre', 'proveedor'].some((v) =>
        normalizarTexto(col).includes(v)
      )
    );

    if (!claveRP || !claveNombre) return {};

    const mapa = {};
    datosContratistas.forEach((fila) => {
      const rp = fila[claveRP];
      const nombre = fila[claveNombre];
      if (rp && nombre) {
        mapa[rp] = nombre;
      }
    });

    return mapa;
  }, [datosContratistas]);
};

export default useContratistasPorRP;