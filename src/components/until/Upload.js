import { TextField } from "@mui/material";
import axios from "axios";
import FormButton from "./FormButton";
import FormSelection from "./FormSelection";
import { useState } from "react";
import FormInput from "./FormInput";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Upload = (props) => {
  return (
    <form onSubmit={props.uploadFunction}>
      <div className="section-item">
        <label className="section-label">File Type</label>
        <FormSelection options={props.optionFileType} optionSelected={props.handleSelectedFileType} />
      </div>
      <FormInput itemName="File Name" className="section-input" type="text" onChange={props.handleInputFileName} />
      <TextField type="file" onChange={props.handleFileChange} />
      <br />
      <FormButton itemName="Upload" buttonType="attach" type="submit" />
    </form>
  );
};

export default Upload;
