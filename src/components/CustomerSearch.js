import { Link } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "./until/LoadingSpinner";
import Truncate from "./until/Truncate";
import axios from "../api/axios";
import ConfirmDialog from "./until/ConfirmBox";

const CustomerSearch = () => {
  const [data, setData] = useState({});
  const [showList, setShowList] = useState(false);
  const [listItem, setListItem] = useState([
    { id: null, customerName: null, phoneNumber: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState({
    id: null,
    customerName: null,
    phoneNumber: null,
  });

  const getCustomers = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      var searchURL = "https://localhost:7265/api/Customer/getAll";
      searchURL =
        data.customerName && data.phoneNumber
          ? searchURL +
            `?customerName=${data.customerName}&phoneNumber=${data.phoneNumber}`
          : data.phoneNumber
          ? searchURL + `?phoneNumber=${data.phoneNumber}`
          : data.customerName
          ? searchURL + `?customerName=${data.customerName}`
          : searchURL;
      const response = await axios.get(searchURL);

      var result = [];
      response.data.forEach((element) => {
        result.push({
          id: element.id,
          customerName: element.name,
          phoneNumber: element.phoneNumber,
        });
      });
      setListItem(result); /*set result list item here*/
      setShowList(true);
    } catch (error) {
      console.log(error);
    }

    setShowList(true);

    setLoading(false);
  };

  const handleClickEdit = (id) => {
    setLoading(true);
    //call API
    //save to context
    window.location.href = "customerdetail?id=" + id;
    setLoading(false);
  };

  const handleClickDelete = async () => {
    setLoading(true);
    try {
      // call API Delete
      var deleteURL = "https://localhost:7265/api/Customer/" + deleteItem.id;
      await axios.delete(deleteURL);
      await getCustomers();
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleClickSearch = async (e) => {
    await getCustomers(e);
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
        {listItem && listItem.length > 0 ? (
          listItem.map((item, index) => {
            return (
              <>
                <li className="search-result" key={item + "-" + index}>
                  <Truncate str={item.customerName} />
                  <div className="search-action">
                    <Link
                      className="search-delete"
                      to=""
                      onClick={() => {
                        setShowAlert(true);
                        setDeleteItem(item);
                      }}
                    >
                      Delete
                    </Link>{" "}
                    <Link
                      className="search-edit"
                      to=""
                      onClick={() => handleClickEdit(item.id)}
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              </>
            );
          })
        ) : (
          <li>
            <p>Not found</p>
          </li>
        )}
      </ul>
    );
  };

  return (
    <section className="select-form">
      <h1>Customer Search</h1>
      <br></br>
      <div className="item-section">
        <label className="label-section">Customer Name</label>
        <input
          value={data.customerName}
          className="section-input"
          type="text"
          onChange={(e) => handleChange(e, "customerName")}
        ></input>
      </div>
      <div className="item-section">
        <label className="label-section">Phone Number</label>
        <input
          value={data.phoneNumber}
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
      <ConfirmDialog
        open={showAlert}
        closeDialog={() => setShowAlert(false)}
        item={deleteItem.customerName}
        deleteFunction={handleClickDelete}
      ></ConfirmDialog>
    </section>
  );
};

export default CustomerSearch;
