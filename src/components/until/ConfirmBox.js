import {
  Box,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import FormButton from "./FormButton";

const ConfirmDialog = ({ open, closeDialog, item, handleFunction, typeDialog = 'Delete'}) => {
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
              <Typography variant="h5">{typeDialog} {item}</Typography>
              <Typography variant="main-body">
                Are you sure you want to {typeDialog} this {item}?
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <FormButton
              itemName="Cancel"
              buttonType="cancel"
              onClick={closeDialog}
            />
            <FormButton
              itemName={typeDialog}
              buttonType="delete"
              onClick={handleFunction}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
