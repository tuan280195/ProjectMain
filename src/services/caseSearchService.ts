import { axiosPrivate } from "../api/axios";

export const GetCaseList = async (payload) => {
  const searchCaseUrl = "/api/Case/getAll";
  return axiosPrivate
    .post(searchCaseUrl, payload)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
