import FormInput from "./FormInput";

function GenericItems({ label, type, ...props }) {
  switch (type) {
    case "textbox":
      return (
        <FormInput
          label={label}
          className="section-input"
          type="text"
          onChange={props.handleInput}
          value={props.value}
        />
      );
    case "combobox":
      return (
        <div className="section-item">
          <label className="section-label">{label}</label>
          <input
            type="text"
            list="items"
            className="section-input"
            onChange={props.handleInput}
            value={props.value}
          />
          <datalist id="items">{props.children}</datalist>
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
    default:
      return <></>;
  }
}

export default GenericItems;
