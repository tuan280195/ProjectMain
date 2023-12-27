import { Autocomplete, TextField } from "@mui/material";
import FormInput from "./FormInput";

function GenericItems({ label, type, options, ...props }) {
  switch (type) {
    case "Alphanumeric":
      return (
        <FormInput
          label={label}
          className="section-input"
          type="text"
          onChange={props.handleInput}
          value={props.value}
        />
      );
    case "List (Alphanumeric)":
      console.log("List (Alphanumeric)", options)
      return (
        
        <div className="section-item">
          <label className="section-label">{label}</label>
          <Autocomplete
            onChange={props.handleInput3}
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
            options={options}
            // {[
            //   { id: 1, label: "Tuan" },
            //   { id: 2, label: "Tan" },
            //   { id: 3, label: "Tiep" },
            // ]}
            renderInput={(params) => <TextField {...params} />}
          ></Autocomplete>
        </div>
      );
    case "daterange":
      return (
        <div className="section-item">
          <label className="section-label">{label}</label>
          <div className="section-range" style={{ marginBottom: 10 }}>
            <input
              value={props.value1}
              type="date"
              onChange={props.handleInput1}
              className="section-input"
              style={{ marginRight: "10px" }}
            ></input>
            -
            <input
              value={props.value2}
              type="date"
              onChange={props.handleInput2}
              className="section-input"
              style={{ marginLeft: "10px" }}
            ></input>
          </div>
        </div>
      );
    case "Datetime":
      return (
        <div className="section-item">
          <label className="section-label">{label}</label>
          <input
            value={props.value}
            type="date"
            onChange={props.handleInput}
            className="section-input"
          ></input>
        </div>
      );
    case "Currency":
      return (
        <div className="section-item">
          <label className="section-label">{label}</label>
          <input
            value={props.value}
            type="number"
            onChange={props.handleInput}
            className="section-input"
          ></input>
        </div>
      );
    default:
      return <></>;
  }
}

export default GenericItems;
