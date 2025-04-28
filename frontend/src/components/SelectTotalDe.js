import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const SelectTotalDe = ({ columnas, columnaValor, setColumnaValor }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Total de</InputLabel>
      <Select
        value={columnaValor || ""}
        label="Total de"
        onChange={(e) => setColumnaValor(e.target.value)}
      >
        {columnas.map((col) => (
          <MenuItem key={col} value={col}>
            {col}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectTotalDe;