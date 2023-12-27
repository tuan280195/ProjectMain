import { Alert, Snackbar } from "@mui/material";

const FormSnackbar = ({ item, setItem }) => {
  return (
    //severity =  success || error || warning || info
    <>
      <Snackbar
        open={item.isOpen}
        autoHideDuration={6000}
        onClose={() => {
          return setItem({ ...item, isOpen: false });
        }}
      >
        <Alert
          onClose={() => {
            return setItem({ ...item, isOpen: false });
          }}
          severity={item.status}
          sx={{ width: "100%" }}
        >
          {item.message}
        </Alert>
      </Snackbar>
    </>
  );
};
export default FormSnackbar;
