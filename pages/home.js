import React, { useState, useEffect, useRef } from "react";
import Layout from "../theme/Layout";
import {
    Grid,
    Typography,
    Box,
    TextField,
    Paper,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    CssBaseline,
    Snackbar,
    Alert
} from "@mui/material";
import hostname from "../utils/hostname";
import axios from "axios";
import scbL from "../assets/scbL.png";
import excel from "../assets/excel.png";
import Image from "next/image";
import moment from "moment/moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import withAuth from "../routes/withAuth";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import LoadingModal from "../theme/LoadingModal";
import { useAppDispatch } from "../store/store";
import { signOut } from "../store/slices/userSlice";
import { useRouter } from "next/router";
import { CSVLink } from "react-csv";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';

function home() {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [openDialogView, setOpenDialogView] = useState(false);
    const [search, setSearch] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataTransactionFail, setDataTransactionFail] = useState([])
    const [dataTransactionSuccess, setDataTransactionSuccess] = useState([])
    const [bankData, setBankData] = useState([]);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    let FailData
    let SuccessData

    const handleClickSnackbar = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        setOpen(false);
    };

    const getDataTransactionFail = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/transaction/transaction_fail`,
            });
            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD/MM HH:mm")
            });
            FailData = resData.length;
            setDataTransactionFail(resData);
            setLoading(false);
        } catch (error) {
            console.log(error);
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }
    };
    const getDataFail_Interval = async () => {
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/transaction/transaction_fail`,
            });
            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD/MM HH:mm")
            });
            if (resData.length !== FailData) {
                playAudio()
                setDataTransactionFail(resData);
                getDataTransactionFail()
            }
        } catch (error) {
            console.log(error);
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }
    }

    const getDataTransactionSuccess = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/transaction/transaction_success`,
            });
            let resData = res.data;
            let no = 1;
            // let lastData = resData.filter((item) => item.status_transction === "CREATE")
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD/MM HH:mm")
                item.username = item.members.username
                item.bank_number = item.banks?.bank_number
            });
            SuccessData = resData.length;
            setDataTransactionSuccess(resData);
            setLoading(false);

        } catch (error) {
            console.log(error);
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }
    };

    const getDataSuccess_Interval = async () => {
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/transaction/transaction_success`,
            });
            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD/MM HH:mm")
                item.username = item.members.username
                item.bank_number = item.banks?.bank_number
            });
            if (resData.length !== SuccessData) {
                // playAudio()
                setDataTransactionSuccess(resData);
                getDataTransactionSuccess()
            }
        } catch (error) {
            console.log(error);
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }
    }

    const getBank = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/bank/bank_list`,
            });
            let resData = res.data;
            let lastData = resData.filter(item => item.type === "DEPOSIT")
            let no = 1;
            let data = lastData.filter(item => item.status === "ACTIVE")
            data.map((item) => {
                item.no = no++;
                item.birthdate = moment(item.birthdate).format("DD-MM-YYYY")
            });
            setBankData(data);
        } catch (error) {
            console.log(error);
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
        }
    };

    const approveTransaction = async () => {
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token")
                },
                method: "post",
                url: `${hostname}/transaction/approve_deposit_request`,
                data: {
                    "username": search.username,
                    "uuid": search.uuid
                },
            });
            if (res.data.message === "อนุมัติคำขอฝากเงินสำเร็จ") {
                setOpenDialogView(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "อนุมัติคำขอฝากเงินสำเร็จ",
                    showConfirmButton: false,
                    timer: 2500,
                });
                setSearch({});
                getDataTransactionFail()
                getDataTransactionSuccess()
            }
        } catch (error) {
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.status === 401 &&
                error.response.data.error.message === "Invalid Token"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            if (
                error.response.data.error.status_code === 404 &&
                error.response.data.error.message === "ไม่พบรหัสข้อมูลนี้"
            ) {
                setOpenDialogView(false);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "ไม่พบรหัสข้อมูลนี้",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
            if (
                error.response.data.error.status_code === 400 &&
                error.response.data.error.message === "ไม่พบสมาชิก"
            ) {
                setOpenDialogView(false);
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "ไม่พบรหัสสมาชิกนี้",
                    showConfirmButton: false,
                    timer: 2000,
                });
            }
            console.log(error);
        }
    }

    const approve_hidden = async (uuid) => {

        try {
            let res = await axios({
                headers: { Authorization: "Bearer " + localStorage.getItem("access_token") },
                method: "post",
                url: `${hostname}/transaction/update_hidden`,
                data: {
                    "uuid": uuid
                }
            });
            if (res.data) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "ซ่อนข้อมูลเรียบร้อย",
                    showConfirmButton: false,
                    timer: 2500,
                });
                getDataTransactionFail()
                getDataTransactionSuccess()
            }
        } catch (error) {
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            console.log(error);
        }
    }

    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = (clearFilters) => {
        clearFilters();
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        <SearchIcon />
                        Search
                    </Button>
                    {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
                    {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button> */}
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchIcon
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const columns = [
        // {
        //     title: 'ลำดับ',
        //     dataIndex: 'no',
        //     align: 'center',
        //     sorter: (record1, record2) => record1.no - record2.no,
        //     render: (item, data) => (
        //         <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >{item}</Typography>
        //     )
        // },
        {
            title: 'ฝากเข้าธนาคาร',
            dataIndex: 'bank_number',
            width: '200px',
            ...getColumnSearchProps('bank_number'),
            render: (item, data) => <Grid container>
                <Grid item xs={3} sx={{ mt: 1 }}>
                    {data.banks?.bank_name === "kbnk" ? (
                        <Image
                            src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509600962-kbnk.png"}
                            alt="kbnk"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "truemoney" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509654967-truemoney.png"
                            }
                            alt="truemoney"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "ktb" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509722840-ktb.png"
                            }
                            alt="ktb"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "scb" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509747475-scb.png"
                            }
                            alt="scb"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "bay" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509778211-bay.png"
                            }
                            alt="bay"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "bbl" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509796809-bbl.png"
                            }
                            alt="bbl"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "gsb" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509823709-gsb.png"
                            }
                            alt="gsb"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "ttb" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509868094-ttb.png"
                            }
                            alt="ttb"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "bbac" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509885549-baac.png"
                            }
                            alt="bbac"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "icbc" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509907708-icbt.png"
                            }
                            alt="icbc"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "tcd" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509929380-tcd.png"
                            }
                            alt="tcd"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "citi" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509949540-citi.png"
                            }
                            alt="citi"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "scbt" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509967883-scbt.png"
                            }
                            alt="scbt"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "cimb" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509984083-cimb.png"
                            }
                            alt="cimb"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "uob" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510000397-uob.png"
                            }
                            alt="uob"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "hsbc" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510018318-hsbc.png"
                            }
                            alt="hsbc"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "mizuho" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510037176-mizuho.png"
                            }
                            alt="mizuho"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "ghb" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510067372-ghb.png"
                            }
                            alt="ghb"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "lhbank" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510092134-lhbank.png"
                            }
                            alt="lhbank"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "tisco" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510111592-tisco.png"
                            }
                            alt="tisco"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "kkba" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510132080-kkba.png"
                            }
                            alt="kkba"
                            width={50}
                            height={50}
                        />
                    ) : data.banks?.bank_name === "ibank" ? (
                        <Image
                            src={
                                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510150924-ibank.png"
                            }
                            alt="ibank"
                            width={50}
                            height={50}
                        />
                    ) : (
                        ""
                    )}
                </Grid>
                <Grid item xs={9}>
                    <Grid sx={{ ml: 3, mt: 1 }}>
                        <CopyToClipboard text={data.bank_number}>
                            <div style={{ "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } } }} >
                                <Button
                                    sx={{ fontSize: "14px", p: 0, color: "blue", }}
                                    onClick={handleClickSnackbar}
                                >
                                    {data.bank_number}
                                </Button>
                            </div>
                        </CopyToClipboard>
                    </Grid>
                    <Grid sx={{ ml: 3, }}>
                        <Typography sx={{ fontSize: "14px" }}>
                            {data.banks?.bank_account_name}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid >,
        },
        {
            title: 'ชื่อผู้ใช้งาน',
            dataIndex: 'username',
            render: (item, data) => (
                <CopyToClipboard text={item}>
                    <div style={{
                        "& .MuiButton-text": {
                            "&:hover": {
                                textDecoration: "underline blue 1px",
                            }
                        }
                    }} >
                        <Button
                            sx={{ fontSize: "14px", p: 0, color: "blue", }}
                            onClick={handleClickSnackbar}
                        >
                            {item}
                        </Button>
                    </div>
                </CopyToClipboard>
            ),
            ...getColumnSearchProps('username'),

        },
        {
            dataIndex: "credit",
            title: "เครดิต",
            align: "center",
            sorter: (record1, record2) => record1.credit - record2.credit,
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
            ),
        },
        // {
        //     dataIndex: "credit_before",
        //     title: "เครดิตก่อนเติม",
        //     align: "center",
        //     ...getColumnSearchProps('credit_before'),
        //     render: (item) => (
        //         <Typography
        //             style={{
        //                 fontSize: '14px'
        //             }}
        //         >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
        //     ),
        // },
        // {
        //     dataIndex: "credit_after",
        //     title: "เครดิตหลังเติม",
        //     align: "center",
        //     ...getColumnSearchProps('credit_after'),
        //     render: (item) => (
        //         <Typography
        //             style={{
        //                 fontSize: '14px'
        //             }}
        //         >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
        //     ),
        // },

        {
            dataIndex: 'status_transction',
            title: "สถานะ",
            align: "center",
            render: (item) => (
                <Chip
                    label={item === 'SUCCESS' ? "สำเร็จ" : "ยกเลิก"}
                    size="small"
                    style={{
                        padding: 10,
                        backgroundColor: item === 'SUCCESS' ? "#129A50" : "#BB2828",
                        color: "#eee",
                    }}
                />
            ),
            filters: [
                { text: 'สำเร็จ', value: 'SUCCESS' },
                { text: 'ยกเลิก', value: 'CANCEL' },
            ],
            onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
        },

        {
            dataIndex: "create_at",
            title: "วันที่ทำรายการ",
            align: "center",
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
        },

        {
            dataIndex: "transfer_by",
            title: "ทำรายการโดย",
            align: "center",
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item}</Typography>
            ),
        },
        {
            dataIndex: "content",
            title: "หมายเหตุ",
            align: "center",
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{item === "" ? "-" : item}</Typography>
            ),
        },
    ];

    useEffect(() => {
        getDataTransactionFail()
        getDataTransactionSuccess()
        getBank()
    }, [])


    // useEffect(() => {
    //     getDataWithdraw()
    //     getBank()

    // }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getDataFail_Interval()
            getDataSuccess_Interval()
        }, 3000);
        return () => clearInterval(interval);
    }, []);


    function playAudio() {
        const audio = new Audio(
            "https://public-cdn-softkingdom.sgp1.cdn.digitaloceanspaces.com/1687247918891-achive-sound-132273.mp3"
        );
        audio.play();
    }

    return (
        <Layout title="home">
            <CssBaseline />
            <Paper sx={{ p: 3, mb: 2 }} >
                <Typography variant="h5" sx={{ mb: 1, textDecoration: "underline #41A3E3 3px" }}>บัญชีเงินฝาก</Typography>

                <Grid container justifyContent="start" >
                    {bankData.map((item) =>
                        <Paper sx={
                            {
                                background: "linear-gradient(#41A3E3, #0072B1)",
                                p: 2,
                                height: 150,
                                width: "400px",
                                mr: 2,
                            }
                        } >
                            <Grid container >
                                <Grid item xs={2} sx={{ mt: 4 }} >
                                    <Box>
                                        {item.bank_name === "kbnk" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509600962-kbnk.png"
                                                }
                                                alt="kbnk"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "truemoney" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509654967-truemoney.png"
                                                }
                                                alt="truemoney"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ktb" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509722840-ktb.png"
                                                }
                                                alt="ktb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "scb" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509747475-scb.png"
                                                }
                                                alt="scb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "bay" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509778211-bay.png"
                                                }
                                                alt="bay"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "bbl" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509796809-bbl.png"
                                                }
                                                alt="bbl"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "gsb" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509823709-gsb.png"
                                                }
                                                alt="gsb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ttb" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509868094-ttb.png"
                                                }
                                                alt="ttb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "bbac" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509885549-baac.png"
                                                }
                                                alt="bbac"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "icbc" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509907708-icbt.png"
                                                }
                                                alt="icbc"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "tcd" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509929380-tcd.png"
                                                }
                                                alt="tcd"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "citi" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509949540-citi.png"
                                                }
                                                alt="citi"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "scbt" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509967883-scbt.png"
                                                }
                                                alt="scbt"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "cimb" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509984083-cimb.png"
                                                }
                                                alt="cimb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "uob" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510000397-uob.png"
                                                }
                                                alt="uob"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "hsbc" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510018318-hsbc.png"
                                                }
                                                alt="hsbc"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "mizuho" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510037176-mizuho.png"
                                                }
                                                alt="mizuho"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ghb" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510067372-ghb.png"
                                                }
                                                alt="ghb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "lhbank" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510092134-lhbank.png"
                                                }
                                                alt="lhbank"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "tisco" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510111592-tisco.png"
                                                }
                                                alt="tisco"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "kkba" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510132080-kkba.png"
                                                }
                                                alt="kkba"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ibank" ? (
                                            <Image
                                                src={
                                                    "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510150924-ibank.png"
                                                }
                                                alt="ibank"
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            ""
                                        )} </Box>
                                </Grid>
                                <Grid item xs={5} sx={{ ml: 2, mt: 1 }} >
                                    <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        {item.bank_name === "kbnk"
                                            ? "กสิกรไทย"
                                            : item.bank_name === "truemoney"
                                                ? "TrueMoney"
                                                : item.bank_name === "ktb"
                                                    ? "กรุงไทย"
                                                    : item.bank_name === "scb"
                                                        ? "ไทยพาณิชย์"
                                                        : item.bank_name === "bay"
                                                            ? "กรุงศรีอยุธยา"
                                                            : item.bank_name === "bbl"
                                                                ? "กรุงเทพ"
                                                                : item.bank_name === "gsb"
                                                                    ? "ออมสิน"
                                                                    : item.bank_name === "ttb"
                                                                        ? "ทหารไทยธนชาต (TTB)"
                                                                        : item.bank_name === "BAAC"
                                                                            ? "เพื่อการเกษตรและสหกรณ์การเกษตร"
                                                                            : item.bank_name === "ICBC"
                                                                                ? "ไอซีบีซี (ไทย)"
                                                                                : item.bank_name === "TCD"
                                                                                    ? "ไทยเครดิตเพื่อรายย่อย"
                                                                                    : item.bank_name === "CITI"
                                                                                        ? "ซิตี้แบงก์"
                                                                                        : item.bank_name === "SCBT"
                                                                                            ? "สแตนดาร์ดชาร์เตอร์ด (ไทย)"
                                                                                            : item.bank_name === "CIMB"
                                                                                                ? "ซีไอเอ็มบีไทย"
                                                                                                : item.bank_name === "UOB"
                                                                                                    ? "ยูโอบี"
                                                                                                    : item.bank_name === "HSBC"
                                                                                                        ? "เอชเอสบีซี ประเทศไทย"
                                                                                                        : item.bank_name === "MIZUHO"
                                                                                                            ? "มิซูโฮ คอร์ปอเรต"
                                                                                                            : item.bank_name === "GHB"
                                                                                                                ? "อาคารสงเคราะห์"
                                                                                                                : item.bank_name === "LHBANK"
                                                                                                                    ? "แลนด์ แอนด์ เฮ้าส์"
                                                                                                                    : item.bank_name === "TISCO"
                                                                                                                        ? "ทิสโก้"
                                                                                                                        : item.bank_name === "kkba"
                                                                                                                            ? "เกียรตินาคิน"
                                                                                                                            : item.bank_name === "IBANK"
                                                                                                                                ? "อิสลามแห่งประเทศไทย"
                                                                                                                                : ""
                                        }
                                    </Typography>
                                    <Typography sx={{ fontSize: "18px", fontWeight: "bold", mt: "5px", ml: "5px", color: "#EEEEEE", }}>
                                        {item.bank_number} </Typography>
                                    <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        {item.bank_account_name}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} >
                                    {/* <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        จำนวนครั้ง / วัน
                                    </Typography>
                                    <Chip label={Intl.NumberFormat("TH").format(parseInt(item.count_transaction))}
                                        size="small"
                                        style={{ marginTop: "10px", padding: 10, width: 120, backgroundColor: "#129A50", color: "#EEEEEE", }} /> */}
                                    <Typography sx={{ fontSize: "14px", mt: 1, ml: "5px", color: "#EEEEEE", }} >
                                        เงินในบัญชี
                                    </Typography>
                                    <Chip
                                        label={Intl.NumberFormat("TH").format(parseInt(item.bank_total))}
                                        size="small"
                                        style={{ marginTop: "10px", padding: 10, width: 120, backgroundColor: "#129A50", color: "#EEEEEE", }} />
                                </Grid>

                            </Grid>
                        </Paper>
                    )
                    }
                </Grid>
            </Paper>

            <Grid container justifyContent="row" spacing={2}>
                <Grid item xs={4}>
                    <Paper sx={{
                        pt: 3,
                        pl: 3,
                        height: "770px",

                    }}>
                        <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}>รายการรออนุมัติการฝากผิดบัญชี</Typography>
                        <Box sx={{
                            overflow: "auto",
                            maxHeight: "700px",
                        }}>

                            {dataTransactionFail.map((item) =>
                                <Paper sx={
                                    {
                                        // background: "linear-gradient(#0072B1, #41A3E3)",
                                        background: "#eee",
                                        p: 1,
                                        // height: 150,
                                        // width: "300px",
                                        mt: 2,
                                        mr: 1
                                    }
                                } >
                                    <Grid container >
                                        <Grid item xs={2} sx={{ mt: 1 }} >
                                            <Box>
                                                {item.banks?.bank_name === "kbnk" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509600962-kbnk.png"
                                                        }
                                                        alt="kbnk"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "truemoney" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509654967-truemoney.png"
                                                        }
                                                        alt="truemoney"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "ktb" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509722840-ktb.png"
                                                        }
                                                        alt="ktb"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "scb" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509747475-scb.png"
                                                        }
                                                        alt="scb"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "bay" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509778211-bay.png"
                                                        }
                                                        alt="bay"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "bbl" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509796809-bbl.png"
                                                        }
                                                        alt="bbl"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "gsb" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509823709-gsb.png"
                                                        }
                                                        alt="gsb"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "ttb" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509868094-ttb.png"
                                                        }
                                                        alt="ttb"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "bbac" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509885549-baac.png"
                                                        }
                                                        alt="bbac"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "icbc" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509907708-icbt.png"
                                                        }
                                                        alt="icbc"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "tcd" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509929380-tcd.png"
                                                        }
                                                        alt="tcd"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "citi" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509949540-citi.png"
                                                        }
                                                        alt="citi"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "scbt" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509967883-scbt.png"
                                                        }
                                                        alt="scbt"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "cimb" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509984083-cimb.png"
                                                        }
                                                        alt="cimb"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "uob" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510000397-uob.png"
                                                        }
                                                        alt="uob"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "hsbc" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510018318-hsbc.png"
                                                        }
                                                        alt="hsbc"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "mizuho" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510037176-mizuho.png"
                                                        }
                                                        alt="mizuho"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "ghb" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510067372-ghb.png"
                                                        }
                                                        alt="ghb"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "lhbank" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510092134-lhbank.png"
                                                        }
                                                        alt="lhbank"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "tisco" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510111592-tisco.png"
                                                        }
                                                        alt="tisco"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "kkba" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510132080-kkba.png"
                                                        }
                                                        alt="kkba"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : item.banks?.bank_name === "ibank" ? (
                                                    <Image
                                                        src={
                                                            "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510150924-ibank.png"
                                                        }
                                                        alt="ibank"
                                                        width={50}
                                                        height={50}
                                                    />
                                                ) : (
                                                    ""
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid item xs={5} sx={{ ml: 2, mt: 1 }} >
                                            <Typography sx={{ fontSize: '14px', color: "#000" }} >
                                                {item.banks?.bank_name === "kbnk"
                                                    ? "กสิกรไทย"
                                                    : item.banks?.bank_name === "truemoney"
                                                        ? "TrueMoney"
                                                        : item.banks?.bank_name === "ktb"
                                                            ? "กรุงไทย"
                                                            : item.banks?.bank_name === "scb"
                                                                ? "ไทยพาณิชย์"
                                                                : item.banks?.bank_name === "bay"
                                                                    ? "กรุงศรีอยุธยา"
                                                                    : item.banks?.bank_name === "bbl"
                                                                        ? "กรุงเทพ"
                                                                        : item.banks?.bank_name === "gsb"
                                                                            ? "ออมสิน"
                                                                            : item.banks?.bank_name === "ttb"
                                                                                ? "ทหารไทยธนชาต (TTB)"
                                                                                : item.banks?.bank_name === "BAAC"
                                                                                    ? "เพื่อการเกษตรและสหกรณ์การเกษตร"
                                                                                    : item.banks?.bank_name === "ICBC"
                                                                                        ? "ไอซีบีซี (ไทย)"
                                                                                        : item.banks?.bank_name === "TCD"
                                                                                            ? "ไทยเครดิตเพื่อรายย่อย"
                                                                                            : item.banks?.bank_name === "CITI"
                                                                                                ? "ซิตี้แบงก์"
                                                                                                : item.banks?.bank_name === "SCBT"
                                                                                                    ? "สแตนดาร์ดชาร์เตอร์ด (ไทย)"
                                                                                                    : item.banks?.bank_name === "CIMB"
                                                                                                        ? "ซีไอเอ็มบีไทย"
                                                                                                        : item.banks?.bank_name === "UOB"
                                                                                                            ? "ยูโอบี"
                                                                                                            : item.banks?.bank_name === "HSBC"
                                                                                                                ? "เอชเอสบีซี ประเทศไทย"
                                                                                                                : item.banks?.bank_name === "MIZUHO"
                                                                                                                    ? "มิซูโฮ คอร์ปอเรต"
                                                                                                                    : item.banks?.bank_name === "GHB"
                                                                                                                        ? "อาคารสงเคราะห์"
                                                                                                                        : item.banks?.bank_name === "LHBANK"
                                                                                                                            ? "แลนด์ แอนด์ เฮ้าส์"
                                                                                                                            : item.banks?.bank_name === "TISCO"
                                                                                                                                ? "ทิสโก้"
                                                                                                                                : item.banks?.bank_name === "kkba"
                                                                                                                                    ? "เกียรตินาคิน"
                                                                                                                                    : item.banks?.bank_name === "IBANK"
                                                                                                                                        ? "อิสลามแห่งประเทศไทย"
                                                                                                                                        : ""
                                                }
                                            </Typography>
                                            <Typography sx={{ fontSize: "18px", fontWeight: "bold", mt: "5px", color: "#000", }}>
                                                {item.banks?.bank_number} </Typography>
                                            <Typography sx={{ fontSize: "14px", mt: "5px", color: "#000", }} >
                                                {item.banks?.bank_account_name}
                                            </Typography>

                                        </Grid>

                                        <Grid item xs={4} >
                                            <Typography align="end" sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#000", }} >
                                                {item.sms_time}
                                            </Typography>
                                            {/* <Chip label={Intl.NumberFormat("TH").format(parseInt(item.count_transaction))}
                                                size="small"
                                                style={{ marginTop: "10px", padding: 10, width: 120, backgroundColor: "#129A50", color: "#EEEEEE", }} /> */}
                                            <Typography align="start" sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#000", }} >
                                                จำนวนเงินฝาก :
                                            </Typography>
                                            <Grid container justifyContent="flex-end">
                                                <Chip
                                                    label={Intl.NumberFormat("TH").format(parseInt(item.credit))}
                                                    size="small"
                                                    style={{ marginTop: "10px", padding: 10, width: 120, backgroundColor: "#129A50", color: "#EEEEEE", }} />
                                            </Grid>

                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            container
                                            justifyContent="center"
                                            sx={{ mt: 1 }}
                                        >
                                            <Grid item xs={6}>
                                                <Typography sx={{ fontSize: "14px", color: '#000' }}>
                                                    ชื่อผู้ใช้ :
                                                </Typography>

                                                <TextField
                                                    variant="outlined"
                                                    type="text"
                                                    name="username"
                                                    size="small"
                                                    // value={search.username}
                                                    onChange={(e) => {
                                                        setSearch({ ...search, [e.target.name]: e.target.value, uuid: item.uuid });

                                                    }}
                                                    placeholder="username"
                                                    fullWidth
                                                // sx={{  mr: 2 }}
                                                />
                                            </Grid>
                                            <Grid item xs={5} container justifyContent='center' sx={{ mt: 3, ml: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    disabled={item.uuid !== search?.uuid ? true : search.username === '' ? true : false}
                                                    sx={{ background: item.uuid !== search?.uuid ? true : search.username === '' ? "gray" : "linear-gradient(#41db82, #09893f)" }}
                                                    onClick={() => {
                                                        setOpenDialogView({
                                                            open: true,
                                                            data: item,
                                                        });

                                                    }}
                                                >
                                                    <CheckCircleOutlineIcon sx={{ color: 'white' }} />
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    sx={{ background: "linear-gradient(#890909, #db4141)", ml: 1 }}
                                                    onClick={() => {
                                                        Swal.fire({
                                                            title: "ยืนยันการซ่อนข้อมูล",
                                                            icon: "info",
                                                            showCancelButton: true,
                                                            cancelButtonColor: "#EB001B",
                                                            confirmButtonColor: "#058900",
                                                            cancelButtonText: `ยกเลิก`,
                                                            confirmButtonText: "ยืนยัน",
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                approve_hidden(item.uuid)
                                                            }
                                                        });
                                                    }

                                                    }

                                                >
                                                    <HighlightOffIcon sx={{ color: 'white' }} />
                                                </Button>
                                            </Grid>


                                        </Grid>
                                    </Grid>
                                </Paper>
                            )
                            }
                        </Box>

                        {/* <Table
                            columns={columnsApprove}
                            dataSource={mock}
                            onChange={onChange}
                            size="small"
                            pagination={{
                                current: page,
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    setPage(page)
                                    setPageSize(pageSize)
                                }
                            }}
                        /> */}
                    </Paper>
                </Grid>

                <Grid item xs={8}>
                    <Paper sx={{ p: 3 }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start" >
                            <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}  > รายการเดินบัญชี </Typography>

                            <CSVLink
                                data={dataTransactionSuccess}
                            >
                                <Button
                                    variant="outlined"
                                    sx={{ mr: "8px", my: "10px", justifyContent: "flex-end", border: "1px solid #C0C0C0", boxShadow: 1, }}
                                >
                                    <Image src={excel} alt="excel" />{" "}
                                    <Typography variant="h7" sx={{ color: "black", ml: 1 }}>
                                        {" "}
                                        Export Excel
                                    </Typography>
                                </Button>
                            </CSVLink>
                        </Grid>
                        <Table
                            columns={columns}
                            dataSource={dataTransactionSuccess}
                            onChange={onChange}
                            size="small"
                            pagination={{
                                current: page,
                                pageSize: pageSize,
                                onChange: (page, pageSize) => {
                                    setPage(page)
                                    setPageSize(pageSize)
                                }
                            }}
                        />

                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={openDialogView.open}
                onClose={() => setOpenDialogView(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>รายการรออนุมัติการฝากผิดบัญชี</DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start">

                        <Grid item xs={2} sx={{ ml: 1, mt: 1 }}>
                            {openDialogView.data?.banks?.bank_name === "kbnk" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509600962-kbnk.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "truemoney" ? (
                                <Image
                                    src={
                                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509654967-truemoney.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "ktb" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509722840-ktb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "scb" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509747475-scb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "bay" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509778211-bay.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "bbl" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509796809-bbl.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "gsb" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509823709-gsb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "ttb" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509868094-ttb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "baac" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509885549-baac.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "icbc" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509907708-icbt.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "tcd" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509929380-tcd.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "citi" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509949540-citi.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "scbt" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509967883-scbt.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "cimb" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509984083-cimb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "uob" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510000397-uob.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "hsbc" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510018318-hsbc.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "mizuho" ? (
                                <Image
                                    src={
                                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510037176-mizuho.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "ghb" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510067372-ghb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "lhbank" ? (
                                <Image
                                    src={
                                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510092134-lhbank.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "tisco" ? (
                                <Image
                                    src={
                                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510111592-tisco.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "kkba" ? (
                                <Image
                                    src={"https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510132080-kkba.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.banks?.bank_name === "ibank" ? (
                                <Image
                                    src={
                                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510150924-ibank.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : (
                                ""
                            )}
                        </Grid>

                        <Grid item xs={5} >
                            <Typography> {openDialogView.data?.banks?.bank_name} </Typography>
                            <Typography> {openDialogView.data?.banks?.bank_number} </Typography>
                            <Typography> {openDialogView.data?.banks?.bank_account_name} </Typography>
                        </Grid>
                        <Grid item xs={4} >
                            <Typography sx={{ fontWeight: 'bold' }}>เวลาที่ทำรายการ</Typography>
                            <Typography > {openDialogView.data?.create_at} </Typography>
                        </Grid>

                    </Grid>
                    <Grid xs={2} item >
                        <Typography sx={{ fontSize: "16px", ml: 1, mt: 2 }}> <span style={{ fontWeight: 'bold' }}> ชื่อผู้ใช้ (Username) : </span>{search.username} </Typography>
                    </Grid>

                    <Grid sx={{ mt: 2 }}>
                        <Typography sx={{ fontSize: "16px", fontWeight: "bold", ml: 1, mt: 2 }}>
                            จำนวนเงิน :
                            <Chip
                                label={openDialogView.data?.credit}
                                size="small"
                                sx={{
                                    p: "10px",
                                    ml: 2,
                                    backgroundColor: "#16539B",
                                    color: "#eee",
                                }}
                            />
                        </Typography>
                        <Typography sx={{ fontSize: "16px", ml: 1, mt: 2 }}> <span style={{ fontWeight: 'bold' }}> หมายเหตุ : </span>{openDialogView.data?.content} </Typography>

                    </Grid>

                    <Grid container justifyContent="flex-end" spacing={1}>
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={() => approveTransaction()}
                                sx={{ mt: 3, color: '#ffff' }}
                            >
                                ยืนยัน
                            </Button>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                variant="text"
                                size="large"
                                fullWidth
                                onClick={() => setOpenDialogView(false)}
                                sx={{ mt: 3, bgcolor: '#eee' }}
                            >
                                ปิด
                            </Button>
                        </Grid>
                    </Grid>

                </DialogContent>
            </Dialog>
            <LoadingModal open={loading} />
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity="success" sx={{ width: "100%" }}>
                    Copy success !
                </Alert>
            </Snackbar>
        </Layout >
    );
}

export default withAuth(home);