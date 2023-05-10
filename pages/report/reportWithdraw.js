import React, { useState, useEffect,useRef } from "react";
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
  Card,
  CardContent,
} from "@mui/material";
import Layout from "../../theme/Layout";
import moment from "moment";
import MaterialTableForm from "../../components/materialTableForm"
import axios from "axios";
import hostname from "../../utils/hostname";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";
import { useTheme } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';


function reportDeposit() {
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
  const [filterSuccess, setFilterSuccess] = useState([]);
  const [filterCancel, setFilterCancel] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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

      let transaction = res.data.transaction
      let no = 1;
      transaction.map((item) => {
        item.no = no++;
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
        item.bank_name = item.members?.bank_name
        item.bank_number = item.members?.bank_number
        item.username = item.members?.username
      });

      sumData(transaction, res.data.sumCredit)
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
    if (type === "success") {
      setFilterCancel([])
      let data = report.filter((item) => item.status_transction === "SUCCESS")
      setFilterSuccess(data)
    }
    if (type === "cancel") {
      setFilterSuccess([])
      let data = report.filter((item) => item.status_transction === "CANCEL")
      setFilterCancel(data)
    }
  }

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
      title: 'ธนาคาร',
      dataIndex: 'bank_name',
      width: '200px',
      ...getColumnSearchProps('bank_number'),
      render: (item, data) => <Grid container>
        <Grid item xs={3} sx={{ mt: 1 }}>
          {item === "kbnk" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/kbnk.png"
              }
              alt="kbnk"
              width={50}
              height={50}
            />
          ) : item === "truemoney" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/truemoney.png"
              }
              alt="truemoney"
              width={50}
              height={50}
            />
          ) : item === "ktba" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/ktba.png"
              }
              alt="ktba"
              width={50}
              height={50}
            />
          ) : item === "scb" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/scb.png"
              }
              alt="scb"
              width={50}
              height={50}
            />
          ) : item === "bay" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/bay.png"
              }
              alt="bay"
              width={50}
              height={50}
            />
          ) : item === "bbla" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/bbl.png"
              }
              alt="bbla"
              width={50}
              height={50}
            />
          ) : item === "gsb" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/gsb.png"
              }
              alt="gsb"
              width={50}
              height={50}
            />
          ) : item === "ttb" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/ttb.png"
              }
              alt="ttb"
              width={50}
              height={50}
            />
          ) : item === "bbac" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/baac.png"
              }
              alt="bbac"
              width={50}
              height={50}
            />
          ) : item === "icbc" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/icbc.png"
              }
              alt="icbc"
              width={50}
              height={50}
            />
          ) : item === "tcd" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/tcd.png"
              }
              alt="tcd"
              width={50}
              height={50}
            />
          ) : item === "citi" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/citi.png"
              }
              alt="citi"
              width={50}
              height={50}
            />
          ) : item === "scbt" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/scbt.png"
              }
              alt="scbt"
              width={50}
              height={50}
            />
          ) : item === "cimb" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/cimb.png"
              }
              alt="cimb"
              width={50}
              height={50}
            />
          ) : item === "uob" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/uob.png"
              }
              alt="uob"
              width={50}
              height={50}
            />
          ) : item === "hsbc" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/hsbc.png"
              }
              alt="hsbc"
              width={50}
              height={50}
            />
          ) : item === "mizuho" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/mizuho.png"
              }
              alt="mizuho"
              width={50}
              height={50}
            />
          ) : item === "ghb" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/ghb.png"
              }
              alt="ghb"
              width={50}
              height={50}
            />
          ) : item === "lhbank" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/lhbank.png"
              }
              alt="lhbank"
              width={50}
              height={50}
            />
          ) : item === "tisco" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/tisco.png"
              }
              alt="tisco"
              width={50}
              height={50}
            />
          ) : item === "kkba" ? (
            <Image
              src={
                "https://angpaos.games/wp-content/uploads/2023/03/kkba.png"
              }
              alt="kkba"
              width={50}
              height={50}
            />
          ) : item === "ibank" ? (
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
        <Grid item xs={9}>
          <Grid sx={{ ml: 3, mt: 1 }}>
            <CopyToClipboard text={data.bank_number}>
              <div style={{ "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } } }} >
                <Button
                  sx={{ fontSize: "14px", p: 0, color: "blue", }}
                  onClick={handleClickSnackbar}
                >
                  {data.bank_number}
                </Button>
              </div>
            </CopyToClipboard>
          </Grid>
          <Grid sx={{ ml: 3, }}>
            <Typography sx={{ fontSize: "14px" }}>
              {data.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid >,
    },
    {
      title: 'ชื่อผู้ใช้งาน',
      dataIndex: 'username',
      render: (item, data) => (
        <CopyToClipboard text={item}>
          <div style={{
            "& .MuiButton-text": {
              "&:hover": {
                textDecoration: "underline blue 1px",
              }
            }
          }} >
            <Button
              sx={{ fontSize: "14px", p: 0, color: "blue", }}
              onClick={handleClickSnackbar}
            >
              {item}
            </Button>
          </div>
        </CopyToClipboard>
      ),
      ...getColumnSearchProps('tel'),

    },
    {
      dataIndex: "credit",
      title: "เครดิต",
      align: "center",
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
      ),
    },
    {
      dataIndex: "credit_before",
      title: "เครดิตก่อนเติม",
      align: "center",
      ...getColumnSearchProps('credit_before'),
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "credit_after",
      title: "เครดิตหลังเติม",
      align: "center",
      ...getColumnSearchProps('credit_after'),
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },

    {
      dataIndex: 'status_transction',
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={item === 'SUCCESS' ? "สำเร็จ" : "ยกเลิก"}
          size="small"
          style={{
            padding: 10,
            backgroundColor: item === 'SUCCESS' ? "#129A50" : "#BB2828",
            color: "#eee",
          }}
        />
      ),
      filters: [
        { text: 'สำเร็จ', value: 'SUCCESS' },
        { text: 'ยกเลิก', value: 'CANCEL' },
      ],
      onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
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
      title: "ทำรายการโดย",
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

  useEffect(() => {
    getReport();
  }, []);

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography
          sx={{
            fontSize: "24px",
            textDecoration: "underline #41A3E3 3px",
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
                marginTop: "8px",
                backgroundColor: "#129A50",
              }}
              size="large"
              onClick={async () => {
                let start = moment().format("YYYY-MM-DD 00:00");
                let end = moment().format("YYYY-MM-DD 23:59");
                setFilterSuccess([])
                setFilterCancel([])
                getReport("today", start, end);
              }}
            >
              <Typography sx={{ color: '#ffff' }}>วันนี้</Typography>
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
                let start = moment().subtract(1, "days").format("YYYY-MM-DD 00:00");
                let end = moment().subtract(1, "days").format("YYYY-MM-DD 23:59");
                setFilterSuccess([])
                setFilterCancel([])
                getReport("yesterday", start, end);
              }}
            >
              <Typography sx={{ color: '#ffff' }}>เมื่อวาน</Typography>
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

          <Card sx={{ width: 250, bgcolor: '#101D35', }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#FFB946" }}>จำนวนรายการ</Typography>
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
              <Typography variant="h7" sx={{ color: "#FFB946" }}>สถานะสำเร็จทั้งหมด</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                {Intl.NumberFormat("TH").format(parseInt(total.totalSuccess))}</Typography>
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
              <Typography variant="h7" sx={{ color: "#FFB946" }}>สถานะยกเลิกทั้งหมด</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                {Intl.NumberFormat("TH").format(parseInt(total.totalCancel))} </Typography>
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
              <Typography variant="h7" sx={{ color : '#2ECC71' }}>ยอดรวมเงินทั้งหมด</Typography>
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
              <Typography variant="h7" sx={{ color : '#2ECC71' }}>ยอดรวมเงินสำเร็จทั้งหมด</Typography>
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
              <Typography variant="h7" sx={{ color : '#2ECC71' }}>ยอดรวมเงินยกเลิกทั้งหมด</Typography>
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


        <Table
          columns={columns}
          dataSource={filterSuccess.length > 0 ? filterSuccess : filterCancel.length > 0 ? filterCancel : report}
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

export default withAuth(reportDeposit);
