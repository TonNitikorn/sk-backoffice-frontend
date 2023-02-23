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
} from "@mui/material";
import Layout from "../../theme/Layout";
import moment from "moment";
import axios from "axios";
import hostname from "../../utils/hostname";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import MaterialTableForm from "../../components/materialTableForm"
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

function reportDepositDecimal() {
//   const classes = useStyles();
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [username, setUsername] = useState("");
  const [report, setReport] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
        // url: `${hostname}/api/report/deposit/?start_date=${
        //   type === undefined ? selectedDateRange.start : start
        // }&end_date=${
        //   type === undefined ? selectedDateRange.end : end
        // }&username=${username}`,
        url: `${hostname}/report/get_transaction`,
        data: {
          "transfer_type": "DEPOSIT"
        }
      });

      let resData = res.data;
      let transaction = res.data.transaction
      let no = 1;
      transaction.map((item) => {
        item.no = no++;
        item.create_at = moment(item.create_at).format('DD/MM/YYYY hh:mm')
        item.username = item.members?.username
        item.bank_name = item.members?.bank_name
        item.bank_number = item.members?.bank_number
        // item.bank_number = item.member_account_banks[0].bank_number
        // item.bank_account_name = item.member_account_banks[0].bank_account_name

      });
      setReport(transaction);
      setLoading(false);
    } catch (error) {
      console.log(error);
      // if (
      //   error.response.data.error.status_code === 401 &&
      //   error.response.data.error.message === "Unauthorized"
      // ) {
      //   dispatch(signOut());
      //   localStorage.clear();
      //   router.push("/auth/login");
      // }
    }
  };
  console.log('report', report)

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
          ประวัติการสร้างรายการทศนิยม
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
            <TextField
              name="username"
              type="text"
              size="small"

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
              size="small"
              onClick={() => {
                getReport();
              }}
            >
              <Typography sx={{color: '#ffff'}}>ค้นหา</Typography>
            </Button>
            <Button
              variant="contained"
              style={{
                marginRight: "8px",
                marginTop: 13,
                backgroundColor: "#FFB946",
              }}
              size="small"
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
              <Typography sx={{color: '#ffff'}}>เมื่อวาน</Typography>
            </Button>
            <Button
              variant="contained"
              style={{
                marginRight: "8px",
                marginTop: 13,
                backgroundColor: "#129A50",
              }}
              size="small"
              onClick={async () => {
                let start = moment().format("YYYY-MM-DD 00:00");
                let end = moment().format("YYYY-MM-DD 23:59");
                getReport("today", start, end);
              }}
            >
              <Typography sx={{color: '#ffff'}}>วันนี้</Typography>
            </Button>
          </Grid>
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
                          "https://the1pg.com/wp-content/uploads/2022/10/kbnk.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "truemoney" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/truemoney.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "ktba" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/ktba.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "scb" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/scb.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "bay" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/bay.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "bbla" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/bbl.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "gsb" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/gsb.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "ttb" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/ttb.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "baac" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/baac.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "ICBC" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/icbc.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "TCD" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/tcd.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "CITI" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/citi.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "SCBT" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/scbt.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "CIMB" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/cimb.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "UOB" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/uob.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "HSBC" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/hsbc.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "MIZUHO" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/mizuho.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "GHB" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/ghb.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "LHBANK" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/lhbank.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "TISCO" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/tisco.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "kkba" ? (
                      <Image
                        src={
                          "https://the1pg.com/wp-content/uploads/2022/10/kkba.png"
                        }
                        alt="scb"
                        width={50}
                        height={50}
                      />
                    ) : item.bank_name === "IBANK" ? (
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
                  <div>
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
              field: "amount",
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
              field: "transfer_by",
              title: "ทำรายการโดย",
              align: "center",
            },
            {
              field: "content",
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

export default reportDepositDecimal;
