import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import FormButton from "./FormButton";

const ConfirmDialog = ({ open, closeDialog, item, deleteFunction }) => {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={closeDialog}
      onBackdropClick={closeDialog}
    >
      <DialogContent sx={{ px: 8, py: 6, position: "relative" }}>
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
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Typography variant="h5">Delete {item}</Typography>
              <Typography variant="main-body">
                Are you sure you want to delete this {item}?
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            {/* <Button
              onClick={closeDialog}
              size="medium"
              variant="contained"
              color=""
            >
              Cancel
            </Button> */}
            <FormButton
              itemName="Cancel"
              buttonType="cancel"
              onClick={closeDialog}
            />
            {/* <Button
              onClick={deleteFunction}
              size="medium"
              variant="contained"
              color="primary"
            >
              Delete
            </Button>{" "} */}
            <FormButton
              itemName="Delete"
              buttonType="delete"
              onClick={deleteFunction}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
