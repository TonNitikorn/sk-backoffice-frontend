import React, { useState, useEffect, useRef } from "react";
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
import axios from "axios";
import hostname from "../../utils/hostname";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Image from "next/image";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import excel from '../../assets/excel.png'
import { CSVLink } from "react-csv";

function reportDeposit() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [username, setUsername] = useState("");
  const [report, setReport] = useState([]);
  const [open, setOpen] = useState(false);
  const [total, setTotal] = useState({})
  const [loading, setLoading] = useState(false);
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
        url: `${hostname}/report/get_transaction`,

        data: {
          "create_at_start": type === undefined ? selectedDateRange.start : start,
          "create_at_end": type === undefined ? selectedDateRange.end : end,
          "transfer_type": "DEPOSIT",
          "username": username !== "" ? username : "ALL"
        }
      });

      let resData = res.data;
      let transaction = res.data.transaction
      let no = 1;
      let credit = []
      let sumCredit = 0
      let credit_before = []
      let sumCreditBefore = 0
      let credit_after = []
      let sumCreditAfter = 0


      for (const item of resData.transaction) {
        credit.push(parseInt(item.credit))
        credit_before.push(parseInt(item.credit_before))
        credit_after.push(parseInt(item.credit_after))

      }
      sumCredit = credit.reduce((a, b) => a + b, 0)
      sumCreditBefore = credit_before.reduce((a, b) => a + b, 0)
      sumCreditAfter = credit_after.reduce((a, b) => a + b, 0)

      transaction.map((item) => {
        item.sumCredit = sumCredit
        item.sumCreditBefore = sumCreditBefore
        item.sumCreditAfter = sumCreditAfter
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
        item.bank_name = item.members?.bank_name
        item.bank_number = item.members?.bank_number
        item.username = item.members?.username
        delete item.affiliate_point
        delete item.affiliate_point_after
        delete item.affiliate_point_before
        delete item.detail_bank
        delete item.member_uuid
        delete item.no
        delete item.point
        delete item.point_after
        delete item.point_before
        delete item.prefix
        delete item.slip
        delete item.status_bank
        delete item.status_provider
        delete item.uuid
        delete item.update_at
        delete item.members
        delete item.by_bank
        delete item.amount
        delete item.amount_before
        delete item.amount_after
        item.no = no++;
        // item.credit = Intl.NumberFormat("TH").format(parseInt(item.credit))
        // item.credit_after = Intl.NumberFormat("TH").format(parseInt(item.credit_after))
        // item.credit_before = Intl.NumberFormat("TH").format(parseInt(item.credit_before))
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
    let dataTypeManual = transaction.filter((item) => item.status_transction === "MANUAL")
    let dataTypeAuto = transaction.filter((item) => item.transfer_by === "AUTO")

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
      sumTotal: Intl.NumberFormat("TH").format(parseInt(manual + auto))
    })
  }
  console.log('total', total)

  const filterData = (type) => {
    if (type === "manual") {
      setFilterCancel([])
      let data = report.filter((item) => item.status_transction === "MANUAL")
      setFilterSuccess(data)
    }
    if (type === "auto") {
      setFilterSuccess([])
      let data = report.filter((item) => item.transfer_by === "AUTO")
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
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509600962-kbnk.png"
              }
              alt="kbnk"
              width={50}
              height={50}
            />
          ) : item === "truemoney" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509654967-truemoney.png"
              }
              alt="truemoney"
              width={50}
              height={50}
            />
          ) : item === "ktba" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509722840-ktb.png"
              }
              alt="ktba"
              width={50}
              height={50}
            />
          ) : item === "scb" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509747475-scb.png"
              }
              alt="scb"
              width={50}
              height={50}
            />
          ) : item === "bay" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509778211-bay.png"
              }
              alt="bay"
              width={50}
              height={50}
            />
          ) : item === "bbla" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509796809-bbl.png"
              }
              alt="bbla"
              width={50}
              height={50}
            />
          ) : item === "gsb" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509823709-gsb.png"
              }
              alt="gsb"
              width={50}
              height={50}
            />
          ) : item === "ttb" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509868094-ttb.png"
              }
              alt="ttb"
              width={50}
              height={50}
            />
          ) : item === "bbac" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509885549-baac.png"
              }
              alt="bbac"
              width={50}
              height={50}
            />
          ) : item === "icbc" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509907708-icbt.png"
              }
              alt="icbc"
              width={50}
              height={50}
            />
          ) : item === "tcd" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509929380-tcd.png"
              }
              alt="tcd"
              width={50}
              height={50}
            />
          ) : item === "citi" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509949540-citi.png"
              }
              alt="citi"
              width={50}
              height={50}
            />
          ) : item === "scbt" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509967883-scbt.png"
              }
              alt="scbt"
              width={50}
              height={50}
            />
          ) : item === "cimb" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509984083-cimb.png"
              }
              alt="cimb"
              width={50}
              height={50}
            />
          ) : item === "uob" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510000397-uob.png"
              }
              alt="uob"
              width={50}
              height={50}
            />
          ) : item === "hsbc" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510018318-hsbc.png"
              }
              alt="hsbc"
              width={50}
              height={50}
            />
          ) : item === "mizuho" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510037176-mizuho.png"
              }
              alt="mizuho"
              width={50}
              height={50}
            />
          ) : item === "ghb" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510067372-ghb.png"
              }
              alt="ghb"
              width={50}
              height={50}
            />
          ) : item === "lhbank" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510092134-lhbank.png"
              }
              alt="lhbank"
              width={50}
              height={50}
            />
          ) : item === "tisco" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510111592-tisco.png"
              }
              alt="tisco"
              width={50}
              height={50}
            />
          ) : item === "kkba" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510132080-kkba.png"
              }
              alt="kkba"
              width={50}
              height={50}
            />
          ) : item === "ibank" ? (
            <Image
              src={
                "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510150924-ibank.png"
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
      ...getColumnSearchProps('username'),

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
        >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
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
        >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
      ),
    },


    {
      dataIndex: 'status_transction',
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={item === "MANUAL" ? 'เติมมือ' : item === 'SUCCESS' ? "สำเร็จ" : "ยกเลิก"}
          size="small"
          style={{
            padding: 10,
            backgroundColor: item === "MANUAL" ? "#4a5eb3" : item === 'SUCCESS' ? "#129A50" : "#BB2828",
            color: "#eee",
          }} S
        />
      ),
      filters: [
        { text: 'สำเร็จ', value: 'SUCCESS' },
        { text: 'เติมมือ', value: 'MANUAL' },
        { text: 'ยกเลิก', value: 'CANCEL' },
      ],
      onFilter: (value, record) => record.status_transction.indexOf(value) === 0,
    },
    // {
    //   dataIndex: 'status_transction',
    //   title: "รูปแบบการทำรายการ",
    //   align: "center",
    //   render: (item) => (
    //     <Chip
    //       label={item === "MANUAL" ? "เติมมือ" : "AUTO"}
    //       size="small"
    //       style={{
    //         padding: 10,
    //         backgroundColor: item === "MANUAL" ? "#4a5eb3" : "#129A50",
    //         color: "#eee",
    //       }}
    //     />
    //   ),
    //   filters: [
    //     { text: 'เติมมือ', value: 'MANUAL' },
    //     { text: 'ออโต้', value: 'AUTO' },
    //   ],
    //   onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
    // },
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
        >{item === null ? "-" : item}</Typography>
      ),
    },
  ];

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
              style={{
                marginRight: "8px",
                background: "linear-gradient(#0072B1, #41A3E3)"
              }}
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
                background: "linear-gradient(#c9881e, #ffc463)"
              }}
              size=""
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
            <Button
              variant="contained"
              style={{
                marginRight: "8px",
                background: "linear-gradient(#09893f, #41db82)",
              }}
              size=""
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
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mt: 2, mb: 4 }}>

          <Card sx={{ width: 250, background: "linear-gradient(#0072B1, #41A3E3)" }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#eee" }}>จำนวนรายการ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>{total.totalList} </Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button disabled>
                  <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>รายการ</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, background: "linear-gradient(#0072B1, #41A3E3)" }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: '#eee' }}>ยอดรวมฝากทั้งหมด</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}> {total.sumCredit}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button disabled>
                  <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>บาท</Typography>
                </Button>
              </Grid>

            </CardContent>
          </Card>

          <Card sx={{ width: 250, background: "linear-gradient(#c9881e, #ffc463)" }} >
            <CardContent>
              <Typography variant="h7" sx={{ color: "#eee" }}>จำนวนรายการฝากแบบเติมมือ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>  {total.typeManual} </Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => filterData('manual')}>
                  <Typography sx={{ textDecoration: "underline", mt: 1, mb: -2 }}>ดูเพิ่มเติม..</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, background: "linear-gradient(#c9881e, #ffc463)" }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#eee" }}>ยอดรวมฝากแบบเติมมือ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}> {total.sumManual}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button disabled>
                  <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>บาท</Typography>
                </Button>
              </Grid>

            </CardContent>
          </Card>

          <Card sx={{ width: 250, background: "linear-gradient(#09893f, #41db82)" }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#eee" }}>จำนวนรายการฝากแบบอัตโนมัติ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>  {total.typeAuto} </Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button
                  sx={{ color: "#eee" }}
                  onClick={() => filterData('auto')}>
                  <Typography sx={{ textDecoration: "underline", mt: 1, mb: -2 }}>ดูเพิ่มเติม..</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ width: 250, background: "linear-gradient(#09893f, #41db82)" }}>
            <CardContent>
              <Typography variant="h7" sx={{ color: "#eee" }}>ยอดรวมฝากแบบอัตโนมัติ</Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }}>  {total.sumAuto}</Typography>
              <Grid sx={{ textAlign: 'right' }}>
                <Button disabled>
                  <Typography sx={{ color: "#eee", mt: 1, mb: -2 }}>บาท</Typography>
                </Button>
              </Grid>
            </CardContent>
          </Card>



        </Grid>


        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center" >

          {/* <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}  > รายการเดินบัญชี </Typography> */}

          <CSVLink
            data={filterSuccess.length > 0 ? filterSuccess : filterCancel.length > 0 ? filterCancel : report}
            filename={'รายการฝาก ตั้งแต่วันที่ ' + moment(selectedDateRange.start).format("YYYY-MM-DD") + ' ถึง ' + moment(selectedDateRange.end).format("YYYY-MM-DD 00:00")}

          >
            <Button
              variant="outlined"
              sx={{ mr: "8px", my: "10px", justifyContent: "flex-end", border: "1px solid #C0C0C0", boxShadow: 1, }}
            >
              <Image src={excel} alt="excel" />{" "}
              <Typography variant="h7" sx={{ color: "black", ml: 1 }}>
                {" "}
                Export Excel
              </Typography>
            </Button>
          </CSVLink>
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
                  <Table.Summary.Cell />
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} >{Intl.NumberFormat("TH").format(parseInt(totalCredit))}</Typography> </Table.Summary.Cell>
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: 'red' }} >{Intl.NumberFormat("TH").format(parseInt(totalBefore))}</Typography> </Table.Summary.Cell>
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >{Intl.NumberFormat("TH").format(parseInt(totalAfter))}</Typography>  </Table.Summary.Cell>

                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} > ยอดรวมทั้งหมด </Typography> </Table.Summary.Cell>
                  <Table.Summary.Cell />
                  <Table.Summary.Cell />
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold" }} >{!totalSumCredit ? 0 : Intl.NumberFormat("TH").format(parseInt(totalSumCredit))}</Typography> </Table.Summary.Cell>
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: 'red' }} >{!totalSumCreditBefore ? 0 : Intl.NumberFormat("TH").format(parseInt(totalSumCreditBefore))}</Typography> </Table.Summary.Cell>
                  <Table.Summary.Cell > <Typography align="center" sx={{ fontWeight: "bold", color: '#129A50' }} >{!totalSumCreditAfter ? 0 : Intl.NumberFormat("TH").format(parseInt(totalSumCreditAfter))}</Typography>  </Table.Summary.Cell>

                </Table.Summary.Row>
              </>
            );
          }}

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

export default withAuth(reportDeposit);
