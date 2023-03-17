import React, { useState, useEffect } from "react";
import Layout from "../theme/Layout";
import {
    Grid,
    Typography,
    Box,
    TextField,
    Paper,
    Button,
    Chip,
    Divider,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
    CssBaseline,
    Table, TableRow, TableHead, TableContainer, TableCell, TableBody, CardContent, Card
} from "@mui/material";
import hostname from "../utils/hostname";
import axios from "axios";
import scbL from "../assets/scbL.png";
import trueL from "../assets/trueL.png";
import Image from "next/image";
import moment from "moment/moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import withAuth from "../routes/withAuth";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Swal from "sweetalert2";
import LoadingModal from "../theme/LoadingModal";
import { useAppDispatch } from "../store/store";
import { signOut } from "../store/slices/userSlice";
import { useRouter } from "next/router";
import MaterialTableForm from '../components/materialTableForm';
import Pagination from '@mui/material/Pagination';
function home() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [selectedDateRange, setSelectedDateRange] = useState({});
    const [bank, setBank] = useState();
    const [wallet, setWallet] = useState([{
        bank_tranfer: '',
        sms_content: '',
        title_tranfer: '',
        amount: 0
    }]);
    const [listWait, setListWait] = useState([{
        bank_tranfer: '',
        sms_content: '',
        title_tranfer: '',
        amount: 0
    }]);
    const [openDialogView, setOpenDialogView] = useState(false);
    const [search, setSearch] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataLast, setDataLast] = useState([])

    const getDataLast = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/dashboard/transaction/last`,
            });
            let resData = res.data;
            let no = 1;
            resData.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format("DD-MM-YYYY hh:mm")
                item.bank_name = item.members?.bank_name
                item.bank_number = item.members?.bank_number
            });
            setDataLast(resData);
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
        }
    };

    useEffect(() => {
        getDataLast()
    }, [])

    console.log('dataLast', dataLast)

    const columns = [
        {
            field: "no",
            maxWidth: 80,
            align: "center",

        },
        {
            title: "สถานะ",
            align: "center",
            render: (item) => (
                <Chip label={
                    item.status_transction === "FAIL" ?
                        "ผิดพลาด" :
                        item.status_transction === "CREATE" ?
                            "รออนุมัติ" :
                            item.status_transction === "APPROVE" ?
                                "อนุมัติแล้ว" :
                                item.status_transction === "PROCESS" ?
                                    "รอทำรายการ" :
                                    item.status_transction === "SUCCESS" ?
                                        "สำเร็จ" :
                                        item.status_transction === "OTP" ?
                                            "OTP" :
                                            item.status_transction === "REJECT" ?
                                                "ยกเลิก" :
                                                item.status_transction === "MANUAL" ?
                                                    "ถอนมือ" :
                                                    item.status_transction === "" ?
                                                        "ทั้งหมด" :
                                                        "-"
                }
                    size="small"
                    style={
                        {
                            padding: 10,
                            backgroundColor: item.status_transction === "FAIL" ?
                                "#EB001B" :
                                item.status_transction === "CREATE" ?
                                    "#16539B" :
                                    item.status_transction === "APPROVE" ?
                                        "#16539B" :
                                        item.status_transction === "PROCESS" ?
                                            "#FFB946" :
                                            item.status_transction === "SUCCESS" ?
                                                "#129A50" :
                                                item.status_transction === "OTP" ?
                                                    "#FFB946" :
                                                    item.status_transction === "REJECT" ?
                                                        "#FD3B52" :
                                                        item.status_transction === "MANUAL" ?
                                                            "#E1772B" :
                                                            item.status_transction === "" ?
                                                                "gray" :
                                                                "gray",
                            // item.status_transction === 1 ? "#129A50" : "#FFB946",
                            color: "#eee",
                        }
                    }
                />
            ),
        },

        {
            field: "bank_number",
            title: "ธนาคาร",
            align: "center",
            minWidth: "150px",
        },
        {
            field: "bank_name",
            title: "ชื่อผู้ใช้งาน",
            align: "center",
        },
        {
            title: "ยอดเงินถอน",
            align: "center",
            minWidth: "130px",
            render: (item) => (
                <>
                    <Grid container justifyContent="center" >
                        <Grid >
                            <Typography sx={{ fontSize: "14px" }} >
                                {Intl.NumberFormat("TH", { style: "currency", currency: "THB", }).format(parseInt(item.credit))}
                            </Typography>
                        </Grid>

                    </Grid>
                </>
            ),
        },
        {
            field: "create_at",
            title: "วันที่ถอน",
            align: "center",
            minWidth: "120px",
        },
        {
            field: "update_at",
            title: "วันที่อัพเดท",
            align: "center",
            minWidth: "130px",
            render: (item) => (
                <>
                    <Grid container justifyContent="center" >
                        <Grid >
                            <Typography sx={{ fontSize: "14px" }} > {item.update_at}</Typography>
                        </Grid>
                    </Grid>
                </>
            ),
        },
        {
            field: "transfer_by",
            title: "ทำโดย",
            align: "center",
            minWidth: "100px"
        },

        {
            title: "เงินในบัญชี",
            align: "center",
            minWidth: "130px",
            render: (item) => (
                <>
                    <Grid container justifyContent="center" >
                        <Grid item xs={12}
                            sx={
                                { mb: 1 }} >
                            <Chip label={
                                item.credit_before ?
                                    item.credit_before :
                                    "0.00"
                            }
                                size="small"
                                style={
                                    {
                                        padding: 10,
                                        minWidth: "80px",
                                        backgroundColor: "#FD3B52",
                                        color: "#eee",
                                    }
                                }
                            /> </Grid>
                        <Grid item xs={12} >
                            <Chip label={
                                item.credit_after ?
                                    item.credit_after :
                                    "0.00"
                            }
                                size="small"
                                style={
                                    {
                                        padding: 10,
                                        minWidth: "80px",
                                        backgroundColor: "#129A50",
                                        color: "#eee",
                                    }
                                }
                            /> </Grid> </Grid> </>
            ),
        },




    ];

    return (
        <Layout title="home">
            <CssBaseline />
            <Paper sx={{ p: 3, mb: 2 }}><Typography variant="h5">หน้าหลัก</Typography></Paper>
            <Grid container justifyContent="row" spacing={2}>

                {/* <Paper sx={{ p: 3, }}>
                    <Typography
                        sx={{ fontSize: "24px", textDecoration: "underline #129A50 3px" }}
                    >
                        รายการรออนุมัติ
                    </Typography>

                    {listWait?.map((item) => (
                        <>
                            <Grid container>
                                <Grid item xs={3} sx={{ mt: 3, ml: 1 }}>
                                    <Image
                                        src={
                                            "https://the1pg.com/wp-content/uploads/2022/10/kbnk.png"
                                        }
                                        alt="scb"
                                        width={50}
                                        height={50}
                                    />

                                </Grid>

                                <Grid xs={3} sx={{ mt: 3 }} >
                                    <Grid item xs={9}>
                                        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>ธนาคารกสิกรไทย"
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={3}>
                                        <Typography sx={{ fontSize: "14px" }}>
                                            14-03-2023
                                        </Typography>
                                        <Typography sx={{ fontSize: "14px" }}>
                                            03:49
                                        </Typography>
                                    </Grid>

                                </Grid>

                                <Grid item xs={12} container justifyContent="center">
                                    <Typography sx={{ fontSize: "16px" }}>
                                        test sms_content
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} container justifyContent="start">
                                    <Typography sx={{ fontSize: "16px", ml: 10, mt: 1 }}>
                                        ช่องทาง :
                                        <Chip
                                            label={<Typography sx={{ fontSize: "14px" }}>"ธนาคารกสิกรไทย</Typography>}
                                            size="small"
                                            sx={{
                                                pt: 1,
                                                p: "10px",
                                                ml: "30px",
                                                backgroundColor: "#129A17",
                                                color: "#eee",
                                            }}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} container justifyContent="start">
                                    <Typography sx={{ fontSize: "16px", ml: 10, mt: 1 }}>
                                        จำนวนเงิน :
                                        <Chip
                                            label={"100"}
                                            size="small"
                                            sx={{
                                                p: "10px",
                                                ml: 2,
                                                backgroundColor: "#16539B",
                                                color: "#eee",
                                            }}
                                        />
                                    </Typography>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    justifyContent="center"
                                    sx={{ mt: 2 }}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            setOpenDialogView({
                                                open: true,
                                                data: item,
                                            });
                                        }}
                                    >
                                        <CheckCircleOutlineIcon />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "#EB001B", ml: 1 }}
                                        onClick={async () => {
                                            try {
                                                let res = await axios({
                                                    headers: {
                                                        Authorization:
                                                            "Bearer " + localStorage.getItem("access_token"),
                                                    },
                                                    method: "post",
                                                    url: `${hostname}/api/sms/scb/sms-transaction/hide/${item.uuid}`,
                                                });
                                                if (res.data.message === "แก้ไขข้อมูลเรียบร้อยแล้ว") {
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "ซ่อนข้อมูลเรียบร้อย",
                                                        showConfirmButton: false,
                                                        timer: 2000,
                                                    });
                                                    getListWait();
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
                                        }}
                                    >
                                        <HighlightOffIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                            <Divider sx={{ bgcolor: "#00897B", mt: "15px", mb: 1 }} />
                        </>
                    ))}

                </Paper> */}
                <Grid item xs={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}>รายการรออนุมัติ</Typography>
                        {/* <Grid container>
                            <Grid item xs={3}>
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/kbnk.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>ธนาคารกสิกรไทย</Typography>
                            </Grid>

                            <Typography sx={{ fontSize: "14px" }}>
                                {"14-03-2023 03:49"}
                            </Typography>



                        </Grid> */}
                        <Paper elevation={3} sx={{
                            mt: 1,
                            borderRadius: 1,
                            p: 3
                            // bgcolor: '#78BEFF',
                            // background: "linear-gradient(#41A3E3, #0072B1, #0072B1)",
                        }}
                        >
                            <Grid container
                                direction="row"
                                justifyContent="center"
                                alignItems="center">
                                <Grid item xs={3}>
                                    <Box sx={{ mt: 1, ml: 3 }}>
                                        <Image src={scbL} alt="scb" />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Chip
                                        label={<Typography sx={{ fontSize: "14px" }}>ธนาคารไทยพานิชย์</Typography>}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#7421C6 ",
                                            color: "#eee",
                                        }}
                                    />
                                    <Typography sx={{ mt: 1 }}>สุทิน จิตอาสา</Typography>
                                    <Typography sx={{ mt: 1 }}>100 บาท</Typography>
                                    <Typography sx={{ mt: 1 }}>เวลา 14-03-202303:49 </Typography>
                                </Grid>
                                <Grid item xs={3} >
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#34BD22 ',mt:1 }}
                                        onClick={() => {
                                            setOpenDialogView({
                                                open: true,
                                                // data: item,
                                            });
                                        }}
                                    >
                                        <CheckCircleOutlineIcon sx={{ color: '#FFFF' }} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "#EB001B",mt:1}}
                                        onClick={async () => {
                                            try {
                                                let res = await axios({
                                                    headers: {
                                                        Authorization:
                                                            "Bearer " + localStorage.getItem("access_token"),
                                                    },
                                                    method: "post",
                                                    url: `${hostname}/api/sms/scb/sms-transaction/hide/${item.uuid}`,
                                                });
                                                if (res.data.message === "แก้ไขข้อมูลเรียบร้อยแล้ว") {
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "ซ่อนข้อมูลเรียบร้อย",
                                                        showConfirmButton: false,
                                                        timer: 2000,
                                                    });
                                                    getListWait();
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
                                        }}
                                    >
                                        <HighlightOffIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                        </Paper>

                        <Paper elevation={3} sx={{
                            mt: 1,
                            borderRadius: 1,
                            p: 3
                            // bgcolor: '#78BEFF',
                            // background: "linear-gradient(#41A3E3, #0072B1, #0072B1)",
                        }}
                        >
                            <Grid container
                                direction="row"
                                justifyContent="center"
                                alignItems="center">
                                <Grid item xs={3}>
                                    <Box sx={{ mt: 1, ml: 3 }}>
                                        <Image src={scbL} alt="scb" />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Chip
                                        label={<Typography sx={{ fontSize: "14px" }}>ธนาคารไทยพานิชย์</Typography>}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#7421C6 ",
                                            color: "#eee",
                                        }}
                                    />
                                    <Typography sx={{ mt: 1 }}>สุทิน จิตอาสา</Typography>
                                    <Typography sx={{ mt: 1 }}>100 บาท</Typography>
                                    <Typography sx={{ mt: 1 }}>เวลา 14-03-202303:49 </Typography>
                                </Grid>
                                <Grid item xs={3}  >
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#34BD22 ' }}
                                        onClick={() => {
                                            setOpenDialogView({
                                                open: true,
                                                // data: item,
                                            });
                                        }}
                                    >
                                        <CheckCircleOutlineIcon sx={{ color: '#FFFF' }} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "#EB001B", mt: 2 }}
                                        onClick={async () => {
                                            try {
                                                let res = await axios({
                                                    headers: {
                                                        Authorization:
                                                            "Bearer " + localStorage.getItem("access_token"),
                                                    },
                                                    method: "post",
                                                    url: `${hostname}/api/sms/scb/sms-transaction/hide/${item.uuid}`,
                                                });
                                                if (res.data.message === "แก้ไขข้อมูลเรียบร้อยแล้ว") {
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "ซ่อนข้อมูลเรียบร้อย",
                                                        showConfirmButton: false,
                                                        timer: 2000,
                                                    });
                                                    getListWait();
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
                                        }}
                                    >
                                        <HighlightOffIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                        </Paper>

                        <Paper elevation={3} sx={{
                            mt: 1,
                            borderRadius: 1,
                            p: 3
                            // bgcolor: '#78BEFF',
                            // background: "linear-gradient(#41A3E3, #0072B1, #0072B1)",
                        }}
                        >
                            <Grid container
                                direction="row"
                                justifyContent="center"
                                alignItems="center">
                                <Grid item xs={3}>
                                    <Box sx={{ mt: 1, ml: 3 }}>
                                        <Image src={scbL} alt="scb" />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Chip
                                        label={<Typography sx={{ fontSize: "14px" }}>ธนาคารไทยพานิชย์</Typography>}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#7421C6 ",
                                            color: "#eee",
                                        }}
                                    />
                                    <Typography sx={{ mt: 1 }}>สุทิน จิตอาสา</Typography>
                                    <Typography sx={{ mt: 1 }}>100 บาท</Typography>
                                    <Typography sx={{ mt: 1 }}>เวลา 14-03-202303:49 </Typography>
                                </Grid>
                                <Grid item xs={3}  >
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: '#34BD22 ' }}
                                        onClick={() => {
                                            setOpenDialogView({
                                                open: true,
                                                // data: item,
                                            });
                                        }}
                                    >
                                        <CheckCircleOutlineIcon sx={{ color: '#FFFF' }} />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        sx={{ bgcolor: "#EB001B", mt: 2 }}
                                        onClick={async () => {
                                            try {
                                                let res = await axios({
                                                    headers: {
                                                        Authorization:
                                                            "Bearer " + localStorage.getItem("access_token"),
                                                    },
                                                    method: "post",
                                                    url: `${hostname}/api/sms/scb/sms-transaction/hide/${item.uuid}`,
                                                });
                                                if (res.data.message === "แก้ไขข้อมูลเรียบร้อยแล้ว") {
                                                    Swal.fire({
                                                        position: "center",
                                                        icon: "success",
                                                        title: "ซ่อนข้อมูลเรียบร้อย",
                                                        showConfirmButton: false,
                                                        timer: 2000,
                                                    });
                                                    getListWait();
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
                                        }}
                                    >
                                        <HighlightOffIcon />
                                    </Button>
                                </Grid>
                            </Grid>

                        </Paper>

                    </Paper>
                </Grid>
                <Grid item xs={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}  > รายการเดินบัญชี </Typography>

                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 450 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ fontWeight: 'blod' }}>
                                        <TableCell>วัน/เวลา</TableCell>
                                        <TableCell align="right">จำนวนเงิน</TableCell>
                                        <TableCell align="right">เครดิตก่อนเติม</TableCell>
                                        <TableCell align="right">เครดิตหลังเติม</TableCell>
                                        <TableCell align="right">ธนาคาร</TableCell>
                                        <TableCell align="right">เลขที่บัญชี</TableCell>
                                        <TableCell align="right">สถานะ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <>
                                        {dataLast.map((item) =>
                                            <TableRow
                                                key={item.no}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">{item.create_at}</TableCell>
                                                <TableCell align="right">{item.credit}</TableCell>
                                                <TableCell align="right">{item.credit_before}</TableCell>
                                                <TableCell align="right">{item.credit_after}</TableCell>
                                                <TableCell align="right">{item.bank_name}</TableCell>
                                                <TableCell align="right">{item.bank_number}</TableCell>
                                                <TableCell align="right">{item.status_transction}</TableCell>
                                            </TableRow>
                                        )}
                                    </>

                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        ><Pagination count={10} size="small" sx={{ mt: 2 }} /></Grid>

                    </Paper>
                </Grid>




            </Grid>

            <Dialog
                open={openDialogView.open}
                onClose={() => setOpenDialogView(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>ข้อมูล SMS</DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={2} sx={{ mt: 3, ml: 1 }}>
                            {openDialogView.data?.bank_tranfer === "KBNK" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/kbnk.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "TRUEWALLET" ? (
                                <Image
                                    src={
                                        "https://the1pg.com/wp-content/uploads/2022/10/truemoney.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "KTBA" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/ktba.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "SCB" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/scb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "BAY" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/bay.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "BBLA" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/bbl.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "GSB" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/gsb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "TTB" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/ttb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "BAAC" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/baac.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "ICBC" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/icbc.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "TCD" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/tcd.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "CITI" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/citi.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "SCBT" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/scbt.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "CIMB" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/cimb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "UOB" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/uob.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "HSBC" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/hsbc.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "MIZUHO" ? (
                                <Image
                                    src={
                                        "https://the1pg.com/wp-content/uploads/2022/10/mizuho.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "GHB" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/ghb.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "LHBANK" ? (
                                <Image
                                    src={
                                        "https://the1pg.com/wp-content/uploads/2022/10/lhbank.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "TISCO" ? (
                                <Image
                                    src={
                                        "https://the1pg.com/wp-content/uploads/2022/10/tisco.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "KKBA" ? (
                                <Image
                                    src={"https://the1pg.com/wp-content/uploads/2022/10/kkba.png"}
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : openDialogView.data?.bank_tranfer === "IBANK" ? (
                                <Image
                                    src={
                                        "https://the1pg.com/wp-content/uploads/2022/10/ibank.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />
                            ) : (
                                ""
                            )}
                        </Grid>
                        <Grid xs={9} sx={{ mt: 3 }} container>
                            <Grid item xs={9} container>
                                <Typography sx={{ fontSize: "16px", ml: 1, mt: 1 }}>
                                    จำนวนเงิน :
                                    <Chip
                                        label={'100'}
                                        size="small"
                                        sx={{
                                            p: "10px",
                                            ml: 2,
                                            backgroundColor: "#16539B",
                                            color: "#eee",
                                        }}
                                    />
                                </Typography>
                            </Grid>
                            <Grid item xs={3} justifyContent="flex-end">
                                <Typography sx={{ fontSize: "14px" }}>
                                    {openDialogView.data?.bank_date}
                                </Typography>
                                <Typography sx={{ fontSize: "14px" }}>
                                    {openDialogView.data?.bank_time}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid sx={{ mt: 2 }}>
                            <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                ชื่อผู้ใช้ (Username)
                            </Typography>

                            <TextField
                                variant="outlined"
                                type="text"
                                name="username"
                                value={search.username}
                                onChange={(e) => {
                                    setSearch({
                                        ...search,
                                        [e.target.name]: e.target.value,
                                    });
                                }}
                                placeholder="Username"
                                fullWidth
                                sx={{ mt: 1, mr: 2 }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end">
                        <Grid item xs={3}>
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={async () => {
                                    try {
                                        let res = await axios({
                                            headers: {
                                                Authorization:
                                                    "Bearer " + localStorage.getItem("access_token"),
                                            },
                                            method: "post",
                                            url: `${hostname}/api/sms/scb/sms-transaction/approved-deposit/${openDialogView.data?.uuid}`,
                                            data: {
                                                amount: openDialogView.data?.amount,
                                                bank_date: openDialogView.data?.bank_date,
                                                bank_time: openDialogView.data?.bank_time,
                                                create_by: localStorage.getItem("create_by"),
                                                username: search.username,
                                            },
                                        });
                                        if (res.data.message === "เพิ่มข้อมูลเรียบร้อยแล้ว") {
                                            setOpenDialogView(false);
                                            Swal.fire({
                                                position: "center",
                                                icon: "success",
                                                title: "เพิ่มข้อมูลเรียบร้อยแล้ว",
                                                showConfirmButton: false,
                                                timer: 2000,
                                            });
                                            setSearch({});
                                            getListWait();
                                            getWallet();
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
                                        console.log(error);
                                    }
                                }}
                                sx={{
                                    mt: 3,
                                    color: '#ffff'
                                }}
                            >
                                ยืนยัน
                            </Button>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
            <LoadingModal open={loading} />
        </Layout>
    );
}

// export default withAuth(home);

export default home