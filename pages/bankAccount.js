import React, { useState, useEffect } from "react";
import Layout from "../theme/Layout";
import {
  Grid,
  Typography,
  TextField,
  Paper,
  Button,
  CssBaseline,
  MenuItem,
  FormControl,
  OutlinedInput,
  Switch,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Box,
  Chip,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@mui/material";
import hostname from "../utils/hostname";
import axios from "axios";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
// import TableForm from "../components/tableForm";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
// import { makeStyles } from "@mui/styles";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import withAuth from "../routes/withAuth";
import LoadingModal from "../theme/LoadingModal";

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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function bankAccount() {
//   const classes = useStyles();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [bank, setBank] = useState();
  const [rowData, setRowData] = useState({});
  const [dataAPI, setDataAPI] = useState({});
  const [scbApi, setScbApi] = useState();
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [openDialogAddSCB, setOpenDialogAddSCB] = useState(false);
  const [loading, setLoading] = useState(false);

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

//   const getBank = async () => {
//     setLoading(true);
//     try {
//       let res = await axios({
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//         method: "get",
//         url: `${hostname}/api/bank`,
//       });
//       let resData = res.data.data;
//       let no = 1;
//       resData.map((item) => {
//         item.no = no++;
//       });
//       setBank(resData);

//       let scb = await axios({
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//         method: "get",
//         url: `${hostname}/api/bank/scb`,
//       });
//       let scbData = scb.data.data;
//       let noScb = 1;
//       scbData.map((item) => {
//         item.noScb = noScb++;
//       });
//       setScbApi(scbData);

//       setLoading(false);
//     } catch (error) {
//       if (
//         error.response.data.error.status_code === 401 &&
//         error.response.data.error.message === "Unauthorized"
//       ) {
//         dispatch(signOut());
//         localStorage.clear();
//         router.push("/auth/login");
//       }
//     }
//   };

//   const addBank = async () => {
//     setLoading(true);

//     try {
//       let res = await axios({
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//         method: "post",
//         url: `${hostname}/api/bank`,
//         data: {
//           account_sequence: rowData.account_sequence,
//           account_set: rowData.account_set,
//           bank_account_name: rowData.bank_account_name,
//           bank_name: rowData.bank_name,
//           bank_number: rowData.bank_number,
//           bank_sms: rowData.bank_sms,
//           bank_status: rowData.bank_status,
//           bank_type: rowData.bank_type,
//           password: rowData.password,
//           status_system: rowData.status_system,
//           type_deposit: rowData.type_deposit,
//           username: rowData.username,
//         },
//       });

//       if (res.data.message === "เพิ่มข้อมูลเรียบร้อยแล้ว") {
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: "เพิ่มข้อมูลเรียบร้อย",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         setOpenDialogAdd(false);
//         setRowData({});
//         getBank();
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log(error);
//       if (
//         error.response.data.error.status_code === 401 &&
//         error.response.data.error.message === "Unauthorized"
//       ) {
//         dispatch(signOut());
//         localStorage.clear();
//         router.push("/auth/login");
//       }
//     }
//   };

//   const editBank = async () => {
//     setLoading(true);

//     try {
//       let res = await axios({
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//         method: "put",
//         url: `${hostname}/api/bank/${uuid}`,
//         data: {
//           account_sequence: rowData.account_sequence,
//           account_set: rowData.account_set,
//           bank_account_name: rowData.bank_account_name,
//           bank_name: rowData.bank_name,
//           bank_number: rowData.bank_number,
//           bank_sms: rowData.bank_sms,
//           bank_status: rowData.bank_status,
//           bank_type: rowData.bank_type,
//           password: rowData.password,
//           status_system: rowData.status_system,
//           type_deposit: rowData.type_deposit,
//           username: rowData.username,
//         },
//       });

//       if (res.data.message === "แก้ไขข้อมูลเรียบร้อย") {
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: "แก้ไขข้อมูลเรียบร้อย",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         setOpenDialogAdd(false);
//         setRowData({});
//         getBank();
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log(error);
//       if (
//         error.response.data.error.status_code === 401 &&
//         error.response.data.error.message === "Unauthorized"
//       ) {
//         dispatch(signOut());
//         localStorage.clear();
//         router.push("/auth/login");
//       }
//     }
//   };

//   const addApiSCB = async () => {
//     setLoading(true);

//     try {
//       let res = await axios({
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//         method: "post",
//         url: `${hostname}/api/bank/createscb`,
//         data: {
//           accountFrom: dataAPI.accountFrom,
//           api_Refresh: dataAPI.api_Refresh,
//           bank_account_name_app: dataAPI.bank_account_name_app,
//           bank_name_app: "SCB",
//           device_Id: dataAPI.device_Id,
//           status: dataAPI.status,
//           status_type: dataAPI.status_type,
//         },
//       });

//       if (res.data.message === "เพิ่มข้อมูลเรียบร้อยแล้ว") {
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: "เพิ่มข้อมูลเรียบร้อย",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         setOpenDialogAddSCB(false);
//         setDataAPI({});
//         getBank();
//         setLoading(false);
//       } else {
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "Not Success มี data in table",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         setOpenDialogAddSCB(false);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log(error);
//       if (
//         error.response.data.error.status_code === 401 &&
//         error.response.data.error.message === "Unauthorized"
//       ) {
//         dispatch(signOut());
//         localStorage.clear();
//         router.push("/auth/login");
//       }
//     }
//   };

//   const editApiSCB = async () => {
//     setLoading(true);

//     try {
//       let res = await axios({
//         headers: {
//           Authorization: "Bearer " + localStorage.getItem("access_token"),
//         },
//         method: "put",
//         url: `${hostname}/api/bank/updatescb/${dataAPI.uuid}`,
//         data: {
//           accountFrom: dataAPI.accountFrom,
//           api_Refresh: dataAPI.api_Refresh,
//           bank_account_name_app: dataAPI.bank_account_name_app,
//           bank_name_app: "SCB",
//           device_Id: dataAPI.device_Id,
//           status: dataAPI.status,
//           status_type: dataAPI.status_type,
//         },
//       });

//       if (res.data.data === "update Success") {
//         Swal.fire({
//           position: "center",
//           icon: "success",
//           title: "แก้ไขข้อมูลเรียบร้อย",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         setOpenDialogAddSCB(false);
//         setDataAPI({});
//         getBank();
//         setLoading(false);
//       } else {
//         Swal.fire({
//           position: "center",
//           icon: "error",
//           title: "Not Success มี data in table",
//           showConfirmButton: false,
//           timer: 2000,
//         });
//         setOpenDialogAddSCB(false);
//         setLoading(false);
//       }
//     } catch (error) {
//       console.log(error);
//       if (
//         error.response.data.error.status_code === 401 &&
//         error.response.data.error.message === "Unauthorized"
//       ) {
//         dispatch(signOut());
//         localStorage.clear();
//         router.push("/auth/login");
//       }
//     }
//   };

//   useEffect(() => {
//     getBank();
//   }, []);

  return (
    <Layout>
      <Typography
        sx={{ fontSize: "24px", textDecoration: "underline #129A50 3px" }}
      >
        บัญชีธนาคาร
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{ fontSize: "24px", textDecoration: "underline #129A50 3px" }}
          >
            ข้อมูลบัญชีธนาคาร
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
        {/* <TableForm
          data={bank}
          pageSize={10}
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
              minWidth: "220px",
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
                    ) : item.bank_name === "BAAC" ? (
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
                  <Grid item xs={9}>
                    <Grid sx={{ ml: 2, mt: 1 }}>
                      <CopyToClipboard text={item.bank_number}>
                        <div className={classes.copy}>
                          <Button
                            sx={{
                              fontSize: "14px",
                              p: 0,
                              color: "blue",
                            }}
                            onClick={handleClickSnackbar}
                          >
                            {item.bank_number}
                          </Button>
                        </div>
                      </CopyToClipboard>
                    </Grid>
                    <Grid>
                      <Typography sx={{ fontSize: "14px" }}>
                        {item.bank_account_name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ),
            },

            {
              field: "account_sequence",
              title: "ลำดับที่",
              align: "center",
            },

            {
              field: "account_set",
              title: "ชุดที่",
              align: "center",
            },

            {
              title: "SMS",
              align: "center",
              render: (item) => (
                <Chip
                  label={
                    item.bank_sms === "1" ? "เปิดรับ SMS" : "ไม่เปิดรับ SMS"
                  }
                  size="small"
                  style={{
                    padding: 10,
                    paddingTop: 12,
                    backgroundColor:
                      item.bank_sms === "1" ? "#129A50" : "#FFB946",
                    color: "#eee",
                  }}
                />
              ),
            },

            {
              title: "สถานะ",
              align: "center",
              render: (item) => (
                <Chip
                  label={item.bank_status === "1" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                  size="small"
                  style={{
                    padding: 10,
                    paddingTop: 12,
                    backgroundColor:
                      item.bank_status === "1" ? "#129A50" : "#FFB946",
                    color: "#eee",
                  }}
                />
              ),
            },

            {
              title: "ประเภท",
              align: "center",
              render: (item) => (
                <Chip
                  label={item.bank_type === "1" ? "สำหรับฝาก" : "สำหรับถอน"}
                  size="small"
                  style={{
                    padding: 10,
                    paddingTop: 12,
                    backgroundColor:
                      item.bank_type === "1" ? "#129A50" : "#FFB946",
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
                        setRowData(item);
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
              title: "ลบ",
              align: "center",
              render: (item) => {
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
                                method: "DELETE",
                                url: `${hostname}/api/bank/${item.uuid}`,
                              });
                              if (
                                res.data.message === "ลบข้อมูลเรียบร้อยแล้ว"
                              ) {
                                Swal.fire({
                                  position: "center",
                                  icon: "success",
                                  title: "ลบข้อมูลเรียบร้อย",
                                  showConfirmButton: false,
                                  timer: 2000,
                                });
                                getBank();
                              }
                            } catch (error) {
                              console.log(error);
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
          ]}
        /> */}
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
        open={openDialogAdd.open}
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>ประเภท *</Typography>
              <TextField
                name="bank_type"
                type="text"
                value={rowData.bank_type || ""}
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
                <MenuItem value="1">การฝาก</MenuItem>
                <MenuItem value="2">การถอน</MenuItem>
              </TextField>
            </Grid>
            {rowData.bank_type === "1" ? (
              <Grid item xs={5}>
                <Typography sx={{ mt: 2, color: "gray" }}>การฝาก *</Typography>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>USERNAME *</Typography>
              <TextField
                name="username"
                type="text"
                value={rowData.username || ""}
                placeholder="USERNAME"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>ชื่อบัญชี *</Typography>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>PASSWORD *</Typography>
              <TextField
                name="password"
                type="text"
                value={rowData.password || ""}
                placeholder="PASSWORD"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>
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
                <MenuItem value="1">Online</MenuItem>
                <MenuItem value="0">Offline</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>ลำดับที่ *</Typography>
              <TextField
                name="account_sequence"
                type="text"
                value={rowData.account_sequence || ""}
                placeholder="ลำดับที่"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>SMS *</Typography>
              <TextField
                name="bank_sms"
                type="text"
                value={rowData.bank_sms || ""}
                placeholder="ชื่อ"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                select
              >
                <MenuItem selected disabled value>
                  เลือกสถานะSMS
                </MenuItem>
                <MenuItem value="1">เปิดรับ SMS</MenuItem>
                <MenuItem value="0">ปิดรับ SMS</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>ชุดที่ *</Typography>
              <TextField
                name="account_set"
                type="text"
                value={rowData.account_set || ""}
                placeholder="ชุดที่"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>สถานะ *</Typography>
              <TextField
                name="bank_status"
                type="text"
                value={rowData.bank_status || ""}
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
                <MenuItem value="1">เปิดใช้งาน</MenuItem>
                <MenuItem value="0">ปิดใช้งาน</MenuItem>
              </TextField>
            </Grid>
            {rowData.bank_type === "1" ? "" : <Grid item xs={5}></Grid>}
            <Grid item xs={3}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() =>
                  openDialogAdd.type === "add" ? addBank() : editBank()
                }
                sx={{
                  mt: 3,
                  background: "#129A50",
                }}
              >
                {openDialogAdd.type === "add"
                  ? "เพิ่มบัญชีธนาคาร"
                  : "แก้ไขบัญชีธนาคาร"}
              </Button>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>api_Key *</Typography>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>ประเภท *</Typography>
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

            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>
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
            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>ชื่อบัญชี *</Typography>
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

            <Grid item xs={5}>
              <Typography sx={{ mt: 2, color: "gray" }}>สถานะ *</Typography>
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

            <Grid item xs={5}></Grid>
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

export default (bankAccount);
