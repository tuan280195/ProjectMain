import Upload from "./Upload";
import LoadingSpinner from "./LoadingSpinner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useState, useEffect } from "react";
import Truncate from "./Truncate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "./ConfirmBox";

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
  const [urlPreviewImg, setUrlPreviewImg] = useState({ blobUrl: "", fileName: "" });
  const [fileDelete, setFileDelete] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  let dataUpload = {};
  useEffect(async () => {
    setListItem([]);
    setLoading(false);
    setLoadingFile(false);
    setUrlPreviewImg({ blobUrl: "", fileName: "" })
    setFileDelete({});
    setShowAlert(false);
    if (caseId) {
      await getFilesOfCase();
    }
  }, []);

  const getFilesOfCase = async () => {
    setLoadingFile(true);
    let getFilesUploadURL = `/api/Case/file/getall?caseId=${caseId}`;
    await axiosPrivate
      .get(getFilesUploadURL, {
        signal: controller.signal,
      })
      .then((response) => {
        setListItem(response.data);
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
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
    dataUpload.fileTypeId = value.id;
  };
  const handleInputFileName = (e) => {
    dataUpload.fileName = e.target.value;
  };
  const handleFileChange = (e) => {
    dataUpload.fileToUpload = e.target.files[0];
  };
  const viewOrDownloadFile = async (item) => {
    setLoading(true);
    let getFileUrl = `/api/FileUpload/Download`
    let payload = {
      fileName: item.fileName,
      caseId: caseId
    }
    await axiosPrivate
      .post(getFileUrl, payload)
      .then(async (response) => {
        const byteArray = Uint8Array.from(
          atob(response.data)
            .split('')
            .map(char => char.charCodeAt(0))
        );
        const blob = new Blob([byteArray], { type: response.headers["content-type"] });
        const blobUrl = window.URL.createObjectURL(blob);
        if (!item.isImage) {
          const link = document.createElement('a');
          link.href = blobUrl
          link.download = item.fileName;
          link.click();
        } else {
          setUrlPreviewImg({ blobUrl: blobUrl, fileName: item.fileName })
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
  }
  const handleClickDelete = async (e) => {
    setLoading(true);
    e.preventDefault();
    let deleteFileUrl = `/api/FileUpload/Delete`
    let payload = fileDelete;
    payload.caseId = caseId;
    await axiosPrivate
      .put(deleteFileUrl, payload)
      .then(async (response) => {
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
        X
      </IconButton>
      <DialogContent sx={{ px: 4, py: 6, position: "relative" }} style={{ paddingTop: "5px" }}>
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <Upload
              optionFileType={optionFileType}
              caseId={caseId}
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
                        >
                          {item.isImage ? 'View' : 'Download'}
                        </Button>
                        <Button
                          className="search-edit"
                          onClick={() => {
                            setFileDelete(item);
                            setShowAlert(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li style={{ textAlign: "center" }}>
                  {loadingFile ? (
                    <CircularProgress />
                  ) : (<p>Not Found!</p>)}
                </li>
              )}
            </ul>

          </Grid>
          {urlPreviewImg.blobUrl && (
            <Grid item xs={12} className="preview-file">
              <a href={urlPreviewImg.blobUrl} download={urlPreviewImg.fileName}>Download Image</a>
              <img src={urlPreviewImg.blobUrl} style={{ width: "25%" }} />
            </Grid>
          )}

        </Grid>
        <ConfirmDialog
          open={showAlert}
          closeDialog={() => setShowAlert(false)}
          item={fileDelete.fileName}
          handleFunction={handleClickDelete}
          typeDialog='Delete'
        ></ConfirmDialog>
        <LoadingSpinner loading={loading}></LoadingSpinner>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHandle;
