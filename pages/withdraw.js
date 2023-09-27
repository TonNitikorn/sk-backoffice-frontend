import Layout from "../theme/Layout";
import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  Chip,
  Card,
  Snackbar,
  CardContent,
  Alert,
} from "@mui/material";
import axios from "axios";
import hostname from "../utils/hostname";
import withAuth from "../routes/withAuth";
import moment from "moment/moment";
import Swal from "sweetalert2";
import LoadingModal from "../theme/LoadingModal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Table, Input, Space } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import CurrencyInput from "md-react-currency-input";
import { useCounterStore } from "../zustand/permission";

function withdraw() {
  const [username, setUsername] = useState("");
  const [dataUser, setDataUser] = useState({});
  const [rowData, setRowData] = useState({});
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const handleClickSnackbar = () => {
    setOpen(true);
  };
  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const searchUser = async () => {
    // setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/member/member_transaction`,
        data: {
          username: username,
        },
      });
      let userData = res.data;
      let lastDataUser = {
        ...userData,
        fullname: userData.fname + " " + userData.lname,
      };
      setDataUser(lastDataUser);
      let resTran = res.data.transaction;
      let no = 1;
      let credit = [];
      let sumCredit = 0;

      for (const item of resTran) {
        credit.push(parseInt(item.credit));
      }
      sumCredit = credit.reduce((a, b) => a + b, 0);

      resTran.map((item) => {
        item.sumCredit = sumCredit;
        item.no = no++;
        item.create_at = moment(item.create_at).format("DD/MM/YYYY HH:mm");
      });
      setTransaction(resTran);
      // setLoading(false);
    } catch (error) {
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
      console.log(error);
    }
  };

  const submitWithdraw = async () => {
    setLoading(true);
    try {
      if (parseInt(dataUser.credit) >= parseInt(rowData.amount)) {
        let res = await axios({
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
          method: "post",
          url: `${hostname}/transaction/withdraw_request`,
          data: {
            amount: rowData.amount,
            username: username,
          },
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: "ทำรายการเรียบร้อย",
          showConfirmButton: false,
          timer: 2500,
        });
        setRowData({});
        setDataUser({});
        searchUser();
      } else if (!!rowData.amount) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "ยอดเครดิตไม่เพียงพอ",
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "กรุณาระบุเครดิตที่ต้องการถอน",
          showConfirmButton: false,
          timer: 2500,
        });
      }
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

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
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
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
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
          color: filtered ? "#1890ff" : undefined,
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
    console.log("params", pagination, filters, sorter, extra);
  };

  const permission = useCounterStore((state) => state.permission);
  const checkPermissionDisabled = (page, action) => {
    const temp = permission?.find((item) => page === item.menu);
    const subMenu = temp?.sub_menu;
    const findDis = subMenu?.find((item) => item.sub_menu_name === action);

    if (findDis?.sub_menu_name === action) {
      if (findDis?.sub_menu_active === false) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      align: "center",
      sorter: (record1, record2) => record1.no - record2.no,
      render: (item, data) => (
        <Typography sx={{ fontSize: "14px", textAlign: "center" }}>
          {item}
        </Typography>
      ),
    },

    {
      dataIndex: "transfer_type",
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={item === "WITHDRAW" ? "ถอน" : "ฝาก"}
          size="small"
          style={{
            // padding: 5,
            backgroundColor: item === "WITHDRAW" ? "#FFB946" : "#129A50",
            color: "#fff",
            minWidth: "120px",
          }}
        />
      ),
      filters: [
        { text: "ถอน", value: "WITHDRAW" },
        { text: "ฝาก", value: "DEPOSIT" },
      ],
      onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
    },
    {
      dataIndex: "credit",
      title: "เครดิต",
      align: "center",
      sorter: (record1, record2) => record1.credit - record2.credit,
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {Intl.NumberFormat("TH").format(parseInt(item))}
        </Typography>
      ),
    },
    {
      dataIndex: "credit_before",
      title: "เครดิตก่อนเติม",
      align: "center",
      ...getColumnSearchProps("credit_before"),
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {Intl.NumberFormat("TH").format(parseInt(item))}
        </Typography>
      ),
    },
    {
      dataIndex: "credit_after",
      title: "เครดิตหลังเติม",
      align: "center",
      ...getColumnSearchProps("credit_after"),
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {Intl.NumberFormat("TH").format(parseInt(item))}
        </Typography>
      ),
    },
    {
      dataIndex: "create_at",
      title: "วันที่ทำรายการ",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {item}
        </Typography>
      ),
    },
    {
      dataIndex: "content",
      title: "หมายเหตุ",
      align: "center",
      render: (item) => (
        <Typography
          style={{
            fontSize: "14px",
          }}
        >
          {item}
        </Typography>
      ),
    },
  ];

  useEffect(() => {
    // searchUser()
  }, [dataUser]);

  return (
    <Layout prefer="withdraw">
      <Paper sx={{ mb: 5, p: 3 }}>
        <Typography
          sx={{
            fontSize: "24px",
            textDecoration: "underline #41A3E3 3px",
          }}
        >
          สร้างรายการถอน
        </Typography>
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Paper>
            <Grid container sx={{ textAlign: "center" }} spacing={3}>
              <Grid item xs={3}>
                <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
                  Username :{" "}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  name="username"
                  type="text"
                  fullWidth
                  value={username || ""}
                  size="small"
                  onChange={(e) => setUsername(e.target.value)}
                  variant="outlined"
                />{" "}
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={username === "" ? true : false}
                  onClick={() => searchUser()}
                  sx={{ background: "linear-gradient(#0072B1, #41A3E3)" }}
                >
                  <Typography sx={{ color: "#ffff" }}>ค้นหา</Typography>
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={6}>
                <Box sx={{ p: 5 }}>
                  <Typography>ชื่อ-สกุล</Typography>
                  <TextField
                    name="username"
                    type="text"
                    fullWidth
                    value={dataUser?.fullname || ""}
                    size="small"
                    onChange={(e) => handleChangeData(e)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    disabled
                  />{" "}
                  <Typography>ธนาคาร</Typography>
                  <TextField
                    name="bank_name"
                    type="text"
                    fullWidth
                    value={dataUser?.bank_name || ""}
                    size="small"
                    onChange={(e) => handleChangeData(e)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    disabled
                  />{" "}
                  <Typography>เครดิตปัจจุบัน</Typography>
                  <TextField
                    name="credit"
                    type="text"
                    fullWidth
                    value={Intl.NumberFormat("TH").format(
                      parseInt(dataUser?.credit || "ไม่มีเครดิต")
                    )}
                    size="small"
                    onChange={(e) => handleChangeData(e)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    disabled
                  />{" "}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 5 }}>
                  <Typography>หมายเลขโทรศัพท์</Typography>
                  <TextField
                    name="tel"
                    type="text"
                    fullWidth
                    value={dataUser?.tel || ""}
                    size="small"
                    onChange={(e) => handleChangeData(e)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    disabled
                  />{" "}
                  <Typography>เลขบัญชี</Typography>
                  <TextField
                    name="bank_number"
                    type="text"
                    fullWidth
                    value={dataUser?.bank_number || ""}
                    size="small"
                    onChange={(e) => handleChangeData(e)}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    disabled
                  />{" "}
                  <Typography>จำนวนเงินที่จะถอน</Typography>
                  <CurrencyInput
                    name="amount"
                    value={rowData?.amount || ""}
                    onChangeEvent={(e) => handleChangeData(e)}
                    style={{
                      width: "100%",
                      borderRadius: "2px",
                      height: "40px",
                      border: "1px solid #b9b9b9",
                      padding: "10px",
                      fontSize: "18px",
                      textAlign: "right",
                    }}
                    precision="0"
                  />
                  {/* <TextField
                                        name="amount"
                                        type="number"
                                        fullWidth
                                        value={rowData.amount || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        InputProps={{
                                            inputProps: {
                                                min: 0
                                            }
                                        }}
                                    // disabled
                                    />{" "} */}
                  <Box sx={{ textAlign: "right", mt: 2 }}>
                    <Button
                      variant="contained"
                      disabled={checkPermissionDisabled(
                        "withdraw",
                        "approve_withdraw_manual"
                      )}
                      sx={{ background: "linear-gradient(#0072B1, #41A3E3)" }}
                      onClick={() => submitWithdraw()}
                    >
                      <Typography sx={{ color: "#ffff" }}>
                        ยืนยันทำรายการ
                      </Typography>
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper></Paper>
          <Card
            fullWidth
            sx={{
              bgcolor: "#101D35",
            }}
          >
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                Turn Type
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3" }}
              >
                -
                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                บาท
              </Typography>
            </CardContent>
          </Card>

          <Card fullWidth sx={{ mt: 4, bgcolor: "#101D35" }}>
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                {" "}
                ยอดเครดิตที่ต้องทำ
              </Typography>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3" }}
              >
                -
                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                {" "}
                บาท
              </Typography>
            </CardContent>
          </Card>
          <Card fullWidth sx={{ mt: 3, bgcolor: "#101D35" }}>
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                Total
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3" }}
              >
                -
                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                บาท
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid style={{ marginTop: "20px" }}>
        <Table
          columns={columns}
          dataSource={transaction}
          onChange={onChange}
          size="small"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          summary={(pageData) => {
            let totalCredit = 0;
            let totalBefore = 0;
            let totalAfter = 0;
            let totalSumCredit = "";
            let totalSumCreditBefore = "";
            let totalSumCreditAfter = "";

            pageData.forEach(
              ({
                credit,
                credit_before,
                credit_after,
                sumCredit,
                sumCreditBefore,
                sumCreditAfter,
              }) => {
                totalCredit += parseInt(credit);
                totalBefore += parseInt(credit_before);
                totalAfter += parseInt(credit_after);
                totalSumCredit = sumCredit;
                totalSumCreditBefore = sumCreditBefore;
                totalSumCreditAfter = sumCreditAfter;
              }
            );
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell>
                    {" "}
                    <Typography align="center" sx={{ fontWeight: "bold" }}>
                      {" "}
                      ยอดรวม{" "}
                    </Typography>{" "}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                  <Table.Summary.Cell>
                    {" "}
                    <Typography
                      align="center"
                      sx={{ fontWeight: "bold", color: "#129A50" }}
                    >
                      {Intl.NumberFormat("TH").format(parseInt(totalCredit))}
                    </Typography>{" "}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                  <Table.Summary.Cell />
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell>
                    {" "}
                    <Typography align="center" sx={{ fontWeight: "bold" }}>
                      {" "}
                      ยอดรวมทั้งหมด{" "}
                    </Typography>{" "}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                  <Table.Summary.Cell>
                    {" "}
                    <Typography
                      align="center"
                      sx={{ fontWeight: "bold", color: "#129A50" }}
                    >
                      {!totalSumCredit
                        ? 0
                        : Intl.NumberFormat("TH").format(
                            parseInt(totalSumCredit)
                          )}
                    </Typography>{" "}
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                  <Table.Summary.Cell />
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Grid>
      <LoadingModal open={loading} />
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
    </Layout>
  );
}

export default withAuth(withdraw);
