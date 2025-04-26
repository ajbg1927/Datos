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
    console.log('useFiltrosAvanzado - Inicio del useMemo');
    console.log('useFiltrosAvanzado - Datos recibidos:', datos);
    console.log('useFiltrosAvanzado - Texto:', texto);
    console.log('useFiltrosAvanzado - Fecha Inicio:', fechaInicio);
    console.log('useFiltrosAvanzado - Fecha Fin:', fechaFin);
    console.log('useFiltrosAvanzado - Filtros Dinámicos:', filtrosDinamicos);
    console.log('useFiltrosAvanzado - Min Valor:', minValor);
    console.log('useFiltrosAvanzado - Max Valor:', maxValor);
    console.log('useFiltrosAvanzado - Columna Valor:', columnaValor);

    if (!Array.isArray(datos)) {
      console.log('useFiltrosAvanzado - Datos no es un array, devolviendo array vacío.');
      return [];
    }

    const resultadoFiltrado = datos.filter(row => {
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

      const valor = parseFloat(row[columnaValor]) || 0;
      const cumpleValorMin = minValor === '' || valor >= parseFloat(minValor);
      const cumpleValorMax = maxValor === '' || valor <= parseFloat(maxValor);

      return contieneTexto && dentroDeRango && cumpleFiltros && cumpleValorMin && cumpleValorMax;
    });

    console.log('useFiltrosAvanzado - Resultado del filtrado:', resultadoFiltrado);
    console.log('useFiltrosAvanzado - Longitud del resultado filtrado:', resultadoFiltrado.length);

    return resultadoFiltrado;
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

const aplicarFiltros = (data, filtrosActivos) => {
  if (Object.keys(filtrosActivos).length === 0) return data;

  return data.filter(row => {
    return Object.keys(filtrosActivos).every(key => {
      const valores = filtrosActivos[key];
      if (!valores || valores.length === 0) return true;

      const esColumnaDependencia = ['dependencia', 'direccion', 'area', 'sector', 'oficina']
        .some(dep => key.toLowerCase().includes(dep.toLowerCase()));

      if (esColumnaDependencia && valores.some(v => v && v.toString().toLowerCase().includes('tic'))) {
        return valores.some(valor => verificarCoincidenciaParcial(row[key], valor));
      }

      return valores.includes(row[key]);
    });
  });
};

export default useFiltrosAvanzado;