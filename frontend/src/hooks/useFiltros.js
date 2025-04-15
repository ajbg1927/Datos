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
    return datos.filter(row => {
      const contieneTexto = texto
        ? Object.values(row).some(val => {
            if (val === null || val === undefined) return false;
            try {
              return val.toString().toLowerCase().includes(texto.toLowerCase());
            } catch (e) {
              return false;
            }
          })
        : true;

      const cumpleFiltrosColumna = Object.entries(filtrosColumnas).every(([columna, valorFiltro]) => {
        if (!valorFiltro) return true; // Si no hay filtro aplicado, pasa
        const valor = row[columna];
        return valor !== undefined && valor !== null && valor.toString() === valorFiltro;
      });

      const posiblesFechas = ['Fecha', 'fecha', 'FECHA', 'fechaRegistro'];
      const fechaColumna = posiblesFechas.find(key => row[key]) || null;
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

  return datosFiltrados;
};

export default useFiltros;

