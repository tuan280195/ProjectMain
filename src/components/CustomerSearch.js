import { useState } from "react";
import LoadingSpinner from "./until/LoadingSpinner";
import Truncate from "./until/Truncate";
import ConfirmDialog from "./until/ConfirmBox";
import FormButton from "./until/FormButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Pagination from "./until/Pagination";
import commonState from "../stories/commonState.ts";
import commonActions from "../actions/commonAction.ts";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ContentDialog from "./until/ContentDialog.js";
import CustomerDetail from "./CustomerDetail.js";

import * as Icons from "@mui/icons-material";
import "../styles/styles.css";

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
    name: null,
    phoneNumber: null,
  });
  const [condition, setCondition] = useState({ width: "400px", xs: 12 });
  const [showDialog, setShowDialog] = useState(false);
  const [customerId, setCustomerId] = useState();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  // State for phone number error
  const [phoneNumberError, setPhoneNumberError] = useState(undefined);

  const getCustomers = async (e) => {
    setLoading(true);
    e.preventDefault();
    let searchURL = "/api/Customer/getAll";
    let pagination = `pageSize=${commonState.paginationState.pageSize}&pageNumber=${commonState.paginationState.currentPage}`;
    if (data.customerName && data.phoneNumber) {
      searchURL =
        searchURL +
        `?customerName=${data.customerName}&phoneNumber=${data.phoneNumber}&${pagination}`;
    } else if (data.phoneNumber) {
      searchURL = searchURL + `?phoneNumber=${data.phoneNumber}&${pagination}`;
    } else if (data.customerName) {
      searchURL =
        searchURL + `?customerName=${data.customerName}&${pagination}`;
    } else {
      searchURL = searchURL + `?${pagination}`;
    }

    const status = await axiosPrivate.get(searchURL, {
      signal: controller.signal,
      validateStatus: () => true
    }).then((response) => {
      setListItem(response.data);
      commonActions.setPaginationState({
        totalCount: response.data.totalCount,
        pageSize: response.data.pageSize,
        currentPage: response.data.currentPage,
      });
    }).catch((error) => {
      console.log(error);
    });
    if (status == 404) {
      setListItem([]);
      commonActions.setPaginationState({
        totalCount: 0,
        pageSize: 10,
        currentPage: 1,
      });
    }
    setLoading(false);
  };

  const handleClickEdit = (id) => {
    setLoading(true);
    setCustomerId(id);
    setShowDialog(true);
    setLoading(false);
  };

  const handleClickDelete = async (e) => {
    setLoading(true);
    e.preventDefault();
    var deleteURL = "/api/Customer/" + deleteItem.id;
    await axiosPrivate
      .delete(deleteURL)
      .then(async (res) => {
        setShowAlert(false);
        await getCustomers(e);
        setCondition({ width: "1440px", xs: 4 });
        setShowList(true);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const handleClickSearch = async (e) => {
    await getCustomers(e);
    setCondition({ width: "1440px", xs: 4 });
    setShowList(true);
  };

  const handleChange = (event, item) => {
    if (item === "customerName") {
      setData({...data, customerName: event.target.value});
    }
    else {
      // Display a message if hyphens are detected in 電話番号 field
      if (event.target.value.includes("-")) {
        setPhoneNumberError("「-」ハイフンを除いて番号のみ");
      } else {
        // Clear the error message if no hyphens
        setPhoneNumberError(undefined);
      }
      setData({...data, phoneNumber: event.target.value});
    }

    
  };

  const handleChangePageSize = async (e) => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      pageSize: parseInt(e.target.value),
    });
    await getCustomers(e);
  };
  const handleChangePage = async (e, value) => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      currentPage: value,
    });
    await getCustomers(e);
  };
  const Results = () => {
    let totalCount = 0;
    if (
      commonState.paginationState &&
      commonState.paginationState.totalCount > 0
    ) {
      totalCount = Math.ceil(
        commonState.paginationState.totalCount /
          commonState.paginationState.pageSize
      );
    }
    return (
      <>
        <Pagination
          totalCount={totalCount}
          pageSize={commonState.paginationState.pageSize}
          currentPage={commonState.paginationState.currentPage}
          handleChangePageSize={handleChangePageSize}
          handleChangePage={handleChangePage}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{ textAlign: "center", width: "fit-content" }}
                >
                  取引先名
                </TableCell>
                <TableCell
                  style={{ textAlign: "center", width: "fit-content" }}
                >
                  電話番号
                </TableCell>
                <TableCell style={{ textAlign: "center", width: "25%" }}>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listItem && listItem.items && listItem.items.length > 0 ? (
                listItem.items.map((item, index) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Truncate str={item.name} maxLength={20} />
                      </TableCell>
                      <TableCell>
                        <Truncate str={item.phoneNumber} maxLength={20} />
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<Icons.Edit />}
                          onClick={() => handleClickEdit(item.id)}
                          style={{ marginRight: "5px" }}
                        >
                          編集
                        </Button>

                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<Icons.Delete />}
                          onClick={() => {
                            setShowAlert(true);
                            setDeleteItem(item);
                          }}
                        >
                          削除
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableCell colSpan={3}>
                  <span style={{ color: "#000" }}>
                    表示する項目がありません。
                  </span>
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return (
    <section style={{ width: condition.width }}>
      <Grid container columnSpacing={5} rowSpacing={5}>
        <Grid item xs={condition.xs}>
          <div className="section-item">
            <label className="section-label">取引先名</label>
            <input
              value={data.customerName}
              className="section-input"
              type="text"
              onChange={(e) => handleChange(e, "customerName")}
            ></input>
          </div>
          <div className="section-item">
            <label className="section-label">電話番号</label>
            <input
              value={data.phoneNumber}
              className="section-input"
              type="text"
              maxLength={11}
              onChange={(e) => handleChange(e, "phoneNumber")}
            ></input>
            {/* Display phone number error message */}
            {phoneNumberError && (
              <span style={{ color: "red" }}>{phoneNumberError}</span>
            )}
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
        typeDialog="削除確認"
        mainContent="顧客情報を削除すると、電話番号情報、住所などの情報がすべて失われます。本当に削除しますか？"
        cancelBtnDialog="いいえ"
        confirmBtnDialog="はい"
      ></ConfirmDialog>
      <ContentDialog open={showDialog} closeDialog={() => setShowDialog(false)}>
        <CustomerDetail customerId={customerId}></CustomerDetail>
      </ContentDialog>
    </section>
  );
};

export default CustomerSearch;
