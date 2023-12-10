import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "./until/LoadingSpinner";
import Truncate from "./until/Truncate";

const CustomerSearch = () => {
  const [data, setData] = useState({ customerName: null, phoneNumber: null });
  const [showList, setShowList] = useState(false);
  const [listItem, setListItem] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClickEdit = () => {
    setLoading(true);
    //call API
    //save to context
    setLoading(false);
  };

  const handleClickDelete = () => {
    setLoading(true);
    // call API Delete
    setLoading(false);
  };

  const handleClickSearch = () => {
    setLoading(true);
    //call API Search
    //set result = response array
    setListItem([
      "item1-testing-longasdfafsddfa",
      "item2",
    ]); /*set result list item here*/
    setShowList(true);
    setLoading(false);
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
              <Truncate str={item} />
              <div className="search-action">
                <Link
                  className="search-delete"
                  to=""
                  onClick={() => handleClickDelete()}
                >
                  Delete
                </Link>{" "}
                <Link
                  className="search-edit"
                  to="../customermanagement/customerdetail"
                  onClick={() => handleClickEdit()}
                >
                  Edit
                </Link>
              </div>
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
        <input
          className="section-input"
          type="text"
          onChange={(e) => handleChange(e, "customerName")}
        ></input>
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
      <LoadingSpinner loading={loading}></LoadingSpinner>
    </section>
  );
};

export default CustomerSearch;
