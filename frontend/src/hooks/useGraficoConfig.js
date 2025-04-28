import { useState } from 'react';

const useGraficoConfig = () => {
  const [columnaAgrupar, setColumnaAgrupar] = useState('');
  const [columnaValor, setColumnaValor] = useState('');
  const [tipoGrafico, setTipoGrafico] = useState('Barras');
  const [paleta, setPaleta] = useState('Institucional');
  const [ordenar, setOrdenar] = useState(true);
  const [topN, setTopN] = useState(0);
  const [mostrarPorcentajeBarras, setMostrarPorcentajeBarras] = useState(false);

  return {
    columnaAgrupar,
    setColumnaAgrupar,
    columnaValor,
    setColumnaValor,
    tipoGrafico,
    setTipoGrafico,
    paleta,
    setPaleta,
    ordenar,
    setOrdenar,
    topN,
    setTopN,
    mostrarPorcentajeBarras,
    setMostrarPorcentajeBarras,
  };
};

export default useGraficoConfig;