import { useMemo } from 'react';

export default function useInformeRP({ cuadros, datos2 }) {
  return useMemo(() => {
    if (!cuadros || cuadros.length === 0) return { resumen: [], mapaContratistas: {} };

    const normalizarRP = (rp) => String(rp).trim();

    const obtenerCuadro = (nombreParcial) =>
      cuadros.find((c) => c.nombre.toLowerCase().includes(nombreParcial.toLowerCase()));

    const obtenerValor = (fila) => {
      const clave = Object.keys(fila).find((k) => k.toLowerCase().includes('valor'));
      return parseFloat(fila[clave]) || 0;
    };

    const cuadroRP = obtenerCuadro('registro') && obtenerCuadro('rp');
    const cuadroCDP = obtenerCuadro('cdp');
    const cuadroCompromisos = obtenerCuadro('compromiso');

    const datosRP = cuadroRP?.datos || [];
    const datosCDP = cuadroCDP?.datos || [];
    const datosCompromisos = cuadroCompromisos?.datos || [];

    const hojaContratistas = datos2?.find(
      (hoja) =>
        hoja.nombre.toLowerCase().includes('contratista') ||
        hoja.nombre.toLowerCase().includes('proveedor')
    );
    const datosContratistas = hojaContratistas?.datos || [];

    const contratistasPorRP = {};
    for (const fila of datosContratistas) {
      const rp = normalizarRP(fila['RP']);
      if (!rp) continue;
      if (!contratistasPorRP[rp]) contratistasPorRP[rp] = [];
      contratistasPorRP[rp].push(fila);
    }

    const resumenPorRP = {};

    const acumular = (datos, tipo) => {
      for (const fila of datos) {
        const rp = normalizarRP(fila['RP']);
        if (!rp) continue;

        const valor = obtenerValor(fila);
        if (!resumenPorRP[rp]) {
          resumenPorRP[rp] = {
            RP: rp,
            cantidadRP: 0,
            totalRP: 0,
            cantidadCDP: 0,
            totalCDP: 0,
            cantidadCompromisos: 0,
            totalCompromisos: 0,
            contratistas: contratistasPorRP[rp] || [],
          };
        }

        if (tipo === 'RP') {
          resumenPorRP[rp].cantidadRP += 1;
          resumenPorRP[rp].totalRP += valor;
        } else if (tipo === 'CDP') {
          resumenPorRP[rp].cantidadCDP += 1;
          resumenPorRP[rp].totalCDP += valor;
        } else if (tipo === 'COMP') {
          resumenPorRP[rp].cantidadCompromisos += 1;
          resumenPorRP[rp].totalCompromisos += valor;
        }
      }
    };

    acumular(datosRP, 'RP');
    acumular(datosCDP, 'CDP');
    acumular(datosCompromisos, 'COMP');

    return {
      resumen: Object.values(resumenPorRP),
      mapaContratistas: contratistasPorRP,
    };
  }, [cuadros, datos2]);
}