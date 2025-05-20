import { useMemo } from 'react';

export default function useInformeRP({ cuadros, datos2 }) {
  return useMemo(() => {
    if (!cuadros || cuadros.length === 0) return { resumen: [], mapaContratistas: {} };

    const cuadroRP = cuadros.find(
      (c) => c.nombre.toLowerCase().includes('registro') && c.nombre.toLowerCase().includes('rp')
    );

    if (!cuadroRP || !cuadroRP.datos) return { resumen: [], mapaContratistas: {} };

    const datosRP = cuadroRP.datos;

    const hojaContratistas = datos2?.find(
      (hoja) => hoja.nombre.toLowerCase().includes('contratistas')
    );
    const datosContratistas = hojaContratistas?.datos || [];

    const contratistasPorRP = {};
    for (const fila of datosContratistas) {
      const rp = fila['RP'];
      if (rp) {
        if (!contratistasPorRP[rp]) contratistasPorRP[rp] = [];
        contratistasPorRP[rp].push(fila);
      }
    }

    const resumenPorRP = {};

    for (const fila of datosRP) {
      const rp = fila['RP'];
      const valor = parseFloat(fila['Valor']) || 0;

      if (!rp) continue;

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