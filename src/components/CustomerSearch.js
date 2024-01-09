import { Link } from "react-router-dom";
import { useState } from "react";
import LoadingSpinner from "./until/LoadingSpinner";
import Truncate from "./until/Truncate";
import ConfirmDialog from "./until/ConfirmBox";
import { Grid, Button } from "@mui/material";
import FormButton from "./until/FormButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Pagination from "./until/Pagination";
import caseSearchState from "../stories/caseSearchState.ts";
import caseSearchActions from "../actions/caseSearchActions.ts";

const CustomerSearch = ({ setHeader, setCustomerDetail }) => {
  const [data, setData] = useState({});
  const [showList, setShowList] = useState(false);
  const [listItem, setListItem] = useState([
    { id: null, customerName: null, phoneNumber: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState({
    id: null,
    name: null,
    phoneNumber: null,
  });
  const [condition, setCondition] = useState({ width: "400px", xs: 12 });
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

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

      const response = await axiosPrivate.get(searchURL, {
        signal: controller.signal,
      });
      setListItem(response.data); /*set result list item here*/
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleClickEdit = (id) => {
    setLoading(true);
    setHeader("Customer");
    setCustomerDetail(id);
    setLoading(false);
  };

  const handleClickDelete = async (e) => {
    setLoading(true);
    e.preventDefault();
    var deleteURL = "/api/Customer/" + deleteItem.id;
    await axiosPrivate.delete(deleteURL).then(async (res) => {
      setShowAlert(false);
      await getCustomers(e);
      setCondition({ width: "1080px", xs: 4 });
      setShowList(true);
    }).catch((error) => {
      console.log(error)
    });
    setLoading(false);
  };

  const handleClickSearch = async (e) => {
    await getCustomers(e);
    setCondition({ width: "1080px", xs: 4 });
    setShowList(true);
  };

  const handleChange = (event, item) => {
    let newData = data;
    if (item === "customerName") newData.customerName = event.target.value;
    else newData.phoneNumber = event.target.value;

    setData(newData);
  };

  const handleChangePageSize = async (e) => {
    caseSearchActions.setPaginationState(
      caseSearchState.paginationState.totalCount,
      e.target.value,
      caseSearchState.paginationState.currentPage
    );
    await getCustomers(e);
  };
  const handleChangePage = async (e) => {
    caseSearchActions.setPaginationState(
      caseSearchState.paginationState.totalCount,
      caseSearchState.paginationState.pageSize,
      parseInt(e.target.innerText)
    );
    await getCustomers(e);
  };

  const Results = () => {
    let totalCount = 0;
    if (listItem && listItem.totalCount > 0) {
      totalCount = Math.ceil(listItem.totalCount / listItem.pageSize);
    }
    return (
      <>
        <Pagination
          totalCount={totalCount}
          pageSize={caseSearchState.caseDataSearchState.pageSize}
          currentPage={caseSearchState.caseDataSearchState.currentPage}
          handleChangePageSize={handleChangePageSize}
          handleChangePage={handleChangePage} />

        <ul id="results" className="search-results" style={{ marginTop: 10 }}>
          {listItem && listItem.items.length > 0 ? (
            listItem.items.map((item, index) => {
              return (
                <>
                  <li className="search-result" key={item + "-" + index}>
                    <Truncate str={item.name} maxLength={20} />
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
      </>
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
          <br />
          <Grid item xs="12" sx={{ display: "flex", justifyContent: "center" }}>
            {/* Search Button */}
            <FormButton itemName="検索" onClick={handleClickSearch} />
          </Grid>
        </Grid>
        {showList ? (
          <Grid item xs={8}>
            <Results />
          </Grid>
        ) : null}
      </Grid>

      <LoadingSpinner loading={loading}></LoadingSpinner>
      <ConfirmDialog
        open={showAlert}
        closeDialog={() => setShowAlert(false)}
        item={deleteItem.name}
        handleFunction={handleClickDelete}
      ></ConfirmDialog>
    </section>
  );
};

export default CustomerSearch;
