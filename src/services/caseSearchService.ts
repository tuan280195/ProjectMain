// import useAxiosPrivate from "../hooks/useAxiosPrivate";
// import caseSearchState from "../stories/caseSearchState.ts";

import { axiosPrivate } from "../api/axios";

export const GetCaseList = async (payload) => {
  // const axiosPrivate = useAxiosPrivate();
  // const controller = new AbortController();
    const searchCaseUrl = "/api/Case/getAll";
    // const payload = {
    //   keywordValues: caseSearchState.keywordsSearchState.keywordValues,
    //   pageSize: caseSearchState.paginationState.pageSize,
    //   pageNumber: caseSearchState.paginationState.currentPage
    // }
    // let payloadFilterd = caseSearchState.keywordsSearchState.keywordValues.filter(n => n['value']);
    // payload.keywordValues = payloadFilterd;
    //setShowList(false);
    return axiosPrivate.post(searchCaseUrl, payload).then((response) => {
      console.log(response.data)
    //   caseSearchActions.setPaginationState(response.data.totalCount, response.data.pageSize, response.data.currentPage)
    //   caseSearchActions.setCaseDataSearchState(response.data.items)
    //   console.log('caseSearchState.caseDataSearchState----', caseSearchState.caseDataSearchState)
      //setShowList(true);
        return response.data;
    })
      .catch((error) => {
        console.log(error);
      });
  };

//   export const GetCaseTemplate = async () => {
// //     const axiosPrivate = useAxiosPrivate();
// const controller = new AbortController();
//     // call API get template
//     // setLoading(true);
//     let templateURL = "/api/Template/template";
//     await axiosPrivate.get(templateURL, {
//       signal: controller.signal,
//     }).then((response) => {
//       console.log("template--", response.data.keywords)
//       // response.data.keywords = template;
//       response.data.keywords = response.data.keywords.filter(x => x.searchable);
//     //   setTemplate(response.data.keywords);
//       response.data.keywords.forEach(element => {
//         element.value = ""
//       });
//       console.log("response.data.keywordstemplate--", response.data.keywords)
//       caseSearchActions.setKeywordsSearchState(response.data.keywords);

//       return response.data;
//     })
//       .catch(error => {
//         console.log("eerrrrrrr---")
//         console.log(error.response);
//       });

//     // setLoading(false);
//   };

  // const caseSearchService = {
  //   getCaseTemplate,
  //   getCaseList,
  // };

  // export default caseSearchService;