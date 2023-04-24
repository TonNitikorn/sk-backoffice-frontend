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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Card,
  CardContent,
  Divider,
  Box,
  CardMedia,
  MenuItem
} from "@mui/material";
import Layout from "../../theme/Layout";
import moment from "moment";
import MaterialTableForm from "../../components/materialTableForm"
import axios from "axios";
import hostname from "../../utils/hostname";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
// import { makeStyles } from "@mui/styles";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
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
  const theme = useTheme();
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [username, setUsername] = useState("");
  const [report, setReport] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialogView, setOpenDialogView] = useState(false);
  const [total, setTotal] = useState({})
  const [filter, setFilter] = useState([]);

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
        url: `${hostname}/report/get_transaction_withdraw`,
        data: {
          "create_at_start": type === undefined ? selectedDateRange.start : start,
          "create_at_end": type === undefined ? selectedDateRange.end : end,
          "transfer_type": "WITHDRAW",
          "username": username
        }
      });

      let resData = res.data;
      let transaction = res.data.transaction
      let no = 1;
      transaction.map((item) => {
        item.no = no++;
        item.create_at = moment(item.create_at).format('DD/MM/YYYY hh:mm')
        item.bank_name = item.members?.bank_name
        item.bank_number = item.members?.bank_number
        item.username = item.members?.username
      });

      let dataSuccess = transaction.filter((item) => item.status_transction === 'SUCCESS')
      let dataCancel = transaction.filter((item) => item.status_transction === 'CANCEL')


      let sumSuccess = []
      for (const item of dataSuccess) {
        sumSuccess.push(parseInt(item.credit))
      }
      let success = sumSuccess.reduce((a, b) => a + b, 0)

      let sumCancel = []
      for (const item of dataCancel) {
        sumCancel.push(parseInt(item.credit))
      }
      let cancel = sumCancel.reduce((a, b) => a + b, 0)



      let sumPrice = 0
      let price = []
      for (const item of transaction) {
        price.push(item.amount)
      }
      sumPrice = price.reduce((a, b) => a + b, 0)

      setTotal({
        totalList: transaction.length,
        sumPrice: Intl.NumberFormat("TH").format(parseInt(parseInt(sumPrice))),
        sumCredit: Intl.NumberFormat("TH").format(parseInt(parseInt(res.data.sumCredit))),
        totalSuccess: dataSuccess.length,
        totalCancel: dataCancel.length,
        sumSuccess: Intl.NumberFormat("TH").format(parseInt(success)),
        sumCancel: Intl.NumberFormat("TH").format(parseInt(cancel))
      })

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
    }
  };

  const filterData = (type) => {
    if (type === "success") {
      // getReport()
      let data = report.filter((item) => item.status_transction === "SUCCESS")
      setReport(data)
    }
    if (type === "cancel") {
      // getReport()
      let data = report.filter((item) => item.status_transction === "CANCEL")
      setReport(data)
    }

  }

  useEffect(() => {
    getReport();
  }, []);

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography
          sx={{
            fontSize: "24px",
            textDecoration: "underline #129A50 3px",
            mb: 2,
          }}
        >
          รายการถอน
        </Typography>

        <Grid container>
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
                marginTop: "8px",
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
            {/* <TextField variant="outlined"
              type="text"
              name="type"
              size="small"
              value={search.type}
              onChange={(e) => {
                setSearch({
                  ...search,
                  [e.target.name]: e.target.value,
                });
              }}
              sx={{ mt: 1, mr: 1, width: "220px", bgcolor: '#fff' }}
              select label="ประเภทการค้นหา"
              InputLabelProps={{ shrink: true }} >
              <MenuItem value="" > ทั้งหมด </MenuItem>
              <MenuItem value="Fail" > ผิดพลาด </MenuItem>
              <MenuItem value="Create" > รออนุมัติ </MenuItem>
              <MenuItem value="Approve" > อนุมัติแล้ว </MenuItem>
              <MenuItem value="Process" > กำลังทำรายการ </MenuItem>
              <MenuItem value="Success" > สำเร็จ </MenuItem>
              <MenuItem value="OTP" > OTP </MenuItem>
              <MenuItem value="Reject" > ยกเลิก </MenuItem>
              <MenuItem value="manual" > ถอนมือ </MenuItem>
            </TextField> */}
            <TextField
              name="username"
              type="text"
              value={username || ""}
              label="ค้นหาโดยใช้ Username"
              placeholder="ค้นหาโดยใช้ Username"
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2, mt: 1 }}
            />
            <Button
              variant="contained"
              style={{ marginRight: "8px", marginTop: "8px", }}
              color="primary"
              size="large"
              onClick={() => {
                getReport();
              }}
            >
              <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
            </Button>
            <Button
              variant="contained"
              style={{
                marginRight: "8px",
                marginTop: "8px",
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
                getReport("yesterday", start, end);
              }}
            >
              <Typography sx={{ color: '#ffff' }}>เมื่อวาน</Typography>
            </Button>
            <Button
              variant="contained"
              style={{
                marginRight: "8px",
                marginTop: "8px",
                backgroundColor: "#129A50",
              }}
              size="large"
              onClick={async () => {
                let start = moment().format("YYYY-MM-DD 00:00");
                let end = moment().format("YYYY-MM-DD 23:59");
                getReport("today", start, end);
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
              <Typography variant="h5" sx={{ textAlign: "center", color: "#ffff", mt: 2 }}> {total.totalList} </Typography>
              <Typography sx={{ color: "#eee", textAlign: "right" }}>เครดิต</Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#eee" }}>สถานะสำเร็จ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}> {total.totalSuccess}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => filterData('success')}>
                  <Typography sx={{ textDecoration: "underline" }}>ดูเพิ่มเติม..</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#eee" }}>สถานะยกเลิก</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}> {total.totalCancel}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => filterData('cancel')}>
                  <Typography sx={{ textDecoration: "underline" }}>ดูเพิ่มเติม..</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#eee" }}>ยอดรวมเงินสำเร็จ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}> {total.sumSuccess}</Typography>
              <Typography sx={{ color: "#eee", textAlign: "right" }}>เครดิต</Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, bgcolor: "#101D35" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "#eee" }}>ยอดรวมเงินยกเลิก</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}> {total.sumCancel}</Typography>
              <Typography sx={{ color: "#eee", textAlign: "right" }}>เครดิต</Typography>
            </CardContent>
          </Card>



        </Grid>


        <MaterialTableForm
          pageSize={10}
          // actions={actions}
          data={report}
          // setData={setDataPurpose}
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
                      <div>
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
                      {item.bank_name}
                    </Typography>
                  </Grid>
                  <Grid container justifyContent="center">
                    <Typography sx={{ fontSize: "14px" }}>
                      {item.name}
                    </Typography>
                  </Grid>
                </Grid>
              ),
            },
            {
              field: "username",
              title: "Username",
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
            },
            {
              field: "create_at",
              title: "เวลาทำรายการ",
              align: "center",
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
              field: "status_transction",
              title: "สถานะ",
              align: "center",
              render: (item) => (
                <Chip
                  label={item.status_transction === 'SUCCESS' ? "สำเร็จ" : "ยกเลิก"}
                  size="small"
                  style={{
                    padding: 10,
                    backgroundColor: item.status_transction === 'SUCCESS' ? "#129A50" : "#BB2828",
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


          ]}
        />
      </Paper>

      <Dialog
        open={openDialogView.open}
        onClose={() => setOpenDialogView(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>หมายเหตุ</DialogTitle>
        <DialogContent>
          <Grid item xs={12} container justifyContent="center" sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: "16px" }}>
              {report.content}
            </Typography>
          </Grid>
        </DialogContent>
      </Dialog>

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
