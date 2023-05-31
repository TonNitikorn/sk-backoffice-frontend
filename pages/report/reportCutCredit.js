import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Button,
  Grid,
  Typography,
  TextField,
  Chip,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import moment from "moment/moment";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";
import Layout from '../../theme/Layout'
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import { CopyToClipboard } from "react-copy-to-clipboard";
import excel from '../../assets/excel.png'
import { CSVLink } from "react-csv";
import Image from "next/image";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function reportCutCredit() {
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("");
  const [withdraw, setWithdraw] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  ////////////////////// search table /////////////////////
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleClickSnackbar = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
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

  const getRerort = async (type, start, end) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/report/manual_transaction`,
        data: {
          "status_transction": "MANUAL",
          "start_date": type === undefined ? selectedDateRange.start : start,
          "end_date": type === undefined ? selectedDateRange.end : end,
        },
      });


      let data = res.data.listDeposit
      let dataWithdraw = data.filter((item) => item.transfer_type === "WITHDRAW")

      let no = 1
      let credit = []
      let sumCredit = 0
      let credit_before = []
      let sumCreditBefore = 0
      let credit_after = []
      let sumCreditAfter = 0


      for (const item of dataWithdraw) {
        credit.push(parseInt(item.credit))
        credit_before.push(parseInt(item.credit_before))
        credit_after.push(parseInt(item.credit_after))

      }
      sumCredit = credit.reduce((a, b) => a + b, 0)
      sumCreditBefore = credit_before.reduce((a, b) => a + b, 0)
      sumCreditAfter = credit_after.reduce((a, b) => a + b, 0)


      dataWithdraw.map(item => {
        item.sumCredit = sumCredit
        item.sumCreditBefore = sumCreditBefore
        item.sumCreditAfter = sumCreditAfter
        item.transfer_type = item.transfer_type === "DEPOSIT" ? 'เติมเครดิต' : 'ตัดเครดิต'
        item.username = item.members?.username
        item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
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
      })
      setWithdraw(dataWithdraw)
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
    {
      title: 'Username',
      dataIndex: 'username',
      render: (item, data) => (
        <CopyToClipboard text={item}>
          <div style={{
            "& .MuiButton-text": {
              "&:hover": {
                // backgroundColor: "#9CE1BC",
                // color: "blue",
                textDecoration: "underline blue 1px",
              }
            }
          }} >
            <Button
              sx={{
                fontSize: "14px",
                p: 0,
                color: "blue",
              }}
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
      title: "เครดิตที่ทำรายการ",
      align: "center",
      ...getColumnSearchProps('credit'),
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
      title: "เครดิตก่อนตัด",
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
      title: "เครดิตหลังตัด",
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
              my: 3,
            }}
          >
            รายงานการตัดเครดิตแบบ manual
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
            {/* <TextField
              name="username"
              type="text"
              value={username || "ALL"}
              label="ค้นหาโดยใช้ Username"
              placeholder="ค้นหาโดยใช้ Username"
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            /> */}
            <Button
              variant="contained"
              style={{ marginRight: "8px", background: "linear-gradient(#0072B1, #41A3E3)" }}
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
                background: "linear-gradient(#c9881e, #ffc463)"
              }}
              size="large"
              onClick={async () => {
                let start = moment()
                  .subtract(1, "days")
                  .format("YYYY-MM-DD 00:00");
                let end = moment()
                  .subtract(1, "days")
                  .format("YYYY-MM-DD 23:59");
                getRerort("yesterday", start, end);
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
              size="large"
              onClick={async () => {
                let start = moment().format("YYYY-MM-DD 00:00");
                let end = moment().format("YYYY-MM-DD 23:59");
                getRerort("today", start, end);
              }}
            >
              <Typography sx={{ color: '#ffff' }}>วันนี้</Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center" >

          {/* <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}  > รายการเดินบัญชี </Typography> */}

          <CSVLink
            data={withdraw}
            filename={'รายการตัดเครดิต ตั้งแต่วันที่ ' + moment(selectedDateRange.start).format("YYYY-MM-DD") + ' ถึง ' + moment(selectedDateRange.end).format("YYYY-MM-DD 00:00")}

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
          dataSource={withdraw}
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

      </Paper>
      <LoadingModal open={loading} />
    </Layout>
  )
}

export default withAuth(reportCutCredit)
