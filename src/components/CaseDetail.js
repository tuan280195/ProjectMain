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
  const [caseIdName, setCaseIdAndName] = useState({});
  const [optionFileType, setOptionFileType] = useState([]);
  const [disableAttach, setDisableAttach] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(async () => {
    setLoading(true);
    await getCaseTemplate();
    if (caseId) {
      setDisableAttach(false);
      await getCaseByCaseId();
    } else {
      setDisableAttach(true);
    }
    setLoading(false);
  }, []);

  const validateForm = () => {
    let errors = [];

    // Validate required fields
    template.map((item) => {
      if (item.isRequired) {
        let currentValue;
        data.map((value) => {
          if (value.keywordId === item.keywordId) {
            return (currentValue = value.value);
          }
        });
        if (currentValue === "") {
          errors.push({
            keywordId: item.keywordId,
            value: item.keywordName + " is required.",
          });
        }
      }
    });

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(errors.length === 0);
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
        });
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
    // call API get template
    await axiosPrivate
      .get(templateURL, {
        validateStatus: function (status) {
          console.log(status);
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
    validateForm();
    if (!isFormValid) {
      // Form is valid, perform the submission logic
      setSnackbar({
        isOpen: true,
        status: "error",
        message: "Form has errors. Please correct them.",
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
      console.log(axiosPrivate);
      await axiosPrivate
        .put(caseCreateURL, payload, {
          signal: controller.signal,
        })
        .then((response) => {
          console.log(response);
          setSnackbar({
            isOpen: true,
            status: "success",
            message: "Update Case successfuly!",
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
      console.log(axiosPrivate);
      await axiosPrivate
        .post(caseCreateURL, payload, {
          signal: controller.signal,
        })
        .then((response) => {
          console.log(response);
          setSnackbar({
            isOpen: true,
            status: "success",
            message: "Create Case successfuly!",
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
    let getFileTypesURL = "/api/FileType?pageSize=25&pageNumber=1";
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
    return (
      <GenericItems
        value={item.value}
        value1={item.value.split("-")[0]}
        value2={item.value.split("-")[1]}
        label={templateItem.keywordName}
        type={templateItem.typeValue}
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
          setData(newState);
        }}
        handleInput2={(newVlue) => {
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              const item1 = item.value.split("-")[0];
              return { ...value, value: item1 + "-" + newVlue };
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
            if (index + 1 <= mid && templateItem.keywordName !== "Note") {
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
            if (index + 1 > mid && templateItem.keywordName !== "Note") {
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
                templateItem.keywordName === "Note"
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
                  disableAttach ? "Please Create Case Before Attach File!" : ""
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
        title="Attach Files"
        optionFileType={optionFileType}
        caseId={caseId}
      />
      <LoadingSpinner loading={loading}></LoadingSpinner>
      <FormSnackbar item={snackbar} setItem={setSnackbar} />
    </section>
  );
};

export default CaseDetail;
