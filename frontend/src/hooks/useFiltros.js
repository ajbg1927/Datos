import { useMemo } from 'react';

const useFiltros = ({
  datos,
  texto,
  fechaInicio,
  fechaFin,
  filtrosColumnas = {}, 
  pagosMin,
  pagosMax,
}) => {
  const datosFiltrados = useMemo(() => {
    if (!Array.isArray(datos)) return [];

    return datos.filter(row => {
      const contieneTexto = texto
        ? Object.values(row).some(val =>
            val?.toString().toLowerCase().includes(texto.toLowerCase())
          )
        : true;

      const cumpleFiltrosColumna = Object.entries(filtrosColumnas).every(([columna, valorFiltro]) => {
        if (!valorFiltro) return true;
        const valor = row[columna];
        return valor !== undefined && valor !== null && valor.toString() === valorFiltro;
      });

      const posiblesFechas = ['Fecha', 'fecha', 'FECHA', 'fechaRegistro'];
      const fechaColumna = posiblesFechas.find(key => row[key]);
      const fechaValor = fechaColumna ? new Date(row[fechaColumna]) : null;
      const esFechaValida = fechaValor instanceof Date && !isNaN(fechaValor);

      const dentroDeRangoFechas =
        (!fechaInicio || !esFechaValida || new Date(fechaInicio) <= fechaValor) &&
        (!fechaFin || !esFechaValida || fechaValor <= new Date(fechaFin));

      const posiblesCamposPago = ['Pagos', 'pagos', 'Pago', 'pago', 'Deducciones', 'Valor', 'valor'];
      const campoPago = posiblesCamposPago.find(key => row[key] !== undefined);
      const pago = campoPago ? parseFloat(row[campoPago]) : null;

      const dentroDeRangoPagos =
        (!pagosMin || (pago !== null && pago >= pagosMin)) &&
        (!pagosMax || (pago !== null && pago <= pagosMax));

      return contieneTexto && cumpleFiltrosColumna && dentroDeRangoFechas && dentroDeRangoPagos;
    });
  }, [datos, texto, fechaInicio, fechaFin, filtrosColumnas, pagosMin, pagosMax]);

  const columnas = useMemo(() => {
    if (!Array.isArray(datos) || datos.length === 0) return [];
    return Object.keys(datos[0]);
  }, [datos]);

  const valoresUnicos = useMemo(() => {
    const valores = {};
    if (!Array.isArray(datos)) return valores;

    datos.forEach(row => {
      Object.entries(row).forEach(([columna, valor]) => {
        if (!valores[columna]) valores[columna] = new Set();
        valores[columna].add(valor);
      });
    });

    Object.keys(valores).forEach(key => {
      valores[key] = Array.from(valores[key]);
    });

    return valores;
  }, [datos]);

  return { datosFiltrados, columnas, valoresUnicos };
};

export default useFiltros;