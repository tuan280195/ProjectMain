import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import GenericItems from "./until/GenericItems";
import DialogHandle from "./until/DialogHandle";
import FormButton from "./until/FormButton";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import FormSnackbar from "./until/FormSnackbar";
import { AxiosResponse, AxiosError } from 'axios'
window.Buffer = window.Buffer || require("buffer").Buffer;

const CaseDetail = ({ caseId }) => {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();

  let tokenBuffer = Buffer.from(auth.accessToken.split('.')[1], 'base64');
  let tokenParsed = JSON.parse(tokenBuffer.toString('utf-8'));
  console.log('tokenParsed', tokenParsed)

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

  useEffect(async () => {
    await getCaseTemplate();
    if (caseId) {
      setDisableAttach(false);
      await getCaseByCaseId();
    } else {
      setDisableAttach(true);
    }
  }, []);

  const getCaseTemplate = async (e) => {
    setLoading(true);
    let templateURL = "/api/Template/template";
    // call API get template
    await axiosPrivate.get(templateURL, {
      signal: controller.signal,
    }).then((response) => {
      setTemplate(response.data.keywords);
      response.data.keywords.forEach(element => {
        element.value = ""
      });
      setData(response.data.keywords)
    })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);

  };

  const getCaseByCaseId = async () => {
    setLoading(true);
    let templateURL = `/api/Case?caseId=${caseId}`;
    // call API get template
    await axiosPrivate.get(templateURL, {
      validateStatus: function (status) {
        console.log(status)
        return status < 500; // Resolve only if the status code is less than 500
      }
    }).then((response) => {
      setCaseIdAndName({
        "caseId": response.data.caseId,
        "caseName": response.data.caseName
      });
      setData(response.data.caseKeywordValues)
    })
      .catch(error => {
        console.log(error);
      });

    setLoading(false);
  };
  const handleSubmit = async (e) => {
    //call API
    e.preventDefault();
    let caseCreateURL = "/api/Case";
    if (caseIdName.caseId) {
      let payload = {
        "caseId": caseIdName.caseId,
        "keywordValues": data
      }
      console.log(axiosPrivate)
      await axiosPrivate.put(caseCreateURL, payload, {
        signal: controller.signal,
      }).then((response) => {
        console.log(response);
        setSnackbar({ isOpen: true, status: "success", message: "Update Case successfuly!" });
        setDisableAttach(false);
        return response;
      })
        .catch((error) => {
          console.log(error);
        });
    } else {
      let payload = {
        "keywordValues": data
      }
      console.log(axiosPrivate)
      await axiosPrivate.post(caseCreateURL, payload, {
        signal: controller.signal,
      }).then((response) => {
        console.log(response);
        setSnackbar({ isOpen: true, status: "success", message: "Create Case successfuly!" });
        setDisableAttach(false);
        return response;
      })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getFileTypes = async () => {
    let getFileTypesURL = "/api/FileType?pageSize=25&pageNumber=1";
    await axiosPrivate.get(getFileTypesURL, {
      signal: controller.signal,
    }).then((response) => {
      let options = [];
      response.data.forEach(function (item) {
        options.push({
          "id": item.id,
          "label": item.name
        });
      })
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
        handleInput3={(e) => {
          console.log(e.target.outerText)
          const newState = data.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.outerText };
            } else return { ...value };
          });
          setData(newState);
        }}
        options={item.metadata}
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
        <Grid item xs={12}>
          <strong><h2 style={{ margin: '1px' }}>{caseIdName.caseName}</h2></strong>
        </Grid>
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

              <FormButton itemName="Save" type="submit" />
            </div>
          </Grid>
        </Grid>
      </form>
      <DialogHandle
        open={showDialog}
        closeDialog={() => setShowDialog(false)}
        title="Attach Files"
        optionFileType={optionFileType}
      />
      <FormSnackbar item={snackbar} setItem={setSnackbar} />
    </section>
  );
};

export default CaseDetail;
