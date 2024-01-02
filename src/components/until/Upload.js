import { TextField } from "@mui/material";
import axios from "axios";
import FormButton from "./FormButton";
import FormSelection from "./FormSelection";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";
import FormInput from "./FormInput";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Upload = (props) => {
  const [loading, setLoading] = useState(false);
  let dataUpload = {};

  const axiosPrivate = useAxiosPrivate();
  const controller = new AbortController();
  const uploadFunction = (event) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData();
    console.log("dataUpload:", dataUpload)
    formData.append("FileToUpload", dataUpload.fileToUpload);
    formData.append("CaseId", props.caseId);
    formData.append("FileTypeId", dataUpload.fileTypeId);
    formData.append("FileName", dataUpload.fileName);
    
    axiosPrivate
      .post("/api/FileUpload/Upload", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    setLoading(false);
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
    <form onSubmit={uploadFunction}>
      <div className="section-item">
        <label className="section-label">File Type</label>
        <FormSelection options={props.optionFileType} optionSelected={handleSelectedFileType} />
      </div>
      <FormInput itemName="File Name" className="section-input" type="text" onChange={handleInputFileName} />
      <TextField type="file" onChange={handleFileChange} />
      <br />
      <FormButton itemName="Upload" buttonType="attach" type="submit" />
      <LoadingSpinner loading={loading}></LoadingSpinner>
    </form>
  );
};

export default Upload;
