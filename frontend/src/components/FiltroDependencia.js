import React, { useState, useEffect } from "react";

export default function FiltroDependencia({
  sheets,
  dependenciasPorHoja,
  onSeleccionar,
}) {
  const [hojaSeleccionada, setHojaSeleccionada] = useState("");
  const [dependenciaSeleccionada, setDependenciaSeleccionada] = useState("");

  useEffect(() => {
    setDependenciaSeleccionada(""); 
  }, [hojaSeleccionada]);

  useEffect(() => {
    if (hojaSeleccionada) { 
      onSeleccionar({ hoja: hojaSeleccionada, dependencia: dependenciaSeleccionada });
    }
  }, [hojaSeleccionada, dependenciaSeleccionada, onSeleccionar]);

  return (
    <div className="flex gap-4 items-center p-4 border rounded-lg bg-white shadow">
      <div>
        <label className="block text-sm font-semibold mb-1">Selecciona hoja</label>
        <select
          className="border px-2 py-1 rounded"
          value={hojaSeleccionada}
          onChange={(e) => setHojaSeleccionada(e.target.value)}
        >
          <option value="">-- Hoja --</option>
          {sheets.map((sheet) => (
            <option key={sheet} value={sheet}>
              {sheet}
            </option>
          ))}
        </select>
      </div>

      {hojaSeleccionada && (
        <div>
          <label className="block text-sm font-semibold mb-1">Selecciona dependencia</label>
          <select
            className="border px-2 py-1 rounded"
            value={dependenciaSeleccionada}
            onChange={(e) => setDependenciaSeleccionada(e.target.value)}
          >
            <option value="">-- Todas las dependencias --</option> {/* <- Esto cambia */}
            {(dependenciasPorHoja[hojaSeleccionada] || []).map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}