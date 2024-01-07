import { state as caseSearchState } from '../stories/caseSearchState.ts';
import { GetCaseList} from '../services/caseSearchService.ts'

const setPaginationState = (totalCount, pageSize, currentPage) => {
    caseSearchState.paginationState.totalCount = totalCount;
    caseSearchState.paginationState.pageSize = pageSize;
    caseSearchState.paginationState.currentPage = currentPage;
};

const setKeywordsSearchState = (keywordValues) => {
    caseSearchState.keywordsSearchState.currentPage = caseSearchState.paginationState.currentPage;
    caseSearchState.keywordsSearchState.pageSize = caseSearchState.paginationState.pageSize;
    caseSearchState.keywordsSearchState.keywordValues = keywordValues;
};

const setCaseDataSearchState = (keywordDataResponse) => {
    caseSearchState.caseDataSearchState.currentPage = caseSearchState.paginationState.currentPage;
    caseSearchState.caseDataSearchState.pageSize = caseSearchState.paginationState.pageSize;
    caseSearchState.caseDataSearchState.totalCount = caseSearchState.paginationState.totalCount;
    caseSearchState.caseDataSearchState.items = keywordDataResponse;
};

const getCaseList = async () => {
    const payload = {
      keywordValues: caseSearchState.keywordsSearchState.keywordValues,
      pageSize: caseSearchState.paginationState.pageSize,
      pageNumber: caseSearchState.paginationState.currentPage
    }
    let payloadFilterd = caseSearchState.keywordsSearchState.keywordValues.filter(n => n['value']);
    payload.keywordValues = payloadFilterd;
    console.log("actions", payload)
    // caseSearchActions.setKeywordsSearchState(payloadFilterd);
    // setShowList(false);
    let response = await GetCaseList(payload);
    if(response) {
        setPaginationState(response.totalCount, response.pageSize, response.currentPage)
        setCaseDataSearchState(response.items)
        console.log('caseSearchState.caseDataSearchState----', caseSearchState.caseDataSearchState)
    }
    return response;
    // axiosPrivate.post(searchCaseUrl, payload).then((response) => {
    //   console.log(response.data)
    //   caseSearchActions.setPaginationState(response.data.totalCount, response.data.pageSize, response.data.currentPage)
    //   caseSearchActions.setCaseDataSearchState(response.data.items)
    //   console.log('caseSearchState.caseDataSearchState----', caseSearchState.caseDataSearchState)
    //   // setSearchData(response.data)
    // //   setShowList(true);

    // })
    //   .catch((error) => {
    //     console.log(error);
    //   });
};

const caseSearchActions = {
    setPaginationState,
    setKeywordsSearchState,
    setCaseDataSearchState,
    getCaseList,
};

export default caseSearchActions;