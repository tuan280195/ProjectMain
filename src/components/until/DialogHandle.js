import Upload from "./Upload";
import LoadingSpinner from "./LoadingSpinner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import Truncate from "./Truncate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "./ConfirmBox";
import * as Icons from "@mui/icons-material";

const DialogHandle = ({
  title,
  open,
  closeDialog,
  item,
  optionFileType,
  handleFunction,
  caseId,
}) => {
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [listItem, setListItem] = useState([]);
  const [urlPreviewImg, setUrlPreviewImg] = useState({
    blobUrl: "",
    fileName: "",
  });
  const [fileDelete, setFileDelete] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [dataUpload, setDataUpload] = useState({
    fileTypeId: null,
    fileName: "",
  });
  useEffect(async () => {
    setListItem([]);
    setLoading(false);
    setLoadingFile(false);
    setUrlPreviewImg({ blobUrl: "", fileName: "" });
    setFileDelete({});
    setShowAlert(false);
    console.log("caseID---dialog----------------", caseId);
    if (caseId) {
      await getFilesOfCase();
    }
  }, []);

  const getFilesOfCase = async () => {
    setLoadingFile(true);
    let getFilesUploadURL = `/api/Case/file/getall?caseId=${caseId}`;
    var { status } = await axiosPrivate
      .get(getFilesUploadURL, {
        signal: controller.signal,
        validateStatus: () => true,
      })
      .then((response) => {
        console.log(response);
        setListItem(response.data);
        return response;
      })
      .catch((error) => {
        console.log(JSON.stringify(error));
      });
    if (status === 404) {
      console.log("validateStatus", status);
      setListItem([]);
    }

    setLoadingFile(false);
  };

  const uploadFunction = async (event) => {
    setLoading(true);
    setUrlPreviewImg({});
    event.preventDefault();

    const formData = new FormData();
    formData.append("FileToUpload", dataUpload.fileToUpload);
    formData.append("CaseId", caseId);
    formData.append("FileTypeId", dataUpload.fileTypeId);
    formData.append("FileName", dataUpload.fileName);

    await axiosPrivate
      .post("/api/FileUpload/Upload", formData)
      .then(async (response) => {
        await getFilesOfCase();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
    controller.abort();
  };

  const handleSelectedFileType = (e, value) => {
    var newState = {
      ...dataUpload,
      fileTypeId: value ? (value.id ? value.id : null) : null,
    };
    setDataUpload(newState);
  };
  const handleInputFileName = (e) => {
    var newState = { ...dataUpload, fileName: e.target.value };
    setDataUpload(newState);
  };
  const handleFileChange = (e) => {
    var newState = { ...dataUpload, fileToUpload: e.target.files[0] };
    setDataUpload(newState);
  };
  const viewOrDownloadFile = async (item) => {
    setLoading(true);
    let getFileUrl = `/api/FileUpload/Download`;
    let payload = {
      fileName: item.fileName,
      caseId: caseId,
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
          link.download = item.fileName;
          link.click();
        } else {
          setUrlPreviewImg({ blobUrl: blobUrl, fileName: item.fileName });
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
    let deleteFileUrl = `/api/FileUpload/Delete`;
    let payload = fileDelete;
    payload.caseId = caseId;
    await axiosPrivate
      .put(deleteFileUrl, payload)
      .then(async (response) => {
        setUrlPreviewImg({ ...urlPreviewImg, blobUrl: "", fileName: "" });
        await getFilesOfCase();
        setShowAlert(false);
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  };
  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={closeDialog}
      onBackdropClick={closeDialog}
      maxWidth="xl"
    >
      <DialogTitle>{title}</DialogTitle>
      <IconButton
        size="small"
        onClick={closeDialog}
        sx={{
          position: "absolute",
          right: "5px",
          top: "5px",
          width: "2rem",
          height: "2rem",
        }}
      >
        <Icons.Close sx={{ color: "red" }} />
      </IconButton>
      <DialogContent
        sx={{ px: 4, py: 6, position: "relative" }}
        style={{ paddingTop: "5px" }}
      >
        <DialogContentText style={{ color: "red", marginBottom: "20px" }}>
          利用可能なファイル拡張子： .jpeg, .jpg, .png, .gif, .tiff, .psd, .pdf,
          .eps, .raw, .txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .dwg, .dxf,
          .jww
        </DialogContentText>
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <Upload
              optionFileType={optionFileType}
              caseId={caseId}
              valueTypeId={dataUpload.fileTypeId}
              valueFileName={dataUpload.fileName}
              uploadFunction={uploadFunction}
              handleSelectedFileType={handleSelectedFileType}
              handleInputFileName={handleInputFileName}
              handleFileChange={handleFileChange}
            />
          </Grid>
          <Grid item xs={8}>
            <ul
              id="results"
              className="search-results"
              style={{ marginTop: 10 }}
            >
              {listItem && listItem[0] != null ? (
                listItem.map((item, index) => {
                  return (
                    <li className="search-result" key={item.keywordId}>
                      <Truncate
                        str={item.fileName}
                        maxLength={20}
                        style={{ padding: "10px" }}
                      />
                      <div className="search-action">
                        <Button
                          className="search-delete"
                          onClick={async () => {
                            await viewOrDownloadFile(item);
                          }}
                          style={{ minWidth: "150px" }}
                        >
                          {item.isImage ? "表示" : "ダウンロード"}
                        </Button>
                        <Button
                          className="search-edit"
                          onClick={() => {
                            setFileDelete(item);
                            setShowAlert(true);
                          }}
                        >
                          削除
                        </Button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li style={{ textAlign: "center" }}>
                  {loadingFile ? (
                    <CircularProgress />
                  ) : (
                    <p>表示する項目がありません。</p>
                  )}
                </li>
              )}
            </ul>
          </Grid>
          {urlPreviewImg.blobUrl && (
            <Grid item xs={12} className="preview-file">
              <a href={urlPreviewImg.blobUrl} download={urlPreviewImg.fileName}>
                <IconButton size="small" aria-label="download">
                  <Icons.CloudDownload sx={{ color: "green", fontSize: 40 }} />
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
        <ConfirmDialog
          open={showAlert}
          closeDialog={() => setShowAlert(false)}
          item={fileDelete.fileName}
          handleFunction={handleClickDelete}
          typeDialog="書類削除の確認"
          mainContent="書類を削除すると、案件から関連書類として参照できなくなります。本当に削除しますか"
          cancelBtnDialog="いいえ"
          confirmBtnDialog="はい"
        ></ConfirmDialog>
        <LoadingSpinner loading={loading}></LoadingSpinner>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHandle;
