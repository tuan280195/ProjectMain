import FormInput from "./FormInput";
import FormSelection from "./FormSelection";

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
          required={props.required}
        />
      );
    case "List (Alphanumeric)":
      console.log("List (Alphanumeric)", options)
      return (
        
        <div className="section-item">
          {/* <label className="section-label">{label}</label>
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
          ></Autocomplete> */}
          <label className="section-label">
            {label}
            {props.required ? <span className="required-icon"> *</span> : null}
          </label>
          <FormSelection options={options} required={props.required} optionSelect={props.handleInput3}/>
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
        <FormInput
          label={label}
          className="section-input"
          type="number"
          onChange={props.handleInput}
          value={props.value}
          required={props.required}
        />
      );
    case "textarea":
      return (
        <div className="section-item">
          <label className="section-label">{label}</label>
          <textarea
            value={props.value}
            onChange={props.handleInput}
            className="section-input"
          ></textarea>
        </div>
      );
    default:
      return <></>;
  }
}

export default GenericItems;
