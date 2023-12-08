import { useState } from "react";

const CustomerDetail = () => {
  const [latestData, setLatestData] = useState([
    { label: "aaa", type: "input", value: "test1" },
    { label: "bbb", type: "range", value: ["test1", "test2"] },
    { label: "ccc", type: "selectBox", value: "Test1" },
    { label: "ddd", type: "selectBox", value: "Test2" },
    { label: "eee", type: "range", value: ["TEST2", "TEST1"] },
    { label: "fff", type: "input", value: "test2" },
  ]);
  function getOption() {
    return (
      <>
        <option value="Test1">Test 1</option>
        <option value="Test2">Test 2</option>
      </>
    );
  }

  const handleClick = () => {};

  function handleChange(event, label, type, value) {
    const newState = latestData.map((obj) => {
      if (obj.label == label) {
        if (type == "range") {
          if (value.length == 2) {
            return { ...obj, value: [event.target.value] };
          }
          return { ...obj, value: value.push(event.target.value) };
        }
        return { ...obj, value: event.target.value };
      }
      return obj;
    });
    setLatestData(newState);
  }

  function renderInput(label, type, value) {
    switch (type) {
      case "input":
        return (
          <input
            type="section-input"
            value={value}
            onChange={(e) => handleChange(e, label, type, value)}
          ></input>
        );
      case "range":
        return (
          <div className="section-range">
            <input
              type="section-input"
              name="range"
              value={value[0]}
              onChange={(e) => handleChange(e, label, type, value)}
            ></input>{" "}
            -{" "}
            <input
              type="section-input"
              name="range"
              value={value[1]}
              onChange={(e) => handleChange(e, label, type, value)}
            ></input>
          </div>
        );
      case "selectBox":
        return (
          <select
            onChange={(e) => handleChange(e, label, type, value)}
            value={value}
          >
            {getOption()}
          </select>
        );
    }
  }

  return (
    <section className="customer">
      <h1>Customer</h1>
      <br></br>
      {latestData.map(({ label, type, value }) => (
        <div className="item-section">
          <div className="label-section">{label}</div>
          {renderInput(label, type, value)}
        </div>
      ))}
      <button onClick={handleClick}>Submit</button>
    </section>
  );
};

export default CustomerDetail;
