import { useMemo } from 'react';

const useFiltrosAvanzado = (
  datos,
  texto,
  fechaInicio,
  fechaFin,
  filtrosDinamicos = {},
  minValor,
  maxValor,
  columnaValor = 'Pagos'
) => {
  const datosFiltrados = useMemo(() => {
    if (!Array.isArray(datos)) return [];

    return datos.filter(row => {
      const contieneTexto = texto
        ? Object.values(row).some(val =>
            String(val ?? '').toLowerCase().includes(texto.toLowerCase())
          )
        : true;

      const fechaColumna = row.Fecha || row.fecha || row.FECHA || row.fechaRegistro || null;
      const fechaValida = fechaColumna ? new Date(fechaColumna) : null;

      const dentroDeRango =
        (!fechaInicio || !fechaValida || new Date(fechaInicio) <= fechaValida) &&
        (!fechaFin || !fechaValida || fechaValida <= new Date(fechaFin));

      const cumpleFiltros = Object.entries(filtrosDinamicos).every(([columna, valor]) => {
        if (!valor) return true;
        const celda = String(row[columna] ?? '').toLowerCase();
        return celda === String(valor).toLowerCase();
      });

      const valorNumerico = parseFloat(row[columnaValor]) || 0;
      const cumpleValorMin = minValor === '' || valorNumerico >= parseFloat(minValor);
      const cumpleValorMax = maxValor === '' || valorNumerico <= parseFloat(maxValor);

      return contieneTexto && dentroDeRango && cumpleFiltros && cumpleValorMin && cumpleValorMax;
    });
  }, [datos, texto, fechaInicio, fechaFin, filtrosDinamicos, minValor, maxValor, columnaValor]);

  return datosFiltrados;
};

const verificarCoincidenciaParcial = (valorFila, valorFiltro) => {
  if (!valorFila || !valorFiltro) return false;

  const valorFilaStr = valorFila.toString().toLowerCase();
  const valorFiltroStr = valorFiltro.toString().toLowerCase();

  if (valorFiltroStr.includes('tic')) {
    return valorFilaStr.includes('tic');
  }

  return valorFilaStr === valorFiltroStr;
};

export const aplicarFiltros = (data, filtrosActivos) => {
  if (Object.keys(filtrosActivos).length === 0) return data;

  return data.filter(row => {
    return Object.keys(filtrosActivos).every(key => {
      const valores = filtrosActivos[key];
      if (!valores || valores.length === 0) return true;

      const esColumnaDependencia = ['dependencia', 'direccion', 'area', 'sector', 'oficina']
        .some(dep => key.toLowerCase().includes(dep.toLowerCase()));

      if (esColumnaDependencia && valores.some(v => v?.toString().toLowerCase().includes('tic'))) {
        return valores.some(valor => verificarCoincidenciaParcial(row[key], valor));
      }

      return valores.includes(row[key]);
    });
  });
};

export default useFiltrosAvanzado;