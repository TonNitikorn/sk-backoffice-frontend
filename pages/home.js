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
import kbank from "../assets/kbank.png";
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
import MaterialTable from '@material-table/core'
import { ExportCsv, ExportPdf } from "@material-table/exporters";

function home() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openDialogView, setOpenDialogView] = useState(false);
    const [search, setSearch] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataLast, setDataLast] = useState([])
    const [bankData, setBankData] = useState([]);

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
                item.username = item.members?.username
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
            lastData.map((item) => {
                item.no = no++;
                item.birthdate = moment(item.birthdate).format("DD-MM-YYYY")
            });
            setBankData(lastData);
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
        getBank()
    }, [])


    return (
        <Layout title="home">
            <CssBaseline />
            <Paper sx={{ p: 3, mb: 2 }} >
                <Typography variant="h5" sx={{ mb: 1, textDecoration: "underline #41A3E3 3px" }}>บัญชีเงินฝาก</Typography>

                <Grid container justifyContent="start" >
                    {bankData.map((item) =>
                        <Paper sx={
                            {
                                // backgroundImage:
                                //   "url(https://the1pg.com/wp-content/uploads/2022/10/BG-wallet.jpg)",
                                // backgroundRepeat: "no-repeat",
                                // backgroundSize: "cover",
                                // backgroundPosition: "center",
                                bgcolor: '#0072B1',
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
                                                    "https://angpaos.games/wp-content/uploads/2023/03/kbnk.png"
                                                }
                                                alt="kbnk"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "truemoney" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/truemoney.png"
                                                }
                                                alt="truemoney"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ktba" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/ktba.png"
                                                }
                                                alt="ktba"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "scb" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/scb.png"
                                                }
                                                alt="scb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "bay" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/bay.png"
                                                }
                                                alt="bay"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "bbla" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/bbl.png"
                                                }
                                                alt="bbla"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "gsb" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/gsb.png"
                                                }
                                                alt="gsb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ttb" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/ttb.png"
                                                }
                                                alt="ttb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "bbac" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/baac.png"
                                                }
                                                alt="bbac"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "icbc" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/icbc.png"
                                                }
                                                alt="icbc"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "tcd" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/tcd.png"
                                                }
                                                alt="tcd"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "citi" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/citi.png"
                                                }
                                                alt="citi"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "scbt" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/scbt.png"
                                                }
                                                alt="scbt"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "cimb" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/cimb.png"
                                                }
                                                alt="cimb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "uob" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/uob.png"
                                                }
                                                alt="uob"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "hsbc" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/hsbc.png"
                                                }
                                                alt="hsbc"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "mizuho" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/mizuho.png"
                                                }
                                                alt="mizuho"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ghb" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/ghb.png"
                                                }
                                                alt="ghb"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "lhbank" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/lhbank.png"
                                                }
                                                alt="lhbank"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "tisco" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/tisco.png"
                                                }
                                                alt="tisco"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "kkba" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/kkba.png"
                                                }
                                                alt="kkba"
                                                width={50}
                                                height={50}
                                            />
                                        ) : item.bank_name === "ibank" ? (
                                            <Image
                                                src={
                                                    "https://angpaos.games/wp-content/uploads/2023/03/ibank.png"
                                                }
                                                alt="ibank"
                                                width={50}
                                                height={50}
                                            />
                                        ) : (
                                            ""
                                        )} </Box>
                                </Grid>
                                <Grid item xs={5} sx={{ ml: 2, mt: 2 }} >
                                    <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        {
                                            item.bank_name === "truemoney" ? "True Wallet"
                                                : item.bank_name === "scb" ? "SCB (ไทยพาณิชย์)"
                                                    : item.bank_name === "kbnk" ? "KBank (กสิกรไทย)"
                                                        : ""
                                        } </Typography>
                                    <Typography sx={{ fontSize: "18px", fontWeight: "bold", mt: "5px", ml: "5px", color: "#EEEEEE", }}>
                                        {item.bank_number} </Typography>
                                    <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        {item.bank_account_name}
                                    </Typography>
                                </Grid>

                                <Grid item xs={4} >
                                    <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        จำนวนครั้ง
                                    </Typography>
                                    <Chip label={Intl.NumberFormat("TH").format(parseInt(item.bank_status))}
                                        size="small"
                                        style={{ marginTop: "10px", padding: 10, width: 120, backgroundColor: "#129A50", color: "#EEEEEE", }} />
                                    <Typography sx={{ fontSize: "14px", mt: "5px", ml: "5px", color: "#EEEEEE", }} >
                                        จำนวนเงินถอน
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
                    <Paper sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}>รายการรออนุมัติ</Typography>
                        <Paper elevation={3} sx={{ mt: 1, borderRadius: 1, p: 3 }}>
                            <Grid container
                                direction="row"
                                justifyContent="center"
                                alignItems="center">
                                <Grid item xs={3}>
                                    <Box sx={{ mt: 1, ml: 1 }}>
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
                                        sx={{ bgcolor: '#34BD22 ', mt: 1 }}
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
                                        sx={{ bgcolor: "#EB001B", mt: 1, color: '#ffff' }}
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
                                    <Box sx={{ mt: 1, ml: 1 }}>
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
                                        sx={{ bgcolor: '#34BD22 ', mt: 1 }}
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
                                        sx={{ bgcolor: "#EB001B", mt: 1, color: '#ffff' }}
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
                                    <Box sx={{ mt: 1, ml: 1 }}>
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
                                        sx={{ bgcolor: '#34BD22 ', mt: 1 }}
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
                                        sx={{ bgcolor: "#EB001B", mt: 1, color: '#ffff' }}
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
                <Grid item xs={8}>
                    <Paper sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}  > รายการเดินบัญชี </Typography>
                        {/* 
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
                        </TableContainer> */}

                        <MaterialTable
                            title=""
                            columns={[
                                { title: 'วัน/เวลา', field: 'create_at' },
                                { title: 'ชื่อผู้ใช้', field: 'username' },
                                { title: 'จำนวนเงิน', field: 'credit' },
                                { title: 'เครดิตก่อนเติม	', field: 'credit_before' },
                                { title: 'เครดิตหลังเติม', field: 'credit_after' },
                                { title: 'ธนาคาร', field: 'bank_name' },
                                { title: 'เลขที่บัญชี', field: 'bank_number' },
                                {
                                    title: 'สถานะ', field: 'status_transction', render: (item) => (
                                        <Chip
                                            label={item.status_transction === 'SUCCESS' ? "SUCCESS" : 'UNSUCCESS'}
                                            size="small"
                                            style={{
                                                padding: 10,
                                                backgroundColor: item.status_transction === 'SUCCESS' ? "#129A50" : "#FFB946",
                                                color: "#eee",
                                            }}
                                        />
                                    ),
                                },
                            ]}
                            data={dataLast}
                            options={{
                                exportMenu: [
                                    
                                    {
                                        label: "Export CSV",
                                        exportFunc: (cols, datas) =>
                                            ExportCsv(cols, datas, "รายการเดินบัญชี"),
                                    },
                                ],
                                search: true,
                                columnsButton: true,
                                columnResizable: true,
                                rowStyle: {
                                    fontSize: 12,
                                },
                                headerStyle: {
                                    paddingTop: 5,
                                    paddingBottom: 5,
                                    align: "center",
                                    paddingRight: 0
                                },
                                pageSize: 20,
                                pageSizeOptions: [10, 20, 100],
                                padding: 0,
                            }}
                            localization={{
                                toolbar: {
                                    exportCSVName: "Export some excel format",
                                    exportPDFName: "Export as pdf!!"
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