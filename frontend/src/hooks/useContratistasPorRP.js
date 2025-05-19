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
    const claveObjeto = columnas.find((col) =>
      ['objeto', 'descripcion', 'detalle'].some((v) =>
        normalizarTexto(col).includes(v)
      )
    );
    const claveValor = columnas.find((col) =>
      ['valor', 'total', 'monto'].some((v) =>
        normalizarTexto(col).includes(v)
      )
    );

    if (!claveRP || !claveNombre) return {};

    const mapa = {};

    datosContratistas.forEach((fila) => {
      const rp = fila[claveRP];
      if (!rp) return;

      const contratista = {
        Nombre: fila[claveNombre],
        Objeto: claveObjeto ? fila[claveObjeto] : '',
        Valor: claveValor ? parseFloat(fila[claveValor]) || 0 : null,
      };

      if (!mapa[rp]) mapa[rp] = [];
      mapa[rp].push(contratista);
    });

    return mapa;
  }, [datosContratistas]);
};

export default useContratistasPorRP;