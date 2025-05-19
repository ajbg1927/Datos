const normalizarTexto = (texto) =>
  texto?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const detectarColumnasPresupuestales = (columnas) => {
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

export const detectarCuadrosPresupuestales = (cuadros = []) => {
  return cuadros.filter((cuadro) => {
    const nombre = normalizarTexto(cuadro?.nombre || '');
    const columnas = cuadro?.datos?.length > 0 ? Object.keys(cuadro.datos[0]) : [];

    return (
      nombre.includes('presupuestal') ||
      nombre.includes('registro') ||
      nombre.includes('cdp') ||
      nombre.includes('rp') ||
      nombre.includes('oblig') ||
      nombre.includes('pago') ||
      columnas.some((col) => {
        const colNorm = normalizarTexto(col);
        return (
          colNorm.includes('cdp') ||
          colNorm.includes('rp') ||
          colNorm.includes('oblig') ||
          colNorm.includes('pago') ||
          colNorm.includes('saldo') ||
          colNorm.includes('valor') ||
          colNorm.includes('monto')
        );
      })
    );
  });
};