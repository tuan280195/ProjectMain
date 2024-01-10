import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import FormButton from "./FormButton";

const ConfirmDialog = ({
  open,
  closeDialog,
  item,
  handleFunction,
  typeDialog = "削除",
  mainContent = "案件を削除すると、関連データ、添付書類、写真データの情報がすべて失われます。本当に削除しますか？",
}) => {
  return (
    <Dialog
      fullWidth
      open={open}
      onClose={closeDialog}
      onBackdropClick={closeDialog}
    >
      <DialogTitle>{typeDialog} </DialogTitle>
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
      <DialogContent sx={{ px: 8, py: 6, position: "relative" }} style={{paddingTop: "5px"}}>
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
              <Typography variant="main-body">{mainContent}</Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <FormButton
              itemName="取消"
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
