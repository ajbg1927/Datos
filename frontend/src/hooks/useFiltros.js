import { useMemo } from 'react';

const useFiltros = (datos, texto, fechaInicio, fechaFin) => {
  const datosFiltrados = useMemo(() => {
    return datos.filter(row => {
      const contieneTexto = texto
        ? Object.values(row).some(val =>
            val?.toString().toLowerCase().includes(texto.toLowerCase())
          )
        : true;

      const fechaColumna = row.Fecha || row.fecha;
      const fechaValida = fechaColumna ? new Date(fechaColumna) : null;

      const dentroDeRango = (!fechaInicio || !fechaValida || new Date(fechaInicio) <= fechaValida) &&
                            (!fechaFin || !fechaValida || fechaValida <= new Date(fechaFin));

      return contieneTexto && dentroDeRango;
    });
  }, [datos, texto, fechaInicio, fechaFin]);

  return datosFiltrados;
};

export default useFiltros;