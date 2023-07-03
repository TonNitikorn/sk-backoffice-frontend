import React, { useState, useEffect, useRef } from "react";
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
  // Table,
  TableRow,
  TableCell,
  DialogContent,
  CssBaseline,
  MenuItem,
  Paper
} from "@mui/material";
import Layout from '../../theme/Layout'
// import MaterialTableForm from "../../components/materialTableForm"
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
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';

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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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
          username: username
        }
      });

      let resData = res.data
      let resTran = res.data.transaction
      // setTransaction(resData.transaction)
      let no = 1;
      let credit = []
      let sumCredit = 0
      let credit_before = []
      let sumCreditBefore = 0
      let credit_after = []
      let sumCreditAfter = 0


      for (const item of resData.transaction) {
        credit.push(Intl.NumberFormat("TH").format(parseInt(item.credit)))
        credit_before.push(parseInt(item.credit_before))
        credit_after.push(parseInt(item.credit_after))

      }
      sumCredit = credit.reduce((a, b) => a + b, 0)
      sumCreditBefore = credit_before.reduce((a, b) => a + b, 0)
      sumCreditAfter = credit_after.reduce((a, b) => a + b, 0)

      resTran.map((item) => {
        item.no = no++;
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
        item.sumCredit = sumCredit
        item.sumCreditBefore = sumCreditBefore
        item.sumCreditAfter = sumCreditAfter
      });


      setTransaction(resTran)
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
      if (
        error.response.status === 401 &&
        error.response.data.error.message === "Invalid Token"
      ) {
        dispatch(signOut());
        localStorage.clear();
        router.push("/auth/login");
      }
      if (
        error.response.data.error.status_code === 400 &&
        error.response.data.error.message === "ไม่พบข้อมูล"
      ) {
        setLoading(false);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "ไม่มีผู้ใช้นี้",
          showConfirmButton: false,
          timer: 2000,
        });

      }
    }
  };
