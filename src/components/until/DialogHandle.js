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
  useEffect(async () => {
    setListItem([]);
    if(caseId){
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
    event.preventDefault();

    const formData = new FormData();
    formData.append("FileToUpload", dataUpload.fileToUpload);
    formData.append("CaseId", caseId);
    formData.append("FileTypeId", dataUpload.fileTypeId);
    formData.append("FileName", dataUpload.fileName);

    await axiosPrivate
      .post("/api/FileUpload/Upload", formData)
      .then(async (response)  => {
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
                        maxLength={15}
                        style={{ padding: "10px" }}
                      ></Truncate>
                      <div className="search-action">
                        {
                          item.isImage && (
                            <Button
                              className="search-delete"
                              onClick={() => {
                                // setShowAlert(true);
                                // setDeleteItem(item);
                              }}
                            >
                              View
                            </Button>
                          )
                        }

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
        </Grid>
      <LoadingSpinner loading={loading}></LoadingSpinner>
      </DialogContent>
    </Dialog>
  );
};

export default DialogHandle;
