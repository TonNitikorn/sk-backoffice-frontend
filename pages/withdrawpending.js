import React, { useState, useEffect } from "react";
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
   Dialog, DialogTitle, DialogContent, Table, TableRow, TableCell, FormControl, RadioGroup, Radio, FormControlLabel
} from "@mui/material";
import Image from 'next/image';
import hostname from "../utils/hostname";
import axios from "axios";
import scbL from "../assets/scbL.png";
import trueL from "../assets/trueL.png";
import MaterialTableForm from '../components/materialTableForm';
import { CopyToClipboard } from "react-copy-to-clipboard";
import moment from "moment/moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";
import { signOut } from "../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../store/store";
import LoadingModal from "../theme/LoadingModal";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import EditIcon from "@mui/icons-material/Edit";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

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
   const [search, setSearch] = useState({
      data: "",
      type: "",
   });
   const [wallet, setWallet] = useState()
   const [item, setitem] = useState()

   const handleClickSnackbar = () => {
      setOpen(true);
   };

   const handleClose = (event, reason) => {
      setOpen(false);
   };


   const bank = [{
      "id": 11,
      "uuid": "091f0717-92c2-480b-8cc7-b5870033a682",
      "bank_account_name": "สมศักดิ์ วังร่ม",
      "bank_name": "scb",
      "bank_number": "4221231909",
      "ip_address": null,
      "bank_status": "1",
      "bank_type": "1",
      "bank_sms": "1",
      "status_system": "1",
      "type_deposit": "0",
      "username": "1",
      "password": "1",
      "account_sequence": 1,
      "account_set": 1,
      "amount": 0,
      "createdAt": "2022-08-08T07:33:42.000Z",
      "updatedAt": "2022-09-02T17:14:11.000Z"
   },
   {
      "id": 7,
      "uuid": "89ddac80-c0b7-44d2-be2d-1873b5ac4c16",
      "bank_account_name": "ปริญญา โพธิ์อ่อง",
      "bank_name": "truemoney",
      "bank_number": "0637190735",
      "ip_address": null,
      "bank_status": "1",
      "bank_type": "2",
      "bank_sms": "1",
      "status_system": "1",
      "type_deposit": "",
      "username": "parinyaphoongOneungg@gmail.com",
      "password": "P0922904932b",
      "account_sequence": 2,
      "account_set": 1,
      "amount": 0,
      "createdAt": "2022-06-30T04:00:17.000Z",
      "updatedAt": "2022-06-30T04:00:17.000Z"
   },
   ];

   const data = [
      {
         "uuid": "710039f9-a6cb-472d-8d51-64801e11bb5d",
         "amount": 18833,
         "transaction_type": "2",
         "credit_bank_before": null,
         "credit_bank_after": null,
         "bank_time": "2022-10-17 14:05:46",
         "create_by": "เกียริ",
         "annotation": "ถอนมือ",
         "transaction_status": "Success",
         "auto_status": "manual",
         "username": "23maa4934450",
         "createdAt": "2022-10-19T07:05:46.000Z",
         "updatedAt": "2022-10-19T07:05:55.000Z",
         "bank_name": "kbnk",
         "bank_account_name": "ภูชิต กุลนอก",
         "bank_number": "1338361889",
        
      },
      {
         "id": 54735,
         "uuid": "2e6d5730-26bf-475a-832a-45b5e679a3ca",
         "bank": "479432cc-0c9a-4b17-925c-35dfdd3f9042",
         "amount": 437,
         "bonus_credit": null,
         "transaction_type": "2",
         "credit_before": 437.75,
         "credit_after": 0.75,
         "credit_bank_before": null,
         "credit_bank_after": null,
         "bank_time": "2022-10-17 14:03:20",
         "create_by": "เกียริ",
         "annotation": "ถอนมือ",
         "ref": "PWQ166599020055031602",
         "transaction_status": "Success",
         "auto_status": "manual",
         "transaction_slip": null,
         "username": "23maa5038798",
         "promotion_uuid": null,
         "sms_transaction_uuid": null,
         "createdAt": "2022-10-19T07:03:20.000Z",
         "updatedAt": "2022-10-19T07:03:30.000Z",
         "member_account_banks": [{
            "id": 6739,
            "uuid": "479432cc-0c9a-4b17-925c-35dfdd3f9042",
            "bank_name": "kbnk",
            "bank_account_name": "ชัญญพัชร์  พึ่งทิม",
            "bank_number": "0513807236",
            "member_credit": 0,
            "member_uuid": "8407b7fb-10ab-4c58-8c24-631e36eb846b",
            "createdAt": "2022-10-17T05:37:36.000Z",
            "updatedAt": "2022-10-17T05:37:36.000Z"
         }]
      },
   ]

   const columns = [
      {
         field: "no",
         title: "อนุมัติ",
         maxWidth: 80,
         align: "center",
         render: (item) => (
            <>
               <IconButton
                  onClick={() => {
                     setRowData(item)
                     setOpenDialogApprove(true)
                  }}
               >
                  <AssignmentTurnedInIcon color="primary" />
               </IconButton>
            </>
         ),
      },
      {
         title: "สถานะ",
         align: "center",
         render: (item) => (
            <Chip label={
               item.transaction_status === "Fail" ?
                  "ผิดพลาด" :
                  item.transaction_status === "Create" ?
                     "รออนุมัติ" :
                     item.transaction_status === "Approve" ?
                        "อนุมัติแล้ว" :
                        item.transaction_status === "Process" ?
                           "รอทำรายการ" :
                           item.transaction_status === "Success" ?
                              "สำเร็จ" :
                              item.transaction_status === "OTP" ?
                                 "OTP" :
                                 item.transaction_status === "Reject" ?
                                    "ยกเลิก" :
                                    item.transaction_status === "manual" ?
                                       "ถอนมือ" :
                                       item.transaction_status === "" ?
                                          "ทั้งหมด" :
                                          "-"
            }
               size="small"
               style={
                  {
                     padding: 10,
                     backgroundColor: item.transaction_status === "Fail" ?
                        "#EB001B" :
                        item.transaction_status === "Create" ?
                           "#16539B" :
                           item.transaction_status === "Approve" ?
                              "#16539B" :
                              item.transaction_status === "Process" ?
                                 "#FFB946" :
                                 item.transaction_status === "Success" ?
                                    "#129A50" :
                                    item.transaction_status === "OTP" ?
                                       "#FFB946" :
                                       item.transaction_status === "Reject" ?
                                          "#FD3B52" :
                                          item.transaction_status === "manual" ?
                                             "#E1772B" :
                                             item.transaction_status === "" ?
                                                "gray" :
                                                "gray",
                     // item.transaction_status === 1 ? "#129A50" : "#FFB946",
                     color: "#eee",
                  }
               }
            />
         ),
      },

      {
         field: "bank_name",
         title: "ธนาคาร",
         align: "center",
         render: (item) => (
            <Grid container >
               <Grid item xs={12} sx={{ mt: 1 }}>
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
            </Grid>
         ),
      },
      {
         field: "bank_name",
         title: "ธนาคาร",
         align: "center",
         // minWidth: "150px",
         render: (item) => (
            <Grid container >
               <Grid item xs={12} >
                  <Grid >
                     <CopyToClipboard text={item.bank_number} >
                        <div style={{
                           "& .MuiButton-text": {
                              "&:hover": {
                                 // backgroundColor: "#9CE1BC",
                                 // color: "blue",
                                 textDecoration: "underline blue 1px",
                              }
                           }
                        }} >
                           <Button sx={{
                              fontSize: "14px",
                              p: 0,
                              color: "blue",
                           }}
                              onClick={handleClickSnackbar} >
                              {item.bank_number}
                           </Button>
                        </div>
                     </CopyToClipboard>
                  </Grid>
                  <Grid >
                     <Typography sx={{ fontSize: "14px" }}> {item.name}</Typography>
                  </Grid>
                  <Grid sx={{ ml: 1 }} >
                     <Typography sx={{ fontSize: "14px" }}> {item.bank_account_name} </Typography>
                  </Grid>
               </Grid>
            </Grid>
         ),
      },
      {
         field: "bank_name",
         title: "ชื่อผู้ใช้งาน",
         align: "center",
         render: (item) => (
            <Grid container >
               <Grid item xs={12} >
                  <Grid>
                     <CopyToClipboard text={item.username} >
                        <div style={
                           {
                              "& .MuiButton-text": {
                                 "&:hover": {
                                    // backgroundColor: "#9CE1BC",
                                    // color: "blue",
                                    textDecoration: "underline blue 1px",
                                 }
                              }
                           }
                        } >
                           <Button sx={
                              {
                                 fontSize: "14px",
                                 p: 0,
                                 color: "blue",
                              }
                           }
                              onClick={handleClickSnackbar} >
                              {item.username}
                           </Button>
                        </div>
                     </CopyToClipboard>
                  </Grid>
               </Grid>
            </Grid>
         ),
      },
      {
         title: "ยอดเงินถอน",
         align: "center",
         minWidth: "130px",
         render: (item) => (
            <>
               <Grid container justifyContent="center" >
                  <Grid >
                     <Typography sx={{ fontSize: "14px" }} >
                        {Intl.NumberFormat("TH", { style: "currency", currency: "THB", }).format(parseInt(item.amount))}
                     </Typography>
                  </Grid>

               </Grid>
            </>
         ),
      },
      {
         title: "ประเภท",
         align: "center",
         render: (item) => (<
            Chip label={
               item.auto_status === "withdraw Fail" ?
                  "ถอนผิดพลาด" :
                  item.auto_status === "queue" ?
                     "อยู่ในคิว" :
                     item.auto_status === "Normal" ?
                        "ปกติ" :
                        item.auto_status === "Create" ?
                           "ปกติ" :
                           item.auto_status === "Approve" ?
                              "อนุมัติ" :
                              item.auto_status === "manual" ?
                                 "ถอนมือ" :
                                 item.auto_status === "Manual" ?
                                    "ถอนมือ" :
                                    item.auto_status === "Success" ?
                                       "อนุมัติ" :
                                       item.auto_status === "-" ?
                                          "-" :
                                          item.auto_status === "null" ?
                                             "-" :
                                             item.auto_status === "Process" ?
                                                "ดำเนินการ" :
                                                item.auto_status === "Withdraw Success" ?
                                                   "ปกติ" :
                                                   item.auto_status === "wait OTP" ?
                                                      "ปกติ" :
                                                      "-"
            }
            size="small"
            style={
               {
                  padding: 10,
                  backgroundColor: item.auto_status === "withdraw Fail" ?
                     "#EB001B" :
                     item.auto_status === "queue" ?
                        "#16539B" :
                        item.auto_status === "Normal" ?
                           "#16539B" :
                           item.auto_status === "Create" ?
                              "#129A50" :
                              item.auto_status === "Approve" ?
                                 "#16539B" :
                                 item.auto_status === "manual" ?
                                    "#FFB946" :
                                    item.auto_status === "Manual" ?
                                       "#FFB946" :
                                       item.auto_status === "Success" ?
                                          "#129A50" :
                                          item.auto_status === "-" ?
                                             "gray" :
                                             item.auto_status === "null" ?
                                                "gray" :
                                                item.auto_status === "Process" ?
                                                   "#16539B" :
                                                   item.auto_status === "Withdraw Success" ?
                                                      "#129A50" :
                                                      item.auto_status === "wait OTP" ?
                                                         "#129A50" :
                                                         "gray",
                  color: "#eee",
               }
            }
         />
         ),
      },
      {
         field: "bank_time",
         title: "วันที่ถอน",
         align: "center",
         minWidth: "120px",
      },
      {
         field: "updatedAt",
         title: "วันที่อัพเดท",
         align: "center",
         minWidth: "130px",
         render: (item) => (
            <>
               <Grid container justifyContent="center" >
                  <Grid >
                     <Typography sx={{ fontSize: "14px" }} > {item.updated_date}</Typography>
                     <Typography sx={{ fontSize: "14px" }} > {item.updated_time} </Typography>
                  </Grid>
               </Grid>
            </>
         ),
      },
      {
         field: "create_by",
         title: "ทำโดย",
         align: "center",
         minWidth: "100px"
      },
      {
         field: "annotation",
         title: "หมายเหตุ",
         align: "center",
         render: (item) => {
            return (
               <>
                  <IconButton onClick={
                     () => {
                        setOpenDialogView({
                           open: true,
                           text: item.annotation,
                        });
                     }
                  } >
                     <ManageSearchIcon />
                  </IconButton> </>
            );
         },
      },
      {
         title: "เงินในบัญชี",
         align: "center",
         minWidth: "130px",

         render: (item) => (
            <>
               <Grid container justifyContent="center" >
                  <Grid item xs={12}
                     sx={
                        { mb: 1 }} >
                     <Chip label={
                        item.credit_bank_before ?
                           item.credit_bank_before :
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
                        item.credit_bank_after ?
                           item.credit_bank_after :
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
                     /> </Grid> </Grid> </>
         ),
      },
      {
         title: "เปลี่ยนสถานะ",
         align: "center",
         minWidth: "140px",

         render: (item) => {
            return (
               <>
                  <IconButton disabled={item.transaction_status !== "Reject"}
                     onClick={
                        () => {
                           setOpenDialogText({
                              open: true,
                              data: item,
                              type: "change_status",
                           });
                        }
                     } >
                     <EditIcon color={
                        item.transaction_status !== "Reject" ?
                           "gray" :
                           "secondary2"
                     }
                     /> </IconButton> </>
            );
         },
      },
      {
         title: "สลิป",
         align: "center",
         maxWidth: "80px",
         render: (item) => {
            return (
               <Grid sx={
                  { textAlign: "center" }} >
                  <IconButton
                     onClick={
                        () => {
                           setOpenDialogSlip({
                              open: true,
                              slip: item.transaction_slip,
                           });
                        }
                     } >
                     { /* <TextSnippetIcon sx={{ color: "#16539B"  }} /> */}
                     <TextSnippetIcon color={!item.transaction_slip ? "gray" : "neutral"}
                     /> </IconButton> </Grid>
            );
         },
      },


   ]

   const data2 = [
      {
         "id": 54738,
         "uuid": "710039f9-a6cb-472d-8d51-64801e11bb5d",
         "bank": "2d336309-0680-4fde-b331-74811a647a8f",
         "amount": 18833,
         "bonus_credit": null,
         "transaction_type": "2",
         "credit_before": 9.45,
         "credit_after": 0.45,
         "credit_bank_before": null,
         "credit_bank_after": null,
         "bank_time": "2022-10-17 14:05:46",
         "create_by": "เกียริ",
         "annotation": "ถอนมือ",
         "ref": "PWQ166599034601610379",
         "transaction_status": "Success",
         "auto_status": "manual",
         "transaction_slip": null,
         "username": "23maa4934450",
         "promotion_uuid": null,
         "sms_transaction_uuid": null,
         "createdAt": "2022-10-19T07:05:46.000Z",
         "updatedAt": "2022-10-19T07:05:55.000Z",
         "bank_name": "kbnk",
         "bank_account_name": "ภูชิต กุลนอก",
         "bank_number": "1338361889",
         "member_account_banks": [{
            "id": 1267,
            "uuid": "2d336309-0680-4fde-b331-74811a647a8f",
            "bank_name": "kbnk",
            "bank_account_name": "ภูชิต กุลนอก",
            "bank_number": "1338361889",
            "member_credit": 0,
            "member_uuid": "722ad776-7c39-470f-ad3c-d1aa89d30139",
            "createdAt": "2022-07-22T08:56:25.000Z",
            "updatedAt": "2022-07-22T08:56:25.000Z"
         }]
      },
      {
         "id": 54735,
         "uuid": "2e6d5730-26bf-475a-832a-45b5e679a3ca",
         "bank": "479432cc-0c9a-4b17-925c-35dfdd3f9042",
         "amount": 437,
         "bonus_credit": null,
         "transaction_type": "2",
         "credit_before": 437.75,
         "credit_after": 0.75,
         "credit_bank_before": null,
         "credit_bank_after": null,
         "bank_time": "2022-10-17 14:03:20",
         "create_by": "เกียริ",
         "annotation": "ถอนมือ",
         "ref": "PWQ166599020055031602",
         "transaction_status": "Success",
         "auto_status": "manual",
         "transaction_slip": null,
         "username": "23maa5038798",
         "promotion_uuid": null,
         "sms_transaction_uuid": null,
         "createdAt": "2022-10-19T07:03:20.000Z",
         "updatedAt": "2022-10-19T07:03:30.000Z",
         "member_account_banks": [{
            "id": 6739,
            "uuid": "479432cc-0c9a-4b17-925c-35dfdd3f9042",
            "bank_name": "kbnk",
            "bank_account_name": "ชัญญพัชร์  พึ่งทิม",
            "bank_number": "0513807236",
            "member_credit": 0,
            "member_uuid": "8407b7fb-10ab-4c58-8c24-631e36eb846b",
            "createdAt": "2022-10-17T05:37:36.000Z",
            "updatedAt": "2022-10-17T05:37:36.000Z"
         }]
      },
   ]

   const columns2 = [{
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
         <Grid container >
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

            <Grid item xs={9} >
               <Grid sx={
                  { ml: 2, mt: 1 }} >
                  <CopyToClipboard text={item.bank_number} >
                     <div style={
                        {
                           "& .MuiButton-text": {
                              "&:hover": {
                                 // backgroundColor: "#9CE1BC",
                                 // color: "blue",
                                 textDecoration: "underline blue 1px",
                              }
                           }
                        }
                     } >
                        <Button sx={
                           {
                              fontSize: "14px",
                              p: 0,
                              color: "blue",
                           }
                        }
                           onClick={handleClickSnackbar} >
                           {item.bank_number}
                        </Button>
                     </div>
                  </CopyToClipboard>
               </Grid>
               <Grid >
                  <Typography sx={
                     { fontSize: "14px" }} > {item.name}
                  </Typography>
               </Grid>
               <Grid sx={
                  { ml: 2 }} >
                  <CopyToClipboard text={item.username} >
                     <div style={
                        {
                           "& .MuiButton-text": {
                              "&:hover": {
                                 // backgroundColor: "#9CE1BC",
                                 // color: "blue",
                                 textDecoration: "underline blue 1px",
                              }
                           }
                        }
                     } >
                        <Button sx={
                           {
                              fontSize: "14px",
                              p: 0,
                              color: "blue",
                           }
                        }
                           onClick={handleClickSnackbar} >
                           {item.username}
                        </Button>
                     </div>
                  </CopyToClipboard>
               </Grid>
            </Grid>
         </Grid>
      ),
   },
   {
      title: "ยอดเงินถอน",
      align: "center",
      render: (item) => (
         <>
            <Grid container justifyContent="center" >
               <Grid >
                  <Typography sx={
                     { fontSize: "14px" }} > {
                        Intl.NumberFormat("TH", {
                           style: "currency",
                           currency: "THB",
                        }).format(parseInt(item.amount))
                     }
                  </Typography>
               </Grid>

               <Chip label={"เครดิต"}
                  size="small"
                  style={
                     {
                        padding: 10,
                        backgroundColor: "#FFB946",
                        color: "#eee",
                     }
                  }
               />
            </Grid>
         </>
      ),
   },
   {
      field: "bank_time",
      title: "วันที่ถอน",
      align: "center",
      minWidth: "110px",
   },
   {
      field: "updatedAt",
      title: "วันที่อัพเดท",
      align: "center",
      render: (item) => (
         <>
            <Grid container justifyContent="center" >
               <Grid >
                  <Typography sx={
                     { fontSize: "14px" }} > {item.updated_date}
                  </Typography>
                  <Typography sx={
                     { fontSize: "14px" }} > {item.updated_time} </Typography>
               </Grid> </Grid>
         </>
      ),
   },

   {
      title: "สถานะ",
      align: "center",
      render: (item) => (<
         Chip label={
            item.transaction_status === "Fail" ?
               "ผิดพลาด" :
               item.transaction_status === "Create" ?
                  "รออนุมัติ" :
                  item.transaction_status === "Approve" ?
                     "อนุมัติแล้ว" :
                     item.transaction_status === "Process" ?
                        "รอทำรายการ" :
                        item.transaction_status === "Success" ?
                           "สำเร็จ" :
                           item.transaction_status === "OTP" ?
                              "OTP" :
                              item.transaction_status === "Reject" ?
                                 "ยกเลิก" :
                                 item.transaction_status === "manual" ?
                                    "ถอนมือ" :
                                    item.transaction_status === "" ?
                                       "ทั้งหมด" :
                                       "-"
         }
         size="small"
         style={
            {
               padding: 10,
               backgroundColor: item.transaction_status === "Fail" ?
                  "#EB001B" :
                  item.transaction_status === "Create" ?
                     "#16539B" :
                     item.transaction_status === "Approve" ?
                        "#16539B" :
                        item.transaction_status === "Process" ?
                           "#FFB946" :
                           item.transaction_status === "Success" ?
                              "#129A50" :
                              item.transaction_status === "OTP" ?
                                 "#FFB946" :
                                 item.transaction_status === "Reject" ?
                                    "#FD3B52" :
                                    item.transaction_status === "manual" ?
                                       "#E1772B" :
                                       item.transaction_status === "" ?
                                          "gray" :
                                          "gray",
               // item.transaction_status === 1 ? "#129A50" : "#FFB946",
               color: "#eee",
            }
         }
      />
      ),
   },
   {
      title: "ออโต้",
      align: "center",
      render: (item) => (<
         Chip label={
            item.auto_status === "withdraw Fail" ?
               "ถอนผิดพลาด" :
               item.auto_status === "queue" ?
                  "อยู่ในคิว" :
                  item.auto_status === "Normal" ?
                     "ปกติ" :
                     item.auto_status === "Create" ?
                        "ปกติ" :
                        item.auto_status === "Approve" ?
                           "อนุมัติ" :
                           item.auto_status === "manual" ?
                              "ถอนมือ" :
                              item.auto_status === "Manual" ?
                                 "ถอนมือ" :
                                 item.auto_status === "Success" ?
                                    "อนุมัติ" :
                                    item.auto_status === "-" ?
                                       "-" :
                                       item.auto_status === "null" ?
                                          "-" :
                                          item.auto_status === "Process" ?
                                             "ดำเนินการ" :
                                             item.auto_status === "Withdraw Success" ?
                                                "ปกติ" :
                                                item.auto_status === "wait OTP" ?
                                                   "ปกติ" :
                                                   "-"
         }
         size="small"
         style={
            {
               padding: 10,
               backgroundColor: item.auto_status === "withdraw Fail" ?
                  "#EB001B" :
                  item.auto_status === "queue" ?
                     "#16539B" :
                     item.auto_status === "Normal" ?
                        "#16539B" :
                        item.auto_status === "Create" ?
                           "#129A50" :
                           item.auto_status === "Approve" ?
                              "#16539B" :
                              item.auto_status === "manual" ?
                                 "#FFB946" :
                                 item.auto_status === "Manual" ?
                                    "#FFB946" :
                                    item.auto_status === "Success" ?
                                       "#129A50" :
                                       item.auto_status === "-" ?
                                          "gray" :
                                          item.auto_status === "null" ?
                                             "gray" :
                                             item.auto_status === "Process" ?
                                                "#16539B" :
                                                item.auto_status === "Withdraw Success" ?
                                                   "#129A50" :
                                                   item.auto_status === "wait OTP" ?
                                                      "#129A50" :
                                                      "gray",
               color: "#eee",
            }
         }
      />
      ),
   },
   {
      field: "create_by",
      title: "ทำโดย",
      align: "center",
      minWidth: "120px"
   },
   {
      field: "annotation",
      title: "หมายเหตุ",
      align: "center",
      render: (item) => {
         return (
            <>
               <IconButton onClick={
                  () => {
                     setOpenDialogView({
                        open: true,
                        text: item.annotation,
                     });
                  }
               } >
                  <ManageSearchIcon />
               </IconButton> </>
         );
      },
   },
   {
      title: "เงินในบัญชี",
      align: "center",
      render: (item) => (
         <>
            <Grid container justifyContent="center" >
               <Grid item xs={12}
                  sx={
                     { mb: 1 }} >
                  <Chip label={
                     item.credit_bank_before ?
                        item.credit_bank_before :
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
                     item.credit_bank_after ?
                        item.credit_bank_after :
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
                  /> </Grid> </Grid> </>
      ),
   },

   {
      title: "เปลี่ยนสถานะ",
      align: "center",
      render: (item) => {
         return (
            <>
               <IconButton disabled={item.transaction_status !== "Reject"}
                  onClick={
                     () => {
                        setOpenDialogText({
                           open: true,
                           data: item,
                           type: "change_status",
                        });
                     }
                  } >
                  <EditIcon color={
                     item.transaction_status !== "Reject" ?
                        "gray" :
                        "secondary2"
                  }
                  /> </IconButton> </>
         );
      },
   },

   {
      title: "อนุมัติ",
      align: "center",
      maxWidth: "80px",
      render: (item) => {
         return (
            <Grid sx={
               { textAlign: "center" }} >
               <IconButton disabled={
                  item.transaction_status === "Success" ||
                  item.transaction_status === "Reject"
               }
                  onClick={
                     () => {
                        Swal.fire({
                           title: "ต้องการอนุมัติการถอน",
                           icon: "info",
                           showCancelButton: true,
                           cancelButtonColor: "#EB001B",
                           confirmButtonColor: "#129A50",
                           cancelButtonText: "ยกเลิก",
                           confirmButtonText: "ยืนยัน",
                        }).then(async (result) => {
                           if (result.isConfirmed) {
                              Swal.fire({
                                 position: "center",
                                 icon: "success",
                                 title: "อนุมัติการถอนเรียบร้อยแล้ว",
                                 showConfirmButton: false,
                                 timer: 2000,
                              });
                              try {
                                 let res = await axios({
                                    headers: {
                                       Authorization: "Bearer " +
                                          localStorage.getItem("access_token"),
                                    },
                                    method: "post",
                                    url: `${hostname}/api/member_transaction/approve-withdraw-auto`,
                                    data: {
                                       uuid: item.uuid,
                                       username: item.username,
                                       amount: item.amount,
                                       bank_name: item.bank_name,
                                       bank_number: item.bank_number,
                                    },
                                 });
                              } catch (error) {
                                 console.log(error);
                              }
                           }
                        });
                     }
                  } >
                  <CheckCircleOutlineIcon color={
                     item.transaction_status === "Success" ||
                        item.transaction_status === "Reject" ?
                        "gray" :
                        "secondary"
                  }
                  /> </IconButton> </Grid>
         );
      },
   },
   {
      title: "ยกเลิกถอน",
      align: "center",
      maxWidth: "90px",
      render: (item) => {
         return (
            <Grid sx={
               { textAlign: "center" }} >
               <IconButton disabled={
                  item.transaction_status === "Success" ||
                  item.transaction_status === "Reject"
               }
                  onClick={
                     () => {
                        setOpenDialogText({
                           open: true,
                           data: item,
                           type: "cancel",
                        });
                     }
                  } >
                  <HighlightOffIcon color={
                     item.transaction_status === "Success" ||
                        item.transaction_status === "Reject" ?
                        "gray" :
                        "error"
                  }
                  /> </IconButton> </Grid>
         );
      },
   },
   {
      title: "ถอนมือ",
      align: "center",
      render: (item) => {
         return (
            <Grid sx={
               { textAlign: "center" }} >
               <IconButton disabled={
                  item.transaction_status === "Success" ||
                  item.transaction_status === "Reject"
               }
                  onClick={
                     () => {
                        setOpenDialogText({
                           open: true,
                           data: item,
                           type: "manual",
                        });
                     }
                  } >
                  <CurrencyExchangeIcon color={
                     item.transaction_status === "Success" ||
                        item.transaction_status === "Reject" ?
                        "gray" :
                        "secondary2"
                  }
                  /> </IconButton> </Grid>
         );
      },
   },
   {
      title: "สลิป",
      align: "center",
      maxWidth: "80px",
      render: (item) => {
         return (
            <Grid sx={
               { textAlign: "center" }} >
               <IconButton disabled={!item.transaction_slip}
                  onClick={
                     () => {
                        setOpenDialogSlip({
                           open: true,
                           slip: item.transaction_slip,
                        });
                     }
                  } >
                  { /* <TextSnippetIcon sx={{ color: "#16539B"  }} /> */}
                  <TextSnippetIcon color={!item.transaction_slip ? "gray" : "neutral"}
                  /> </IconButton> </Grid>
         );
      },
   },
   {
      title: "เปลี่ยนสถานะ",
      align: "center",
      render: (item) => {
         return (
            <>
               <IconButton disabled={item.transaction_status !== "Reject"}
                  onClick={
                     () => {
                        setOpenDialogText({
                           open: true,
                           data: item,
                           type: "change_status",
                        });
                     }
                  } >
                  <EditIcon color={
                     item.transaction_status !== "Reject" ?
                        "gray" :
                        "secondary2"
                  }
                  /> </IconButton> </>
         );
      },
   },
   ];

   console.log('rowData', rowData)

   return (
      <Layout>
         <Paper sx={{ p: 3, mb: 2 }} >
            <Grid container justifyContent="start" >
               {bank.map((item) =>
                  <Paper sx={
                     {
                        // backgroundImage:
                        //   "url(https://the1pg.com/wp-content/uploads/2022/10/BG-wallet.jpg)",
                        // backgroundRepeat: "no-repeat",
                        // backgroundSize: "cover",
                        // backgroundPosition: "center",
                        bgcolor: '#0072B1',
                        p: 2,
                        height: 150,
                        width: "400px",
                        mr: 2,
                     }
                  } >
                     <Grid container >
                        <Grid item xs={2} sx={{ mt: 3 }} >
                           <Box>
                              {item.bank_name === "truemoney" ? (
                                 <Image src={trueL}
                                    alt="" />
                              ) : item.bank_name === "scb" ? (
                                 <Image src={scbL}
                                    alt="" />
                              ) : (
                                 ""
                              )
                              } </Box>
                        </Grid>
                        <Grid item xs={5} sx={{ ml: 2, mt: 2 }} >
                           <Typography sx={{
                              fontSize: "14px",
                              mt: "5px",
                              ml: "5px",
                              color: "#EEEEEE",
                           }} >
                              {
                                 item.bank_name === "truemoney" ?
                                    "True Wallet" :
                                    item.bank_name === "scb" ?
                                       "SCB (ไทยพาณิชย์)" :
                                       ""
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
                              จำนวนครั้ง
                           </Typography>
                           <Chip label={Intl.NumberFormat("TH").format(parseInt(item.bank_status))}
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
                           <Chip label={Intl.NumberFormat("TH").format(parseInt(1221100))}
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

         {/* <Grid container sx={{ mt: 2 }} >
            <Grid item container xs={12} sx={{ mb: 3 }} >
               <TextField label="เริ่ม"
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
                  InputLabelProps={{ shrink: true, }}
               />
               <TextField label="สิ้นสุด"
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
                  InputLabelProps={{ shrink: true }}
                  required />
               <TextField variant="outlined"
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
                  select label="ประเภทการค้นหา"
                  InputLabelProps={{ shrink: true }} >
                  <MenuItem value="" > ทั้งหมด </MenuItem>
                  <MenuItem value="Fail" > ผิดพลาด </MenuItem>
                  <MenuItem value="Create" > รออนุมัติ </MenuItem>
                  <MenuItem value="Approve" > อนุมัติแล้ว </MenuItem>
                  <MenuItem value="Process" > กำลังทำรายการ </MenuItem>
                  <MenuItem value="Success" > สำเร็จ </MenuItem>
                  <MenuItem value="OTP" > OTP </MenuItem>
                  <MenuItem value="Reject" > ยกเลิก </MenuItem>
                  <MenuItem value="manual" > ถอนมือ </MenuItem>
               </TextField>

               <TextField variant="outlined"
                  type="text"
                  name="data"
                  value={search.data}
                  onChange={(e) => {
                     setSearch({
                        ...search,
                        [e.target.name]: e.target.value,
                     });
                  }}
                  placeholder="ค้นหาข้อมูลที่ต้องการ"
                  sx={{ mt: 1, mr: 2, width: "220px", bgcolor: '#fff' }}
               />
               <Button variant="contained"
                  style={{ marginRight: "8px", marginTop: 8, color: '#fff' }}
                  color="primary"
                  size="large"
                  onClick={() => {
                     getMemberList();
                  }} >
                  <Typography > ค้นหา </Typography>
               </Button>
            </Grid>
         </Grid> */}

         <Grid container justifyContent="space-between" >
            <Paper sx={{ p: 3, mb: 2 }} >
               <Grid container sx={{ mt: 2 }} >
                  <Grid item container xs={12} sx={{ mb: 3 }} >
                     <TextField label="เริ่ม"
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
                        InputLabelProps={{ shrink: true, }}
                     />
                     <TextField label="สิ้นสุด"
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
                        InputLabelProps={{ shrink: true }}
                        required />
                     <TextField variant="outlined"
                        type="text"
                        name="type"
                        size="small"

                        value={search.type}
                        onChange={(e) => {
                           setSearch({
                              ...search,
                              [e.target.name]: e.target.value,
                           });
                        }}
                        sx={{ mt: 1, mr: 1, width: "220px", bgcolor: '#fff' }}
                        select label="ประเภทการค้นหา"
                        InputLabelProps={{ shrink: true }} >
                        <MenuItem value="" > ทั้งหมด </MenuItem>
                        <MenuItem value="Fail" > ผิดพลาด </MenuItem>
                        <MenuItem value="Create" > รออนุมัติ </MenuItem>
                        <MenuItem value="Approve" > อนุมัติแล้ว </MenuItem>
                        <MenuItem value="Process" > กำลังทำรายการ </MenuItem>
                        <MenuItem value="Success" > สำเร็จ </MenuItem>
                        <MenuItem value="OTP" > OTP </MenuItem>
                        <MenuItem value="Reject" > ยกเลิก </MenuItem>
                        <MenuItem value="manual" > ถอนมือ </MenuItem>
                     </TextField>

                     <TextField variant="outlined"
                        type="text"
                        name="data"
                        size="small"
                        value={search.data}
                        onChange={(e) => {
                           setSearch({
                              ...search,
                              [e.target.name]: e.target.value,
                           });
                        }}
                        label="ค้นหาชื่อผู้ใช้"
                        placeholder="ค้นหาชื่อผู้ใช้"
                        sx={{ mt: 1, mr: 2, width: "220px", bgcolor: '#fff' }}
                     />
                     {/* <Button variant="contained"
                        style={{ marginRight: "8px", marginTop: 8, color: '#fff' }}
                        color="primary"
                        size="large"
                        onClick={() => {
                           getMemberList();
                        }} >
                        <Typography > ค้นหา </Typography>
                     </Button> */}
                     <Button
                        variant="contained"
                        style={{ marginRight: "8px", marginTop: 9, color: '#fff' }}
                        color="primary"
                        size="small"
                        onClick={() => {
                           getUser();
                           getReport();
                        }}
                     >
                        <SearchIcon />
                        <Typography>ค้นหา</Typography>
                     </Button>
                     <Button
                        variant="contained"
                        style={{
                           marginRight: "8px",
                           marginTop: 9,
                           backgroundColor: "#FFB946",
                           color: '#fff'
                        }}
                        size="large"
                        onClick={async () => {
                           let start = moment()
                              .subtract(1, "days")
                              .format("YYYY-MM-DD 00:00");
                           let end = moment()
                              .subtract(1, "days")
                              .format("YYYY-MM-DD 23:59");
                           setSelectedDateRange({
                              start: moment()
                                 .subtract(1, "days")
                                 .format("YYYY-MM-DD 00:00"),
                              end: moment().subtract(1, "days").format("YYYY-MM-DD 23:59"),
                           });
                           getUser("yesterday", start, end);
                           getReport("yesterday", start, end);
                        }}
                     >
                        <Typography>เมื่อวาน</Typography>
                     </Button>
                     <Button
                        variant="contained"
                        style={{
                           marginRight: "8px",
                           marginTop: 9,
                           backgroundColor: "#129A50",
                           color: '#fff'
                        }}
                        size="large"
                        onClick={async () => {
                           let start = moment().format("YYYY-MM-DD 00:00");
                           let end = moment().format("YYYY-MM-DD 23:59");
                           setSelectedDateRange({
                              start: moment().format("YYYY-MM-DD 00:00"),
                              end: moment().format("YYYY-MM-DD 23:59"),
                           });
                           getUser("today", start, end);
                           getReport("today", start, end);
                        }}
                     >
                        <Typography>วันนี้</Typography>
                     </Button>
                  </Grid>
               </Grid>
               <Grid container justifyContent="start" >
                  <MaterialTableForm data={data2} columns={columns} pageSize="5" title="รายการถอนวันนี้" />
               </Grid>
            </Paper>
         </Grid>

         {/* <Grid container justifyContent="start" >
                <MaterialTableForm data={data} columns={columns} pageSize="5" title="จัดการรายการถอน" />
            </Grid> */}

         {/* <Paper sx={{ p: 3, mb: 2 }} >
            <Grid container justifyContent="start" >
               <MaterialTableForm data={data2} columns={columns2} pageSize="10" title="รายการถอนวันนี้" />
            </Grid>
         </Paper> */}

         <Dialog
            open={openDialogApprove}
            // onClose={() => setOpenDialogApprove(false)}
            fullWidth
            maxWidth="md"
         >
            <DialogTitle>
               <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                  <Grid>
                     <IconButton onClick={() => {
                        setOpenDialogApprove(false)
                     }} >
                        <CloseIcon />
                     </IconButton>
                     รายละเอียด :
                     <Chip
                        label={
                           rowData.transaction_status === "Fail" ?
                              "ผิดพลาด" :
                              rowData.transaction_status === "Create" ?
                                 "รออนุมัติ" :
                                 rowData.transaction_status === "Approve" ?
                                    "อนุมัติแล้ว" :
                                    rowData.transaction_status === "Process" ?
                                       "รอทำรายการ" :
                                       rowData.transaction_status === "Success" ?
                                          "สำเร็จ" :
                                          rowData.transaction_status === "OTP" ?
                                             "OTP" :
                                             rowData.transaction_status === "Reject" ?
                                                "ยกเลิก" :
                                                rowData.transaction_status === "manual" ?
                                                   "ถอนมือ" :
                                                   rowData.transaction_status === "" ?
                                                      "ทั้งหมด" :
                                                      "-"
                        }
                        sx={{
                           ml: 2,
                           p: 2,
                           fontSize: '16px',
                           border: rowData.transaction_status === "Fail" ?
                              "2px solid #EB001B" :
                              rowData.transaction_status === "Create" ?
                                 "2px solid #16539B" :
                                 rowData.transaction_status === "Approve" ?
                                    "2px solid #16539B" :
                                    rowData.transaction_status === "Process" ?
                                       "2px solid #FFB946" :
                                       rowData.transaction_status === "Success" ?
                                          "2px solid #129A50" :
                                          rowData.transaction_status === "OTP" ?
                                             "2px solid #FFB946" :
                                             rowData.transaction_status === "Reject" ?
                                                "2px solid #FD3B52" :
                                                rowData.transaction_status === "manual" ?
                                                   "2px solid #E1772B" :
                                                   rowData.transaction_status === "" ?
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
                     <Button variant="outlined" color="error" sx={{}}>
                        ยกเลิกและคืนเงิน
                     </Button>
                  </Grid>
               </Grid>


            </DialogTitle>

            <DialogContent>
               <Grid container justifyContent="center" spacing={2}>
                  <Grid item xs={6}>
                     <Table sx={{ border: '1px solid #eee' }}>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ชื่อผู้ใช้งาน
                           </TableCell>
                           <TableCell>{rowData.username}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ธนาคาร
                           </TableCell>
                           <TableCell >{rowData.bank_name}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              เลขบัญชี
                           </TableCell>
                           <TableCell >{rowData.bank_number}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ชื่อ นามสกุล
                           </TableCell>
                           <TableCell >{rowData.bank_account_name}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              เวลาที่ถอน
                           </TableCell>
                           <TableCell >{moment(rowData.createdAt).format("DD-MM-YYYY HH:mm")}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ยอดถอนเงิน
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold" }} > {Intl.NumberFormat("TH").format(parseInt(rowData.amount))} บาท</TableCell>
                        </TableRow>
                     </Table>
                  </Grid>

                  <Grid item xs={6}>
                     <Typography sx={{ fontSize: '14px' }}> ประเภทการถอน</Typography>
                     <FormControl>
                        <RadioGroup
                           row
                           defaultValue="auto"
                           name="radio-buttons-group"
                        >
                           <FormControlLabel value="auto" control={<Radio />} label={<Typography sx={{ fontSize: '14px' }}>ออโต้ </Typography>} />
                           <FormControlLabel value="manual" control={<Radio />} label={<Typography sx={{ fontSize: '14px' }}>ถอนมือ </Typography>} />
                        </RadioGroup>
                     </FormControl>

                     <Typography sx={{ fontSize: '14px', mt: 3 }}> ธนาคาร</Typography>
                     <FormControl>
                        <RadioGroup
                           defaultValue="auto"
                           name="radio-buttons-group"
                        >
                           <Paper sx={{ pl: 4, pr: 10, py: 2, mb: 2 }}>
                              <FormControlLabel value="auto" control={<Radio />}
                                 label={
                                    <Grid >
                                       <Typography sx={{ fontSize: '14px', mt: 1 }}> SCB (ไทยพาณิชย์)</Typography>
                                       <Typography sx={{ fontSize: '14px', mt: 1 }}> 120345698801</Typography>
                                       <Typography sx={{ fontSize: '14px', mt: 1 }}> จักรพงศ์ ปรีชาภรณ์</Typography>

                                    </Grid>
                                 }
                              />
                           </Paper>
                           <Paper sx={{ pl: 4, pr: 10, py: 2 }}>
                              <FormControlLabel value="manual" control={<Radio />}
                                 label={
                                    <Grid >
                                       <Typography sx={{ fontSize: '14px', mt: 1 }}> KBANK</Typography>
                                       <Typography sx={{ fontSize: '14px', mt: 1 }}> 120345698801</Typography>
                                       <Typography sx={{ fontSize: '14px', mt: 1 }}> จักรพงศ์ ปรีชาภรณ์</Typography>
                                    </Grid>
                                 }
                              />
                           </Paper>

                        </RadioGroup>
                     </FormControl>

                  </Grid>

                  <Grid container justifyContent='center' spacing={1}>
                     <Grid container item xs={10}>
                        <Button
                           variant="contained"
                           size="large"
                           fullWidth
                           onClick={() => {
                              editUser();
                           }}
                           sx={{
                              mt: 3,
                              color: '#fff',

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