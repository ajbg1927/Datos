import { useMemo } from 'react';

const normalizarTexto = (texto) =>
  texto?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const detectarColumnasPresupuestales = (columnas) => {
  const claves = {};

  columnas.forEach((col) => {
    const colNorm = normalizarTexto(col);
    if (colNorm.includes('cdp')) claves.cdp = col;
    else if (colNorm.includes('rp')) claves.rp = col;
    else if (colNorm.includes('oblig')) claves.obligacion = col;
    else if (colNorm.includes('pago')) claves.pago = col;
    else if (colNorm.includes('valor') || colNorm.includes('monto')) claves.valor = col;
    else if (colNorm.includes('saldo')) claves.saldo = col;
  });

  return claves;
};

const useInformePresupuestal = (datos, datosContratistas = []) => {
  const informe = useMemo(() => {
    if (!Array.isArray(datos) || datos.length === 0) return null;

    const columnas = Object.keys(datos[0]);
    const claves = detectarColumnasPresupuestales(columnas);

    const resumen = {
      totalCDP: 0,
      totalRP: 0,
      totalObligado: 0,
      totalPagado: 0,
      totalValor: 0,
      totalSaldo: 0,
      registros: datos.length,
    };

    datos.forEach((row) => {
      if (claves.cdp && row[claves.cdp]) resumen.totalCDP += 1;
      if (claves.rp && row[claves.rp]) resumen.totalRP += 1;

      if (claves.obligacion) {
        const val = Number(row[claves.obligacion]);
        resumen.totalObligado += isNaN(val) ? 0 : val;
      }
      if (claves.pago) {
        const val = Number(row[claves.pago]);
        resumen.totalPagado += isNaN(val) ? 0 : val;
      }
      if (claves.valor) {
        const val = Number(row[claves.valor]);
        resumen.totalValor += isNaN(val) ? 0 : val;
      }
      if (claves.saldo) {
        const val = Number(row[claves.saldo]);
        resumen.totalSaldo += isNaN(val) ? 0 : val;
      }
    });

    const nombreColumnaRP = claves.rp;
    const vinculaciones = {};

    if (nombreColumnaRP && Array.isArray(datosContratistas) && datosContratistas.length > 0) {
      const posiblesNombresRP = ['rp', 'no rp', 'número rp'];

      const colRPContratistas = Object.keys(datosContratistas[0]).find((col) =>
        posiblesNombresRP.some((k) => normalizarTexto(col).includes(k))
      );

      if (colRPContratistas) {
        datos.forEach((row) => {
          const rp = row[nombreColumnaRP];
          if (rp) {
            const relacionados = datosContratistas.filter(
              (d) =>
                String(d[colRPContratistas]).toLowerCase().trim() === String(rp).toLowerCase().trim()
            );
            if (relacionados.length > 0) {
              vinculaciones[rp] = relacionados;
            }
          }
        });
      }
    }

    return { resumen, claves, vinculaciones };
  }, [datos, datosContratistas]);

  return informe;
};

export default useInformePresupuestal;