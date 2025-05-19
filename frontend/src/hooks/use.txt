import { useMemo } from 'react';
import { detectarCuadrosPresupuestales } from '../utils/detectoresPresupuestales';

const useCuadrosPresupuestales = (cuadros = []) => {
  return useMemo(() => detectarCuadrosPresupuestales(cuadros), [cuadros]);
};

export default useCuadrosPresupuestales;