import React, { useState, useEffect, useRef } from "react";
import Layout from '../theme/Layout'
import {
   Grid,
   Button,
   TextField,
   Typography,
   Chip,
   Box,
   IconButton,
   MenuItem,
   Paper,
   Dialog, DialogTitle, DialogContent, TableContainer, TableRow, TableCell, FormControl, RadioGroup, Radio, FormControlLabel
} from "@mui/material";
import Image from 'next/image';
import hostname from "../utils/hostname";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment/moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";
import { signOut } from "../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../store/store";
import LoadingModal from "../theme/LoadingModal";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { Table, Input, Space, } from 'antd';


const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6}
      ref={ref}
      variant="filled" {...props}
   />;
});

function withdrawpending() {
   const dispatch = useAppDispatch();
   const router = useRouter()
   const [open, setOpen] = useState(false)
   const [loading, setLoading] = useState(false)
   const [openDialogApprove, setOpenDialogApprove] = useState(false)
   const [rowData, setRowData] = useState({})
   const [selectedDateRange, setSelectedDateRange] = useState({
      start: moment().format("YYYY-MM-DD 00:00"),
      end: moment().format("YYYY-MM-DD 23:59"),
   });
   const [content, setContent] = useState(false)
   const [dataWithdraw, setDataWithdraw] = useState()
   const [bankData, setBankData] = useState([]);
   const [selectedBank, setSelectedBank] = useState();
   const [openDialogView, setOpenDialogView] = useState(false);
   let temp
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(10)
   const [statusWithdraw, setStatusWithdraw] = useState(null);

   const handleChange = (uuid) => {
      setSelectedBank(uuid);
   };


   const handleChangeData = async (e) => {
      setRowData({ ...rowData, [e.target.name]: e.target.value });
   };

   const handleClickSnackbar = () => {
      setOpen(true);
   };

   const handleClose = (event, reason) => {
      setOpen(false);
   };

   const getDataWithdraw = async () => {
      // setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "get",
            url: `${hostname}/transaction/withdraw_list`,
            data: {
               start: selectedDateRange.start,
               end: selectedDateRange.end
            }
         });
         let resData = res.data

         let no = 1
         resData.map((item) => {
            item.no = no++;
            item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
            item.update_at = moment(item.update_at).format('DD/MM/YYYY HH:mm')
            item.bank_account_name = item.members?.fname + ' ' + item.members?.lname
            item.username = item.members.username
         })
         temp = resData.length;

         setDataWithdraw(resData)
         // setLoading(false);
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


   const pendingWithdraw = async () => {
      // setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "get",
            url: `${hostname}/transaction/withdraw_list`,
            data: {
               start: selectedDateRange.start,
               end: selectedDateRange.end
            }
         });
         let resData = res.data

         let no = 1
         resData.map((item) => {
            item.no = no++;
            item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
            item.update_at = moment(item.update_at).format('DD/MM/YYYY HH:mm')
            item.bank_account_name = item.members?.fname + ' ' + item.members?.lname
            item.username = item.members.username
         })
         // console.log('temp 1 >> ', temp)
         // console.log('resData.length 2>> ', resData.length)
         // let tempRes =  temp + res.lresData.length
         // console.log('tempRes', tempRes)

         if (temp != resData.length) {
            playAudio();
            setDataWithdraw(resData)
            getDataWithdraw();
         }


         setDataWithdraw(resData)
         // setLoading(false);
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
         let lastData = resData.filter(item => item.type === "WITHDRAW")
         let no = 1;
         lastData.map((item) => {
            item.no = no++;
            item.birthdate = moment(item.birthdate).format("DD-MM-YYYY")
         });


         setBankData(lastData);
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

   const approveWithdraw = async (uuid) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: { Authorization: "Bearer " + localStorage.getItem("access_token"),},
            method: "post",
            url: `${hostname}/transaction/approve_withdraw_request`,
            data:
            {
               "uuid": uuid,
               "by_bank": selectedBank,
               "status_Withdraw": statusWithdraw,
               "content" : rowData.content || "Auto"
            }
         });
         if (res.data.message === "อนุมัติคำขอถอนเงินสำเร็จ") {
            Swal.fire({
               position: "center",
               icon: "success",
               title: "อนุมัติคำขอถอนเงินสำเร็จ",
               showConfirmButton: false,
               timer: 2000,
            });
            getBank()
            setOpenDialogApprove(false)
            setRowData({})
            setSelectedBank()
         }
         setLoading(false);
         getDataWithdraw()
      } catch (error) {
         console.log(error);
         if (error.response.data.error.status_code === 401 && error.response.data.error.message === "Unauthorized") {
            dispatch(signOut());
            localStorage.clear();
            router.push("/auth/login");
         }
         if (
            error.response.status === 401 && error.response.data.error.message === "Invalid Token"
         ) {
            dispatch(signOut());
            localStorage.clear();
            router.push("/auth/login");
         }
      }
   }

   const approveWithdrawManual = async (uuid) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: { Authorization: "Bearer " + localStorage.getItem("access_token"),},
            method: "post",
            url: `${hostname}/transaction/approve_manual_transaction`,
            data:
            {
               "uuid": uuid,
               "by_bank": selectedBank,
               "status_Withdraw": statusWithdraw,
               "content" : rowData.content || "Auto"
            }
         });
         if (res.data.message === "อนุมัติรายการสำเร็จ") {
            Swal.fire({
               position: "center",
               icon: "success",
               title: "อนุมัติคำขอถอนเงินสำเร็จ",
               showConfirmButton: false,
               timer: 2000,
            });
            getBank()
            setOpenDialogApprove(false)
            setRowData({})
            setSelectedBank()
         }
         setLoading(false);
         getDataWithdraw()
      } catch (error) {
         console.log(error);
         if (error.response.data.error.status_code === 401 && error.response.data.error.message === "Unauthorized") {
            dispatch(signOut());
            localStorage.clear();
            router.push("/auth/login");
         }
         if (
            error.response.status === 401 && error.response.data.error.message === "Invalid Token"
         ) {
            dispatch(signOut());
            localStorage.clear();
            router.push("/auth/login");
         }
      }
   }

   const handelwithdraw = () => {
      setOpenDialogApprove(false)
      Swal.fire({
         title: "ท่านต้องยกเลิกการถอน",
         html: `<h7>Username : ` + rowData.members?.username + `</h7> <br> 
                <h7>เป็นจำนวนเงิน : `+ rowData.credit + ' ฿ ' + `</h7> <br>
                <h7>ธนาคาร : `+ rowData.members?.bank_name + `</h7> <br>
                <h7>เลขบัญชี : `+ rowData.members?.bank_number + `</h7><br>
                <h7>เวลาที่ถอน : `+ rowData.create_at + `</h7> <br>`,
         icon: "info",
         showCancelButton: true,
         cancelButtonColor: "#EB001B",
         confirmButtonColor: "#058900",
         cancelButtonText: `ยกเลิก`,
         confirmButtonText: "ยืนยัน",
      }).then((result) => {
         if (result.isConfirmed) {
            cancelWithdraw();
         }
      });
   };

   const cancelWithdraw = async () => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/transaction/cancel_withdraw_request`,
            data:
            {
               "uuid": rowData.uuid,
               "content": content
            }
         });
         if (res.data.message === "อนุมัติคำขอถอนเงินสำเร็จ") {
            Swal.fire({
               position: "center",
               icon: "success",
               title: "อนุมัติคำขอถอนเงินสำเร็จ",
               showConfirmButton: false,
               timer: 2000,
            });
            setOpenDialogApprove(false)
            setRowData({})
         }
         setLoading(false);
         getDataWithdraw()
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


   useEffect(() => {
      getDataWithdraw()
      getBank()

   }, [])

   useEffect(() => {
      const interval = setInterval(() => {
         pendingWithdraw()
      }, 3000);
      return () => clearInterval(interval);
   }, []);


   function playAudio() {
      const audio = new Audio(
         "https://angpaos.games/wp-content/uploads/2023/04/achive-sound-132273.mp3"
      );
      audio.play();
   }

   const columns = [
      {
         title: 'อนุมัติ',
         align: 'center',
         render: (item, data) => (
            <>
               <IconButton
                  onClick={() => {
                     setRowData(data)
                     setOpenDialogApprove(true)
                  }}
               >
                  <AssignmentTurnedInIcon color="primary" />
               </IconButton>
            </>
         )
      },
      {
         title: 'สถานะ',
         dataIndex: 'status_transction',
         align: 'center',
         render: (item, data) => (
            <Chip label={
               item === "FAIL" ?
                  "ผิดพลาด" :
                  item === "CREATE" ?
                     "รออนุมัติ" :
                     item === "APPROVE" ?
                        "รออนุมัติ" :
                        item === "PROCESS" ?
                           "รอทำรายการ" :
                           item === "SUCCESS" ?
                              "สำเร็จ" :
                              item === "OTP" ?
                                 "OTP" :
                                 item === "REJECT" ?
                                    "ยกเลิก" :
                                    item === "MANUAL" ?
                                       "ถอนมือ" :
                                       item === "" ?
                                          "ทั้งหมด" :
                                          "-"
            }
               size="small"
               style={
                  {
                     padding: 10,
                     backgroundColor: item === "FAIL" ?
                        "#EB001B" :
                        item === "CREATE" ?
                           "#16539B" :
                           item === "APPROVE" ?
                              "#16539B" :
                              item === "PROCESS" ?
                                 "#FFB946" :
                                 item === "SUCCESS" ?
                                    "#129A50" :
                                    item === "OTP" ?
                                       "#FFB946" :
                                       item === "REJECT" ?
                                          "#FD3B52" :
                                          item === "MANUAL" ?
                                             "#E1772B" :
                                             item === "" ?
                                                "gray" :
                                                "gray",
                     // item === 1 ? "#129A50" : "#FFB946",
                     color: "#eee",
                  }
               }
            />
         )
      },

      {
         title: 'ธนาคาร',
         width: '200px',
         // ...getColumnSearchProps('bank_number'),
         render: (item, data) => <Grid container>
            <Grid item xs={3} sx={{ mt: 1 }}>
               {data.members.bank_name === "kbnk" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/kbnk.png"
                     }
                     alt="kbnk"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "truemoney" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/truemoney.png"
                     }
                     alt="truemoney"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "ktba" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/ktba.png"
                     }
                     alt="ktba"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "scb" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/scb.png"
                     }
                     alt="scb"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "bay" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/bay.png"
                     }
                     alt="bay"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "bbla" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/bbl.png"
                     }
                     alt="bbla"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "gsb" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/gsb.png"
                     }
                     alt="gsb"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "ttb" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/ttb.png"
                     }
                     alt="ttb"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "bbac" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/baac.png"
                     }
                     alt="bbac"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "icbc" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/icbc.png"
                     }
                     alt="icbc"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "tcd" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/tcd.png"
                     }
                     alt="tcd"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "citi" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/citi.png"
                     }
                     alt="citi"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "scbt" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/scbt.png"
                     }
                     alt="scbt"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "cimb" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/cimb.png"
                     }
                     alt="cimb"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "uob" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/uob.png"
                     }
                     alt="uob"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "hsbc" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/hsbc.png"
                     }
                     alt="hsbc"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "mizuho" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/mizuho.png"
                     }
                     alt="mizuho"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "ghb" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/ghb.png"
                     }
                     alt="ghb"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "lhbank" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/lhbank.png"
                     }
                     alt="lhbank"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "tisco" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/tisco.png"
                     }
                     alt="tisco"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "kkba" ? (
                  <Image
                     src={
                        "https://angpaos.games/wp-content/uploads/2023/03/kkba.png"
                     }
                     alt="kkba"
                     width={50}
                     height={50}
                  />
               ) : data.members.bank_name === "ibank" ? (
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
                  <CopyToClipboard text={data.members.bank_number}>
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
                           {data.members.bank_number}
                        </Button>
                     </div>
                  </CopyToClipboard>
               </Grid>
               <Grid sx={{ ml: 3, }}>
                  <Typography sx={{ fontSize: "14px" }}>
                     {data.members.fname}    {data.members.lname}
                  </Typography>
               </Grid>
            </Grid>
         </Grid >,
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
         title: 'ยอดเงินถอน',
         dataIndex: 'credit',
         align: 'center',
         render: (item, data) => (
            <Grid container justifyContent="center" >
               <Grid >
                  <Typography sx={{ fontSize: "14px" }} >
                     {Intl.NumberFormat("TH", { style: "currency", currency: "THB", }).format(parseInt(item))}
                  </Typography>
               </Grid>

            </Grid>
         )
      },

      {
         title: 'ประเภท',
         dataIndex: 'transfer_type',
         align: 'center',
         render: (item, data) => (
            <Chip label={
               item === "WITHDRAW" ?
                  "ถอนเงิน" :
                  item === "queue" ?
                     "อยู่ในคิว" :
                     item === "Normal" ?
                        "ปกติ" :
                        item === "Create" ?
                           "ปกติ" :
                           item === "Approve" ?
                              "อนุมัติ" :
                              item === "manual" ?
                                 "ถอนมือ" :
                                 item === "Manual" ?
                                    "ถอนมือ" :
                                    item === "Success" ?
                                       "อนุมัติ" :
                                       item === "-" ?
                                          "-" :
                                          item === "null" ?
                                             "-" :
                                             item === "Process" ?
                                                "ดำเนินการ" :
                                                item === "Withdraw Success" ?
                                                   "ปกติ" :
                                                   item === "wait OTP" ?
                                                      "ปกติ" :
                                                      "-"
            }
               size="small"
               style={
                  {
                     padding: 10,
                     backgroundColor: item === "WITHDRAW" ?
                        "#16539B" :
                        item === "queue" ?
                           "#16539B" :
                           item === "Normal" ?
                              "#16539B" :
                              item === "Create" ?
                                 "#129A50" :
                                 item === "Approve" ?
                                    "#16539B" :
                                    item === "manual" ?
                                       "#FFB946" :
                                       item === "Manual" ?
                                          "#FFB946" :
                                          item === "Success" ?
                                             "#129A50" :
                                             item === "-" ?
                                                "gray" :
                                                item === "null" ?
                                                   "gray" :
                                                   item === "Process" ?
                                                      "#16539B" :
                                                      item === "Withdraw Success" ?
                                                         "#129A50" :
                                                         item === "wait OTP" ?
                                                            "#129A50" :
                                                            "gray",
                     color: "#eee",
                  }
               }
            />
         )
      },

      {
         dataIndex: "create_at",
         title: "วันที่ถอน",
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
         dataIndex: "update_at",
         title: "วันที่อัพเดท",
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
         title: "เงินในบัญชี",
         align: "center",
         render: (item, data) => (
            <>
               <Grid container justifyContent="center" >
                  <Grid item xs={12}
                     sx={
                        { mb: 1 }} >
                     <Chip label={
                        data.credit_before ?
                           data.credit_before :
                           "0.00"
                     }
                        size="small"
                        style={
                           {
                              padding: 10,
                              minWidth: "80px",
                              backgroundColor: "#FD3B52",
                              color: "#eee",
                           }
                        }
                     /> </Grid>
                  <Grid item xs={12} >
                     <Chip label={
                        data.credit_after ?
                           data.credit_after :
                           "0.00"
                     }
                        size="small"
                        style={
                           {
                              padding: 10,
                              minWidth: "80px",
                              backgroundColor: "#129A50",
                              color: "#eee",
                           }
                        }
                     />
                  </Grid>
               </Grid>
            </>
         ),
      },


      {
         title: "เปลี่ยนสถานะ",
         align: "center",
         render: (item, data) => (
            <>
               <IconButton disabled={data.status_transction !== "Reject"}
                  onClick={
                     () => {
                        setOpenDialogText({
                           open: true,
                           data: data,
                           type: "change_status",
                        });
                     }
                  } >
                  <EditIcon color={
                     data.status_transction !== "Reject" ?
                        "gray" :
                        "secondary2"
                  }
                  />
               </IconButton>
            </>
         ),
      },


      // {
      //    title: "สลิป",
      //    align: "center",
      //    maxWidth: "80px",
      //    render: (item) => {
      //       return (
      //          <Grid sx={
      //             { textAlign: "center" }} >
      //             <IconButton
      //                onClick={
      //                   () => {
      //                      setOpenDialogSlip({
      //                         open: true,
      //                         slip: item.transaction_slip,
      //                      });
      //                   }
      //                } >
      //                { /* <TextSnippetIcon sx={{ color: "#16539B"  }} /> */}
      //                <TextSnippetIcon color={!item.transaction_slip ? "gray" : "netural"}
      //                /> </IconButton> </Grid>
      //       );
      //    },
      // },


   ];

   return (
      <Layout>
         <Paper sx={{ p: 3, mb: 2 }} >
            <Grid container justifyContent="start" >
               {bankData.map((item) =>
                  <Paper sx={
                     {
                        background: "linear-gradient(#41A3E3, #0072B1)",
                        // bgcolor: '#0072B1',
                        p: 2,
                        height: 150,
                        width: "400px",
                        mr: 2,
                     }
                  } >
                     <Grid container >
                        <Grid item xs={2} sx={{ mt: 4 }} >
                           <Box>
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
                           </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ ml: 2, mt: 2 }} >
                           <Typography sx={{
                              fontSize: "14px",
                              mt: "5px",
                              ml: "5px",
                              color: "#EEEEEE",
                           }} >
                              {
                                 item.bank_name === "truemoney" ? "True Wallet"
                                    : item.bank_name === "scb" ? "SCB (ไทยพาณิชย์)"
                                       : item.bank_name === "kbnk" ? "KBank (กสิกรไทย)"
                                          : ""
                              } </Typography>
                           <Typography sx={
                              {
                                 fontSize: "18px",
                                 fontWeight: "bold",
                                 mt: "5px",
                                 ml: "5px",
                                 color: "#EEEEEE",
                              }
                           } >
                              {item.bank_number} </Typography>
                           <Typography sx={
                              {
                                 fontSize: "14px",
                                 mt: "5px",
                                 ml: "5px",
                                 color: "#EEEEEE",
                              }
                           } >
                              {item.bank_account_name}
                           </Typography>
                        </Grid>

                        <Grid item xs={4} >
                           <Typography sx={
                              {
                                 fontSize: "14px",
                                 mt: "5px",
                                 ml: "5px",
                                 color: "#EEEEEE",
                              }
                           } >
                              จำนวนครั้ง / วัน
                           </Typography>
                           <Chip label={Intl.NumberFormat("TH").format(parseInt(item.count_transaction))}
                              size="small"
                              style={
                                 {
                                    marginTop: "10px",
                                    padding: 10,
                                    width: 120,
                                    backgroundColor: "#129A50",
                                    color: "#EEEEEE",
                                 }
                              }
                           />
                           <Typography sx={
                              {
                                 fontSize: "14px",
                                 mt: "5px",
                                 ml: "5px",
                                 color: "#EEEEEE",
                              }
                           } >
                              จำนวนเงินถอน
                           </Typography>
                           <Chip label={Intl.NumberFormat("TH").format(parseInt(item.bank_total))}
                              size="small"
                              style={
                                 {
                                    marginTop: "10px",
                                    padding: 10,
                                    width: 120,
                                    backgroundColor: "#129A50",
                                    color: "#EEEEEE",
                                 }
                              }
                           />
                        </Grid>

                     </Grid>
                  </Paper>
               )
               }
            </Grid>
         </Paper>

         <Paper sx={{ p: 3, mb: 2 }} >
            <Table
               columns={columns}
               dataSource={dataWithdraw}
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
            open={openDialogApprove}
            onClose={() => setOpenDialogApprove(false)}
            fullWidth
            maxWidth="md"
         >
            <DialogTitle>
               <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                  <Grid>
                     <IconButton onClick={() => {
                        setSelectedBank()
                        setOpenDialogApprove(false)

                     }} >
                        <CloseIcon />
                     </IconButton>
                     รายละเอียด :
                     <Chip
                        label={
                           rowData.status_transction === "Fail" ?
                              "ผิดพลาด" :
                              rowData.status_transction === "CREATE" ?
                                 "รออนุมัติ" :
                                 rowData.status_transction === "Approve" ?
                                    "อนุมัติแล้ว" :
                                    rowData.status_transction === "Process" ?
                                       "รอทำรายการ" :
                                       rowData.status_transction === "Success" ?
                                          "สำเร็จ" :
                                          rowData.status_transction === "OTP" ?
                                             "OTP" :
                                             rowData.status_transction === "Reject" ?
                                                "ยกเลิก" :
                                                rowData.status_transction === "manual" ?
                                                   "ถอนมือ" :
                                                   rowData.status_transction === "" ?
                                                      "ทั้งหมด" :
                                                      "-"
                        }
                        sx={{
                           ml: 2,
                           p: 2,
                           fontSize: '16px',
                           border: rowData.status_transction === "Fail" ?
                              "2px solid #EB001B" :
                              rowData.status_transction === "CREATE" ?
                                 "2px solid #16539B" :
                                 rowData.status_transction === "Approve" ?
                                    "2px solid #16539B" :
                                    rowData.status_transction === "Process" ?
                                       "2px solid #FFB946" :
                                       rowData.status_transction === "Success" ?
                                          "2px solid #129A50" :
                                          rowData.status_transction === "OTP" ?
                                             "2px solid #FFB946" :
                                             rowData.status_transction === "Reject" ?
                                                "2px solid #FD3B52" :
                                                rowData.status_transction === "manual" ?
                                                   "2px solid #E1772B" :
                                                   rowData.status_transction === "" ?
                                                      "2px solid gray" :
                                                      "2px solid gray",
                           // backgroundColor: rowData.transaction_status === "Fail" ?
                           //    "#EB001B" :
                           //    rowData.transaction_status === "Create" ?
                           //       "#16539B" :
                           //       rowData.transaction_status === "Approve" ?
                           //          "#16539B" :
                           //          rowData.transaction_status === "Process" ?
                           //             "#FFB946" :
                           //             rowData.transaction_status === "Success" ?
                           //                "#129A50" :
                           //                rowData.transaction_status === "OTP" ?
                           //                   "#FFB946" :
                           //                   rowData.transaction_status === "Reject" ?
                           //                      "#FD3B52" :
                           //                      rowData.transaction_status === "manual" ?
                           //                         "#E1772B" :
                           //                         rowData.transaction_status === "" ?
                           //                            "gray" :
                           //                            "gray",
                           color: rowData.transaction_status === "Fail" ?
                              "#EB001B" :
                              rowData.transaction_status === "Create" ?
                                 "#16539B" :
                                 rowData.transaction_status === "Approve" ?
                                    "#16539B" :
                                    rowData.transaction_status === "Process" ?
                                       "#FFB946" :
                                       rowData.transaction_status === "Success" ?
                                          "#129A50" :
                                          rowData.transaction_status === "OTP" ?
                                             "#FFB946" :
                                             rowData.transaction_status === "Reject" ?
                                                "#FD3B52" :
                                                rowData.transaction_status === "manual" ?
                                                   "#E1772B" :
                                                   rowData.transaction_status === "" ?
                                                      "gray" : "gray",
                           bgcolor: "#fff"
                        }}
                     />
                  </Grid>
                  <Grid>
                     <Button variant="outlined" color="error" sx={{}} onClick={() => handelwithdraw()}>
                        ยกเลิกและคืนเงิน
                     </Button>
                  </Grid>
               </Grid>

            </DialogTitle>

            <DialogContent>
               <Grid container justifyContent="center" spacing={2}>
                  <Grid item xs={6}>
                     <TableContainer >
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ชื่อผู้ใช้งาน
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{rowData.members?.username}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ธนาคาร
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{rowData.members?.bank_name}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              เลขบัญชี
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{rowData.members?.bank_number}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ชื่อ นามสกุล
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{rowData.bank_account_name}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              เวลาที่ถอน
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{rowData.create_at}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ยอดถอนเงิน
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold" }} > {Intl.NumberFormat("TH").format(parseInt(rowData.credit))} บาท</TableCell>
                        </TableRow>
                     </TableContainer>
                  </Grid>

                  <Grid item xs={6}>
                     <Typography sx={{ fontSize: '14px' }}> ประเภทการถอน</Typography>
                     <FormControl>
                        <RadioGroup
                           row
                           onChange={(e) => {
                              setStatusWithdraw(e.target.value);
                           }}
                        >
                           <FormControlLabel
                              value="AUTO"
                              onClick={() => setContent(false)}
                              control={<Radio onChange={(e) => handleChangeData(e)} />}
                              label={<Typography sx={{ fontSize: '14px' }}>ออโต้ </Typography>} />
                           <FormControlLabel
                              value="MANUAL"
                              onClick={() => setContent(true)}
                              control={<Radio onChange={(e) => handleChangeData(e)} />}
                              label={<Typography sx={{ fontSize: '14px' }}>ถอนมือ </Typography>} />
                        </RadioGroup>
                     </FormControl>
                     <Typography sx={{ fontSize: '14px', mt: 3 }}> ธนาคาร</Typography>
                     <FormControl>
                        {bankData.map((item) =>
                           <RadioGroup
                              onChange={(e) => handleChange(item.uuid)}
                           >
                              <Paper sx={{ pl: 4, pr: 10, py: 2, mb: 2 }} elevation={3}>
                                 <FormControlLabel
                                    value={item.uuid}
                                    checked={selectedBank === item.uuid}
                                    control={<Radio />}
                                    label={
                                       <Grid>
                                          <Typography sx={{ fontSize: '14px', mt: 0 }}>{item.bank_name}</Typography>
                                          <Typography sx={{ fontSize: '14px', mt: 0 }}> {item.bank_number}</Typography>
                                          <Typography sx={{ fontSize: '14px', mt: 0 }}> {item.bank_account_name}</Typography>
                                          <Typography sx={{ fontSize: '14px', mt: 0 }}> เงินในบัญชี {item.bank_total}</Typography>
                                       </Grid>
                                    }
                                 />
                              </Paper>
                           </RadioGroup>
                        )}
                     </FormControl>

                     {content ?
                        <TextField
                           name="content"
                           type="text"
                           value={rowData.content || ""}
                           placeholder="หมายเหตุ"
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white", width: 300, mt: 2 }}
                           multiline
                           rows={3}
                           maxRows={4}
                           error
                        />
                        : ''}
                  </Grid>

                  <Grid container justifyContent='center' spacing={1}>
                     <Grid container item xs={10}>
                        <Button
                           variant="contained"
                           size="large"
                           fullWidth
                           disabled={!!selectedBank ? false : true}
                           onClick={() => {
                              if (!!selectedBank) {
                                 if(statusWithdraw === 'AUTO'){
                                    approveWithdraw(rowData.uuid, rowData.by_bank);
                                 }
                                 if (statusWithdraw === 'MANUAL') {
                                    approveWithdrawManual(rowData.uuid, rowData.by_bank);
                                 }
                              } else {
                                 alert('กรุณาเลือกธนาคาร')
                              }

                           }}
                           sx={{
                              mt: 3,
                              color: '#fff',
                              background: "linear-gradient(#0072B1, #41A3E3)" 
                           }}
                        >
                           ยืนยัน
                        </Button>
                     </Grid>
                  </Grid>



                  {/* <Grid container spacing={2} >
                     <Grid container item xs={6}>
                        <Typography>ชื่อ *</Typography>
                        <TextField
                           name="fname"
                           type="text"
                           value={rowData?.fname || ""}
                           placeholder="ชื่อ"
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                        />
                     </Grid>

                     <Grid container item xs={6}>
                        <Typography>นามสกุล *</Typography>
                        <TextField
                           name="lname"
                           type="text"
                           value={rowData?.lname || ""}
                           placeholder="นามสกุล"
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                        />
                     </Grid>
                     <Grid container item xs={6}>
                        <Typography>หมายเลขโทรศัพท์*</Typography>
                        <TextField
                           name="tel"
                           type="text"
                           value={rowData?.tel || ""}
                           placeholder="000-000-0000"
                           fullWidth
                           required
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                           inputProps={{ maxLength: 10 }}
                        />
                     </Grid>

                     <Grid container item xs={6}>
                        <Typography>Line ID*</Typography>
                        <TextField
                           name="line_id"
                           type="text"
                           value={rowData?.line_id || ""}
                           placeholder="Line ID"
                           fullWidth
                           required
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                           inputProps={{ maxLength: 10 }}
                        />
                     </Grid>

                     <Grid container item xs={6}>
                        <Typography>โปรดเลือกบัญชีธนาคาร*</Typography>
                        <TextField
                           name="bank_name"
                           type="text"
                           value={rowData?.bank_name || ""}
                           select
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                        >
                           <MenuItem selected disabled value>
                              เลือก ธนาคาร
                           </MenuItem>
                           <MenuItem value="kbnk">ธนาคารกสิกรไทย</MenuItem>
                           <MenuItem value="truemoney">TrueMoney Wallet</MenuItem>
                           <MenuItem value="ktba">ธนาคารกรุงไทย</MenuItem>
                           <MenuItem value="scb">ธนาคารไทยพาณิชย์</MenuItem>
                           <MenuItem value="bay">ธนาคารกรุงศรีอยุธยา</MenuItem>
                           <MenuItem value="bbla">ธนาคารกรุงเทพ</MenuItem>
                           <MenuItem value="gsb">ธนาคารออมสิน</MenuItem>
                           <MenuItem value="ttb">ธนาคารทหารไทยธนชาต (TTB)</MenuItem>
                           <MenuItem value="BAAC">
                              ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
                           </MenuItem>
                           <MenuItem value="ICBC">ธนาคารไอซีบีซี (ไทย)</MenuItem>
                           <MenuItem value="TCD">ธนาคารไทยเครดิตเพื่อรายย่อย</MenuItem>
                           <MenuItem value="CITI">ธนาคารซิตี้แบงก์</MenuItem>
                           <MenuItem value="SCBT">
                              ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)
                           </MenuItem>
                           <MenuItem value="CIMB">ธนาคารซีไอเอ็มบีไทย</MenuItem>
                           <MenuItem value="UOB">ธนาคารยูโอบี</MenuItem>
                           <MenuItem value="HSBC">ธนาคารเอชเอสบีซี ประเทศไทย</MenuItem>
                           <MenuItem value="MIZUHO">ธนาคารมิซูโฮ คอร์ปอเรต</MenuItem>
                           <MenuItem value="GHB">ธนาคารอาคารสงเคราะห์</MenuItem>
                           <MenuItem value="LHBANK">ธนาคารแลนด์ แอนด์ เฮ้าส์</MenuItem>
                           <MenuItem value="TISCO">ธนาคารทิสโก้</MenuItem>
                           <MenuItem value="kkba">ธนาคารเกียรตินาคิน</MenuItem>
                           <MenuItem value="IBANK">ธนาคารอิสลามแห่งประเทศไทย</MenuItem>
                        </TextField>
                     </Grid>

                     <Grid container item xs={6}>
                        <Typography>หมายเลขบัญชี*</Typography>
                        <TextField
                           name="bank_number"
                           type="number"
                           value={rowData?.bank_number || ""}
                           placeholder="000-000-000"
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                        />
                     </Grid>

                     <Grid container item xs={6}>
                        <Typography>รู้จักเราผ่านช่องทางใด *</Typography>
                        <TextField
                           name="platform"
                           type="text"
                           value={rowData?.platform || ""}
                           select
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                        >
                           <MenuItem selected disabled value>
                              รู้จักเราผ่านช่องทางใด
                           </MenuItem>
                           <MenuItem value="google">Google</MenuItem>
                           <MenuItem value="line">Line</MenuItem>
                           <MenuItem value="instagram">Instagram</MenuItem>
                           <MenuItem value="youtube">Youtube</MenuItem>
                           <MenuItem value="twitter">Twitter</MenuItem>
                           <MenuItem value="vk">VK</MenuItem>
                           <MenuItem value="tiktok">Tiktok</MenuItem>
                           <MenuItem value="facebook">Facebook</MenuItem>
                           <MenuItem value="friend">เพื่อนแนะนำมา</MenuItem>
                        </TextField>
                     </Grid>

                     {rowData?.platform === "friend" ?
                        <Grid container item xs={6}>
                           <Typography>แนะนำโดย *</Typography>
                           <TextField
                              name="affiliate_by"
                              type="text"
                              value={rowData?.affiliate_by || ""}
                              placeholder="แนะนำโดย"
                              fullWidth
                              required
                              size="small"
                              onChange={(e) => handleChangeData(e)}
                              variant="outlined"
                              sx={{ bgcolor: "white" }}
                              inputProps={{ maxLength: 10 }}
                           />
                        </Grid> :
                        <Grid container item xs={6}> </Grid>

                     }

                  </Grid>
                  <Grid container justifyContent='center' spacing={1}>
                     <Grid container item xs={4}>
                        <Button
                           // variant="outlined"
                           variant="contained"
                           size="large"
                           fullWidth
                           onClick={() => {
                              editUser();
                           }}
                           sx={{
                              mt: 3,
                              // background: "#129A50",
                              color: '#fff',

                           }}
                        >
                           ยืนยัน
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
                              setOpenDialogApprove(false)
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
                  </Grid> */}

               </Grid>
            </DialogContent>
         </Dialog>

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
                     {/* {report.content} */}asdasdasdasd
                  </Typography>
               </Grid>
            </DialogContent>
         </Dialog>



         <LoadingModal open={loading} />
         <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <Alert severity="success" sx={{ width: "100%" }} > Copy success! </Alert>
         </Snackbar>
      </Layout >
   )
}

export default withdrawpending