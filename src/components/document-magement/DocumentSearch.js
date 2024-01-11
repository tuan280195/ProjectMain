import LoadingSpinner from "../until/LoadingSpinner";
import Truncate from "../until/Truncate";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CircularProgress from "@mui/material/CircularProgress";
import ConfirmDialog from "../until/ConfirmBox";
import { useState, useEffect } from "react";
import FormButton from "../until/FormButton";
import Pagination from "../until/Pagination";
import FormSelection from "../until/FormSelection";
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
    const [deleteItem, setDeleteItem] = useState({
        id: null,
        name: null,
        phoneNumber: null,
    });
    const [optionFileType, setOptionFileType] = useState([]);
    const [condition, setCondition] = useState({ minWidth: "400px", xs: 4 });
    const axiosPrivate = useAxiosPrivate();
    const controller = new AbortController();

    useEffect(async () => {
        await getDocumentTemplate();
    }, []);

    const getCustomers = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            let searchURL = "/api/Customer/getAll";
            searchURL =
                data.customerName && data.phoneNumber
                    ? searchURL +
                    `?customerName=${data.customerName}&phoneNumber=${data.phoneNumber}`
                    : data.phoneNumber
                        ? searchURL + `?phoneNumber=${data.phoneNumber}`
                        : data.customerName
                            ? searchURL + `?customerName=${data.customerName}`
                            : searchURL;

            const response = await axiosPrivate.get(searchURL, {
                signal: controller.signal,
            });
            setListItem(response.data); /*set result list item here*/
        } catch (error) {
            console.log(error);
        }
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
                console.log("response", response)
                let options = [];
                response.data.fileType.fileTypes.forEach(function (item) {
                    options.push({
                        "id": item.id,
                        "label": item.name,
                    });
                });
                setOptionFileType(options);
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    };

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
            await getCustomers(e);
            setCondition({ width: "1080px", xs: 4 });
            setShowList(true);
        }).catch((error) => {
            console.log(error)
        });
        setLoading(false);
    };

    const handleClickSearch = async (e) => {
        await getCustomers(e);
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
                                            <TableCell><Truncate str={item.name} maxLength={20} /></TableCell>
                                            <TableCell><Truncate str={item.phoneNumber} maxLength={20} /></TableCell>
                                            <TableCell style={{ position: "relative" }}>
                                                <Truncate str={item.note} maxLength={20} />
                                                <div className="container-search-actions">
                                                    <Button
                                                        className="search-edit"
                                                        to=""
                                                        onClick={() => handleClickEdit(item.id)}
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

    return (
        <section style={{ width: condition.width }}>
            <Grid container columnSpacing={5} rowSpacing={5}>
                <Grid item xs={condition.xs}>
                    <div className="section-item">
                        <label className="section-label">File Type</label>
                        <FormSelection
                            options={optionFileType} 
                        />
                    </div>
                    <div className="section-item">
                        <label className="section-label">Customer Name</label>
                        <input
                            value={data.customerName}
                            className="section-input"
                            type="text"
                            onChange={(e) => handleChange(e, "customerName")}
                        ></input>
                    </div>
                    <div className="section-item">
                        <label className="section-label">Reception Date</label>
                        <div className="section-range">
                            <input
                                value={data.customerName}
                                className="section-input"
                                type="date"
                                onChange={(e) => handleChange(e, "customerName")}
                            />
                            <span>〜</span>
                            <input
                                value={data.customerName}
                                className="section-input"
                                type="date"
                                onChange={(e) => handleChange(e, "customerName")}
                            />
                        </div>
                    </div>
                    <div className="section-item">
                        <label className="section-label">Payment Amount</label>
                        <div className="section-range">
                            <input
                                value={data.customerName}
                                className="section-input"
                                type="number"
                                onChange={(e) => handleChange(e, "customerName")}
                            />
                            <span>〜</span>
                            <input
                                value={data.customerName}
                                className="section-input"
                                type="number"
                                onChange={(e) => handleChange(e, "customerName")}
                            />
                        </div>
                    </div>
                    <br />
                    <Grid item xs="12" sx={{ display: "flex", justifyContent: "center" }}>
                        {/* Search Button */}
                        <FormButton itemName="検索" onClick={handleClickSearch} />
                    </Grid>
                </Grid>
                {showList ? (
                    <Grid item xs={8}>
                        <Results />
                    </Grid>
                ) : null}
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