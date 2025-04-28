import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

const SelectAnálisisPor = ({ columnas, columnaAgrupar, setColumnaAgrupar }) => {
  return (
    <FormControl fullWidth>
      <InputLabel>Análisis por</InputLabel>
      <Select
        value={columnaAgrupar || ""}
        label="Análisis por"
        onChange={(e) => setColumnaAgrupar(e.target.value)}
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

export default SelectAnálisisPor;