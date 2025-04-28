import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const tiposDeGrafico = [
  { label: "Barras", value: "bar" },
  { label: "Pastel", value: "pie" },
  { label: "Líneas", value: "line" },
  { label: "Área", value: "area" },
  { label: "Radar", value: "radar" },
];

const SelectTipoDeGrafico = ({ tipoGrafico, setTipoGrafico }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Tipo de gráfico</InputLabel>
      <Select
        value={tipoGrafico || ""}
        label="Tipo de gráfico"
        onChange={(e) => setTipoGrafico(e.target.value)}
      >
        {tiposDeGrafico.map((tipo) => (
          <MenuItem key={tipo.value} value={tipo.value}>
            {tipo.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTipoDeGrafico;