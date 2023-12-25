import { Link } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "./until/LoadingSpinner";
import Truncate from "./until/Truncate";
import axios from "../api/axios";
import ConfirmDialog from "./until/ConfirmBox";
import { Grid, Button } from "@mui/material";
import FormButton from "./until/FormButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

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
  const [condition, setCondition] = useState({ width: "400px", xs: 12 });
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

    

    // const getUsers = async () => {
    //   let isMounted = true;
    //   const controller = new AbortController();
    //   try {
    //     console.log("api/Customer/getAll");
    //     const response = await axiosPrivate.get("/api/Customer/getAll", {
    //       signal: controller.signal,
    //     });
    //     console.log(response.data);
    //     isMounted && setUsers(response.data);
    //   } catch (err) {
    //     console.error(err);
    //     navigate("/api/account/login", { state: { from: location }, replace: true });
    //   }
    // };

    // getUsers();



  const getCustomers = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      
      let searchURL = "/api/Customer/getAll";
      searchURL =
        data.customerName && data.phoneNumber
          ? searchURL +
            `?customerName=${data.customerName}&phoneNumber=${data.phoneNumber}`
          : data.phoneNumber
          ? searchURL + `?phoneNumber=${data.phoneNumber}`
          : data.customerName
          ? searchURL + `?customerName=${data.customerName}`
          : searchURL;

          console.log("searchURL:" + searchURL)
      const response = await axiosPrivate.get(searchURL, {
        signal: controller.signal,
      });

      let result = [];
      response.data.forEach((element) => {
        result.push({
          id: element.id,
          customerName: element.name,
          phoneNumber: element.phoneNumber,
        });
      });
      setListItem(result); /*set result list item here*/
    } catch (error) {
      console.log(error);
    }

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
      var deleteURL = "/api/Customer/" + deleteItem.id;
      await axiosPrivate.delete(deleteURL).then(async (res)=> {
        await getCustomers();
        setShowAlert(false);
      });
      
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const handleClickSearch = async (e) => {
    await getCustomers(e);
    setCondition({ width: "1000px", xs: 6 });
  };

  const handleChange = (event, item) => {
    let newData = data;
    if (item === "customerName") newData.customerName = event.target.value;
    else newData.phoneNumber = event.target.value;

    setData(newData);
  };

  const Results = () => {
    return (
      <ul id="results" className="search-results" style={{ marginTop: 10 }}>
        {listItem && listItem[0].id != null ? (
          listItem.map((item, index) => {
            return (
              <>
                <li className="search-result" key={item + "-" + index}>
                  <Truncate str={item.customerName} maxLength={20} />
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
    <section style={{ width: condition.width }}>
      <Grid container columnSpacing={5} rowSpacing={5}>
        <Grid item xs={condition.xs}>
          <div className="section-item">
            <label className="section-label">Customer Name</label>
            <input
              value={data.customerName}
              className="section-input"
              type="text"
              onChange={(e) => handleChange(e, "customerName")}
            ></input>
          </div>
          <div className="section-item">
            <label className="section-label">Phone Number</label>
            <input
              value={data.phoneNumber}
              className="section-input"
              type="text"
              maxLength={11}
              onChange={(e) => handleChange(e, "phoneNumber")}
            ></input>
          </div>
        </Grid>
        {showList ? (
          <Grid item xs={6}>
            <Results />
          </Grid>
        ) : null}
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <FormButton itemName="Search" onClick={handleClickSearch} />
        </Grid>
      </Grid>

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
