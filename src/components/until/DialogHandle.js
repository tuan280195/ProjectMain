import Upload from "./Upload";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useState } from "react";
import Truncate from "./Truncate";

const DialogHandle = ({ title, open, closeDialog, item, handleFunction }) => {
  const optionFileType = ["Hoa Don", "Ban Ve", "Invoice", "Receipt"];
  const [listItem, setListItem] = useState([
    "Hoa Don",
    "Receipt",
    "Design",
    "Map",
    "Image1",
  ]);
  const uploadFunction = () => {};

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={closeDialog}
      onBackdropClick={closeDialog}
      maxWidth="md"
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{ px: 4, py: 6, position: "relative" }}>
        <Grid container spacing={5}>
          <Grid item xs={6}>
            <div className="section-item">
              <label className="section-label">File Type</label>
              <select
                // value={props.value}
                className="section-input"
                // onChange={props.handleInput}
              >
                {optionFileType.map((item) => {
                  <option value={item}>{item}</option>;
                })}
              </select>
            </div>
            <Upload></Upload>
            <Button
              onClick={uploadFunction}
              size="medium"
              color="primary"
              variant="contained"
            >
              Upload
            </Button>
          </Grid>
          <Grid item xs={6}>
            <ul
              id="results"
              className="search-results"
              style={{ marginTop: 10 }}
            >
              {listItem && listItem[0] != null ? (
                listItem.map((item, index) => {
                  return (
                    <li className="search-result" key={item + "-" + index}>
                      <Truncate str={item} maxLength={15}></Truncate>
                      <div className="search-action">
                        <Button
                          className="search-delete"
                          // onClick={() => {
                          //   setShowAlert(true);
                          //   setDeleteItem(item);
                          // }}
                        >
                          View
                        </Button>{" "}
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
      </DialogContent>
    </Dialog>
  );
};

export default DialogHandle;
