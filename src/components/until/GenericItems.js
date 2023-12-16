import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

function GenericItems({ label, type, index, ...props }) {
  switch (type) {
    case "textbox":
      return (
        <div className="section-item">
          <label className="label-section">{label}</label>
          <input
            value={props.value}
            className="section-input"
            type="text"
            onChange={props.handleInput}
          ></input>
        </div>
      );
    case "combobox":
      return (
        <div className="section-item">
          <label className="label-section">{label}</label>
          <select
            value={props.value}
            className="section-input"
            onChange={props.handleInput}
          >
            {props.children}
          </select>
        </div>
      );
    case "datetime":
      return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
          <label className="label-section">{label}</label>
          <div className="section-range" style={{ marginBottom: 10 }}>
            <div
              className="range-from"
              style={{
                borderRadius: 10,
                background: "#ffffff",
                marginRight: 10,
              }}
            >
              <DatePicker
                value={dayjs(props.value1)}
                onChange={props.handleInput1}
              ></DatePicker>
            </div>{" "}
            -{" "}
            <div
              style={{
                borderRadius: 10,
                background: "#ffffff",
                marginLeft: 10,
              }}
            >
              <DatePicker
                value={dayjs(props.value2)}
                onChange={props.handleInput2}
              ></DatePicker>
            </div>
          </div>
        </LocalizationProvider>
      );
    default:
      return <></>;
  }
}

export default GenericItems;
