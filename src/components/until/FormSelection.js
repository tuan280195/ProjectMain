import { Autocomplete, TextField } from "@mui/material";

const FormSelection = (props) => {
  return (
    <Autocomplete
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
      // {[
      //   { id: 1, label: "Tuan" },
      //   { id: 2, label: "Tan" },
      //   { id: 3, label: "Tiep" },
      // ]}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};

export default FormSelection;
