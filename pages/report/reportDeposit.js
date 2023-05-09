import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  Snackbar,
  Alert,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import Layout from "../../theme/Layout";
import moment from "moment";
import MaterialTableForm from "../../components/materialTableForm"
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from "axios";
import hostname from "../../utils/hostname";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
// import { makeStyles } from "@mui/styles";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";

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

function reportDeposit() {
  // const classes = useStyles();
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [username, setUsername] = useState("");
  const [report, setReport] = useState([]);
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState({})
  const [loading, setLoading] = useState(false);
  const [typeList, setTypeList] = useState({})
  const [filterSuccess, setFilterSuccess] = useState([]);
  const [filterCancel, setFilterCancel] = useState([])

  const handleClickSnackbar = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };
  const getReport = async (type, start, end) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/report/get_transaction`,

        data: {
          "create_at_start": type === undefined ? selectedDateRange.start : start,
          "create_at_end": type === undefined ? selectedDateRange.end : end,
          "transfer_type": "DEPOSIT",
          "username": username
        }
      });

      let resData = res.data;
      let transaction = res.data.transaction
      let no = 1;
      transaction.map((item) => {
        item.no = no++;
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
        item.bank_name = item.members?.bank_name
        item.bank_number = item.members?.bank_number
        item.username = item.members?.username
        // item.credit = Intl.NumberFormat("TH").format(parseInt(item.credit))
        // item.credit_after = Intl.NumberFormat("TH").format(parseInt(item.credit_after))
        // item.credit_before = Intl.NumberFormat("TH").format(parseInt(item.credit_before))
      });

     
      
      sumData(transaction,res.data.sumCredit)
      setReport(transaction);
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

  const sumData = (transaction,sumCredit) => {
    let dataTypeManual = transaction.filter((item) => item.status_transction === "MANUAL")
    let dataTypeAuto = transaction.filter((item) => item.status_transction === "AUTO")

    let sumManual = []
    let sumAuto = []
    let sumPrice = 0
    let price = []

    for (const item of dataTypeManual) {
      sumManual.push(parseInt(item.credit))
    }

    let manual = sumManual.reduce((a, b) => a + b, 0)

    for (const item of dataTypeAuto) {
      sumAuto.push(parseInt(item.credit))
    }

    let auto = sumAuto.reduce((a, b) => a + b, 0)

    for (const item of transaction) {
      price.push(item.amount)
    }

    sumPrice = price.reduce((a, b) => a + b, 0)

    setTotal({
      totalList: transaction.length,
      sumPrice: parseInt(Intl.NumberFormat("TH").format(parseInt(sumPrice))),
      sumCredit: parseInt(Intl.NumberFormat("TH").format(parseInt(sumCredit))),
      typeManual: dataTypeManual.length,
      typeAuto: dataTypeAuto.length,
      sumManual: Intl.NumberFormat("TH").format(parseInt(manual)),
      sumAuto: Intl.NumberFormat("TH").format(parseInt(auto)),
      sumTotal : Intl.NumberFormat("TH").format(parseInt(manual,auto))
    })
  }

  const filterData = (type) => {
    if (type === "manual") {
      setFilterCancel([])
      let data = report.filter((item) => item.status_transction === "MANUAL")
      setFilterSuccess(data)
    }
    if (type === "auto") {
      setFilterSuccess([])
      let data = report.filter((item) => item.status_transction === "AUTO")
      setFilterCancel(data)
    }
  }

  useEffect(() => {
    getReport();
  }, []);

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px", mb: 2, }}> รายการฝาก</Typography>

        <Grid container>
          <Grid item={true} xs={12} sx={{ mb: 3 }}>
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
              style={{ marginRight: "8px", }}
              color="primary"
              size="large"
              onClick={() => {
                setFilterSuccess([])
                setFilterCancel([])
                getReport();
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
              size=""
              onClick={async () => {

                let start = moment().subtract(1, "days").format("YYYY-MM-DD 00:00");
                let end = moment().subtract(1, "days").format("YYYY-MM-DD 23:59");
                setFilterSuccess([])
                setFilterCancel([])
                getUser("yesterday", start, end);
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
              size=""
              onClick={async () => {
                let start = moment().format("YYYY-MM-DD 00:00");
                let end = moment().format("YYYY-MM-DD 23:59");
                setFilterSuccess([])
                setFilterCancel([])
                getUser("today", start, end);
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
          sx={{ mt: 4, mb: 4 }}>

          <Card sx={{ width: 250, bgcolor: "#101D35", }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#FFB946" }}>จำนวนรายการ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>{total.totalList} </Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => { }}>
                  <Typography >รายการ</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35", }} >
            <CardContent>
              <Typography variant="h7" sx={{ color: "#FFB946" }}>จำนวนรายการฝากแบบเติมมือ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>  {total.typeManual} </Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => filterData('manual')}>
                  <Typography sx={{ textDecoration: "underline" }}>ดูเพิ่มเติม..</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35", }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#FFB946" }}>จำนวนรายการฝากแบบอัตโนมัติ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>  {total.typeAuto} </Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => filterData('auto')}>
                  <Typography sx={{ textDecoration: "underline" }}>ดูเพิ่มเติม..</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35", }}>
            <CardContent>
              <Typography variant="h7" sx={{color : '#2ECC71'}}>ยอดรวมฝากทั้งหมด</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}> {total.sumTotal}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => { }}>
                  <Typography >บาท</Typography>
                </Button>
              </Grid>

            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35", }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#2ECC71" }}>ยอดรวมฝากแบบเติมมือ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}> {total.sumManual}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => { }}>
                  <Typography >บาท</Typography>
                </Button>
              </Grid>

            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35", }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#2ECC71" }}>ยอดรวมฝากแบบอัตโนมัติ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>  {total.sumAuto}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => { }}>
                  <Typography >บาท</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>



        </Grid>

        <MaterialTableForm
          pageSize={10}
          data={filterSuccess.length > 0 ? filterSuccess : filterCancel.length > 0 ? filterCancel : report}
          columns={[
            {
              field: "no",
              title: "ลำดับ",
              maxWidth: 80,
              align: "center",
            },
            {
              field: "bank_name",
              title: "ธนาคาร",
              align: "center",
              minWidth: "240px",
              render: (item) => (
                <Grid container>
                  <Grid item xs={3} sx={{ mt: 1 }}>
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
                    )}
                  </Grid>
                  <Grid sx={{ ml: 2, mt: 1, textAlign: "center" }}>
                    <CopyToClipboard text={item.bank_number}>
                      <div >
                        <Button
                          sx={{
                            p: 0,
                            color: "blue",
                          }}
                          onClick={handleClickSnackbar}
                        >
                          <Typography sx={{ fontSize: "14px" }}>
                            {item.bank_number}
                          </Typography>
                        </Button>
                      </div>
                    </CopyToClipboard>
                    <Typography sx={{ fontSize: "14px" }}>
                      {" "}
                      {item.bank_name}
                    </Typography>
                  </Grid>
                  {/* <Grid container justifyContent="center">
                    <Typography sx={{ fontSize: "14px" }}>
                      {item.name}
                    </Typography>
                  </Grid> */}
                </Grid>
              ),
            },
            {
              field: "username",
              title: "ชื่อผู้ใช้งาน",
              align: "center",
              render: (item) => (
                <CopyToClipboard text={item.username}>
                  <div >
                    <Button
                      sx={{
                        fontSize: "14px",
                        p: 0,
                        color: "blue",
                      }}
                      onClick={handleClickSnackbar}
                    >
                      {item.username}
                    </Button>
                  </div>
                </CopyToClipboard>
              ),
            },
            {
              field: "credit",
              title: "ยอดเงิน",
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
              field: "create_at",
              title: "เวลาทำรายการ",
              align: "center",
              width: '200px'
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
              title: "โบนัส",
              align: "center",
              render: (item) => (
                <Chip
                  label={item.bonus === 1 ? "รับโบนัส" : "ไม่รับโบนัส"}
                  size="small"
                  style={{
                    padding: 10,
                    backgroundColor: item.bonus === 1 ? "#129A50" : "#FFB946",
                    color: "#eee",
                  }}
                />
              ),
            },
            {
              field: "status_transction",
              title: "สถานะทำรายการ",
              align: "center",
              render: (item) => (
                <Chip
                  label={item.status_transction === "MANUAL" ? "เติมมือ" : "AUTO"}
                  size="small"
                  style={{
                    padding: 10,
                    backgroundColor: item.status_transction === "MANUAL" ? "#4a5eb3" : "#129A50",
                    color: "#eee",
                  }}
                />
              ),
            },
            {
              field: "transfer_by",
              title: "ทำรายการโดย",
              align: "center",
            },
            {
              field: "detail",
              title: "หมายเหตุ",
              align: "center",
            },

          ]}
        />
      </Paper>
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
      <LoadingModal open={loading} />
    </Layout>
  );
}

export default reportDeposit;
