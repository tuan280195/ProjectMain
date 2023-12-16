import { useState } from "react";
import GenericItems from "./until/GenericItems";
import LoadingSpinner from "./until/LoadingSpinner";
import ConfirmDialog from "./until/ConfirmBox";
import { Grid, Item } from "@mui/material";

const CaseSearch = () => {
  const [template, setTemplate] = useState([
    {
      keywordId: "customer",
      keywordName: "Customer",
      typeName: "combobox",
      order: 1,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "receptionDate",
      keywordName: "Reception Date",
      typeName: "datetime",
      order: 3,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "requestType",
      keywordName: "Request Type",
      typeName: "combobox",
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
      keywordId: "phoneNo",
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
    { keywordId: "customer", value: "test 1" },
    { keywordId: "phoneNo", value: "0819177199" },
    { keywordId: "receptionDate", value: "12/15/2023-12/21/2023" },
    { keywordId: "requestType", value: "" },
    { keywordId: "pic", value: "" },
    { keywordId: "paymentStatus", value: "" },
    { keywordId: "invoiceDate", value: "" },
    { keywordId: "arrivalDate", value: "" },
    { keywordId: "paymentDate", value: "" },
  ]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState({
    id: null,
    customerName: null,
    phoneNumber: null,
  });
  const [options, setOptions] = useState(["item1", "item2"]);

  const handleClickSearch = () => {};
  const Results = () => {};
  const handleClickDelete = () => {};

  const dynamicGenerate = (item, templateItem) => {
    return (
      <GenericItems
        value={item.value}
        value1={item.value.split("-")[0]}
        value2={item.value.split("-")[1]}
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
        handleInput1={(newVlue) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item2 = item.value.split("-")[1];
              newVlue = newVlue.format("MM/DD/YYYY").toString();
              return { ...value, value: newVlue + "-" + item2 };
            } else return { ...value };
          });
          console.log(newState);
          setData(newState);
        }}
        handleInput2={(newVlue) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item1 = item.value.split("-")[0];
              newVlue = newVlue.format("MM/DD/YYYY").toString();
              return { ...value, value: item1 + "-" + newVlue };
            } else return { ...value };
          });
          console.log(newState);
          setData(newState);
        }}
      >
        {options.map((option, index) => {
          return (
            <option value={option} key={index}>
              {option}
            </option>
          );
        })}
      </GenericItems>
    );
  };

  const generateCode = () => {
    template.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
    const mid = (template.length + 1) / 2;
    return (
      <>
        <Grid item xs={6}>
          {template.map((templateItem) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                templateItem.order <= mid
              ) {
                return dynamicGenerate(item, templateItem);
              } else return null;
            });
          })}
        </Grid>
        <Grid item xs={6}>
          {template.map((templateItem) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                templateItem.order > mid
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
      <h1>Case Search</h1>
      <br></br>
      <Grid container spacing={2}>
        {generateCode()}
      </Grid>

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

export default CaseSearch;
