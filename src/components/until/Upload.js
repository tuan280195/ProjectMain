import { TextField } from "@mui/material";
import axios from "axios";
import FormButton from "./FormButton";
import FormSelection from "./FormSelection";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

const Upload = (props) => {
  const [loading, setLoading] = useState(false);

  const uploadFunction = (data) => {
    setLoading(true);
    // const file = event.target.files[0];
    // const formData = new FormData();
    // formData.append("file", file);
    console.log(data);

    // axios
    //   .post("/upload", formData)
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    setLoading(false);
  };

  return (
    <form onSubmit={uploadFunction}>
      <div className="section-item">
        <label className="section-label">File Type</label>
        <FormSelection options={props.optionFileType} />
      </div>
      <TextField type="file" />
      <br />
      <FormButton itemName="Upload" buttonType="attach" type="submit" />
      <LoadingSpinner loading={loading}></LoadingSpinner>
    </form>
  );
};

export default Upload;
