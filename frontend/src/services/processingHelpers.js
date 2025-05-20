export const combinarDatosArchivos = (datosPorArchivo) => {
  const datosCombinados = Object.values(datosPorArchivo).flat();
  return datosCombinados;
};

export const obtenerColumnasUnicas = (datos) => {
  if (!datos || datos.length === 0) return [];
  const columnasSet = new Set();
  datos.forEach((item) => {
    Object.keys(item).forEach((key) => columnasSet.add(key));
  });
  return Array.from(columnasSet);
};

export const obtenerColumnasNumericas = (datos, columnas) => {
  if (!datos || datos.length === 0) return [];
  return columnas.filter((col) =>
    datos.every((item) => item[col] === undefined || item[col] === null || !isNaN(Number(item[col])))
  );
};

export const obtenerColumnasFecha = (datos, columnas) => {
  if (!datos || datos.length === 0) return [];
  return columnas.filter((col) =>
    datos.every((item) => {
      const value = item[col];
      if (!value) return true;
      const fecha = Date.parse(value);
      return !isNaN(fecha);
    })
  );
};

export const obtenerValoresUnicosPorColumna = (datos, columnas) => {
  if (!datos || datos.length === 0) return {};
  const valores = {};

  columnas.forEach((col) => {
    const setValores = new Set();
    datos.forEach((item) => {
      if (item[col] !== undefined && item[col] !== null) {
        setValores.add(item[col]);
      }
    });
    valores[col] = Array.from(setValores);
  });

  return valores;
};