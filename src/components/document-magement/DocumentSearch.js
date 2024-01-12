import LoadingSpinner from "../until/LoadingSpinner";
import Truncate from "../until/Truncate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "../until/ConfirmBox";
import { useState, useEffect } from "react";
import FormButton from "../until/FormButton";
import Pagination from "../until/Pagination";
import FormSelection from "../until/FormSelection";
import GenericItems from "../until/GenericItems";
import {
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
const DocumentSearch = () => {
    const [data, setData] = useState({});
    const [showList, setShowList] = useState(true);
    const [listItem, setListItem] = useState([
        { id: null, customerName: null, phoneNumber: null },
    ]);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [template, setTemplate] = useState([]);
    const [keyWordSearch, setKeyWordSearch] = useState([]);
    const [fileTypeSearch, setFileTypeSearch] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [deleteItem, setDeleteItem] = useState({
        id: null,
        name: null,
        phoneNumber: null,
    });
    const [optionFileType, setOptionFileType] = useState([]);
    const [condition, setCondition] = useState({ minWidth: "400px", xs: 4 });
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();
    const [urlPreviewImg, setUrlPreviewImg] = useState({ blobUrl: "", fileName: "" });

    useEffect(async () => {
        setUrlPreviewImg({ blobUrl: "", fileName: "" });
        await getDocumentTemplate();
    }, []);

    const getFiles = async (e) => {
        setLoading(true);
        e.preventDefault();
        let searchURL = "/api/Document/search";
        let keywordValues = keyWordSearch.filter(x => !x.fromTo && x.value)
        let keywordDateValues = keyWordSearch.filter(x => x.fromTo && x.typeValue === 'datetime' && (x.fromValue || x.toValue))
        let keywordDecimalValues = keyWordSearch.filter(x => x.fromTo && x.typeValue === 'decimal' && (x.fromValue || x.toValue))
        const payload = {
            "fileTypeId" : fileTypeSearch.value,
            "keywordValues": keywordValues,
              "keywordDateValues": keywordDateValues,
              "keywordDecimalValues": keywordDecimalValues,
              "pageSize": 25,
              "pageNumber": 1
        };
        await axiosPrivate.post(searchURL, payload, {
            signal: controller.signal,
        }).then((response) => {
            setListItem(response.data);
        }).catch((error)=>{
            console.log(error);
        });
        
        setLoading(false);
    };


    const getDocumentTemplate = async () => {
        setLoading(true);
        let getFileTypesURL = "/api/document/template";
        await axiosPrivate
            .get(getFileTypesURL, {
                signal: controller.signal,
            })
            .then((response) => {
                response.data.fileType.fileTypes.forEach(function (item) {
                    item.label = item.name;
                });
                response.data.customers.forEach(function (item) {
                    item.label = item.name;
                });
                response.data.keywords.forEach(function (item){
                    item.customerId = ""
                })
                response.data.fileType.value = "";
                setFileTypeSearch(response.data.fileType);
                setKeyWordSearch(response.data.keywords);
                setTemplate(response.data.keywords);
                setCustomerList(response.data.customers);
                setOptionFileType(response.data.fileType.fileTypes);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };

    const viewOrDownloadFile = async (item) => {
        setLoading(true);
        let getFileUrl = `/api/FileUpload/Download`
        let payload = {
          fileName: item.keywordName,
          caseId: item.caseId
        }
        await axiosPrivate
          .post(getFileUrl, payload)
          .then(async (response) => {
            const byteArray = Uint8Array.from(
              atob(response.data)
                .split('')
                .map(char => char.charCodeAt(0))
            );
            const blob = new Blob([byteArray], { type: response.headers["content-type"] });
            const blobUrl = window.URL.createObjectURL(blob);
            if (!item.isImage) {
              const link = document.createElement('a');
              link.href = blobUrl
              link.download = item.fileName;
              link.click();
            } else {
              setUrlPreviewImg({ blobUrl: blobUrl, fileName: item.fileName })
            }
          })
          .catch((error) => {
            console.error(error);
          });
        setLoading(false);
      }
    const handleClickEdit = (id) => {
        console.log("handleClickEdit", id)
        setLoading(true);
        setLoading(false);
    };

    const handleClickDelete = async (e) => {
        setLoading(true);
        e.preventDefault();
        var deleteURL = "/api/Customer/" + deleteItem.id;
        await axiosPrivate.delete(deleteURL).then(async (res) => {
            setShowAlert(false);
            await getFiles(e);
            setCondition({ width: "1080px", xs: 4 });
            setShowList(true);
        }).catch((error) => {
            console.log(error)
        });
        setLoading(false);
    };

    const handleClickSearch = async (e) => {
        await getFiles(e);
        setCondition({ width: "1080px", xs: 4 });
        setShowList(true);
    };

    const handleChange = (event, item) => {
        let newData = data;
        if (item === "customerName") newData.customerName = event.target.value;
        else newData.phoneNumber = event.target.value;

        setData(newData);
    };

    const handleChangePageSize = async (e) => {
        // caseSearchActions.setPaginationState(
        //   caseSearchState.paginationState.totalCount,
        //   e.target.value,
        //   caseSearchState.paginationState.currentPage
        // );
        // await getCustomers(e);
    };
    const handleChangePage = async (e) => {
        // caseSearchActions.setPaginationState(
        //   caseSearchState.paginationState.totalCount,
        //   caseSearchState.paginationState.pageSize,
        //   parseInt(e.target.innerText)
        // );
        // await getCustomers(e);
    };

    const Results = () => {
        let totalCount = 0;
        if (listItem && listItem.totalCount > 0) {
            totalCount = Math.ceil(listItem.totalCount / listItem.pageSize);
        }
        return (
            <>
                <Pagination
                    totalCount={totalCount}
                    pageSize={25}
                    currentPage={1}
                    handleChangePageSize={handleChangePageSize}
                    handleChangePage={handleChangePage} />
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        {/* <TableHead>
                            <TableRow>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Note</TableCell>
                            </TableRow>
                        </TableHead> */}
                        <TableBody>
                            {listItem && listItem.items && listItem.items.length > 0 ? (
                                listItem.items.map((item, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell><Truncate str={item.keywordName} maxLength={20} /></TableCell>
                                            <TableCell style={{ position: "relative" }}>
                                                <div className="container-search-actions">
                                                    <Button
                                                        className="search-edit"
                                                        to=""
                                                        onClick={() => viewOrDownloadFile(item)}
                                                        style={{ minWidth: "140px" }}
                                                    >
                                                        表示・編集
                                                    </Button>
                                                    <Button
                                                        className="search-delete"
                                                        to=""
                                                        onClick={() => {
                                                            setShowAlert(true);
                                                            setDeleteItem(item);
                                                        }}
                                                    >
                                                        削除
                                                    </Button>{" "}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })) : (
                                <TableCell colSpan={3}><span style={{ color: "#000" }}>Not Found!</span></TableCell>
                            )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>
        );
    };

    const dynamicGenerate = (item, templateItem) => {
        let typeValue = templateItem.typeValue;
        if (templateItem.fromTo && templateItem.typeValue == 'decimal'){
            typeValue = 'decimalrange'
        }else if(templateItem.fromTo && templateItem.typeValue == 'datetime'){
            typeValue = 'daterange';
        }else if(templateItem.keywordName === '取引先名'){
            typeValue = 'list';
        }
        return (
            <GenericItems
                value={item.value}
                value1={item.fromValue}
                value2={item.toValue}
                label={templateItem.keywordName}
                type={typeValue}
                key={templateItem.order}
                handleInput={(e) => {
                    const newState = keyWordSearch.map((value) => {
                        if (value.keywordId === item.keywordId) {
                            return { ...value, value: e.target.value };
                        } else return { ...value };
                    });
                    setKeyWordSearch(newState);
                }}
                // using for decimal range
                handleInput1={(e) => {
                    const newState = keyWordSearch.map((value) => {
                        if (value.keywordId === item.keywordId) {
                            return { ...value, fromValue: e.target.value };
                        } else return { ...value };
                    });

                    setKeyWordSearch(newState);
                }}
                handleInput2={(e) => {
                    const newState = keyWordSearch.map((value) => {
                        if (value.keywordId === item.keywordId) {
                            return { ...value, toValue: e.target.value };
                        } else return { ...value };
                    });
                    setKeyWordSearch(newState);
                }}
                handleInput3={(e, customer) => {
                    const newState = keyWordSearch.map((value) => {
                        if (value.keywordId === item.keywordId) {
                            return { ...value, value: customer ? customer.label : "", customerId: customer ? customer.id: "" };
                        } else return { ...value };
                    });
                    setKeyWordSearch(newState);
                }}
                options={customerList}
            />
        );
    };

    const generateTemplate = () => {
        if (template && template.length > 0) {
            template.sort((a, b) =>
                a.order > b.order ? 1 : b.order > a.order ? -1 : 0
            );
        }
        return (
            <>
            <Grid item xs={condition.xs}>
                <GenericItems
                    label={"File Type"}
                    type={'list'}
                    options={fileTypeSearch.fileTypes}
                    handleInput3={(e, item) => {
                        const newState = fileTypeSearch;
                        newState.value = item ? item.id : "";
                        setFileTypeSearch(newState);
                    }}
                />
                {template.map((templateItem) => {
                    return keyWordSearch.map((item) => {
                        if (item.keywordId === templateItem.keywordId) {
                            return dynamicGenerate(item, templateItem);
                        }
                    });
                })}
                <br />
                <Grid item xs="12" sx={{ display: "flex", justifyContent: "center" }}>
                    {/* Search Button */}
                    <FormButton itemName="検索" onClick={handleClickSearch} />
                </Grid>
            </Grid>
            </>
        );

    };

    return (

        <section style={{ width: condition.width }}>
            <Grid container columnSpacing={5} rowSpacing={5}>
                {generateTemplate()}

                {showList ? (
                    <Grid item xs={8}>
                        <Results />
                    </Grid>
                ) : null}
                {urlPreviewImg.blobUrl && (
                    <Grid item xs={12} className="preview-file">
                    <a href={urlPreviewImg.blobUrl} download={urlPreviewImg.fileName}>Download Image</a>
                    <img src={urlPreviewImg.blobUrl} style={{ width: "25%" }} />
                    </Grid>
                )}
            </Grid>

            <LoadingSpinner loading={loading}></LoadingSpinner>
            <ConfirmDialog
                open={showAlert}
                closeDialog={() => setShowAlert(false)}
                item={deleteItem.name}
                handleFunction={handleClickDelete}
            ></ConfirmDialog>
        </section>
    );
};

export default DocumentSearch;