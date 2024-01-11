import { useState, useEffect } from "react";
import GenericItems from "./until/GenericItems";
import LoadingSpinner from "./until/LoadingSpinner";
import ConfirmDialog from "./until/ConfirmBox";
import Pagination from "./until/Pagination";
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
import caseSearchState from "../stories/caseSearchState.ts";
import caseSearchActions from "../actions/caseSearchActions.ts";

const CaseSearch = ({ setHeader, setCaseDetail }) => {
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [template, setTemplate] = useState([]);
  const [data, setData] = useState([]);
  const [keyWordSearch, setKeyWordSearch] = useState([]);
  const [keyWordDateSearch, setKeyWordDateSearch] = useState([]);
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
  // const tableClassCustomize = useStyles();
  useEffect(async () => {
    caseSearchActions.setPaginationState(0, 25, 1);
    caseSearchActions.setKeywordsSearchState([]);
    caseSearchActions.setCaseDataSearchState([]);
    // setSearchData([]);
    setShowList(false);
    setData([]);
    setKeyWordSearch([]);
    await getCaseTemplate();
  }, []);

  const getCaseTemplate = async (e) => {
    // call API get template
    setLoading(true);
    let templateURL = "/api/Case/template";
    await axiosPrivate
      .get(templateURL, {
        signal: controller.signal,
      })
      .then((response) => {
        setTemplate(response.data);
        setKeyWordSearch(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });

    setLoading(false);
  };

  const getCaseList = async () => {
    const searchCaseUrl = "/api/Case/getAll";
    const payload = {
      keywordValues: keyWordSearch.filter(n => !n.fromTo),
      keywordDateValues: keyWordSearch.filter(n => n.fromTo),
      pageSize: caseSearchState.paginationState.pageSize,
      pageNumber: caseSearchState.paginationState.currentPage,
    };
    console.log("payload", payload);
    let payloadFilterd =
    keyWordSearch.filter((n) => n.value);
    payload.keywordValues = payloadFilterd;
    // caseSearchActions.setKeywordsSearchState(payloadFilterd);
    setShowList(false);
    axiosPrivate
      .post(searchCaseUrl, payload)
      .then((response) => {
        console.log(response.data);
        caseSearchActions.setPaginationState(
          response.data.totalCount,
          response.data.pageSize,
          response.data.currentPage
        );
        caseSearchActions.setCaseDataSearchState(response.data.items);
        setShowList(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleClickSearch = async (e) => {
    setLoading(true);
    e.preventDefault();

    await getCaseList();

    setLoading(false);
  };
  const handleClickEdit = (caseId) => {
    setLoading(true);
    setCaseDetail(caseId);
    setHeader("Create Case");
    setLoading(false);
  };

  const confirmCloseCase = async (e) => {
    setLoading(true);
    setShowAlert(false);
    e.preventDefault();

    const closeCaseUrl = `/api/Case/Close?caseId=${caseIdClose}`;
    const payload = {
      caseId: caseIdClose,
    };

    axiosPrivate
      .post(closeCaseUrl, payload)
      .then(async (response) => {
        await getCaseList();
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const handleChangePageSize = async (e) => {
    caseSearchActions.setPaginationState(
      caseSearchState.paginationState.totalCount,
      e.target.value,
      caseSearchState.paginationState.currentPage
    );
    await getCaseList();
  };
  const handleChangePage = async (e) => {
    caseSearchActions.setPaginationState(
      caseSearchState.paginationState.totalCount,
      caseSearchState.paginationState.pageSize,
      parseInt(e.target.innerText)
    );
    await getCaseList();
  };
  const Results = () => {
    let totalCount = 0;
    if (
      caseSearchState.caseDataSearchState &&
      caseSearchState.caseDataSearchState.totalCount > 0
    ) {
      totalCount = Math.ceil(
        caseSearchState.caseDataSearchState.totalCount /
        caseSearchState.caseDataSearchState.pageSize
      );
    }
    return caseSearchState.caseDataSearchState &&
      caseSearchState.caseDataSearchState.totalCount > 0 ? (
      <>
        <Pagination
          totalCount={totalCount}
          pageSize={caseSearchState.caseDataSearchState.pageSize}
          currentPage={caseSearchState.caseDataSearchState.currentPage}
          handleChangePageSize={handleChangePageSize}
          handleChangePage={handleChangePage}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Case Name</TableCell>
                {caseSearchState.caseDataSearchState.items[0].caseKeywordValues
                  .length > 0 &&
                  caseSearchState.caseDataSearchState.items[0].caseKeywordValues.map(
                    (item) => {
                      return (
                        item.isShowOnCaseList && (
                          <TableCell>{item.keywordName}</TableCell>
                        )
                      );
                    }
                  )}
              </TableRow>
            </TableHead>
            <TableBody>
              {caseSearchState.caseDataSearchState.items.map((row) => {
                return (
                  <TableRow
                    key={row.caseId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Truncate str={row.caseName} maxlength={15} />
                    </TableCell>
                    {row.caseKeywordValues.length > 0 && (
                      row.caseKeywordValues.filter(n => n.isShowOnCaseList).map((item, index) => {
                        return (
                          <TableCell style={{position: "relative"}}>
                            <Truncate str={item.value} />
                            {(index + 1 === row.caseKeywordValues.filter(n => n.isShowOnCaseList).length) && (
                              <div className="container-search-actions">
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
                              </div>
                            )}
                          </TableCell>
                        );
                      }))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    ) : (
      <h3>Not Found!</h3>
    );
  };

  const dynamicGenerate = (item, templateItem) => {
    return (
      <GenericItems
        value={item.value}
        value1={item.fromValue}
        value2={item.toValue}
        label={templateItem.keywordName}
        type={templateItem.fromTo ? 'daterange' : templateItem.typeValue}
        key={templateItem.order}
        handleInput={(e) => {
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.value };
            } else return { ...value };
          });
          setKeyWordSearch(newState);
        }}
        // using for date range
        handleInput1={(e) => {
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, fromValue: e.target.value};
            } else return { ...value };
          });

          setKeyWordSearch(newState);
        }}
        handleInput2={(e) => {
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, toValue: e.target.value };
            } else return { ...value };
          });
          setKeyWordSearch(newState);
        }}
        handleInput3={(e) => {
          console.log(e.target.outerText);
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.outerText };
            } else return { ...value };
          });
          setKeyWordSearch(newState);
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
    return (
      <>
        <Grid item xs={6}>
          {template.map((templateItem, index) => {
            if (index + 1 <= mid) {
              return keyWordSearch.map((item) => {
                if (item.keywordId === templateItem.keywordId) {
                  return dynamicGenerate(item, templateItem);
                }
              });
            }
          })}
        </Grid>
        <Grid item xs={6}>
          {template.map((templateItem, index) => {
            if (index + 1 > mid) {
              return keyWordSearch.map((item) => {
                if (item.keywordId === templateItem.keywordId) {
                  return dynamicGenerate(item, templateItem);
                }
              });
            }
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
          {/* Search Button */}
          <FormButton onClick={handleClickSearch} itemName="検索"></FormButton>
        </Grid>
      </Grid>

      <LoadingSpinner loading={loading}></LoadingSpinner>
      <ConfirmDialog
        open={showAlert}
        closeDialog={() => setShowAlert(false)}
        item={deleteItem.customerName}
        handleFunction={confirmCloseCase}
        typeDialog="Close"
      ></ConfirmDialog>
    </section>
  );
};

export default CaseSearch;
