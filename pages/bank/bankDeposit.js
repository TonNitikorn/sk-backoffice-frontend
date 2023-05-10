import React, { useState, useEffect ,useRef} from "react";
import Layout from "../../theme/Layout";
import {
  Grid,
  Typography,
  TextField,
  Paper,
  Button,
  CssBaseline,
  MenuItem,
  Box,
  IconButton,
  Chip,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@mui/material";
import hostname from "../../utils/hostname";
import axios from "axios";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingModal from "../../theme/LoadingModal";
import MaterialTableForm from "../../components/materialTableForm";
import moment from "moment/moment";
import { signOut } from "../../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../store/store";
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function bankDeposit() {

  const dispatch = useAppDispatch();
  const router = useRouter()
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [bank, setBank] = useState();
  const [rowData, setRowData] = useState({});
  const [dataAPI, setDataAPI] = useState({});
  const [scbApi, setScbApi] = useState();
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogAddSCB, setOpenDialogAddSCB] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedDateRange, setSelectedDateRange] = useState({
    birthdate: moment().format("YYYY-MM-DD"),
  });

  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const handleChangeDataAPI = async (e) => {
    setDataAPI({ ...dataAPI, [e.target.name]: e.target.value });
  };

  const handleClickSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleClose = (event, reason) => {
    setOpenSnackbar(false);
  };

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

  const getBank = async () => {
    // setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/bank/bank_list`,
      });
      let resData = res.data;
      let no = 1;
      resData.map((item) => {
        item.no = no++;
        item.birthdate = moment(item.birthdate).format("DD-MM-YYYY")
      });
      let data = resData.filter((item) => item.type === "DEPOSIT")
      setBank(data);
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

  const editBank = async () => {
    setLoading(true);

    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/bank/update_bank/`,
        data: {
          "uuid": rowData.uuid,
          "bank_no": rowData.no,
          "bank_number": rowData.bank_number,
          "bank_name": rowData.bank_name,
          "bank_account_name": rowData.bank_account_name,
          "bank_total": "0.00",
          "type": rowData.type,
          "tel": rowData.tel,
          "birthdate": selectedDateRange.birthdate,
          "pin": rowData.pin,
          "device_id": rowData.device_id,
          "status": rowData.status,
          "sub_type": "APP",
          "is_decimal": "TRUE",
          "username_ibanking": rowData.username_ibanking,
          "password_ibanking": rowData.password_ibanking,
          "qr_code": "data.qr_code",
          "status_system": rowData.status_system
        },
      });
      if (res.data.message === "แก้ไขบัญชีธนาคารสำเร็จ") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "แก้ไขข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 2000,
        });
        setOpenDialogAdd(false);
        setRowData({});
        getBank();
        setLoading(false);
      }
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

  const addBank = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/bank/create_bank`,
        data: {
          "bank_no": rowData.no,
          "bank_number": rowData.bank_number,
          "bank_name": rowData.bank_name,
          "bank_account_name": rowData.bank_account_name,
          "bank_total": "0.00",
          "type": rowData.type,
          "tel": rowData.tel,
          "birthdate": selectedDateRange.birthdate,
          "pin": rowData.pin,
          "device_id": rowData.device_id,
          "status": rowData.status,
          "sub_type": "APP",
          "is_decimal": "TRUE",
          "username_ibanking": rowData.username_ibanking,
          "password_ibanking": rowData.password_ibanking,
          "qr_code": "data.qr_code",
          "status_system": rowData.status_system
        },
      });
      console.log(res.data);

      if (res.data.message === "สร้างบัญชีธนาคารสำเร็จ") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "เพิ่มข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 2000,
        });
        setOpenDialogAdd(false);
        setRowData({});
        getBank();
        setLoading(false);
      }
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
      dataIndex: "tel",
      title: "โทรศัพท์",
      align: "center",
      ...getColumnSearchProps('tel'),
      render: (item) => (
        <Typography
          style={{
            fontSize: '14px'
          }}
        >{item}</Typography>
      ),
    },
    {
      dataIndex: "birthdate",
      title: "วัน/เดือน/ปีเกิด",
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
      dataIndex: 'status',
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={item === "ACTIVE" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
          size="small"
          style={{
            // padding: 5,
            backgroundColor: item === "ACTIVE" ? "#129A50" : "#FFB946",
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
      dataIndex: 'type',
      title: "ประเภท",
      align: "center",
      render: (item) => (
        <Chip
          label={item === "DEPOSIT" ? "สำหรับฝาก" : "สำหรับถอน"}
          size="small"
          style={{
            // padding: 5,
            backgroundColor: item === "DEPOSIT" ? "#129A50" : "#FFB946",
            color: "#fff",
            minWidth: "120px"
          }}
        />
      ),
    },


    {
      title: "แก้ไข",
      align: "center",
      render: (item, data) => {
        return (
          <>
            <IconButton
              onClick={async () => {
                setRowData(data);
                setOpenDialogAdd({
                  open: true,
                  type: "edit",
                });
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },

    {
      title: "ลบ", align: "center",
      render: (item, data) => {
        return (
          <>
            <IconButton
              onClick={async () => {
                Swal.fire({
                  title: "ยืนยันการลบข้อมูล",
                  icon: "info",
                  showCancelButton: true,
                  cancelButtonColor: "#EB001B",
                  confirmButtonColor: "#129A50",
                  cancelButtonText: "ยกเลิก",
                  confirmButtonText: "ยืนยัน",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    try {
                      let res = await axios({
                        headers: {
                          Authorization:
                            "Bearer " +
                            localStorage.getItem("access_token"),
                        },
                        method: "Post",
                        url: `${hostname}/bank/delete_bank`,
                        data: {
                          uuid: data.uuid
                        }
                      });
                      if (
                        res.data.message === "ลบบัญชีธนาคารสำเร็จ"
                      ) {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "ลบบัญชีธนาคารสำเร็จ",
                          showConfirmButton: false,
                          timer: 2000,
                        });
                        getBank();
                      }
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
                  }
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ]

  useEffect(() => {
    getBank();
  }, []);

  return (
    <Layout title="bank">
      <CssBaseline />

      <Paper sx={{ p: 3 }}>
        <Typography
          sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
        >
          บัญชีธนาคารสำหรับฝาก
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="end"
          alignItems="center"
        >

          <Box>
            <Button
              variant="contained"
              // disabled={!preference.memberSystem && preference.memberView}
              sx={{
                mr: "8px",
                my: 2,
                justifyContent: "flex-end",
                boxShadow: 1,
                background: "#41A3E3",
              }}
              onClick={() =>
                setOpenDialogAdd({
                  open: true,
                  type: "add",
                })
              }
            >
              <PersonAddAltIcon sx={{ color: "white" }} />{" "}
              <Typography sx={{ color: "white", ml: 1 }}>
                เพิ่มบัญชีธนาคาร
              </Typography>
            </Button>
          </Box>
        </Grid>
        <Table
          columns={columns}
          dataSource={bank}
          onChange={onChange}
          size="small"
          pagination={{
            current: page,
            pageSize: pageSize,
            onChange: (page, pageSize) => {
              setPage(page)
              setPageSize(pageSize)
            }
          }} />

      </Paper>

      {/* <Paper sx={{ p: 3, mt: 2 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{ fontSize: "24px", textDecoration: "underline #129A50 3px" }}
          >
            SCB API
          </Typography>
          <Box>
            <Button
              variant="contained"
              // disabled={!preference.memberSystem && preference.memberView}
              sx={{
                mr: "8px",
                my: 2,
                justifyContent: "flex-end",
                boxShadow: 1,
                background: "#129A50",
              }}
              onClick={() =>
                setOpenDialogAddSCB({
                  open: true,
                  type: "add",
                })
              }
            >
              <AddCircleOutlineIcon sx={{ color: "white" }} />{" "}
              <Typography sx={{ color: "white", ml: 1 }}>
                เพิ่มแอปพลิเคชัน
              </Typography>
            </Button>
          </Box>
        </Grid>
        {/* <TableForm
          data={scbApi}
          pageSize={5}
          columns={[
            {
              field: "noScb",
              title: "ลำดับ",
              maxWidth: 80,
              align: "center",
            },

            {
              field: "accountFrom",
              title: "หมายเลขบัญชี",
              align: "center",
            },

            {
              field: "status",
              title: "สถานะ",
              align: "center",
              render: (item) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={item.status}
                      onChange={(e) =>
                        setRowData({ ...item, status: e.target.checked })
                      }
                      color="secondary"
                    />
                  }
                />
              ),
            },

            {
              field: "api_Refresh",
              title: "api_Key",
              align: "center",
            },

            {
              field: "bank_account_name_app",
              title: "ชื่อบัญชี",
              align: "center",
            },

            {
              field: "bank_name_app",
              title: "ชื่อธนาคาร",
              align: "center",
            },

            {
              field: "device_Id",
              title: "หมายเลขอุปกรณ์",
              align: "center",
            },

            {
              title: "ประเภท",
              align: "center",
              render: (item) => (
                <Chip
                  label={item.status_type === 1 ? "ฝาก" : "ถอน"}
                  size="small"
                  style={{
                    padding: 10,
                    paddingTop: 12,
                    backgroundColor:
                      item.status_type === 1 ? "#129A50" : "#FFB946",
                    color: "#eee",
                  }}
                />
              ),
            },

            {
              title: "แก้ไข",
              align: "center",
              render: (item) => {
                return (
                  <>
                    <IconButton
                      onClick={async () => {
                        setDataAPI(item);
                        setOpenDialogAddSCB({
                          open: true,
                          type: "edit",
                        });
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </>
                );
              },
            },
          ]}
        /> */}
      {/* </Paper> */}

      <Dialog
        open={openDialogAdd}
        onClose={() => {
          setOpenDialogAdd(false);
          setRowData({});
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {openDialogAdd.type === "add"
            ? "เพิ่มบัญชีธนาคาร"
            : "แก้ไขบัญชีธนาคาร"}
        </DialogTitle>

        <DialogContent>
          <Grid container justifyContent="center" spacing={2}>
            <Grid container item xs={6}>
              <Typography>
                เลือกธนาคาร *
              </Typography>
              <TextField
                name="bank_name"
                type="text"
                value={rowData.bank_name || ""}
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                <MenuItem selected disabled>
                  เลือกธนาคาร
                </MenuItem>
                <MenuItem value="scb">ไทยพาณิชย์</MenuItem>
                <MenuItem value="kbnk">กสิกรไทย</MenuItem>
                <MenuItem value="truemoney">Truemoney Wallet</MenuItem>
              </TextField>
            </Grid>
            <Grid container item xs={6}>
              <Typography >ประเภท *</Typography>
              <TextField
                name="type"
                type="text"
                value={rowData.type || ""}
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                <MenuItem selected disabled value>
                  เลือก ประเภท
                </MenuItem>
                <MenuItem value="DEPOSIT">การฝาก</MenuItem>
                <MenuItem value="WITHDRAW">การถอน</MenuItem>
              </TextField>
            </Grid>
            {rowData.bank_type === "1" ? (
              <Grid container item xs={6}>
                <Typography >การฝาก *</Typography>
                <TextField
                  name="type_deposit"
                  type="text"
                  value={rowData.type_deposit || ""}
                  fullWidth
                  size="small"
                  onChange={(e) => handleChangeData(e)}
                  variant="outlined"
                  sx={{ bgcolor: "white" }}
                  select
                >
                  <MenuItem selected disabled value>
                    เลือกประเภทการฝาก
                  </MenuItem>
                  <MenuItem value="0">ฝากปกติ</MenuItem>
                  <MenuItem value="1">ฝากทศนิยม</MenuItem>
                </TextField>
              </Grid>
            ) : (
              ""
            )}
            <Grid container item xs={6}>
              <Typography >
                เลขที่บัญชี *
              </Typography>
              <TextField
                name="bank_number"
                type="text"
                value={rowData.bank_number || ""}
                placeholder="เลขที่บัญชี"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >USERNAME *</Typography>
              <TextField
                name="username_ibanking"
                type="text"
                value={rowData.username_ibanking || ""}
                placeholder="USERNAME"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >ชื่อบัญชี *</Typography>
              <TextField
                name="bank_account_name"
                type="text"
                value={rowData.bank_account_name || ""}
                placeholder="ชื่อบัญชี"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >PASSWORD *</Typography>
              <TextField
                name="password_ibanking"
                type="text"
                value={rowData.password_ibanking || ""}
                placeholder="PASSWORD"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            <Grid container item xs={6}>
              <Typography >PIN *</Typography>
              <TextField
                name="pin"
                type="number"
                value={rowData.pin || ""}
                placeholder="PIN"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            <Grid container item xs={6}>
              <Typography >
                Status System *
              </Typography>
              <TextField
                name="status_system"
                type="text"
                value={rowData.status_system || ""}
                placeholder="ชื่อ"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                <MenuItem selected disabled value>
                  เลือกสถานะระบบ
                </MenuItem>
                <MenuItem value="RUNNING">Online</MenuItem>
                <MenuItem value="CLOSE">Offline</MenuItem>
              </TextField>
            </Grid>
            <Grid container item xs={6}>
              <Typography >ลำดับที่ *</Typography>
              <TextField
                name="no"
                type="text"
                value={rowData.no || ""}
                placeholder="ลำดับที่"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >วัน/เดือน/ปี เกิด *</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="date"
                name="birthdate"
                value={selectedDateRange.birthdate}
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
            </Grid>
            <Grid container item xs={6}>
              <Typography >device_id *</Typography>
              <TextField
                name="device_id"
                type="text"
                value={rowData.device_id || ""}
                placeholder="device_id"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >เบอร์โทรศัพท์ *</Typography>
              <TextField
                name="tel"
                type="number"
                value={rowData.tel || ""}
                placeholder="เบอร์โทรศัพท์"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >สถานะ *</Typography>
              <TextField
                name="status"
                type="text"
                value={rowData.status || ""}
                placeholder="ชื่อ"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                <MenuItem selected disabled value>
                  เลือกสถานะ
                </MenuItem>
                <MenuItem value="ACTIVE">เปิดใช้งาน</MenuItem>
                <MenuItem value="INACTIVE">ปิดใช้งาน</MenuItem>
              </TextField>
            </Grid>
            {rowData.bank_type === "add" ? "" : <Grid container item xs={6}></Grid>}

            <Grid container justifyContent='center' spacing={1} sx={{ mt: 2 }}>
              <Grid container item xs={4}>
                <Button
                  // variant="outlined"
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => {
                    openDialogAdd.type === "add" ? addBank() : editBank()
                  }}
                  sx={{
                    mt: 3,
                    // background: "#129A50",
                    color: '#fff',

                  }}
                >
                  {openDialogAdd.type === "add"
                    ? "เพิ่มบัญชีธนาคาร"
                    : "แก้ไขบัญชีธนาคาร"}
                </Button>
              </Grid>
              <Grid container item xs={4}>
                <Button
                  // variant="outlined"
                  variant="contained"
                  size="large"
                  fullWidth
                  color="secondary"
                  onClick={() => {
                    setOpenDialogAdd(false)
                  }}
                  sx={{
                    mt: 3,
                    // background: "#129A50",
                    // color: '#fff'
                  }}
                >
                  ยกเลิก
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialogAddSCB.open}
        onClose={() => {
          setOpenDialogAddSCB(false);
          setDataAPI({});
        }}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {openDialogAdd.type === "add"
            ? "เพิ่มข้อมูลแอปพลิเคชัน"
            : "แก้ไขข้อมูลแอปพลิเคชัน"}
        </DialogTitle>

        <DialogContent>
          <Grid container justifyContent="center" spacing={2}>
            <Grid container item xs={6}>
              <Typography >api_Key *</Typography>
              <TextField
                name="api_Refresh"
                type="text"
                placeholder="api_Key"
                value={dataAPI.api_Refresh || ""}
                fullWidth
                size="small"
                onChange={(e) => handleChangeDataAPI(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >ประเภท *</Typography>
              <TextField
                name="status_type"
                type="text"
                value={dataAPI.status_type || ""}
                fullWidth
                size="small"
                onChange={(e) => handleChangeDataAPI(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                {/* <MenuItem selected disabled value>
                  เลือกประเภท
                </MenuItem> */}
                <MenuItem value="1">การฝาก</MenuItem>
                <MenuItem value="0">การถอน</MenuItem>
              </TextField>
            </Grid>

            <Grid container item xs={6}>
              <Typography >
                หมายเลขอุปกรณ์ *
              </Typography>
              <TextField
                name="device_Id"
                type="text"
                value={dataAPI.device_Id || ""}
                placeholder="device_Id"
                fullWidth
                size="small"
                onChange={(e) => handleChangeDataAPI(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >
                ชื่อธนาคาร *
              </Typography>
              <TextField
                name="bank_name_app"
                type="text"
                value={"SCB"}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ bgcolor: "white" }}
                disabled
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >
                หมายเลขบัญชี *
              </Typography>
              <TextField
                name="accountFrom"
                type="text"
                value={dataAPI.accountFrom || ""}
                placeholder="หมายเลขบัญชี"
                fullWidth
                size="small"
                onChange={(e) => handleChangeDataAPI(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid container item xs={6}>
              <Typography >ชื่อบัญชี *</Typography>
              <TextField
                name="bank_account_name_app"
                type="text"
                value={dataAPI.bank_account_name_app || ""}
                placeholder="ชื่อบัญชี"
                fullWidth
                size="small"
                onChange={(e) => handleChangeDataAPI(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            <Grid container item xs={6}>
              <Typography >สถานะ *</Typography>
              <TextField
                name="status"
                type="text"
                value={dataAPI.status || ""}
                placeholder="ชื่อ"
                fullWidth
                size="small"
                onChange={(e) => handleChangeDataAPI(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                <MenuItem selected disabled value>
                  เลือกสถานะระบบ
                </MenuItem>
                <MenuItem value="0">ปิด</MenuItem>
                <MenuItem value="1">เปิด</MenuItem>
              </TextField>
            </Grid>

            <Grid container item xs={6}></Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  {
                    openDialogAdd.type === "add" ? addApiSCB() : editApiSCB();
                  }
                }}
                sx={{
                  mt: 3,
                  background: "#129A50",
                }}
              >
                {openDialogAdd.type === "add"
                  ? "เพิ่มข้อมูลแอปพลิเคชัน"
                  : "แก้ไขข้อมูลแอปพลิเคชัน"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={openSnackbar}
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

export default bankDeposit;
