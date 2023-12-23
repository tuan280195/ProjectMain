import { Button } from "@mui/material";

const FormButton = ({ itemName, style, ...props }) => {
  const styleButton = {
    backgroundColor: "#14873A",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#2AA252",
    },
    "&:active": {
      backgroundColor: "#C0E8CE",
    },
    padding: "10px 100px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
    transition: "background-color 0.3s, box-shadow 0.5s",
    cursor: "pointer",
    fontSize: "30px",
    lineHeight: "1.3",
  };
  return (
    <Button sx={styleButton} {...props}>
      {itemName}
    </Button>
  );
};

export default FormButton;
