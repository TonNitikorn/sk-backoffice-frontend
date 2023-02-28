import Layout from "../theme/Layout";
import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Grid,
    Typography,
    Box,
    TextField,
    Chip,
    Card,
    CardContent
} from "@mui/material";
import axios from "axios";
import hostname from "../utils/hostname";
import MaterialTableForm from "../components/materialTableForm";
import withAuth from "../routes/withAuth";
import moment from "moment/moment";
import Swal from "sweetalert2";
import LoadingModal from "../theme/LoadingModal";

function withdraw() {
    const [username, setUsername] = useState("");
    const [dataUser, setDataUser] = useState({});
    const [dataCredit, setDataCredit] = useState({});
    const [deposit, setDeposit] = useState([]);
    const [promotion, setPromotion] = useState({});
    const [depositLast, setDepositLast] = useState({});
    const [rowData, setRowData] = useState({});
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState([])

    const handleChangeData = async (e) => {
        setRowData({ ...rowData, [e.target.name]: e.target.value });
    };

    const searchUser = async () => {
        setLoading(true);

        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/member/member_transaction`,
                data: {
                    username: username
                }
            });

            // setDeposit(res.data.deposit_latest);
            // setDataCredit(res.data.user[0]);
            let userData = res.data
            let lastDataUser = { ...userData, fullname: userData.fname + ' ' + userData.lname }

            setDataUser(lastDataUser);
            let resTran = res.data.transaction
            let no = 1
            resTran.map((item) => {
                item.no = no++;
                item.create_at = moment(item.create_at).format('DD/MM/YYYY hh:mm')
            })
            setTransaction(resTran)

            // setPromotion(res.data.deposit_latest_one_with_promotion?.promotion);
            // setDepositLast(res.data.deposit_latest_one_with_promotion?.deposit_last);
            setLoading(false);
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
    };
    const submitWithdraw = async () => {

        setLoading(true);
        try {
            if (parseInt(dataUser.credit) >= parseInt(rowData.amount)) {
                let res = await axios({
                    headers: { Authorization: "Bearer " + localStorage.getItem("access_token") },
                    method: "post",
                    url: `${hostname}/transaction/withdraw_request`,
                    data: {
                        amount: rowData.amount,
                        username: username,
                    },
                });

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "ทำรายการเรียบร้อย",
                    showConfirmButton: false,
                    timer: 2500,
                });
                setRowData({});
                setUsername("");
                setDataUser({})
                setLoading(false);
            } else if (!!rowData.amount) {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "กรุณาระบุเครดิตที่ต้องการถอน",
                    showConfirmButton: false,
                    timer: 2500,
                });
            } else {
                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "ยอดเครดิตไม่เพียงพอ",
                    showConfirmButton: false,
                    timer: 2500,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        {
            title: "ลำดับที่",
            field: "no",
            search: true,
            width: "10%",
            align: "center",
        },
        {
            title: "เงินฝาก",
            field: "amount",
            search: true,
            // width: "10%",
            align: "center",
        },
        // {
        //     title: "โบนัส",
        //     field: "bonus_credit",
        //     search: true,
        //     // width: "10%",
        //     align: "center",
        //     render: (item) => (
        //         <Chip
        //             label={item.bonus_credit}
        //             size="small"
        //             style={{
        //                 background: "#109CF1",
        //                 color: "#ffff",
        //             }}
        //         />
        //     ),
        // },
        {
            title: "เครดิตก่อนเติม",
            field: "credit_before",
            search: true,
            // width: "10%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.credit_before}
                    size="small"
                    style={{
                        background: "#FFB946",
                        color: "#ffff",
                    }}
                />
            ),
        },

        {
            title: "เครดิตหลังเติม",
            field: "credit_after",
            search: true,
            // width: "30%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.credit_after}
                    size="small"
                    style={{
                        background: "#00B900",
                        color: "#ffff",
                    }}
                />
            ),
        },

        {
            title: "เวลา",
            field: "create_at",
            search: true,
            align: 'center',
            // width: "30%",
            align: "center",
        },
        {
            title: "หมายเหตุ",
            field: "annotation",
            align: 'center',
            search: true,
            // width: "30%",
            align: "center",
        },
    ];

    useEffect(() => { }, [rowData.amount]);

    return (
        <Layout>
            <Paper sx={{ mb: 5, p: 3 }}>
                <Typography
                    sx={{
                        fontSize: "24px",
                        textDecoration: "underline #41A3E3 3px",
                    }}
                >
                    สร้างรายการถอน
                </Typography>
            </Paper>
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <Paper>
                        <Grid container sx={{ textAlign: "center" }} spacing={3}>
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
                                    Username :{" "}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name="username"
                                    type="text"
                                    fullWidth
                                    value={username || ""}
                                    size="small"
                                    onChange={(e) => setUsername(e.target.value)}
                                    variant="outlined"
                                />{" "}
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => searchUser()}
                                >
                                    <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>

                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <Box sx={{ p: 5 }}>
                                    <Typography>ชื่อ-สกุล</Typography>
                                    <TextField
                                        name="username"
                                        type="text"
                                        fullWidth
                                        value={dataUser?.fullname || ''}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>ธนาคาร</Typography>
                                    <TextField
                                        name="bank_name"
                                        type="text"
                                        fullWidth
                                        value={dataUser?.bank_name || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>เครดิตปัจจุบัน</Typography>
                                    <TextField
                                        name="credit"
                                        type="text"
                                        fullWidth
                                        value={Intl.NumberFormat("TH").format(parseInt(dataUser?.credit || "ไม่มีเครดิต"))}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ p: 5 }}>
                                    <Typography>หมายเลขโทรศัพท์</Typography>
                                    <TextField
                                        name="tel"
                                        type="text"
                                        fullWidth
                                        value={dataUser?.tel || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>เลขบัญชี</Typography>
                                    <TextField
                                        name="bank_number"
                                        type="text"
                                        fullWidth
                                        value={dataUser?.bank_number || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>จำนวนเงินที่จะถอน</Typography>
                                    <TextField
                                        name="amount"
                                        type="number"
                                        fullWidth
                                        value={rowData.amount || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                    // disabled
                                    />{" "}
                                    <Box sx={{ textAlign: "right" }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => submitWithdraw()}
                                        >
                                            <Typography sx={{ color: '#ffff' }}>ยืนยันทำรายการ</Typography>

                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>

                    </Paper>
                    <Card fullWidth
                        sx={{
                            bgcolor: "#101D35",
                        }}
                    >
                        <CardContent>
                            <Typography component="div" sx={{ color: "#eee" }}>
                                Turn Type
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{ textAlign: "center", color: "#41A3E3" }}
                            >-
                                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
                            </Typography>
                            <Typography
                                component="div"
                                sx={{ color: "#eee", textAlign: "right" }}
                            >
                                บาท
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card fullWidth sx={{ mt: 4, bgcolor: "#101D35", }}>
                        <CardContent>
                            <Typography component="div" sx={{ color: "#eee" }}> ยอดเครดิตที่ต้องทำ</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3" }} >-{/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}</Typography>
                            <Typography component="div" sx={{ color: "#eee", textAlign: "right" }}> บาท</Typography>
                        </CardContent>
                    </Card>
                    <Card fullWidth sx={{ mt: 3, bgcolor: "#101D35", }}>
                        <CardContent>
                            <Typography component="div" sx={{ color: "#eee" }}>Total</Typography>

                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3" }}
                            >-
                                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
                            </Typography>
                            <Typography
                                component="div"
                                sx={{ color: "#eee", textAlign: "right", }}
                            >
                                บาท
                            </Typography>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            <Grid style={{ marginTop: "20px" }}>
                <MaterialTableForm pageSize={10} data={transaction} columns={columns} />
            </Grid>
            <LoadingModal open={loading} />
        </Layout>
    );
}

export default withdraw;
