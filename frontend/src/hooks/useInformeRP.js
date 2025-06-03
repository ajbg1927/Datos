import { useMemo } from 'react';

export default function useInformeRP({ cuadros, datos2 }) {
  return useMemo(() => {
    if (!cuadros || cuadros.length === 0) return { resumen: [], mapaContratistas: {} };

    const cuadroRP = cuadros.find(
      (c) => c.nombre.toLowerCase().includes('registro') && c.nombre.toLowerCase().includes('rp')
    );

    if (!cuadroRP?.datos) return { resumen: [], mapaContratistas: {} };
    const datosRP = cuadroRP.datos;

    const hojaContratistas = datos2?.find(
      (hoja) =>
        hoja.nombre.toLowerCase().includes('contratista') ||
        hoja.nombre.toLowerCase().includes('proveedor')
    );
    const datosContratistas = hojaContratistas?.datos || [];

    const normalizarRP = (rp) => String(rp).trim();

    const contratistasPorRP = {};
    for (const fila of datosContratistas) {
      const rp = normalizarRP(fila['RP']);
      if (!rp) continue;
      if (!contratistasPorRP[rp]) contratistasPorRP[rp] = [];
      contratistasPorRP[rp].push(fila);
    }

    const resumenPorRP = {};

    const obtenerValor = (fila) => {
      const clave = Object.keys(fila).find((k) => k.toLowerCase().includes('valor'));
      return parseFloat(fila[clave]) || 0;
    };

    for (const fila of datosRP) {
      const rp = normalizarRP(fila['RP']);
      if (!rp) continue;

      const valor = obtenerValor(fila);

      if (!resumenPorRP[rp]) {
        resumenPorRP[rp] = {
          RP: rp,
          cantidad: 0,
          total: 0,
          contratistas: contratistasPorRP[rp] || [],
        };
      }

      resumenPorRP[rp].cantidad += 1;
      resumenPorRP[rp].total += valor;
    }

    return {
      resumen: Object.values(resumenPorRP),
      mapaContratistas: contratistasPorRP,
    };
  }, [cuadros, datos2]);
}