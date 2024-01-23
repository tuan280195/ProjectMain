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
import * as _ from "lodash";
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
import CaseDetail from "../CaseDetail.js";
import FormSnackbar from "../until/FormSnackbar.js";

const DocumentSearch = () => {
  const [showList, setShowList] = useState(true);
  const [listItem, setListItem] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [template, setTemplate] = useState([]);
  const [keyWordSearch, setKeyWordSearch] = useState([]);
  const [fileTypeSearch, setFileTypeSearch] = useState({
    fileTypes: [],
    name: "File Type",
    value: null,
    label: ""
  });
  const [customerList, setCustomerList] = useState([]);
  const [deleteItem, setDeleteItem] = useState({
    keywordId: null,
    caseId: null,
    fileName: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [urlPreviewImg, setUrlPreviewImg] = useState({
    blobUrl: "",
    fileName: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogPreview, setShowDialogPreview] = useState(false);

  const [showDialogCase, setShowDialogCase] = useState(false);
  const [caseId, setCaseId] = useState();
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    status: "success",
    message: "Successfully!",
  });

  useEffect(async () => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      totalCount: 0,
    });
    setListItem([]);
    setUrlPreviewImg({ blobUrl: "", fileName: "" });
    await getDocumentTemplate();
  }, []);

  const getFiles = async (e) => {
    setLoading(true);
    if (e) e.preventDefault();
    let searchURL = "/api/Document/search";
    const keywordSearchCopy = _.cloneDeep(keyWordSearch);
    const keywordValues = keywordSearchCopy.filter((x) => !x.fromTo && x.value);
    let keywordDateValues = keyWordSearch.filter(
      (x) =>
        x.fromTo && x.typeValue === "datetime" && (x.fromValue || x.toValue)
    );
    let keywordDecimalValues = keyWordSearch.filter(
      (x) => x.fromTo && x.typeValue === "decimal" && (x.fromValue || x.toValue)
    );
    keywordValues.forEach((item) => {
      if (item.keywordName === "取引先名") {
        item.value = item.customerId;
      }
    });
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
          ...commonState.paginationState,
          totalCount: response.data.totalCount,
        });
      })
      .catch(() => {
        setListItem([]);
        setSnackbar({
          isOpen: true,
          status: "error",
          message:
            "エラーが発生しました。再試行するか、サポートにお問い合わせください。",
        });
      });
    if (status === 404) {
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
        response.data.fileType.value = null;
        response.data.fileType.fileTypes.forEach(function (item) {
          item.label = item.name;
        });
        response.data.customers.forEach(function (item) {
          item.label = item.name;
        });
        response.data.keywords.forEach(function (item) {
          item.customerId = null;
        });
        setFileTypeSearch(response.data.fileType);
        setKeyWordSearch(response.data.keywords);
        setTemplate(response.data.keywords);
        setCustomerList(response.data.customers);
      })
      .catch(() => {
        setSnackbar({
          isOpen: true,
          status: "error",
          message:
            "エラーが発生しました。再試行するか、サポートにお問い合わせください。",
        });
      });
    setLoading(false);
  };

  const viewOrDownloadFile = async (item, type) => {
    // type = download / view
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
        if (type === "download") {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = item.keywordName;
          link.click();
        } else {
          setShowDialogPreview(true);
          setUrlPreviewImg({ blobUrl: blobUrl, fileName: item.keywordName });
        }
      })
      .catch(() => {
        setSnackbar({
          isOpen: true,
          status: "error",
          message:
            "エラーが発生しました。再試行するか、サポートにお問い合わせください。",
        });
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
        setShowList(true);
      })
      .catch(() => {
        setSnackbar({
          isOpen: true,
          status: "error",
          message:
            "エラーが発生しました。再試行するか、サポートにお問い合わせください。",
        });
      });
    setLoading(false);
  };

  const handleClickViewCase = (caseId) => {
    setLoading(true);
    setCaseId(caseId);
    setShowDialogCase(true);
    setLoading(false);
  };

  const handleClickSearch = async (e) => {
    await getFiles(e);
    setShowList(true);
  };

  const handleClickClear = () => {
    setKeyWordSearch((prevKeyWordSearch) =>
      prevKeyWordSearch.map((item) => ({
        ...item,
        value: "",
        fromValue: "",
        toValue: "",
        customerId: "",
      }))
    );
    setFileTypeSearch({...fileTypeSearch, value: null, label: ""});
  };

  const handleChangePageSize = async (e) => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      pageSize: parseInt(e.target.value),
    });
    await getFiles(e);
  };
  const handleChangePage = async (e, value) => {
    commonActions.setPaginationState({
      ...commonState.paginationState,
      currentPage: value,
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
                      <TableCell
                        style={{
                          minWidth: "230px",
                          maxWidth: "250px",
                          textAlign: "right",
                        }}
                      >
                        <div>
                          {item.isImage && (
                            <Button
                              variant="contained"
                              color="success"
                              to=""
                              startIcon={<Icons.Image />}
                              style={{ marginRight: "5px" }}
                              onClick={() => {
                                viewOrDownloadFile(item, "view");
                              }}
                              disabled={!item.isImage}
                            >
                              表示
                            </Button>
                          )}
                          <Button
                            variant="contained"
                            color="success"
                            to=""
                            startIcon={<Icons.Download />}
                            style={{ marginRight: "5px" }}
                            onClick={async () => {
                              await viewOrDownloadFile(item, "download");
                            }}
                            // disabled={item.isImage}
                          >
                            ダウンロード
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<Icons.Delete />}
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
                          </Button>
                          {/* Add line break to bring the View Case button to next line*/}
                          <br />{" "}
                          <Button
                            variant="contained"
                            startIcon={<Icons.Assignment />}
                            style={{ marginTop: "5px" }}
                            onClick={() => {
                              handleClickViewCase(item.caseId);
                            }}
                          >
                            案件表示
                          </Button>{" "}
                        </div>
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

  const dynamicGenerate = (item, templateItem) => {
    let typeValue = templateItem.typeValue;
    if (templateItem.fromTo && templateItem.typeValue === "decimal") {
      typeValue = "decimalrange";
    } else if (templateItem.fromTo && templateItem.typeValue === "datetime") {
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
                customerId: customer ? customer.id : null,
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
        <Grid item xs={4}>
          <GenericItems
            value={fileTypeSearch.label}
            label={"書類種類"}
            type={"list"}
            options={fileTypeSearch.fileTypes}
            handleInput3={(e, item) => {
              setFileTypeSearch({
                ...fileTypeSearch,
                value: item ? (item.id ? item.id : null) : null,
                label: item ? (item.label ? item.label : "") : ""
              });
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
          <Grid
            item
            xs="12"
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: 2,
            }}
          >
            {/* Search Button */}
            <FormButton itemName="検索" onClick={handleClickSearch} />
            <FormButton
              itemName="検索条件の初期化"
              onClick={handleClickClear}
            />
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <section>
      <Grid container columnSpacing={5} rowSpacing={5}>
        {generateTemplate()}

        {showList ? (
          <Grid item xs={8}>
            <Results />
          </Grid>
        ) : null}
      </Grid>
      <ContentDialog
        open={showDialogPreview}
        closeDialog={() => setShowDialogPreview(false)}
      >
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
        typeDialog="書類削除の確認"
        mainContent="書類を削除すると、案件から関連書類として参照できなくなります。本当に削除しますか"
        cancelBtnDialog="いいえ"
        confirmBtnDialog="はい"
        handleFunction={handleClickDelete}
      ></ConfirmDialog>
      <ContentDialog
        open={showDialogCase}
        closeDialog={() => setShowDialogCase(false)}
      >
        <CaseDetail caseId={caseId} createType={false} />
      </ContentDialog>
      <FormSnackbar item={snackbar} setItem={setSnackbar} />
    </section>
  );
};

export default DocumentSearch;
