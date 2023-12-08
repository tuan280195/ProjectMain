import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CustomerSearch = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({ customerName: null, phoneNumber: null });

  const customer = [
    "Customer 1",
    "Customer 2",
    "Customer 3",
    "Customer 4",
    "Customer 5",
  ];

  const handleClick = (link) => {
    //call API
    navigate(link);
  };

  const handleChange = (event, item) => {
    let newData = data;
    if (item == "customerName") newData.customerName = event.target.value;
    else newData.phoneNumber = event.target.value;

    setData(newData);
  };

  return (
    <section>
      <h1>Customer Search</h1>
      <br></br>
      <div className="item-section">
        <label className="label-section">Customer Name</label>
        <select onChange={(e) => handleChange(e, "customerName")}>
          {customer.map((item) => {
            return <option>{item}</option>;
          })}
        </select>
      </div>
      <div className="item-section">
        <label className="label-section">Phone Number</label>
        <input
          type="section-input"
          onChange={(e) => handleChange(e, "phoneNumber")}
        ></input>
      </div>
      <br></br>
      <button onClick={() => handleClick("/customermanagement/customerdetail")}>
        Search
      </button>
    </section>
  );
};

export default CustomerSearch;
