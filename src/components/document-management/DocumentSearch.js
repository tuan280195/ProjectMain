import LoadingSpinner from "../until/LoadingSpinner.js";
import Truncate from "../until/Truncate.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import ConfirmDialog from "../until/ConfirmBox.js";
import { useState, useEffect } from "react";
import FormButton from "../until/FormButton.js";
import Pagination from "../until/Pagination.js";
import GenericItems from "../until/GenericItems.js";
import ContentDialog from "../until/ContentDialog.js";
import commonState from "../../stories/commonState.ts";
import commonActions from "../../actions/commonAction.ts";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
} from "@mui/material";
import * as Icons from "@mui/icons-material";

const DocumentSearch = () => {
  const [showList, setShowList] = useState(true);
  const [listItem, setListItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [template, setTemplate] = useState([]);
  const [keyWordSearch, setKeyWordSearch] = useState([]);
  const [fileTypeSearch, setFileTypeSearch] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [deleteItem, setDeleteItem] = useState({
    keywordId: null,
    caseId: null,
    fileName: "",
  });
  const [condition, setCondition] = useState({ minWidth: "400px", xs: 4 });
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [urlPreviewImg, setUrlPreviewImg] = useState({
    blobUrl: "",
    fileName: "",
  });
  const [showDialog, setShowDialog] = useState(false);

  useEffect(async () => {
    setListItem([]);
    setUrlPreviewImg({ blobUrl: "", fileName: "" });
    await getDocumentTemplate();
  }, []);

  const getFiles = async (e) => {
    setLoading(true);
    if (e) e.preventDefault();
    let searchURL = "/api/Document/search";
    let keywordValues = keyWordSearch.filter((x) => !x.fromTo && x.value);
    let keywordDateValues = keyWordSearch.filter(
      (x) =>
        x.fromTo && x.typeValue === "datetime" && (x.fromValue || x.toValue)
    );
    let keywordDecimalValues = keyWordSearch.filter(
      (x) => x.fromTo && x.typeValue === "decimal" && (x.fromValue || x.toValue)
    );
    const payload = {
      fileTypeId: fileTypeSearch.value,
      keywordValues: keywordValues,
      keywordDateValues: keywordDateValues,
      keywordDecimalValues: keywordDecimalValues,
      pageSize: commonState.paginationState.pageSize,
      pageNumber: commonState.paginationState.currentPage,
    };
    const status = await axiosPrivate
      .post(searchURL, payload, {
        signal: controller.signal,
        validateStatus: () => true,
      })
      .then((response) => {
        setListItem(response.data);
        commonActions.setPaginationState({
          totalCount: response.data.totalCount,
          pageSize: response.data.pageSize,
          currentPage: response.data.currentPage,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    if (status == 404) {
      console.log("validateStatus", status);
      setListItem([]);
    }
    setLoading(false);
  };

  const getDocumentTemplate = async () => {
    setLoading(true);
    let getFileTypesURL = "/api/document/template";
    await axiosPrivate
      .get(getFileTypesURL, {
        signal: controller.signal,
      })
      .then((response) => {
        response.data.fileType.fileTypes.forEach(function (item) {
          item.label = item.name;
        });
        response.data.customers.forEach(function (item) {
          item.label = item.name;
        });
        response.data.keywords.forEach(function (item) {
          item.customerId = "";
        });
        response.data.fileType.value = null;
        setFileTypeSearch(response.data.fileType);
        setKeyWordSearch(response.data.keywords);
        setTemplate(response.data.keywords);
        setCustomerList(response.data.customers);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const viewOrDownloadFile = async (item) => {
    setLoading(true);
    let getFileUrl = `/api/FileUpload/Download`;
    let payload = {
      fileName: item.keywordName,
      caseId: item.caseId,
    };
    await axiosPrivate
      .post(getFileUrl, payload)
      .then(async (response) => {
        const byteArray = Uint8Array.from(
          atob(response.data)
            .split("")
            .map((char) => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], {
          type: response.headers["content-type"],
        });
        const blobUrl = window.URL.createObjectURL(blob);
        if (!item.isImage) {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = item.keywordName;
          link.click();
        } else {
          setShowDialog(true);
          setUrlPreviewImg({ blobUrl: blobUrl, fileName: item.keywordName });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  };

  const handleClickDelete = async (e) => {
    setLoading(true);
    e.preventDefault();
    var deleteURL = "/api/FileUpload/Delete";
    await axiosPrivate
      .put(deleteURL, deleteItem)
      .then(async (res) => {
        setShowAlert(false);
        await getFiles(e);
        setCondition({ width: "1080px", xs: 4 });
        setShowList(true);
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  };

  const handleClickSearch = async (e) => {
    await getFiles(e);
    setCondition({ width: "1080px", xs: 4 });
    setShowList(true);
  };

  const handleChangePageSize = async (e) => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      pageSize: parseInt(e.target.value),
    });
    await getFiles(e);
  };
  const handleChangePage = async (e) => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      currentPage: parseInt(e.target.innerText),
    });
    await getFiles(e);
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
            <TableBody>
              {listItem && listItem.items && listItem.items.length > 0 ? (
                listItem.items.map((item, index) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <Truncate str={item.keywordName} maxLength={20} />
                      </TableCell>
                      <TableCell style={{ position: "relative" }}>
                        <div className="container-search-actions">
                          <Button
                            className="search-edit"
                            to=""
                            onClick={() => {
                              viewOrDownloadFile(item);
                            }}
                            style={{ minWidth: "140px" }}
                          >
                            {item.isImage ? "表示" : "ダウンロード"}
                          </Button>
                          <Button
                            className="search-delete"
                            to=""
                            onClick={() => {
                              setShowAlert(true);
                              let itemDelete = {
                                keywordId: item.keywordId,
                                caseId: item.caseId,
                                fileName: item.keywordName,
                              };
                              setDeleteItem(itemDelete);
                            }}
                          >
                            削除
                          </Button>{" "}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableCell colSpan={3}>
                  <span style={{ color: "#000" }}>Not Found!</span>
                </TableCell>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  const dynamicGenerate = (item, templateItem) => {
    let typeValue = templateItem.typeValue;
    if (templateItem.fromTo && templateItem.typeValue == "decimal") {
      typeValue = "decimalrange";
    } else if (templateItem.fromTo && templateItem.typeValue == "datetime") {
      typeValue = "daterange";
    } else if (templateItem.keywordName === "取引先名") {
      typeValue = "list";
    }
    return (
      <GenericItems
        value={item.value}
        value1={item.fromValue}
        value2={item.toValue}
        label={templateItem.keywordName}
        type={typeValue}
        key={templateItem.order}
        handleInput={(e) => {
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, value: e.target.value };
            } else return { ...value };
          });
          setKeyWordSearch(newState);
        }}
        // using for decimal range
        handleInput1={(e) => {
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return { ...value, fromValue: e.target.value };
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
        handleInput3={(e, customer) => {
          const newState = keyWordSearch.map((value) => {
            if (value.keywordId === item.keywordId) {
              return {
                ...value,
                value: customer ? customer.label : "",
                customerId: customer ? customer.id : "",
              };
            } else return { ...value };
          });
          setKeyWordSearch(newState);
        }}
        options={customerList}
      />
    );
  };

  const generateTemplate = () => {
    if (template && template.length > 0) {
      template.sort((a, b) =>
        a.order > b.order ? 1 : b.order > a.order ? -1 : 0
      );
    }
    return (
      <>
        <Grid item xs={condition.xs}>
          <GenericItems
            label={"書類種類"}
            type={"list"}
            options={fileTypeSearch.fileTypes}
            handleInput3={(e, item) => {
              const newState = fileTypeSearch;
              newState.value = item ? (item.id ? item.id : null) : null;
              setFileTypeSearch(newState);
            }}
          />
          {template.map((templateItem) => {
            return keyWordSearch.map((item) => {
              if (item.keywordId === templateItem.keywordId) {
                return dynamicGenerate(item, templateItem);
              }
            });
          })}
          <br />
          <Grid item xs="12" sx={{ display: "flex", justifyContent: "center" }}>
            {/* Search Button */}
            <FormButton itemName="検索" onClick={handleClickSearch} />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <section style={{ width: condition.width }}>
      <Grid container columnSpacing={5} rowSpacing={5}>
        {generateTemplate()}

        {showList ? (
          <Grid item xs={8}>
            <Results />
          </Grid>
        ) : null}
      </Grid>
      <ContentDialog open={showDialog} closeDialog={() => setShowDialog(false)}>
        <Grid container columnSpacing={5} rowSpacing={5}>
          {urlPreviewImg.blobUrl && (
            <Grid
              item
              xs={12}
              className="preview-file"
              style={{ marginTop: "10px" }}
            >
              <a href={urlPreviewImg.blobUrl} download={urlPreviewImg.fileName}>
                <IconButton size="small" aria-label="download">
                  <Icons.CloudDownload sx={{ color: "green", fontSize: 24 }} />
                </IconButton>
                書類のダウンロード
              </a>
              <img
                src={urlPreviewImg.blobUrl}
                style={{
                  width: "100%",
                  marginTop: "10px",
                  border: "3px solid #11596F",
                }}
              />
            </Grid>
          )}
        </Grid>
      </ContentDialog>
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

export default DocumentSearch;