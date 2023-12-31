import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import GenericItems from "./until/GenericItems";
import DialogHandle from "./until/DialogHandle";
import FormButton from "./until/FormButton";
import FormSnackbar from "./until/FormSnackbar";

const CaseDetail = () => {
  const [template, setTemplate] = useState([
    {
      keywordId: "customer",
      keywordName: "Customer",
      typeName: "combobox",
      order: 1,
      roleName: "user",
      searchable: 1,
      isRequired: true,
    },
    {
      keywordId: "adress",
      keywordName: "Adress",
      typeName: "textbox",
      order: 2,
      roleName: "user",
      searchable: 1,
      isRequired: true,
    },
    {
      keywordId: "phoneNo",
      keywordName: "Phone No",
      typeName: "textbox",
      order: 3,
      roleName: "user",
      searchable: 1,
      isRequired: true,
    },
    {
      keywordId: "contactPerson",
      keywordName: "Contact Person",
      typeName: "textbox",
      order: 4,
      roleName: "user",
      searchable: 1,
    },
    {
      keywordId: "receptionDate",
      keywordName: "Reception Date",
      typeName: "datetime",
      order: 5,
      roleName: "user",
      searchable: 1,
    },
  ]);
  const [data, setData] = useState([
    {
      keywordId: "customer",
      value: "111",
    },

    {
      keywordId: "adress",
      value: "2222",
    },
    {
      keywordId: "phoneNo",
      value: "2222",
    },
    {
      keywordId: "contactPerson",
      value: "2222",
    },
    {
      keywordId: "receptionDate",
      value: "2020-01-28",
    },
  ]);
  const [showDialog, setShowDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    status: "success",
    message: "Successfully!",
  });
  const options = [
    { id: 1, label: "Tuan" },
    { id: 2, label: "Tiep" },
    { id: 3, label: "Tan" },
  ];
  const [disableAttach, setDisableAttach] = useState(false);

  useEffect(async () => {
    await getCaseTemplate();
  }, []);

  const getCaseTemplate = () => {
    // call API get template
    // setTemplate();
  };

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
              return { ...value, value: item1 + "-" + newVlue };
            } else return { ...value };
          });
          console.log(newState);
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
    return (
      <>
        <Grid item xs={6}>
          {template.map((templateItem) => {
            return data.map((item, index) => {
              if (
                item.keywordId === templateItem.keywordId &&
                index + 1 <= mid
              ) {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbar({ isOpen: true, status: "success", message: "Successfully!" });

    //call API
  };
  const handleAttach = () => {
    setShowDialog(true);
  };

  return (
    <section className="customer">
      <form onSubmit={handleSubmit}>
        <Grid container columnSpacing={5} rowSpacing={3}>
          {generateCode()}
          <Grid item xs={12}>
            {disableAttach ? (
              <span className="required-icon">
                Note *: Please Create Case Before Attach File!
              </span>
            ) : null}
          </Grid>
          <Grid item xs={12}>
            <div className="handle-button">
              <FormButton
                itemName="Attach"
                buttonType="attach"
                onClick={handleAttach}
                disabled={disableAttach}
              />

              <FormButton itemName="Confirm" type="submit" />
            </div>
          </Grid>
        </Grid>
      </form>
      <DialogHandle
        open={showDialog}
        closeDialog={() => setShowDialog(false)}
        title="Attach Files"
      />
      <FormSnackbar item={snackbar} setItem={setSnackbar} />
    </section>
  );
};

export default CaseDetail;
