import { Link } from "react-router-dom";
import { useState } from "react";

const CustomerSearch = () => {
  const [data, setData] = useState({ customerName: null, phoneNumber: null });
  const [showList, setShowList] = useState(false);
  const [listItem, setListItem] = useState([]);

  const customer = [
    "Customer 1",
    "Customer 2",
    "Customer 3",
    "Customer 4",
    "Customer 5",
  ];

  const handleClickEdit = () => {
    //call API
    //save to context
  };

  const handleClickSearch = () => {
    //call API Search
    //set result = response array
    setListItem(["item1", "item2"]); /*set result list item here*/
    setShowList(true);
  };

  const handleChange = (event, item) => {
    let newData = data;
    if (item == "customerName") newData.customerName = event.target.value;
    else newData.phoneNumber = event.target.value;

    setData(newData);
  };

  const Results = () => {
    return (
      <ul id="results" className="search-results">
        {listItem.map((item, index) => {
          return (
            <li className="search-result" key={item + "-" + index}>
              {item}
              <Link
                className="search-edit"
                to="../customermanagement/customerdetail"
                onClick={() => handleClickEdit()}
              >
                Edit
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section>
      <h1>Customer Search</h1>
      <br></br>
      <div className="item-section">
        <label className="label-section">Customer Name</label>
        <select onChange={(e) => handleChange(e, "customerName")}>
          {customer.map((item, index) => {
            return <option key={item + "-" + index}>{item}</option>;
          })}
        </select>
      </div>
      <div className="item-section">
        <label className="label-section">Phone Number</label>
        <input
          className="section-input"
          type="text"
          maxLength={11}
          onChange={(e) => handleChange(e, "phoneNumber")}
        ></input>
      </div>
      {showList ? <Results /> : null}
      <br></br>
      <button onClick={handleClickSearch}>Search</button>
    </section>
  );
};

export default CustomerSearch;
