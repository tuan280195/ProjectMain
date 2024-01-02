import { Autocomplete, TextField } from "@mui/material";

const FormSelection = (props) => {
  return (
    <Autocomplete
      value={props.value}
      disablePortal
      sx={{
        "& .MuiInputBase-root": {
          height: "2rem",
          borderRadius: "0.3rem",
          padding: 0,
          paddingLeft: "5px",
        },
        "& .MuiAutocomplete-endAdornment": {
          top: "auto",
        },
      }}
      options={props.options}
      onChange={props.optionSelected}
      renderInput={(params) => (
        <TextField {...params} required={props.required} />
      )}
    />
  );
};

export default FormSelection;
