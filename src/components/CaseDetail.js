import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import GenericItems from "./until/GenericItems";
import DialogHandle from "./until/DialogHandle";
import FormButton from "./until/FormButton";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FormSnackbar from "./until/FormSnackbar";
import LoadingSpinner from "./until/LoadingSpinner";
window.Buffer = window.Buffer || require("buffer").Buffer;

const CaseDetail = ({ caseId }) => {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

  // let tokenBuffer = Buffer.from(auth.accessToken.split('.')[1], 'base64');
  // let tokenParsed = JSON.parse(tokenBuffer.toString('utf-8'));
  // console.log('tokenParsed', tokenParsed)

  const [template, setTemplate] = useState([]);
  const [data, setData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    status: "success",
    message: "Successfully!",
  });
  const [caseIdName, setCaseIdAndName] = useState({
    caseId: null,
    caseName: "",
  });
  const [optionFileType, setOptionFileType] = useState([]);
  const [disableAttach, setDisableAttach] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [customerList, setCustomerList] = useState([]);

  useEffect(async () => {
    setLoading(true);
    await getCaseTemplate();
    setLoading(false);
  }, []);

  useEffect(async () => {
    if (caseId) {
      setCaseIdAndName((caseIdName) => ({ ...caseIdName, caseId: caseId }));
      setDisableAttach(false);
      await getCaseByCaseId();
    } else {
      setDisableAttach(true);
    }
  }, [caseId]);
  const validateForm = () => {
    let errors = [];

    template.map((item) => {
      if (item.isRequired) {
        let currentValue;
        data.map((value) => {
          if (value.keywordId === item.keywordId) {
            return (currentValue = value.value);
          }
        });
        if (!currentValue) {
          errors.push({
            keywordId: item.keywordId,
            value: item.keywordName + "は必須項目です。",
          });
        }
      }
    });

    // Set the errors and update form validity
    setErrors(errors);
    return errors.length === 0;
  };

  const getCaseTemplate = async (e) => {
    setLoading(true);
    let templateURL = "/api/Template/template";
    // call API get template
    await axiosPrivate
      .get(templateURL, {
        signal: controller.signal,
      })
      .then((response) => {
        response.data.keywords.forEach((element) => {
          element.value = "";
          element.customerId = "";
        });
        response.data.customers.forEach(function (item) {
          item.label = item.name;
        });
        setCustomerList(response.data.customers);
        setTemplate(response.data.keywords);
        setData(response.data.keywords);
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  };

  const getCaseByCaseId = async () => {
    setLoading(true);
    let templateURL = `/api/Case?caseId=${caseId}`;
    await axiosPrivate
      .get(templateURL, {
        validateStatus: function (status) {
          return status < 500; // Resolve only if the status code is less than 500
        },
      })
      .then((response) => {
        setCaseIdAndName({
          caseId: response.data.caseId,
          caseName: response.data.caseName,
        });
        setData(response.data.caseKeywordValues);
      })
      .catch((error) => {
        console.log(error);
      });

    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsFormValid(true);
    validateForm();
    if (!validateForm()) {
      // Form is valid, perform the submission logic
      setSnackbar({
        isOpen: true,
        status: "error",
        message: "問題が発生しました。入力内容を修正してください。",
      });
      setLoading(false);
      return;
    } else {
      console.log("OK.");
    }

    let caseCreateURL = "/api/Case";
    if (caseIdName.caseId) {
      let payload = {
        caseId: caseIdName.caseId,
        keywordValues: data,
      };
      await axiosPrivate
        .put(caseCreateURL, payload, {
          signal: controller.signal,
        })
        .then((response) => {
          setSnackbar({
            isOpen: true,
            status: "success",
            message: "案件情報の更新は正常に完了しました!",
          });
          setDisableAttach(false);
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      let payload = {
        keywordValues: data,
      };
      await axiosPrivate
        .post(caseCreateURL, payload, {
          signal: controller.signal,
        })
        .then((response) => {
          setCaseIdAndName({ ...caseIdName, caseId: response.data });
          setSnackbar({
            isOpen: true,
            status: "success",
            message: "案件の作成は正常に完了しました!",
          });
          setDisableAttach(false);
          return response;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setLoading(false);
  };

  const getFileTypes = async () => {
    let getFileTypesURL = "/api/Type/file-type";
    await axiosPrivate
      .get(getFileTypesURL, {
        signal: controller.signal,
      })
      .then((response) => {
        let options = [];
        response.data.forEach(function (item) {
          options.push({
            id: item.id,
            label: item.name,
          });
        });
        setOptionFileType(options);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAttach = async () => {
    await getFileTypes();
    setShowDialog(true);
  };

  const dynamicGenerate = (item, templateItem) => {
    let typeValue = templateItem.typeValue;
    if (templateItem.keywordName === "取引先名") {
      typeValue = "customerlist";
    }
    return (
      <GenericItems
        value={item.value}
        label={templateItem.keywordName}
        type={typeValue}
        key={templateItem.order}
        handleInput={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.value };
            } else return { ...value };
          });
          setData(newState);
        }}
        handleInput3={(e) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.outerText };
            } else return { ...value };
          });
          setData(newState);
        }}
        handleInputCustomer={(e, customer) => {
          const newState = data.map((value) => {
            if (value.keywordName === "電話番号") {
              value.value =
                customer && customer.id
                  ? customerList.find((x) => x.id === customer.id).phoneNumber
                  : "";
            }
            if (value.keywordName === "住所") {
              let fiteredCustomer =
                customer && customer.id
                  ? customerList.find((x) => x.id === customer.id)
                  : "";
              value.value = fiteredCustomer
                ? [
                    fiteredCustomer.stateProvince,
                    fiteredCustomer.city,
                    fiteredCustomer.street,
                    fiteredCustomer.buildingName,
                    fiteredCustomer.roomNumber,
                  ].join("")
                : "";
            }
            if (value.keywordId === item.keywordId) {
              return {
                ...value,
                value: customer ? customer.label : "",
                customerId: customer ? customer.id : "",
              };
            } else return { ...value };
          });
          setData(newState);
        }}
        optionCustomers={customerList}
        options={item.metadata}
        required={templateItem.isRequired}
        maxLength={templateItem.maxLength}
      >
        {errors.map((error) => {
          if (error.keywordId === item.keywordId) {
            return <errors>{error.value}</errors>;
          }
        })}
      </GenericItems>
    );
  };
  const generateCode = () => {
    template.sort((a, b) =>
      a.order > b.order ? 1 : b.order > a.order ? -1 : 0
    );
    const mid = template.length / 2;
    return (
      <>
        <Grid item xs={12}>
          <strong>
            <h2 style={{ margin: "1px" }}>{caseIdName.caseName}</h2>
          </strong>
        </Grid>
        <Grid item xs={6}>
          {template.map((templateItem, index) => {
            if (index + 1 <= mid && templateItem.typeValue !== "textarea") {
              return data.map((item) => {
                if (item.keywordId === templateItem.keywordId) {
                  return dynamicGenerate(item, templateItem);
                }
              });
            }
          })}
        </Grid>
        <Grid item xs={6}>
          {template.map((templateItem, index) => {
            if (index + 1 > mid && templateItem.typeValue !== "textarea") {
              return data.map((item) => {
                if (item.keywordId === templateItem.keywordId) {
                  return dynamicGenerate(item, templateItem);
                }
              });
            }
          })}
        </Grid>
        <Grid item xs={12}>
          {template.map((templateItem, index) => {
            return data.map((item) => {
              if (
                item.keywordId === templateItem.keywordId &&
                templateItem.typeValue === "textarea"
              ) {
                return dynamicGenerate(item, templateItem);
              }
            });
          })}
        </Grid>
      </>
    );
  };

  return (
    <section className="customer">
      <form onSubmit={handleSubmit}>
        <Grid container columnSpacing={5} rowSpacing={3}>
          {generateCode()}
          <Grid item xs={12}>
            {/* <span>Attached {atchedFile} files</span> */}
            <div className="handle-button">
              <FormButton
                itemName="関連書類"
                buttonType="attach"
                titleContent={
                  disableAttach
                    ? "関連書類が存在しません。案件を保存してから書類の添付や管理が行えます。"
                    : ""
                }
                onClick={handleAttach}
                disabled={disableAttach}
              />
              {/* Save Button */}
              <FormButton itemName="保存" type="submit" />
            </div>
          </Grid>
        </Grid>
      </form>
      <DialogHandle
        open={showDialog}
        closeDialog={() => setShowDialog(false)}
        title="関連書類の添付"
        optionFileType={optionFileType}
        caseId={caseId || caseIdName.caseId}
      />
      <LoadingSpinner loading={loading}></LoadingSpinner>
      <FormSnackbar item={snackbar} setItem={setSnackbar} />
    </section>
  );
};

export default CaseDetail;
