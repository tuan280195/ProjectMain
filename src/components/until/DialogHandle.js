import Upload from "./Upload";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import Truncate from "./Truncate";

const DialogHandle = ({
  title,
  open,
  closeDialog,
  item,
  optionFileType,
  handleFunction,
}) => {
  // const optionFileType = [
  //   { id: 1, label: "Hoa Don" },
  //   { id: 2, label: "Ban Ve" },
  //   { id: 3, label: "Invoice" },
  //   { id: 4, label: "Receipt" },
  // ];
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
          <Grid item xs={6}>
            <Upload optionFileType={optionFileType} />
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
                      <Truncate
                        str={item}
                        maxLength={15}
                        style={{ padding: "10px" }}
                      ></Truncate>
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
