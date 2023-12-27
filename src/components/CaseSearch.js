import { useState } from "react";
import GenericItems from "./until/GenericItems";
import LoadingSpinner from "./until/LoadingSpinner";
import ConfirmDialog from "./until/ConfirmBox";
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
import Truncate from "./until/Truncate";
import FormButton from "./until/FormButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const CaseSearch = ({ setHeader }) => {
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [template, setTemplate] = useState([
    {
      keywordId: "4CF4C518-9DCE-4338-A83B-C401F8CFF415",
      keywordName: "Customer",
      typeName: "List (Alphanumeric)",
      order: 1,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "82222a12-4b57-49e3-b7e3-f3dfa9ca9c11",
      keywordName: "Reception Date",
      typeName: "daterange",
      order: 3,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "requestType",
      keywordName: "Request Type",
      typeName: "currency",
      order: 4,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "pic",
      keywordName: "PIC",
      typeName: "textbox",
      order: 5,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "paymentStatus",
      keywordName: "Payment Status",
      typeName: "combobox",
      order: 6,
      roleName: "admin",
      searchable: 1,
    },
    {
      keywordId: "invoiceDate",
      keywordName: "Invoice Date",
      typeName: "textbox",
      order: 7,
      roleName: "admin",
      searchable: 1,
    },
    {
      keywordId: "paymentDate",
      keywordName: "Payment Date",
      typeName: "textbox",
      order: 9,
      roleName: "admin",
      searchable: 1,
    },
    {
      keywordId: "ca788522-283f-4513-865a-04ca0908b218",
      keywordName: "Phone No",
      typeName: "textbox",
      order: 2,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "arrivalDate",
      keywordName: "Arrival Date",
      typeName: "textbox",
      order: 8,
      roleName: "admin",
      searchable: 1,
    },
  ]);
  const [data, setData] = useState([
    { keywordId: "4CF4C518-9DCE-4338-A83B-C401F8CFF415", value: "test 1" },
    { keywordId: "ca788522-283f-4513-865a-04ca0908b218", value: "0819177199" },
    { keywordId: "82222a12-4b57-49e3-b7e3-f3dfa9ca9c11", value: "2023-12-15/2023-12-21" },
    // { keywordId: "requestType", value: "" },
    // { keywordId: "pic", value: "" },
    // { keywordId: "paymentStatus", value: "" },
    // { keywordId: "invoiceDate", value: "" },
    // { keywordId: "arrivalDate", value: "" },
    // { keywordId: "paymentDate", value: "" },
  ]);
  const [searchData, setSearchData] = useState([
    {
      caseId: "1",
      caseName: "Test123456781232112321",
      customerName: "Toyota",
      requestType: "abc",
      status: "in-progress",
      pic: "TuanDQ7",
    },
    {
      caseId: "2",
      caseName: "Test2",
      customerName: "Hitachi",
      requestType: "def",
      status: "Done",
      pic: "TanBC1",
    },
  ]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState({
    id: null,
    customerName: null,
    phoneNumber: null,
  });
  const [options, setOptions] = useState([
    { id: 1, label: "Tuan" },
    { id: 2, label: "Tiep" },
    { id: 3, label: "Tan" },
  ]);

  const handleClickSearch = async (e) => {
    setLoading(true);
    e.preventDefault();

    const searchCaseUrl = "/api/Case/getAll";
    const payload = {
      keywordValues: data,
      pageSize: 25,
      pageNumber: 1
    }
    axiosPrivate.post(searchCaseUrl, payload).then((response) => {
      console.log("response---------", response);
      setSearchData(response.data)
      return response;
    })
      .catch((error) => {
        console.log(error);
      });
    // call api
    setShowList(true);
    setLoading(false);
  };
  const handleClickEdit = async () => {
    setLoading(true);
    setHeader("Case");

    setLoading(false);
  };

  const Results = () => {
    return (
      <>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Case Name</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Request Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>PIC</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchData.map((row) => {
                return (
                  <TableRow
                    key={row.caseId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Truncate str={row.keywordName} maxlength={15} />
                    </TableCell>
                    <TableCell>
                      <Truncate str={row.value} maxlength={15} />
                    </TableCell>
                    <TableCell>{row.requestType}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.pic}</TableCell>
                    <TableCell align="center">
                      <Button
                        className="search-close"
                        // onClick={() => {
                        //   setShowAlert(true);
                        //   setDeleteItem(item);
                        // }}
                      >
                        Close
                      </Button>
                      <Button
                        className="search-edit"
                        onClick={() => handleClickEdit(row.caseKey)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };
  const handleClickDelete = () => {};

  const dynamicGenerate = (item, templateItem) => {
    return (
      <GenericItems
        value={item.value}
        value1={item.value.split("/")[0]}
        value2={item.value.split("/")[1]}
        label={templateItem.keywordName}
        type={templateItem.typeName}
        key={templateItem.order}
        handleInput={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.value };
            } else return { ...value };
          });
          setData(newState);
        }}
        // using for date range
        handleInput1={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item2 = item.value.split("/")[1];
              return { ...value, value: e.target.value + "/" + item2 };
            } else return { ...value };
          });
          setData(newState);
        }}
        handleInput2={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item1 = item.value.split("/")[0];
              return { ...value, value: item1 + "/" + e.target.value };
            } else return { ...value };
          });
          setData(newState);
        }}
        options={options}
        required={templateItem.isRequired}
      />
    );
  };

  const generateCode = () => {
    template.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
    const mid = (template.length + 1) / 2;
    console.log("template Length" + template.length);
    return (
      <>
        <Grid item xs={6}>
          {template.map((templateItem, index) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                index + 1 <= mid
              ) {
                console.log(index);
                console.log("mid: " + mid);
                return dynamicGenerate(item, templateItem);
              } else return null;
            });
          })}
        </Grid>
        <Grid item xs={6}>
          {template.map((templateItem, index) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                index + 1 > mid
              ) {
                return dynamicGenerate(item, templateItem);
              } else return null;
            });
          })}
        </Grid>
      </>
    );
  };

  return (
    <section>
      <Grid container spacing={5}>
        {generateCode()}
        {showList ? (
          <Grid item xs={12}>
            <Results />
          </Grid>
        ) : null}
        <Grid
          item
          xs={12}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <FormButton
            onClick={handleClickSearch}
            itemName="Search"
          ></FormButton>
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

export default CaseSearch;
