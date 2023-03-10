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

    return (
        <Layout title="home">
            <CssBaseline />
            <Paper sx={{ p: 2 }}>
                <Grid container justifyContent="start">
                    {bank?.map((item) => (
                        <Paper
                            sx={{
                                backgroundImage:
                                    "url(https://the1pg.com/wp-content/uploads/2022/10/BG-wallet.jpg)",
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                p: 2,
                                height: 150,
                                width: "380px",
                                mr: 2,
                            }}
                        >
                            <Grid container>
                                <Grid item xs={5}>
                                    <Box sx={{ mt: "15px", ml: 3 }}>
                                        {item.bank_name === "truemoney" ? (
                                            <Image src={trueL} alt="" />
                                        ) : item.bank_name === "scb" ? (
                                            <Image src={scbL} alt="" />
                                        ) : (
                                            ""
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            mt: "5px",
                                            ml: "5px",
                                            color: "#EEEEEE",
                                        }}
                                    >
                                        {item.bank_name === "truemoney"
                                            ? "True Wallet"
                                            : item.bank_name === "scb"
                                                ? "SCB (ไทยพาณิชย์)"
                                                : ""}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: "18px",
                                            fontWeight: "bold",
                                            mt: "5px",
                                            ml: "5px",
                                            color: "#EEEEEE",
                                        }}
                                    >
                                        {item.bank_number}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: "14px",
                                            mt: "5px",
                                            ml: "5px",
                                            color: "#EEEEEE",
                                        }}
                                    >
                                        {item.bank_account_name}
                                    </Typography>
                                    <Chip
                                        label={
                                            item.bank_status === "1" ? "เปิดใช้งาน" : "ไม่เปิดใช้งาน"
                                        }
                                        size="small"
                                        style={{
                                            marginTop: "10px",
                                            padding: 10,
                                            width: 120,
                                            backgroundColor:
                                                item.bank_status === "1" ? "#129A50" : "#F7685B",

                                            color: item.bank_status === "1" ? "#EEEEEE" : "#000000",
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}
                </Grid>
            </Paper>

            <Grid container justifyContent="space-between">
                <Paper
                    sx={{
                        p: 2,
                        mt: 2,
                        width: "49%",
                        maxHeight: "500px",
                        overflow: "auto",
                    }}
                >
                    <Typography
                        sx={{ fontSize: "24px", textDecoration: "underline #129A50 3px" }}
                    >
                        รายการรออนุมัติ
                    </Typography>

                    {listWait?.map((item) => (
                        <>
                            <Grid container>
                                <Grid item xs={2} sx={{ mt: 3, ml: 1 }}>
                                    {item.bank_tranfer === "KBNK" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/kbnk.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "TRUEWALLET" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/truemoney.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "KTBA" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/ktba.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "SCB" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/scb.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "BAY" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/bay.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "BBLA" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/bbl.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "GSB" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/gsb.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "TTB" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/ttb.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "BAAC" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/baac.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "ICBC" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/icbc.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "TCD" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/tcd.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "CITI" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/citi.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "SCBT" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/scbt.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "CIMB" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/cimb.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "UOB" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/uob.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "HSBC" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/hsbc.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "MIZUHO" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/mizuho.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "GHB" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/ghb.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "LHBANK" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/lhbank.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "TISCO" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/tisco.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "KKBA" ? (
                                        <Image
                                            src={
                                                "https://the1pg.com/wp-content/uploads/2022/10/kkba.png"
                                            }
                                            alt="scb"
                                            width={50}
                                            height={50}
                                        />
                                    ) : item.bank_tranfer === "IBANK" ? (
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
                                    <Grid item xs={9}>
                                        <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                            {item.bank_tranfer === "KBNK"
                                                ? "ธนาคารกสิกรไทย"
                                                : item.bank_tranfer === "TRUEWALLET"
                                                    ? "TrueMoney"
                                                    : item.bank_tranfer === "KTBA"
                                                        ? "ธนาคารกรุงไทย"
                                                        : item.bank_tranfer === "SCB"
                                                            ? "ธนาคารไทยพาณิชย์"
                                                            : item.bank_tranfer === "BAY"
                                                                ? "ธนาคารกรุงศรีอยุธยา"
                                                                : item.bank_tranfer === "BBLA"
                                                                    ? "ธนาคารกรุงเทพ"
                                                                    : item.bank_tranfer === "GSB"
                                                                        ? "ธนาคารออมสิน"
                                                                        : item.bank_tranfer === "TTB"
                                                                            ? "ธนาคารทหารไทยธนชาต (TTB)"
                                                                            : item.bank_tranfer === "BAAC"
                                                                                ? "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร"
                                                                                : item.bank_tranfer === "ICBC"
                                                                                    ? "ธนาคารไอซีบีซี (ไทย)"
                                                                                    : item.bank_tranfer === "TCD"
                                                                                        ? "ธนาคารไทยเครดิตเพื่อรายย่อย"
                                                                                        : item.bank_tranfer === "CITI"
                                                                                            ? "ธนาคารซิตี้แบงก์"
                                                                                            : item.bank_tranfer === "SCBT"
                                                                                                ? "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)"
                                                                                                : item.bank_tranfer === "CIMB"
                                                                                                    ? "ธนาคารซีไอเอ็มบีไทย"
                                                                                                    : item.bank_tranfer === "UOB"
                                                                                                        ? "ธนาคารยูโอบี"
                                                                                                        : item.bank_tranfer === "HSBC"
                                                                                                            ? "ธนาคารเอชเอสบีซี ประเทศไทย"
                                                                                                            : item.bank_tranfer === "MIZUHO"
                                                                                                                ? "ธนาคารมิซูโฮ คอร์ปอเรต"
                                                                                                                : item.bank_tranfer === "GHB"
                                                                                                                    ? "ธนาคารอาคารสงเคราะห์"
                                                                                                                    : item.bank_tranfer === "LHBANK"
                                                                                                                        ? "ธนาคารแลนด์ แอนด์ เฮ้าส์"
                                                                                                                        : item.bank_tranfer === "TISCO"
                                                                                                                            ? "ธนาคารทิสโก้"
                                                                                                                            : item.bank_tranfer === "KKBA"
                                                                                                                                ? "ธนาคารเกียรตินาคิน"
                                                                                                                                : item.bank_tranfer === "IBANK"
                                                                                                                                    ? "ธนาคารอิสลามแห่งประเทศไทย"
                                                                                                                                    : ""}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography sx={{ fontSize: "14px" }}>
                                            {item?.bank_date}
                                        </Typography>
                                        <Typography sx={{ fontSize: "14px" }}>
                                            {item?.bank_time}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} container justifyContent="center">
                                    <Typography sx={{ fontSize: "16px" }}>
                                        {item?.sms_content}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} container justifyContent="start">
                                    <Typography sx={{ fontSize: "16px", ml: 10, mt: 1 }}>
                                        ช่องทาง :
                                        <Chip
                                            label={
                                                item.title_tranfer === "app" ? (
                                                    <Typography sx={{ fontSize: "14px" }}>
                                                        {item.bank_tranfer === "KBNK"
                                                            ? "ธนาคารกสิกรไทย"
                                                            : item.bank_tranfer === "TRUEWALLET"
                                                                ? "TrueMoney"
                                                                : item.bank_tranfer === "KTBA"
                                                                    ? "ธนาคารกรุงไทย"
                                                                    : item.bank_tranfer === "SCB"
                                                                        ? "ธนาคารไทยพาณิชย์"
                                                                        : item.bank_tranfer === "BAY"
                                                                            ? "ธนาคารกรุงศรีอยุธยา"
                                                                            : item.bank_tranfer === "BBLA"
                                                                                ? "ธนาคารกรุงเทพ"
                                                                                : item.bank_tranfer === "GSB"
                                                                                    ? "ธนาคารออมสิน"
                                                                                    : item.bank_tranfer === "TTB"
                                                                                        ? "ธนาคารทหารไทยธนชาต (TTB)"
                                                                                        : item.bank_tranfer === "BAAC"
                                                                                            ? "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร"
                                                                                            : item.bank_tranfer === "ICBC"
                                                                                                ? "ธนาคารไอซีบีซี (ไทย)"
                                                                                                : item.bank_tranfer === "TCD"
                                                                                                    ? "ธนาคารไทยเครดิตเพื่อรายย่อย"
                                                                                                    : item.bank_tranfer === "CITI"
                                                                                                        ? "ธนาคารซิตี้แบงก์"
                                                                                                        : item.bank_tranfer === "SCBT"
                                                                                                            ? "ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)"
                                                                                                            : item.bank_tranfer === "CIMB"
                                                                                                                ? "ธนาคารซีไอเอ็มบีไทย"
                                                                                                                : item.bank_tranfer === "UOB"
                                                                                                                    ? "ธนาคารยูโอบี"
                                                                                                                    : item.bank_tranfer === "HSBC"
                                                                                                                        ? "ธนาคารเอชเอสบีซี ประเทศไทย"
                                                                                                                        : item.bank_tranfer === "MIZUHO"
                                                                                                                            ? "ธนาคารมิซูโฮ คอร์ปอเรต"
                                                                                                                            : item.bank_tranfer === "GHB"
                                                                                                                                ? "ธนาคารอาคารสงเคราะห์"
                                                                                                                                : item.bank_tranfer === "LHBANK"
                                                                                                                                    ? "ธนาคารแลนด์ แอนด์ เฮ้าส์"
                                                                                                                                    : item.bank_tranfer === "TISCO"
                                                                                                                                        ? "ธนาคารทิสโก้"
                                                                                                                                        : item.bank_tranfer === "KKBA"
                                                                                                                                            ? "ธนาคารเกียรตินาคิน"
                                                                                                                                            : item.bank_tranfer === "IBANK"
                                                                                                                                                ? "ธนาคารอิสลามแห่งประเทศไทย"
                                                                                                                                                : ""}
                                                    </Typography>
                                                ) : (
                                                    "Truemoney Wallet"
                                                )
                                            }
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
                                            label={item.amount}
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
                    {/* <Grid container>
            <Grid container justifyContent="center" sx={{ my: 20 }}>
              <Typography sx={{ fontSize: "24px" }}>
                ไม่มีข้อมูลรายการอนุมัติ
              </Typography>
            </Grid>
          </Grid> */}
                </Paper>

                <Paper
                    sx={{
                        p: 2,
                        mt: 2,
                        width: "49%",
                        maxHeight: "800px",
                        overflow: "auto",
                    }}
                >
                    <Typography
                        sx={{ fontSize: "24px", textDecoration: "underline #129A50 3px" }}
                    >
                        รายการเดินบัญชี
                    </Typography>
                    <>
                        <Grid container>
                            <Grid item xs={2} sx={{ mt: 3, ml: 1 }}>
                                <Image
                                    src={
                                        "https://the1pg.com/wp-content/uploads/2022/10/kbnk.png"
                                    }
                                    alt="scb"
                                    width={50}
                                    height={50}
                                />

                            </Grid>
                            <Grid xs={9} sx={{ mt: 3 }} container>
                                <Grid item xs={9}>
                                    <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                        ธนาคารกสิกรไทย
                                    </Typography>
                                </Grid>
                                <Grid item xs={3} container>
                                    <Typography sx={{ fontSize: "14px" }}>
                                        20/1/2565
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                        15.30
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} container justifyContent="center">
                                <Typography sx={{ fontSize: "16px" }}>
                                    test
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container justifyContent="center">
                                <Chip
                                    label={` 100 บาท`}
                                    size="small"
                                    style={{
                                        marginTop: "10px",
                                        marginBottom: "10px",

                                        padding: 15,
                                        //   width: 120,
                                        backgroundColor: "#129A50",
                                        color: "#EEEEEE",
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} container justifyContent="start">
                                <Typography sx={{ fontSize: "16px", ml: 10 }}>
                                    เครดิตก่อนเติม :
                                    <b>
                                        0
                                    </b>
                                    ฿
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container justifyContent="start">
                                <Typography sx={{ fontSize: "16px", ml: 10 }}>
                                    เครดิตหลังเติม :
                                    <b>
                                        0
                                    </b>
                                    ฿
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container justifyContent="start">
                                <Typography sx={{ fontSize: "16px", ml: 10 }}>
                                    เวลาเติมสำเร็จ : <b> 15.30</b>
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ bgcolor: "#00897B", mt: "15px", mb: 1 }} />
                    </>
                </Paper>
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
                                        label={openDialogView.data?.amount}
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
                                    background: "#129A50",
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