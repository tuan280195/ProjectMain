import { Autocomplete, TextField } from "@mui/material";

const FormSelection = (props) => {
  console.log("props.value----lits", props.value);
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
      onChange={props.optionSelect}
      // {[
      //   { id: 1, label: "Tuan" },
      //   { id: 2, label: "Tan" },
      //   { id: 3, label: "Tiep" },
      // ]}
      renderInput={(params) => (
        <TextField {...params} required={props.required} />
      )}
    />
  );
};

export default FormSelection;
