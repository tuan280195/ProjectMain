import FormInput from "./FormInput";
import FormSelection from "./FormSelection";

function GenericItems({ label, type, options, ...props }) {
  switch (type) {
    case "string":
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
    case "textarea":
      return (
        <FormInput
          label={label}
          className="section-input"
          type="textarea"
          onChange={props.handleInput}
          value={props.value}
          required={props.required}
        />
      );
    case "list":
      return (
        
        <div className="section-item">
          <label className="section-label">
            {label}
            {props.required ? <span className="required-icon"> *</span> : null}
          </label>
          <FormSelection options={options} required={props.required} optionSelected={props.handleInput3} value={props.value}/>
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
    case "datetime":
      return (
        <FormInput
          label={label}
          className="section-input"
          type="date"
          onChange={props.handleInput}
          value={props.value}
          required={props.required}
        />
      );
    case "decimal":
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
