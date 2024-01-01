import { useState, useEffect } from "react";
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

const CaseSearch = ({ setHeader, setCaseDetail }) => {
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [template, setTemplate] = useState([]);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState({
    id: null,
    customerName: null,
    phoneNumber: null,
  });
  const [caseIdClose, setCloseCase] = useState("");
  useEffect(async () => {
    setSearchData([]);
    setData([]);
    await getCaseTemplate();
  }, []);

  const getCaseTemplate = async (e) => {
    // call API get template
    setLoading(true);
    let templateURL = "/api/Template/template";
    await axiosPrivate.get(templateURL, {
      signal: controller.signal,
    }).then((response) => {
      console.log("template--", response.data.keywords)
      // response.data.keywords = template;
      setTemplate(response.data.keywords);
      response.data.keywords.forEach(element => {
        element.value = ""
      });
      console.log("response.data.keywordstemplate--", response.data.keywords)
      setData(response.data.keywords)
    })
      .catch(error => {
        console.log("eerrrrrrr---")
        console.log(error.response);
      });

    setLoading(false);
  };

  const getCaseList = async () => {
    const searchCaseUrl = "/api/Case/getAll";
    const payload = {
      keywordValues: data,
      pageSize: 25,
      pageNumber: 1
    }
    let payloadFilterd = payload.keywordValues.filter(n => n.value);
    payload.keywordValues = payloadFilterd;
    axiosPrivate.post(searchCaseUrl, payload).then((response) => {

      setSearchData(response.data)
    })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleClickSearch = async (e) => {
    setLoading(true);
    e.preventDefault();

    await getCaseList();
    setShowList(true);
    setLoading(false);
  };
  const handleClickEdit = async (caseId) => {
    console.log("caseId-----------", caseId)
    setLoading(true);
    setHeader("Case");
    setCaseDetail(caseId);
    setLoading(false);
  };

  const confirmCloseCase = async (e) => {
    setLoading(true);
    setShowAlert(false);
    e.preventDefault();

    const closeCaseUrl = `/api/Case/Close?caseId=${caseIdClose}`;
    const payload = {
      caseId: caseIdClose
    }

    axiosPrivate.post(closeCaseUrl, payload).then(async (response) => {
      await getCaseList();
      setShowList(true);
    })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const Results = () => {
    return (
      searchData.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Case Name</TableCell>
                  {
                    searchData[0].caseKeywordValues.length > 0 && searchData[0].caseKeywordValues.map((item) => {
                      return (
                        (item.isShowOnCaseList) && (
                          <TableCell>{item.keywordName}</TableCell>
                        )
                      )
                    })
                  }
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
                        <Truncate str={row.caseName} maxlength={15} />
                      </TableCell>
                      {row.caseKeywordValues.length > 0 && row.caseKeywordValues.map((item) => {

                        return (
                          (item.isShowOnCaseList) && (
                            <TableCell>
                              <Truncate str={item.value} />
                            </TableCell>)
                        )
                      })}
                      <TableCell align="center">
                        <Button
                          className="search-close"
                          onClick={() => {
                            setShowAlert(true);
                            setCloseCase(row.caseId);
                          }}
                        >
                          Close
                        </Button>
                        <Button
                          className="search-edit"
                          onClick={() => handleClickEdit(row.caseId)}
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
      ));
  };

  const dynamicGenerate = (item, templateItem) => {
    return (
      <GenericItems
        value={item.value}
        value1={item.value.split("/")[0]}
        value2={item.value.split("/")[1]}
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
        handleFunction={confirmCloseCase}
        typeDialog='Close'
      ></ConfirmDialog>
    </section>
  );
};

export default CaseSearch;
