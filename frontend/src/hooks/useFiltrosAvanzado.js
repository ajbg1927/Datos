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

      const valor = parseFloat(row[columnaValor]) || 0;
      const cumpleValorMin = minValor === '' || valor >= parseFloat(minValor);
      const cumpleValorMax = maxValor === '' || valor <= parseFloat(maxValor);

      return contieneTexto && dentroDeRango && cumpleFiltros && cumpleValorMin && cumpleValorMax;
    });
  }, [datos, texto, fechaInicio, fechaFin, filtrosDinamicos, minValor, maxValor, columnaValor]);

  return datosFiltrados;
};

export default useFiltrosAvanzado;
