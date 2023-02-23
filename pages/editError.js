import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  TableRow,
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  Table,
  Tabs,
  Tab,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";
import hostname from "../utils/hostname";
import moment from "moment/moment";
import PropTypes from "prop-types";
import Layout from "../theme/Layout";
import withAuth from "../routes/withAuth";
import LoadingModal from "../theme/LoadingModal";
import Swal from "sweetalert2";
import MaterialTableForm from "../components/materialTableForm"
import { useRouter } from "next/router";



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// const useStyles = makeStyles({
//   copy: {
//     "& .MuiButton-text": {
//       "&:hover": {
//         // backgroundColor: "#9CE1BC",
//         // color: "blue",
//         textDecoration: "underline blue 1px",
//       },
//     },
//   },
// });

function editError() {
  const router = useRouter()
  const [value, setValue] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [dataAdmin, setDataAdmin] = useState({})
  const [username, setUsername] = useState("");
  const [cutCredit, setCutCredit] = useState([]);
  const [total, setTotal] = useState({
    sumDeposit: 0,
    sumWithdraw: 0,
  });
  const [creditPromo, setCreditPromo] = useState([]);
  const [upCredit, setUpCredit] = useState([]);
  const [rowData, setRowData] = useState({});

  const [slipCreditTotal, setSlipCreditTotal] = useState(0);
  const [cutCreditTotal, setCutCreditTotal] = useState(0);
  const [addCreditTotal, setAddCreditTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const getDataAdmin = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/admin/admin_profile`,
      });
      let resData = res.data;
      setDataAdmin(resData);
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

  const getTotal = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/report/get_manual_transaction`,
        data: {
          "status_transction": "MANUAL"
        }
      });
      setTotal({
        sumDeposit: res.data.sumDeposit,
        sumWithdraw: res.data.sumWithdraw,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const submitFormCutCredit = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/transaction/create_manual`,
        data: {
          "member_username": rowData.username,
          "amount": rowData.amount,
          "transfer_type": "WITHDRAW",
          "content": rowData.annotation
        },
      });
      getTotal()

      setLoading(false);
      if (res.data.message === "สร้างรายการสำเร็จ") {
        setRowData({})
        Swal.fire({
          position: "center",
          icon: "success",
          title: "ทำรายการเรียบร้อย",
          showConfirmButton: false,
          timer: 2000,
        });
        getTotal()
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitFormCreditPromo = async () => {
    setLoading(true);
    try {
      let now = moment().format("YYYY-MM-DD h:mm");
      let create_by = localStorage.getItem("create_by")
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/api/err_list`,
        data: {
          "credit": "1000",
          "credit_before": "1500",
          "credit_after": "-1000",
          "amount": rowData.amount,
          "amount_before": "1000000",
          "amount_after": "-1000",
          "transfer_by": dataAdmin.name,
          "transfer_type": "WITHDRAW",
          "status_transction": "SUCCESS",
          "status_provider": "SUCCESS",
          "status_bank": "SUCCESS",
          "content": "data.contentQWE",
          "member_uuid": rowData.username,
          "detail": rowData.annotation,
          "detail_bank": "data.detail_bankQWE",
          "slip": "data.test.slipQWE",

          // "max_withdraw": rowData.max_withdraw
        },
      });
      setLoading(false);
      if (res.data.message === "เพิ่มข้อมูลเรียบร้อยแล้ว") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "ทำรายการเรียบร้อย",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitFormSlip = async () => {
    setLoading(true);

    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/transaction/create_manual`,
        data: {
          "member_username": rowData.username,
          "amount": rowData.amount,
          "transfer_type": "DEPOSIT",
          "content": rowData.annotation
        },
      });
      

      setLoading(false);
      if (res.data.message === "สร้างรายการสำเร็จ") {
        setRowData({})
        Swal.fire({
          position: "center",
          icon: "success",
          title: "ทำรายการเรียบร้อย",
          showConfirmButton: false,
          timer: 2000,
        });
        getTotal()
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataAdmin();
    getTotal()
  }, []);

  return (
    <Layout>
      <Box>
        <Paper sx={{ p: 3 }}>
          <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px", mb: 4, }}> เติมเครดิตแบบ manual </Typography>
          <Grid container>

            <Button
              variant="contained"
              onClick={() => {
                setPage(0);
                setRowData({});
              }}
              sx={{
                p: 2,
                mx: 3,
                backgroundColor: page === 0 ? "#41A3E3" : "gray",
                color: "#fff",
              }}
            >
              <Typography>ตัดเครดิต</Typography>
            </Button>
            {/* <Button
              variant="contained"
              onClick={() => {
                setPage(1);
                setRowData({});
              }}
              sx={{
                p: 2,
                mx: 3,
                backgroundColor: page === 1 ? "#41A3E3" : "gray",
                color: "#fff",
              }}
            >
              <Typography>เพิ่มเครดิตโปรโมชั่น</Typography>
            </Button> */}
            <Button
              variant="contained"
              onClick={() => {
                setPage(2);
                setRowData({});
              }}
              sx={{ p: 2, mx: 3, backgroundColor: page === 2 ? "#41A3E3" : "gray", color: "#fff" }}
            >
              <Typography>เติมเครดิต</Typography>
            </Button>


            {page === 0 ? (
              <>
                <Grid container sx={{ mt: 5, ml: 4 }}>
                  <Grid item xs={1} >
                    <Typography>ชื่อผู้ใช้ : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="username"
                      type="text"
                      fullWidth
                      value={rowData.username || ""}
                      size="small"
                      placeholder="Username"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>{" "}
                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid item xs={1} >
                    <Typography >จำนวนเครดิต : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="amount"
                      type="text"
                      fullWidth
                      value={rowData.amount || ""}
                      size="small"
                      placeholder="จำนวนเครดิต"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid item xs={1} >
                    <Typography>หมายเหตุ : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="annotation"
                      type="text"
                      fullWidth
                      placeholder="หมายเหตุ"
                      value={rowData.annotation || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>{" "}


                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    onClick={() => submitFormCutCredit()}
                  >

                    <Typography sx={{ color: '#fff' }}>ยืนยัน</Typography>
                  </Button>
                </Grid>
              </>
            ) : page === 1 ? (
              <>
                <Grid container sx={{ mt: 5, ml: 4 }}>
                  <Grid item xs={1} >
                    <Typography> ชื่อผู้ใช้ : </Typography>
                  </Grid>
                  <Grid item xs={5}  >
                    <TextField
                      name="username"
                      type="text"
                      fullWidth
                      value={rowData.username || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid item xs={1} >
                    <Typography>จำนวนเงิน : </Typography>
                  </Grid>
                  <Grid item xs={5}>

                    <TextField
                      name="amount"
                      type="text"
                      fullWidth
                      value={rowData.amount || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid item xs={1}>
                    <Typography>หมายเหตุ : </Typography>
                  </Grid>
                  <Grid item xs={5}>

                    <TextField
                      name="annotation"
                      type="text"
                      fullWidth
                      value={rowData.annotation || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid item xs={1}>
                    <Typography>อั้นถอน : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="max_withdraw"
                      type="text"
                      fullWidth
                      value={rowData.max_withdraw || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid item xs={1}>
                    <Typography>TURN OVER : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="turn_over"
                      type="text"
                      fullWidth
                      value={rowData.turn_over || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    onClick={() => submitFormCreditPromo()}
                  >
                    <Typography sx={{ color: '#fff' }}>ยืนยัน</Typography>
                  </Button>
                </Grid>
              </>
            ) : (
              <>
                <Grid container sx={{ mt: 5, ml: 4 }}>
                  <Grid xs={1}>
                    <Typography>ชื่อผู้ใช้ : </Typography>
                  </Grid>
                  <Grid item xs={5}>

                    <TextField
                      name="username"
                      type="text"
                      fullWidth
                      value={rowData.username || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>

                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid xs={1}>
                    <Typography>จำนวนเงิน : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="amount"
                      type="number"
                      fullWidth
                      value={rowData.amount || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ mt: 2, ml: 4 }}>
                  <Grid xs={1}>
                    <Typography>หมายเหตุ : </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      name="annotation"
                      type="text"
                      fullWidth
                      value={rowData.annotation || ""}
                      size="small"
                      onChange={(e) => handleChangeData(e)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>


                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Button
                    variant="contained"
                    onClick={() => submitFormSlip()}
                  >
                    <Typography sx={{ color: '#fff' }}>ยืนยัน</Typography>
                  </Button>
                </Grid>
              </>
            )}

          </Grid>




        </Paper>

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px", mb: 3, }} > ยอดรวม </Typography>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ mt: 5 }}>

            <Card sx={{ width: 400, bgcolor: "#101D35", }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: "#eee" }}>เติมเครดิต</Typography>
                <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>  {total.sumDeposit || 0} </Typography>
                <Typography sx={{ color: "#eee", textAlign: "right" }}>เครดิต</Typography>
              </CardContent>
            </Card>

            <Card sx={{ width: 400, bgcolor: "#101D35", }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: "#eee" }}>ตัดเครดิต</Typography>
                <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>  {total.sumWithdraw || 0} </Typography>
                <Typography sx={{ color: "#eee", textAlign: "right" }}>เครดิต</Typography>
              </CardContent>
            </Card>

            <Card sx={{ width: 400, bgcolor: "#101D35", }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: "#eee" }}>เพิ่มเครดิตโปรโมชั่น</Typography>
                <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>  {addCreditTotal || 0} </Typography>
                <Typography sx={{ color: "#eee", textAlign: "right" }}>เครดิต</Typography>
              </CardContent>
            </Card>

          </Grid>
          {/* <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px", mb: 3, }} > ยอดรวม </Typography> */}

          <Button
            variant="text"
            onClick={() => { }}
          >
            <Typography variant="h6" sx={{ textDecoration: "underline #41A3E3 3px", mt: 3 }} onClick={() => router.push("/report/reportError")}>รายงานการการเติมเครดิตแบบ manual</Typography>
          </Button>

        </Paper>


        {/* <Paper sx={{ p: 3, mt: 3 }}>
          <Grid container>
            <Typography variant="h5" sx={{ p: 3 }}>
              รายงานการผิดพลาด
            </Typography>
            <Grid item={true} xs={12} sx={{ mb: 3 }}>
              <TextField
                label="เริ่ม"
                style={{
                  marginRight: "8px",
                  marginTop: "8px",
                  backgroundColor: "white",
                  borderRadius: 4,
                }}
                variant="outlined"
                size=""
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
                  marginTop: "8px",
                  color: "white",
                  backgroundColor: "white",
                  borderRadius: 4,
                }}
                variant="outlined"
                size=""
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
                sx={{ mt: 1, mr: 2 }}
              />
              <Button
                variant="contained"
                style={{ marginRight: "8px", marginTop: 13 }}
                color="primary"
                size="large"
                onClick={() => {
                  getAllError();
                }}
              >
                <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
              </Button>
              <Button
                variant="contained"
                style={{
                  marginRight: "8px",
                  marginTop: 13,
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
                  marginTop: 13,
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
          <Grid>
            <Tabs
              textColor="black"
              indicatorColor="black"
              value={value}
              sx={{
                bgcolor: "#DFE3EA",
                borderRadius: 3,
                mb: 2,
                boxShadow: "2px 2px 10px #737373",
                "& button": { borderRadius: 2 },
                "& button.Mui-selected": {
                  background: "#41A3E3",
                  color: "#EEE",
                },
              }}
              variant="fullWidth"
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="ทั้งหมด"
                {...a11yProps(0)}
              // onClick={() => getAllError()}
              />
              <Tab
                label="ตัดเครดิต"
                {...a11yProps(1)}
              // onClick={() => getCreditCut()}
              />
              <Tab
                label="เพิ่มเครดิตโปรโมชั่น"
                {...a11yProps(2)}
              // onClick={() => getCreditPromo()}
              />
              <Tab
                label="เติมเครดิต"
                {...a11yProps(3)}
              // onClick={() => getUpCredit()}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <MaterialTableForm
                pageSize={10}
                // title="รายการฝาก"
                data={allError}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
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
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MaterialTableForm
                // title="รายการฝาก"
                pageSize={10}
                data={cutCredit}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MaterialTableForm
                // title="รายการฝาก"
                pageSize={10}
                data={creditPromo}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <MaterialTableForm
                // title="รายการฝาก"
                pageSize={10}
                data={upCredit}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
          </Grid>
        </Paper> */}
      </Box>
      <LoadingModal open={loading} />
    </Layout>
  );
}

export default withAuth(editError);