console.log('dataMember', dataMember)
  ////////////////////// search table /////////////////////
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{
              width: 90,
            }}
          >
            <SearchIcon />
            Search
          </Button>
          {/* <Button
               type="link"
               size="small"
               onClick={() => {
                 confirm({
                   closeDropdown: false,
                 });
                 setSearchText(selectedKeys[0]);
                 setSearchedColumn(dataIndex);
               }}
             >
               Filter
             </Button> */}
          {/* <Button
               type="link"
               size="small"
               onClick={() => {
                 close();
               }}
             >
               close
             </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchIcon
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  ////////////////////// search table /////////////////////

  const columns = [
    {
      title: 'ลำดับ',
      dataIndex: 'no',
      align: 'center',
      sorter: (record1, record2) => record1.no - record2.no,
      render: (item, data) => (
        <Typography sx={{ fontSize: '14px', textAlign: 'center' }} >{item}</Typography>
      )
    },

    {
      dataIndex: 'transfer_type',
      title: "ประเภท",
      align: "center",
      render: (item) => (
        <Chip
          label={item === "DEPOSIT" ? "ฝาก" : "ถอน"}
          size="small"
          style={{
            // padding: 5,
            backgroundColor: item === "DEPOSIT" ? "#129A50" : "#FFB946",
            color: "#fff",
            minWidth: "120px"
          }}
        />
      ),
      filters: [
        { text: 'ถอน', value: 'WITHDRAW' },
        { text: 'ฝาก', value: 'DEPOSIT' },
      ],
      onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
    },
    {
      dataIndex: 'credit',
      title: "ยอดเงิน",
      align: "center",
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography sx={{ fontSize: '14px', }}>
          {Intl.NumberFormat("TH").format(parseInt(item))}
        </Typography>
      ),
    },
    {
      dataIndex: 'credit_before',
      title: "เครดิตก่อนเติม",
      align: "center",
      render: (item) => (
        <Typography sx={{ color: 'red', fontSize: '14px', }}>
          {Intl.NumberFormat("TH").format(parseInt(item))}
        </Typography>
      ),
    },
    {
      dataIndex: 'credit_after',
      title: "เครดิตหลังเติม",
      align: "center",
      render: (item) => (
        <Typography sx={{ color: '#129A50', fontSize: '14px', }}>
          {Intl.NumberFormat("TH").format(parseInt(item))}
        </Typography>
      ),
    },
    {
      dataIndex: 'status_transction',
      title: "สถานะ",
      align: "center",
      render: (item, data) => (
        <Chip
          label={item === "SUCCESS" ? 'AUTO' : item === "MANUAL" ? 'MANUAL' : 'CANCEL'}
          size="small"
          style={{
            padding: 10,
            backgroundColor: item === "SUCCESS" ? '#129A50' : item === "MANUAL" ? '#4a5eb3' : '#BB2828',
            color: "#fff",
          }}
        />
      ),
      filters: [
        { text: 'สำเร็จ', value: 'SUCCESS' },
        { text: 'เติมมือ', value: 'MANUAL' },
        { text: 'ยกเลิก', value: 'CANCEL' },
      ],
      onFilter: (value, record) => record.status_transction.indexOf(value) === 0,
    },
    {
      dataIndex: "create_at",
      title: "วันที่ทำรายการ",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "transfer_by",
      title: "ทำโดย",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "content",
      title: "หมายเหตุ",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },

  ];


  return (
    <Layout>
      <CssBaseline />
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
              style={{ marginTop: 8, color: '#fff', background: "linear-gradient(#0072B1, #41A3E3)" }}
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
                  <Typography variant="h6">ชื่อผู้ใช้ลูกค้า</Typography>
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
                  <Typography sx={{ ml: 1 }}> {!!dataMember.credit || ""}</Typography>
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

      <Table
        columns={columns}
        dataSource={transaction}
        onChange={onChange}
        size="small"
        pagination={{
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => {
            setPage(page)
            setPageSize(pageSize)
          }
        }}
        summary={(pageData) => {
          let totalCredit = 0;
          let totalBefore = 0;
          let totalAfter = 0;
          let totalSumCredit = ''
          let totalSumCreditBefore = ''
          let totalSumCreditAfter = ''

          pageData.forEach(({ credit, credit_before, credit_after, sumCredit, sumCreditBefore, sumCreditAfter }) => {
            totalCredit += parseInt(credit);
            totalBefore += parseInt(credit_before);
            totalAfter += parseInt(credit_after);
            totalSumCredit = sumCredit
            totalSumCreditBefore = sumCreditBefore
            totalSumCreditAfter = sumCreditAfter

          });
          return (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} > ยอดรวม </Typography> </Table.Summary.Cell>

                <Table.Summary.Cell />
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} >{Intl.NumberFormat("TH").format(parseInt(totalCredit))}</Typography> </Table.Summary.Cell>
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: 'red' }} >{Intl.NumberFormat("TH").format(parseInt(totalBefore))}</Typography> </Table.Summary.Cell>
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >{Intl.NumberFormat("TH").format(parseInt(totalAfter))}</Typography>  </Table.Summary.Cell>

              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} > ยอดรวมทั้งหมด </Typography> </Table.Summary.Cell>
                <Table.Summary.Cell />
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} >{!totalSumCredit ? 0 : Intl.NumberFormat("TH").format(parseInt(totalSumCredit))}</Typography> </Table.Summary.Cell>
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: 'red' }} >{!totalSumCreditBefore ? 0 : Intl.NumberFormat("TH").format(parseInt(totalSumCreditBefore))}</Typography> </Table.Summary.Cell>
                <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >{!totalSumCreditAfter ? 0 : Intl.NumberFormat("TH").format(parseInt(totalSumCreditAfter))}</Typography>  </Table.Summary.Cell>

              </Table.Summary.Row>
            </>
          );
        }}
      />

      {/* <MaterialTableForm data={transaction} columns={columns} pageSize="10" title="รายชื่อลูกค้า" /> */}

      <LoadingModal open={loading} />
    </Layout>
  )
}

export default memberInfo