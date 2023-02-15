import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Grid,
    Typography,
    CardContent,
    Chip,
    Card,
    DialogActions,
    Dialog,
    TextField,
    DialogTitle,
    DialogContent,
    Box,
    IconButton,
} from "@mui/material";
import Layout from "../../theme/Layout";
import MaterialTableForm from "../../components/materialTableForm"
import LoadingModal from "../../theme/LoadingModal";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import hostname from "../../utils/hostname";
import withAuth from "../../routes/withAuth";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Image from "next/image";
import member from "../../assets/member.png";
import vip from "../../assets/vip.png";
import superVip from "../../assets/super.png";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function ranking() {
    const [username, setUsername] = useState("");
    const [dataUser, setDataUser] = useState({});
    const [dataCredit, setDataCredit] = useState({});
    const [deposit, setDeposit] = useState([]);
    const [promotion, setPromotion] = useState({});
    const [depositLast, setDepositLast] = useState({});
    const [rowData, setRowData] = useState({});
    const [boxData, setBoxData] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = React.useState(false);
    const [point, setPoint] = useState(1020)
    const [exp, setExp] = useState(1900)
    const [openHistory, setOpenHistory] = useState(false)

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleChangeData = async (e) => {
        setRowData({ ...rowData, [e.target.name]: e.target.value });
    };
    const getProfile = async () => {
        // setLoading(true);
        // try {
        // let res = await axios({
        // headers: {
        // Authorization: "Bearer " + localStorage.getItem("access_token"),
        // },
        // method: "post",
        // url: `https://api-007bet.superfast-auto.com/admin/api/member_transaction/check-data/${username}`,
        // });

        // setDeposit(res.data.deposit_latest);
        // setDataCredit(res.data.user[0]);
        // setDataUser(res.data.info);
        // setPromotion(res.data.deposit_latest_one_with_promotion.promotion);
        // setDepositLast(res.data.deposit_latest_one_with_promotion.deposit_last);
        // setBoxData(1);
        // setLoading(false);
        // } catch (error) {
        // if (
        //   error.response.data.error.status_code === 401 &&
        //   error.response.data.error.message === "Unauthorized"
        // ) {
        //   dispatch(signOut());
        //   localStorage.clear();
        //   router.push("/auth/login");
        // }
        // console.log(error);
        // }
        if (!!username) {
            let temp = []
            temp = data.filter(item => item.username === username)
            setData(temp)
        }

    };

    const [data, setData] = useState([
        {
            no: 1,
            name: "fistname lastname",
            rank: "VIP",
            point_use: "100",
            exp: "230",
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 2,
            name: "K9X V1",
            rank: "MEMBER",
            point_use: "210",
            exp: "200",
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 3,
            name: "K9X V2",
            rank: "MEMBER",
            point_use: "100",
            exp: "200",
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 4,
            name: "K9X V3",
            rank: "VIP",
            point_use: "1020",
            exp: "1,900",
            username: 'test123'
        },
        {
            no: 5,
            name: "test",
            rank: "SUPER VIP",
            point_use: "1020",
            exp: "1,900",
            username: 'testtesttest'
        },
    ])

    const columns = [
        {
            title: "no",
            field: "no",
            width: "80px",
            align: "center",
        },
        {
            title: "ชื่อ-สกุล",
            field: "name",
            search: true,
            width: "25%",
            align: "center",
        },
        {
            title: "Username",
            field: "username",
            search: true,
            width: "20%",
            align: "center",
        },
        {
            title: "Rank",
            field: "rank",
            search: true,
            width: "15%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.rank}
                    size="small"
                    style={{
                        background: "#109CF1",
                        color: "#ffff",
                        padding: 10,
                        minWidth: "120px"
                    }}
                />
            ),
        },
        {
            title: "Point",
            field: "point_use",
            search: true,
            width: "15%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.point_use}
                    size="small"
                    style={{
                        background: "#FFB946",
                        color: "#ffff",
                        padding: 10,
                        minWidth: "120px"

                    }}
                />
            ),
        },

        {
            title: "EXP.",
            field: "exp",
            search: true,
            width: "15%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.exp}
                    size="small"
                    style={{
                        background: "#00B900",
                        color: "#ffff",
                        padding: 10,
                        minWidth: "120px"
                    }}


                />
            ),
        },

        {
            title: "Edit",
            field: "bank_time",
            search: true,
            width: "10%",
            align: "center",
            render: (item) => (
                <>
                    <Button sx={{ color: "" }}>
                        <EditIcon onClick={() => setOpen(true)} />
                    </Button>

                </>
            ),
        },
        {
            title: "History",
            field: "bank_time",
            search: true,
            width: "10%",
            align: "center",
            render: (item) => (
                <>
                    <Button sx={{ color: "" }}>
                        <ManageSearchIcon onClick={() => setOpenHistory(true)} />
                    </Button>

                </>
            ),
        },
    ];

    const [datahistory, setDataHistory] = useState([
        {
            no: 1,
            name: "fistname lastname",
            rank: "VIP",
            point_use: "100",
            detail: 'แลกแต้ม ',
            exp: "230",
            point_use: 100,
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 2,
            name: "K9X V1",
            rank: "MEMBER",
            detail: 'แลกแต้ม ',
            point_use: "210",
            point_use: 50,
            exp: "200",
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 3,
            name: "K9X V2",
            rank: "MEMBER",
            detail: 'แลกแต้ม ',
            point_use: "100",
            point_use: 110,
            exp: "200",
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 4,
            name: "K9X V3",
            rank: "VIP",
            detail: 'แลกแต้ม ',
            point_use: "1020",
            point_use: 10,
            exp: "1,900",
            username: 'K9X_LOSOMONIC'
        },
        {
            no: 5,
            name: "test",
            rank: "SUPER VIP",
            detail: 'แลกแต้ม ',
            point_use: "1020",
            point_use: 200,
            exp: "1,900",
            username: 'K9X_LOSOMONIC'
        },
    ])

    const columnsHistory = [
        {
            title: "no",
            field: "no",
            width: "80px",
            align: "center",
        },
        {
            title: "Username",
            field: "username",
            search: true,
            width: "20%",
            align: "center",
        },
        {
            title: "รายการ",
            field: "detail",
            search: true,
            width: "20%",
            align: "center",
        },
        {
            title: "Point ที่ใช้ไป",
            field: "point_use",
            search: true,
            width: "15%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.point_use}
                    size="small"
                    style={{
                        background: "#FFB946",
                        color: "#ffff",
                        padding: 10,
                        minWidth: "120px"

                    }}
                />
            ),
        },

        {
            title: "EXP.",
            field: "exp",
            search: true,
            width: "15%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.exp}
                    size="small"
                    style={{
                        background: "#00B900",
                        color: "#ffff",
                        padding: 10,
                        minWidth: "120px"
                    }}

                />
            ),
        },


    ];

    return (
        <Layout>
            <Paper sx={{ p: 3 }}>
                <Typography
                    sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
                >
                    Ranking Management
                </Typography>
                <Grid
                    container
                    direction="row"
                    justifyContent="start"
                    alignItems="center"
                    sx={{ textAlign: "right", my: 2 }}
                    spacing={3}
                >
                    <Grid item xs={3}>
                        <TextField
                            name="username"
                            type="text"
                            fullWidth
                            label="ค้นหาโดย username"
                            value={username || ""}
                            placeholder="username"
                            size="small"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                        />{" "}
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" fullWidth onClick={() => getProfile()}>
                            <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>

                        </Button>
                    </Grid>
                </Grid>
                {boxData === 1 ? (
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ my: 2 }}
                    >
                        <Card sx={{ minWidth: 200, mx: 2, }}>
                            <CardContent sx={{ bgcolor: "#2C4065" }}>
                                <Typography component="div" sx={{ color: "#00DCF9" }}>ชื่อผู้ใช้</Typography>
                                <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                    firstname lastname
                                    {/* {sumperson.person_total} */}
                                    {/* {roundListCal?.length === undefined ? 0 : Intl.NumberFormat("THB").format(roundListCal?.length)} */}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{ textAlign: "right", color: "#eee" }}
                                > </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                minWidth: 200,
                                mx: 2,
                            }}
                        >
                            <CardContent sx={{ bgcolor: "#2C4065" }}>
                                <Typography component="div" sx={{ color: "#00DCF9" }}>
                                    Rank
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ mt: 3, textAlign: "center", color: "#eee" }}
                                >
                                    VIP
                                    {/* {sumperson.person_total} */}
                                    {/* {roundListCal?.length === undefined ? 0 : Intl.NumberFormat("THB").format(roundListCal?.length)} */}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{ textAlign: "right", color: "#eee" }}
                                ></Typography>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                minWidth: 200,
                                mx: 2,
                            }}
                        >
                            <CardContent sx={{ bgcolor: "#2C4065" }}>
                                <Typography component="div" sx={{ color: "#00DCF9" }}>
                                    Point ที่ใช้ไป
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ mt: 3, textAlign: "center", color: "#eee" }}
                                >
                                    500
                                    {/* {sumperson.person_total} */}
                                    {/* {roundListCal?.length === undefined ? 0 : Intl.NumberFormat("THB").format(roundListCal?.length)} */}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{ textAlign: "right", color: "#eee" }}
                                >
                                    point
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                minWidth: 200,
                                mx: 2,
                            }}
                        >
                            <CardContent sx={{ bgcolor: "#2C4065" }}>
                                <Typography component="div" sx={{ color: "#00DCF9" }}>
                                    Point คงเหลือ
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ mt: 3, textAlign: "center", color: "#eee" }}
                                >
                                    100
                                    {/* {sumperson.person_total} */}
                                    {/* {roundListCal?.length === undefined ? 0 : Intl.NumberFormat("THB").format(roundListCal?.length)} */}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{ textAlign: "right", color: "#eee" }}
                                >
                                    point
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card
                            sx={{
                                minWidth: 200,
                                mx: 2,
                            }}
                        >
                            <CardContent sx={{ bgcolor: "#2C4065" }}>
                                <Typography component="div" sx={{ color: "#00DCF9" }}>
                                    จำนวนผู้ใช้
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{ mt: 3, textAlign: "center", color: "#eee" }}
                                >
                                    500
                                    {/* {sumperson.person_total} */}
                                    {/* {roundListCal?.length === undefined ? 0 : Intl.NumberFormat("THB").format(roundListCal?.length)} */}
                                </Typography>
                                <Typography
                                    component="div"
                                    sx={{ textAlign: "right", color: "#eee" }}
                                >
                                    ครั้ง
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ) : (
                    ""
                )}

                <MaterialTableForm
                    data={data}
                    pageSize={15}
                    columns={columns} />
            </Paper>

            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle >
                    <Typography variant="h5">การจัดการ</Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}>
                        <Grid item xs={4} sx={{ textAlign: 'center' }}>
                            <Image
                                src={member}
                                width={250}
                                height={250}
                            />
                            <Typography variant="h5" sx={{ color: '#4CAEE3', fontWeight: 'bold' }}> MEMBER</Typography>
                        </Grid>
                        <Grid item xs={7}>
                            <Paper sx={{ p: 3 }} elevation={3}>
                                <Typography variant="h6">ชื่อ : K9X V3 </Typography>
                                <Typography variant="h6">Username : test123</Typography>

                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    sx={{ mt: 3 }}
                                >
                                    <Grid item xs={2}>
                                        <Typography variant="h6">Point</Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField
                                            label=""
                                            variant="outlined"
                                            value={rowData.point || ''}
                                            onChange={(e) => handleChangeData(e)}
                                            name="point"
                                            fullWidth
                                            sx={{ mt: 1, }}
                                            inputProps={{
                                                style: { fontSize: 20 },
                                            }}
                                        />
                                    </Grid>

                                    <Grid item xs={2}>
                                        <Typography variant="h6">EXP.</Typography>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <TextField
                                            label=""
                                            name="exp"
                                            variant="outlined"
                                            value={rowData.exp || ''}
                                            onChange={(e) => handleChangeData(e)}
                                            fullWidth
                                            sx={{ mt: 1, }}
                                            inputProps={{
                                                style: { fontSize: 20 },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>


                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">ยกเลิก</Button>
                    <Button onClick={handleClose} variant="outlined" sx={{ bgcolor: '#4CAEE3', color: '#ffff' }}>
                        ยืนยัน
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                fullWidth
                maxWidth="md"
                open={openHistory}
                onClose={() => setOpenHistory(false)}
            >
                <DialogTitle >
                    <Typography variant="h5">History</Typography>
                </DialogTitle>
                <DialogContent>
                    <MaterialTableForm
                        data={datahistory}
                        pageSize={15}
                        columns={columnsHistory} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenHistory(false)} variant="outlined">ปิด</Button>

                </DialogActions>
            </Dialog>
            <LoadingModal open={loading} />
        </Layout>
    );
}

export default withAuth(ranking);
