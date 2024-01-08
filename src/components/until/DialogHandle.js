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

const DialogHandle = ({ title, open, closeDialog, item, optionFileType, handleFunction, caseId }) => {
  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const [loading, setLoading] = useState(false);
  let dataUpload = {};
  const [listItem, setListItem] = useState([]);
  const [urlPreviewImg, setUrlPreviewImg] = useState({ blobUrl: "", fileName: "" });
  useEffect(async () => {
    setListItem([]);
    setUrlPreviewImg({ blobUrl: "", fileName: "" })
    if (caseId) {
      await getFilesOfCase();
    }
  }, []);

  const getFilesOfCase = async () => {
    let getFilesUploadURL = `/api/Case/file/getall?caseId=${caseId}`;
    await axiosPrivate.get(getFilesUploadURL, {
      signal: controller.signal,
    }).then((response) => {
      setListItem(response.data);
      return response;
    })
      .catch((error) => {
        console.log(error);
      });
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
    let getFileUrl = `/api/FileUpload/Download?filename=${item.fileName}&caseId=${caseId}`
    await axiosPrivate
      .get(getFileUrl)
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

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={closeDialog}
      onBackdropClick={closeDialog}
      maxWidth="xl"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ px: 4, py: 6, position: "relative" }}>
        <IconButton
          size="small"
          onClick={closeDialog}
          sx={{
            position: "absolute",
            right: "1rem",
            top: "0.5rem",
            width: "2rem",
            height: "2rem",
          }}
        >
          X
        </IconButton>
        <Grid container spacing={5}>
          <Grid item xs={4}>
            <Upload optionFileType={optionFileType} caseId={caseId} uploadFunction={uploadFunction} handleSelectedFileType={handleSelectedFileType} handleInputFileName={handleInputFileName} handleFileChange={handleFileChange} />
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
                        // onClick={() => handleClickEdit(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li>
                  <p>Not Found!</p>
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
        <LoadingSpinner loading={loading}></LoadingSpinner>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHandle;
