import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Grid,
  Button,
  TextField,
  Typography,
  Chip,
  Box,
  Dialog,
  IconButton,
  DialogTitle,
  DialogActions,
  Table,
  TableRow,
  TableCell,
  DialogContent,
  CssBaseline,
  MenuItem,
  Paper
} from "@mui/material";
import Layout from '../../theme/Layout'
import MaterialTableForm from "../../components/materialTableForm"
import axios from "axios";
import hostname from "../../utils/hostname";
import LoadingModal from "../../theme/LoadingModal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import KeyIcon from "@mui/icons-material/Key";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import moment from "moment/moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";
import { signOut } from "../../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../store/store";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArticleIcon from "@mui/icons-material/Article";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function memberInfo() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [dataMember, setDataMember] = useState([])
  // const [rowData, setRowData] = useState()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState()
  const [transaction, setTransaction] = useState([])

  const getMember = async (type, start, end) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/member/get_member`,
        data: {
          username : username
        }
      });

      let resData = res.data;
      console.log('resData', resData)
      // let no = 1;
      // resData.map((item) => {
      //   item.no = no++;
      //   item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
      // });

      console.log('resData', resData)

      setDataMember(resData);
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

  const columns = [
    {
      field: "no",
      title: "ลำดับ",
      maxWidth: 80,
      align: "center",
    },
    {
      field: "type",
      title: "ประเภท",
      align: "center",
      render: (item) => (
        <Chip
          label={item.type === "deposit" ? "ฝาก" : "ถอน"}
          // size="small"
          style={{
            padding: 10,
            backgroundColor: item.type === "deposit" ? "#129A50" : "#FFB946",
            color: "#fff",
            minWidth: "120px"
          }}
        />
      ),
    },
    {
      field: "amount",
      title: "ยอดเงิน",
      align: "center",
      render: (item) => (
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
          {Intl.NumberFormat("TH").format(parseInt(item.amount))}
        </Typography>
      ),
    },
    {
      field: "credit_before",
      title: "Credit Before",
      align: "center",
      render: (item) => (
        <Typography sx={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
          {Intl.NumberFormat("TH").format(parseInt(item.credit_before))}
        </Typography>
      ),
    },
    {
      field: "credit_after",
      title: "Credit After",
      align: "center",
      render: (item) => (
        <Typography sx={{ color: '#129A50', fontSize: '14px', fontWeight: 'bold' }}>
          {Intl.NumberFormat("TH").format(parseInt(item.credit_after))}
        </Typography>
      ),
    },
    {
      field: "create_date",
      title: "วันที่ทำรายการ",
      align: "center",
    },
    {
      field: "create_by",
      title: "ทำโดย",
      align: "center",
    },
    {
      field: "annotation",
      title: "หมายเหตุ",
      align: "center",
    },

    {
      field: "ref",
      title: "Ref",
      align: "center",
    },
  ];


  return (
    <Layout>
      <CssBaseline />
      {/* <Grid container sx={{ mt: 2 }}>
        <Grid item container xs={12} sx={{ mb: 3 }}>
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
            variant="outlined"
            type="text"
            name="type"

            value={search.type}
            onChange={(e) => {
              setSearch({
                ...search,
                [e.target.name]: e.target.value,
              });
            }}
            sx={{ mt: 1, mr: 1, width: "220px", bgcolor: '#fff' }}
            select
            label="ประเภทการค้นหา"
            InputLabelProps={{
              shrink: true,
            }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="username">Username</MenuItem>
            <MenuItem value="tel">หมายเลขโทรศัพท์</MenuItem>
            <MenuItem value="bankNumber">เลขบัญชีธนาคาร</MenuItem>
            <MenuItem value="fname">ชื่อจริง</MenuItem>
            <MenuItem value="sname">นามสุกล</MenuItem>
          </TextField>

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
            placeholder="ค้นหาข้อมูลที่ต้องการ"
            sx={{ mt: 1, mr: 2, width: "220px", bgcolor: '#fff' }}
          />

          <Button
            variant="contained"
            style={{ marginRight: "8px", marginTop: 8, color: '#fff' }}
            color="primary"
            size="large"
            onClick={() => {
              getUser();
            }}
          >
            <Typography>ค้นหา</Typography>
          </Button>

        </Grid>
      </Grid> */}

      <Paper sx={{ p: 3, mb: 2 }}>
        <Typography
          sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
        >
          ตรวจสอบข้อมูลลูกค้า
        </Typography>
        <Grid
          container
          direction="row"
          sx={{ mt: 2, ml: 2 }}
          spacing={1}
        >
          <Grid item xs={1} sx={{ mt: 2 }}>
            <Typography>ชื่อผู้ใช้ : </Typography>
          </Grid>
          <Grid item xs={3} >
            <TextField
              variant="outlined"
              type="text"
              name="username"
              fullWidth
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              sx={{ bgcolor: '#fff' }}
            />
          </Grid>
          <Grid item xs={1} sx={{ ml: 1 }}>
            <Button
              variant="contained"
              style={{ marginTop: 8, color: '#fff' }}
              color="primary"
              size="large"
              fullWidth
              onClick={() => getMember()}>
              ค้นหา
            </Button>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ mt: 2 }}
        >
          <Grid item xs={4}>
            <Paper sx={{ bgcolor: '#eee', py: 1 }}>
              <Grid container>
                <AccountBoxIcon sx={{ fontSize: 100, color: "#109CF1" }} />

                <Grid item direction="column" sx={{ mt: 2 }}>
                  <Typography variant="h6">ยูสเซอร์เนมลูกค้า</Typography>
                  <Typography sx={{ ml: 1 }}>{dataMember.username || ""}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ bgcolor: '#eee', py: 1 }}>
              <Grid container>
                <AccountBalanceWalletIcon
                  sx={{ fontSize: 100, color: "#109CF1" }}
                />
                <Grid item direction="column" sx={{ mt: 2 }}>
                  <Typography variant="h6">เครดิตปัจจุบันของลูกค้า</Typography>
                  <Typography sx={{ ml: 1 }}> {Intl.NumberFormat("TH").format(parseInt(dataMember.credit)) || ""}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ bgcolor: '#eee', py: 1 }}>
              <Grid container>
                <ArticleIcon sx={{ fontSize: 100, color: "#109CF1" }} />
                <Grid item direction="column" sx={{ mt: 2 }}>
                  <Typography variant="h6">Rank Point</Typography>
                  <Typography sx={{ ml: 1 }}>{dataMember.rank} {dataMember.points}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <MaterialTableForm data={transaction} columns={columns} pageSize="10" title="รายชื่อลูกค้า" />

      <LoadingModal open={loading} />
    </Layout>
  )
}

export default memberInfo