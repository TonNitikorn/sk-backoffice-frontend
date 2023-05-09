import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Grid,
    Typography,
    Box,
    TextField,
    Card,
    CardContent
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import moment from "moment/moment";
import PropTypes from "prop-types";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";
import Swal from "sweetalert2";
import Layout from '../../theme/Layout'
import MaterialTableForm from "../../components/materialTableForm";



function reportAddCredit() {
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: moment().format("YYYY-MM-DD 00:00"),
        end: moment().format("YYYY-MM-DD 23:59"),
    });
    const [rowData, setRowData] = useState({});
    const [username, setUsername] = useState("");
    const [allError, setAllError] = useState([]);
    const [withdraw, setWithdraw] = useState([]);
    const [deposit, setDeposit] = useState([]);
    const [total, setTotal] = useState({})
    const [loading, setLoading] = useState(false);
    const [filterDeposit, setFilterDeposit] = useState([]);
    const [filterWithdraw, setFilterWithdraw] = useState([])
    const [report, setReport] = useState([]);



    const getRerort = async () => {
        setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/report/manual_transaction`,
                data: {
                    "status_transction": "MANUAL"
                },
            });
            let dataWithdraw = res.data.listWithdraw
            let dataDeposit = res.data.listDeposit

            setReport(res.data)

            // sumData(res.data, res.data.sumCredit)

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
    console.log('report', report)

    const sumData = (transaction, sumCredit) => {
        let dataSuccess = transaction.filter((item) => item.status_transction === 'SUCCESS')
        let dataCancel = transaction.filter((item) => item.status_transction === 'CANCEL')
        let sumSuccess = []
        let sumCancel = []
        let sumPrice = 0
        let price = []

        for (const item of dataSuccess) {
            sumSuccess.push(parseInt(item.credit))
        }

        let success = sumSuccess.reduce((a, b) => a + b, 0)

        for (const item of dataCancel) {
            sumCancel.push(parseInt(item.credit))
        }

        let cancel = sumCancel.reduce((a, b) => a + b, 0)

        for (const item of transaction) {
            price.push(item.amount)
        }
        sumPrice = price.reduce((a, b) => a + b, 0)

        setTotal({
            totalList: transaction.length,
            sumPrice: Intl.NumberFormat("TH").format(parseInt(parseInt(sumPrice))),
            sumCredit: Intl.NumberFormat("TH").format(parseInt(parseInt(sumCredit))),
            totalSuccess: dataSuccess.length,
            totalCancel: dataCancel.length,
            sumSuccess: Intl.NumberFormat("TH").format(parseInt(success)),
            sumCancel: Intl.NumberFormat("TH").format(parseInt(cancel)),
            sumTotal: Intl.NumberFormat("TH").format(parseInt(cancel + success))
        })
    }

    const filterData = (type) => {
        if (type === "deposit") {
            setFilterWithdraw([])
            setFilterDeposit(report.listDeposit)
        }
        if (type === "withdraw") {
            setFilterDeposit([])
            setFilterWithdraw(report.listWithdraw)
        }
    }

    const columns = [
        {
            field: "no",
            title: "ลำดับ",
            maxWidth: 80,
            align: "center",
        },
        {
            field: "transfer_type",
            title: "รายการ",
            align: "center",
            minWidth: "120px",
        },
        {
            field: "username",
            title: "Username",
            align: "center",
        },


        {
            field: "credit",
            title: "เครดิตที่ทำรายการ",
            align: "center",
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{Intl.NumberFormat("TH").format(parseInt(item.credit))}</Typography>
            ),
        },
        {
            field: "credit_before",
            title: "เครดิตก่อนเติม",
            align: "center",
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{Intl.NumberFormat("TH").format(parseInt(item.credit_before))}</Typography>
            ),
        },

        {
            field: "credit_after",
            title: "เครดิตหลังเติม",
            align: "center",
            render: (item) => (
                <Typography
                    style={{
                        fontSize: '14px'
                    }}
                >{Intl.NumberFormat("TH").format(parseInt(item.credit_after))}</Typography>
            ),
        },
        {
            field: "create_at",
            title: "วันที่",
            align: "center",
        },
        {
            field: "transfer_by",
            title: "ทำรายการโดย",
            align: "center",
        },
        {
            field: "content",
            title: "หมายเหตุ",
            align: "center",
        }

    ]

    useEffect(() => {
        getRerort()
    }, [])


    return (
        <Layout>
            <Paper sx={{ p: 3, }}>
                <Grid container>
                    <Typography
                        sx={{
                            fontSize: "24px",
                            textDecoration: "underline #41A3E3 3px",
                            mb: 2,
                        }}
                    >
                        รายงานการเติมเครดิตโดยแอดมิน
                    </Typography>

                    <Grid xs={12} sx={{ mb: 3 }}>
                        <TextField
                            label="เริ่ม"
                            style={{
                                marginRight: "8px",
                                backgroundColor: "white",
                                borderRadius: 4,
                            }}
                            variant="outlined"
                            size="small"
                            type="datetime-local"
                            name="start"
                            value={selectedDateRange.start}
                            onChange={(e) => {
                                setSelectedDateRange({
                                    ...selectedDateRange,
                                    [e.target.name]: e.target.value,
                                });
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="สิ้นสุด"
                            style={{
                                marginRight: "8px",
                                color: "white",
                                backgroundColor: "white",
                                borderRadius: 4,
                            }}
                            variant="outlined"
                            size="small"
                            type="datetime-local"
                            name="end"
                            value={selectedDateRange.end}
                            onChange={(e) => {
                                setSelectedDateRange({
                                    ...selectedDateRange,
                                    [e.target.name]: e.target.value,
                                });
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                        <TextField
                            name="username"
                            type="text"
                            value={username || ""}
                            label="ค้นหาโดยใช้ Username"
                            placeholder="ค้นหาโดยใช้ Username"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 2 }}
                        />
                        <Button
                            variant="contained"
                            style={{ marginRight: "8px" }}
                            color="primary"
                            size="large"
                            onClick={() => {
                                getRerort();
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                marginRight: "8px",
                                backgroundColor: "#FFB946",
                            }}
                            size="large"
                            onClick={async () => {
                                let start = moment()
                                    .subtract(1, "days")
                                    .format("YYYY-MM-DD 00:00");
                                let end = moment()
                                    .subtract(1, "days")
                                    .format("YYYY-MM-DD 23:59");
                                getAllError("yesterday", start, end);
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>เมื่อวาน</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                marginRight: "8px",
                                backgroundColor: "#129A50",
                            }}
                            size="large"
                            onClick={async () => {
                                let start = moment().format("YYYY-MM-DD 00:00");
                                let end = moment().format("YYYY-MM-DD 23:59");
                                getAllError("today", start, end);
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>วันนี้</Typography>
                        </Button>
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mt: 2, mb: 3 }}
                >

                    <Card sx={{ width: 250, bgcolor: '#0072B1', }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#eee" }}>จำนวนรายการ</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#ffff", mt: 2 }}>
                                {Intl.NumberFormat("TH").format(parseInt(total.totalList))}
                            </Typography>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Button
                                    sx={{ color: "#eee" }}>
                                    <Typography>เครดิต</Typography>
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: 250, bgcolor: "#101D35" }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#eee" }}>การเติมเครดิต</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                                {Intl.NumberFormat("TH").format(parseInt(total.totalSuccess))}</Typography>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Button
                                    sx={{ color: "#eee" }}
                                    onClick={() => filterData('deposit')}>
                                    <Typography sx={{ textDecoration: "underline" }}>ดูเพิ่มเติม..</Typography>

                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: 250, bgcolor: "#101D35" }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#eee" }}>การตัดเครดิต</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                                {Intl.NumberFormat("TH").format(parseInt(total.totalCancel))} </Typography>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Button
                                    sx={{ color: "#eee" }}
                                    onClick={() => filterData('withadraw')}>
                                    <Typography sx={{ textDecoration: "underline" }}>ดูเพิ่มเติม..</Typography>
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: 250, bgcolor: "#101D35" }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#eee" }}>ยอดรวมเงินทั้งหมด</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                                {Intl.NumberFormat("TH").format(parseInt(total.sumTotal))}  </Typography>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Button
                                    sx={{ color: "#eee" }}>
                                    <Typography>เครดิต</Typography>
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: 250, bgcolor: "#101D35" }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#eee" }}>ยอดรวมเงินสำเร็จ</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                                {Intl.NumberFormat("TH").format(parseInt(total.sumSuccess))}  </Typography>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Button
                                    sx={{ color: "#eee" }}>
                                    <Typography>เครดิต</Typography>
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ width: 250, bgcolor: "#101D35" }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ color: "#eee" }}>ยอดรวมเงินยกเลิก</Typography>
                            <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                                {Intl.NumberFormat("TH").format(parseInt(total.sumCancel))}   </Typography>
                            <Grid sx={{ textAlign: 'right' }}>
                                <Button
                                    sx={{ color: "#eee" }}>
                                    <Typography>เครดิต</Typography>
                                </Button>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <MaterialTableForm
                    // title="รายการฝาก"
                    pageSize={10}
                    data={filterDeposit.length > 0 ? filterDeposit : filterWithdraw.length > 0 ? filterWithdraw : report}

                    columns={columns}
                />


            </Paper>
        </Layout>
    )
}

export default reportAddCredit
