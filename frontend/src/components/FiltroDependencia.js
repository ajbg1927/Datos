import React, { useState, useEffect } from "react";

export default function FiltroDependencia({
  sheets,
  onSeleccionarHoja,
}) {
  const [hojaSeleccionada, setHojaSeleccionada] = useState("");

  useEffect(() => {
    if (hojaSeleccionada) {
      onSeleccionarHoja(hojaSeleccionada);
    }
  }, [hojaSeleccionada, onSeleccionarHoja]);

  return (
    <div className="flex gap-4 items-center p-4 border rounded-lg bg-white shadow">
      {/* Selector de hoja */}
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
    </div>
  );
}