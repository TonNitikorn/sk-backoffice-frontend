import React, { useState, useEffect } from "react";
import Layout from '../theme/Layout'
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

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function withdrawpending() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: moment().format("YYYY-MM-DD 00:00"),
    end: moment().format("YYYY-MM-DD 23:59"),
  });
  const [search, setSearch] = useState({
    data: "",
    type: "",
  });

  const handleClickSnackbar = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const bank = [
    {
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
  ]

  const columns = [
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
          <Grid item xs={3} sx={{ mt: 2 }}>
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
            ) : item.bank_name === "baac" ? (
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
                    {item.bank_number}
                  </Button>
                </div>
              </CopyToClipboard>
            </Grid>
            <Grid>
              <Typography sx={{ fontSize: "14px" }}>
                {item.name}
              </Typography>
            </Grid>
            <Grid sx={{ ml: 2 }}>
              <CopyToClipboard text={item.username}>
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
      field: "sb_username",
      title: "ยอดเงินถอน",
      align: "center",
      render: (item) => (
        <>
          <Grid container justifyContent="center">
            <Grid>
              <Typography sx={{ fontSize: "14px" }}>
                {Intl.NumberFormat("TH", {
                  style: "currency",
                  currency: "THB",
                }).format(parseInt(item.amount))}
              </Typography>
            </Grid>

            <Chip
              label={"เครดิต"}
              size="small"
              style={{
                padding: 10,
                backgroundColor: "#FFB946",
                color: "#eee",
              }}
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
      // render: (item) => (
      //   <>
      //     <Grid container justifyContent="center">
      //       <Grid>
      //         <Typography sx={{ fontSize: "14px" }}>
      //           {item.bank_date}
      //         </Typography>
      //         <Typography sx={{ fontSize: "14px" }}>
      //           {item.bank_time}
      //         </Typography>
      //       </Grid>
      //     </Grid>
      //   </>
      // ),
    },
    {
      field: "updatedAt",
      title: "วันที่อัพเดท",
      align: "center",
      render: (item) => (
        <>
          <Grid container justifyContent="center">
            <Grid>
              <Typography sx={{ fontSize: "14px" }}>
                {item.updated_date}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                {item.updated_time}
              </Typography>
            </Grid>
          </Grid>
        </>
      ),
    },

    {
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={
            item.transaction_status === "Fail"
              ? "ผิดพลาด"
              : item.transaction_status === "Create"
                ? "รออนุมัติ"
                : item.transaction_status === "Approve"
                  ? "อนุมัติแล้ว"
                  : item.transaction_status === "Process"
                    ? "รอทำรายการ"
                    : item.transaction_status === "Success"
                      ? "สำเร็จ"
                      : item.transaction_status === "OTP"
                        ? "OTP"
                        : item.transaction_status === "Reject"
                          ? "ยกเลิก"
                          : item.transaction_status === "manual"
                            ? "ถอนมือ"
                            : item.transaction_status === ""
                              ? "ทั้งหมด"
                              : "-"
          }
          size="small"
          style={{
            padding: 10,
            backgroundColor:
              item.transaction_status === "Fail"
                ? "#EB001B"
                : item.transaction_status === "Create"
                  ? "#16539B"
                  : item.transaction_status === "Approve"
                    ? "#16539B"
                    : item.transaction_status === "Process"
                      ? "#FFB946"
                      : item.transaction_status === "Success"
                        ? "#129A50"
                        : item.transaction_status === "OTP"
                          ? "#FFB946"
                          : item.transaction_status === "Reject"
                            ? "#FD3B52"
                            : item.transaction_status === "manual"
                              ? "#E1772B"
                              : item.transaction_status === ""
                                ? "gray"
                                : "gray",
            // item.transaction_status === 1 ? "#129A50" : "#FFB946",
            color: "#eee",
          }}
        />
      ),
    },
    {
      title: "ออโต้",
      align: "center",
      render: (item) => (
        <Chip
          label={
            item.auto_status === "withdraw Fail"
              ? "ถอนผิดพลาด"
              : item.auto_status === "queue"
                ? "อยู่ในคิว"
                : item.auto_status === "Normal"
                  ? "ปกติ"
                  : item.auto_status === "Create"
                    ? "ปกติ"
                    : item.auto_status === "Approve"
                      ? "อนุมัติ"
                      : item.auto_status === "manual"
                        ? "ถอนมือ"
                        : item.auto_status === "Manual"
                          ? "ถอนมือ"
                          : item.auto_status === "Success"
                            ? "อนุมัติ"
                            : item.auto_status === "-"
                              ? "-"
                              : item.auto_status === "null"
                                ? "-"
                                : item.auto_status === "Process"
                                  ? "ดำเนินการ"
                                  : item.auto_status === "Withdraw Success"
                                    ? "ปกติ"
                                    : item.auto_status === "wait OTP"
                                      ? "ปกติ"
                                      : "-"
          }
          size="small"
          style={{
            padding: 10,
            backgroundColor:
              item.auto_status === "withdraw Fail"
                ? "#EB001B"
                : item.auto_status === "queue"
                  ? "#16539B"
                  : item.auto_status === "Normal"
                    ? "#16539B"
                    : item.auto_status === "Create"
                      ? "#129A50"
                      : item.auto_status === "Approve"
                        ? "#16539B"
                        : item.auto_status === "manual"
                          ? "#FFB946"
                          : item.auto_status === "Manual"
                            ? "#FFB946"
                            : item.auto_status === "Success"
                              ? "#129A50"
                              : item.auto_status === "-"
                                ? "gray"
                                : item.auto_status === "null"
                                  ? "gray"
                                  : item.auto_status === "Process"
                                    ? "#16539B"
                                    : item.auto_status === "Withdraw Success"
                                      ? "#129A50"
                                      : item.auto_status === "wait OTP"
                                        ? "#129A50"
                                        : "gray",
            color: "#eee",
          }}
        />
      ),
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
      render: (item) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setOpenDialogView({
                  open: true,
                  text: item.annotation,
                });
              }}
            >
              <ManageSearchIcon />
            </IconButton>
          </>
        );
      },
    },
    {
      title: "เงินในบัญชี",
      align: "center",
      render: (item) => (
        <>
          <Grid container justifyContent="center">
            <Grid item xs={12} sx={{ mb: 1 }}>
              <Chip
                label={
                  item.credit_bank_before
                    ? item.credit_bank_before
                    : "0.00"
                }
                size="small"
                style={{
                  padding: 10,
                  minWidth: "80px",
                  backgroundColor: "#FD3B52",
                  color: "#eee",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Chip
                label={
                  item.credit_bank_after
                    ? item.credit_bank_after
                    : "0.00"
                }
                size="small"
                style={{
                  padding: 10,
                  minWidth: "80px",
                  backgroundColor: "#129A50",
                  color: "#eee",
                }}
              />
            </Grid>
          </Grid>
        </>
      ),
    },

    {
      title: "อนุมัติ",
      align: "center",
      maxWidth: "80px",
      render: (item) => {
        return (
          <Grid sx={{ textAlign: "center" }}>
            <IconButton
              disabled={
                item.transaction_status === "Success" ||
                item.transaction_status === "Reject"
              }
              onClick={() => {
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
                          Authorization:
                            "Bearer " +
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
              }}
            >
              <CheckCircleOutlineIcon
                color={
                  item.transaction_status === "Success" ||
                    item.transaction_status === "Reject"
                    ? "gray"
                    : "secondary"
                }
              />
            </IconButton>
          </Grid>
        );
      },
    },
    {
      title: "ยกเลิกถอน",
      align: "center",
      maxWidth: "90px",
      render: (item) => {
        return (
          <Grid sx={{ textAlign: "center" }}>
            <IconButton
              disabled={
                item.transaction_status === "Success" ||
                item.transaction_status === "Reject"
              }
              onClick={() => {
                setOpenDialogText({
                  open: true,
                  data: item,
                  type: "cancel",
                });
              }}
            >
              <HighlightOffIcon
                color={
                  item.transaction_status === "Success" ||
                    item.transaction_status === "Reject"
                    ? "gray"
                    : "error"
                }
              />
            </IconButton>
          </Grid>
        );
      },
    },
    {
      title: "ถอนมือ",
      align: "center",
      render: (item) => {
        return (
          <Grid sx={{ textAlign: "center" }}>
            <IconButton
              disabled={
                item.transaction_status === "Success" ||
                item.transaction_status === "Reject"
              }
              onClick={() => {
                setOpenDialogText({
                  open: true,
                  data: item,
                  type: "manual",
                });
              }}
            >
              <CurrencyExchangeIcon
                color={
                  item.transaction_status === "Success" ||
                    item.transaction_status === "Reject"
                    ? "gray"
                    : "secondary2"
                }
              />
            </IconButton>
          </Grid>
        );
      },
    },
    {
      title: "สลิป",
      align: "center",
      maxWidth: "80px",
      render: (item) => {
        return (
          <Grid sx={{ textAlign: "center" }}>
            <IconButton
              disabled={!item.transaction_slip}
              onClick={() => {
                setOpenDialogSlip({
                  open: true,
                  slip: item.transaction_slip,
                });
              }}
            >
              {/* <TextSnippetIcon sx={{ color: "#16539B"  }} /> */}
              <TextSnippetIcon
                color={!item.transaction_slip ? "gray" : "neutral"}
              />
            </IconButton>
          </Grid>
        );
      },
    },
    {
      title: "เปลี่ยนสถานะ",
      align: "center",
      render: (item) => {
        return (
          <>
            <IconButton
              disabled={item.transaction_status !== "Reject"}
              onClick={() => {
                setOpenDialogText({
                  open: true,
                  data: item,
                  type: "change_status",
                });
              }}
            >
              <EditIcon
                color={
                  item.transaction_status !== "Reject"
                    ? "gray"
                    : "secondary2"
                }
              />
            </IconButton>
          </>
        );
      },
    },
  ];

  const data = [
    {
      "id": 54738,
      "uuid": "710039f9-a6cb-472d-8d51-64801e11bb5d",
      "bank": "2d336309-0680-4fde-b331-74811a647a8f",
      "amount": 9,
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
      "member_account_banks": [
        {
          "id": 1267,
          "uuid": "2d336309-0680-4fde-b331-74811a647a8f",
          "bank_name": "kbnk",
          "bank_account_name": "ภูชิต กุลนอก",
          "bank_number": "1338361889",
          "member_credit": 0,
          "member_uuid": "722ad776-7c39-470f-ad3c-d1aa89d30139",
          "createdAt": "2022-07-22T08:56:25.000Z",
          "updatedAt": "2022-07-22T08:56:25.000Z"
        }
      ]
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
      "member_account_banks": [
        {
          "id": 6739,
          "uuid": "479432cc-0c9a-4b17-925c-35dfdd3f9042",
          "bank_name": "kbnk",
          "bank_account_name": "ชัญญพัชร์  พึ่งทิม",
          "bank_number": "0513807236",
          "member_credit": 0,
          "member_uuid": "8407b7fb-10ab-4c58-8c24-631e36eb846b",
          "createdAt": "2022-10-17T05:37:36.000Z",
          "updatedAt": "2022-10-17T05:37:36.000Z"
        }
      ]
    },
    {
      "id": 54730,
      "uuid": "45cb3523-d203-4f33-b2c9-5d6aa24c89c8",
      "bank": "f4de8d86-c674-42bf-a3ae-743206709ba3",
      "amount": 100,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 184.9,
      "credit_after": 84.9,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:59:35",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598997579473007",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa6657512",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:59:35.000Z",
      "updatedAt": "2022-10-17T07:00:33.000Z",
      "member_account_banks": [
        {
          "id": 5942,
          "uuid": "f4de8d86-c674-42bf-a3ae-743206709ba3",
          "bank_name": "truemoney",
          "bank_account_name": "ศตายุ  อุไรโชติ",
          "bank_number": "0806657512",
          "member_credit": 0,
          "member_uuid": "152bb67d-f278-49ca-9a59-c7896196e246",
          "createdAt": "2022-10-05T10:01:27.000Z",
          "updatedAt": "2022-10-05T10:01:27.000Z"
        }
      ]
    },
    {
      "id": 54720,
      "uuid": "fd17b9ee-17a7-4395-b7bc-ed460709ca80",
      "bank": "7215b40e-4e9d-44c6-b3b7-2a503c881ac9",
      "amount": 3055,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 3055.85,
      "credit_after": 0.85,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:52:16",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598953692727057",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa1788528",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:52:17.000Z",
      "updatedAt": "2022-10-17T06:56:53.000Z",
      "member_account_banks": [
        {
          "id": 4425,
          "uuid": "7215b40e-4e9d-44c6-b3b7-2a503c881ac9",
          "bank_name": "kbnk",
          "bank_account_name": "ณัฐภาพรรณ์ โตอารีย์",
          "bank_number": "0148379173",
          "member_credit": 0,
          "member_uuid": "43bab807-5a3a-4280-8b40-fe53d40ed976",
          "createdAt": "2022-09-20T15:01:11.000Z",
          "updatedAt": "2022-09-20T15:01:11.000Z"
        }
      ]
    },
    {
      "id": 54719,
      "uuid": "188d688a-c883-4be6-8cd0-b8bee77e066f",
      "bank": "b608efdf-d489-4000-ba31-bb9ed653f41c",
      "amount": 423,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 423.6,
      "credit_after": 0.6,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:51:14",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598947427778498",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa3600716",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:51:14.000Z",
      "updatedAt": "2022-10-17T06:56:28.000Z",
      "member_account_banks": [
        {
          "id": 6718,
          "uuid": "b608efdf-d489-4000-ba31-bb9ed653f41c",
          "bank_name": "kbnk",
          "bank_account_name": "ไพโรจน์ บุตรขจร",
          "bank_number": "1023541595",
          "member_credit": 0,
          "member_uuid": "24f20e74-1306-4528-940e-59ec74d02c2e",
          "createdAt": "2022-10-16T19:14:42.000Z",
          "updatedAt": "2022-10-16T20:23:33.000Z"
        }
      ]
    },
    {
      "id": 54714,
      "uuid": "104dd47b-e1a2-43d5-af7c-b63ee21b1d8e",
      "bank": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
      "amount": 80,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 120.35,
      "credit_after": 40.35,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:46:03",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598916318666628",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa6845422",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:46:03.000Z",
      "updatedAt": "2022-10-17T06:46:37.000Z",
      "member_account_banks": [
        {
          "id": 3567,
          "uuid": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
          "bank_name": "truemoney",
          "bank_account_name": "มะคอรี ซามะลาแล",
          "bank_number": "0936845422",
          "member_credit": 0,
          "member_uuid": "47dfb5a5-482d-4772-bb4e-1a7960d52f54",
          "createdAt": "2022-08-26T19:18:02.000Z",
          "updatedAt": "2022-08-26T19:18:02.000Z"
        }
      ]
    },
    {
      "id": 54705,
      "uuid": "2a933f22-8f32-43d2-872e-8108f943a327",
      "bank": "c42cca84-aac3-4e48-a358-29ab8b09d65d",
      "amount": 200,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 242.97,
      "credit_after": 42.97,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:38:59",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598873959064593",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa7075818",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:38:59.000Z",
      "updatedAt": "2022-10-17T06:40:04.000Z",
      "member_account_banks": [
        {
          "id": 4712,
          "uuid": "c42cca84-aac3-4e48-a358-29ab8b09d65d",
          "bank_name": "gsb",
          "bank_account_name": "ประเวช คชภักดี",
          "bank_number": "020377022601",
          "member_credit": 0,
          "member_uuid": "52c07299-ac0b-434b-a24a-aac0ac9b373b",
          "createdAt": "2022-09-23T03:52:36.000Z",
          "updatedAt": "2022-09-23T03:52:36.000Z"
        }
      ]
    },
    {
      "id": 54704,
      "uuid": "cc780851-8efb-4b59-8e5d-b3302d661511",
      "bank": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
      "amount": 52,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 102.7,
      "credit_after": 50.7,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:35:27",
      "create_by": "เกียริ",
      "annotation": "ถอยมือ",
      "ref": "PWQ166598852731866027",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa6845422",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:35:27.000Z",
      "updatedAt": "2022-10-17T06:36:20.000Z",
      "member_account_banks": [
        {
          "id": 3567,
          "uuid": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
          "bank_name": "truemoney",
          "bank_account_name": "มะคอรี ซามะลาแล",
          "bank_number": "0936845422",
          "member_credit": 0,
          "member_uuid": "47dfb5a5-482d-4772-bb4e-1a7960d52f54",
          "createdAt": "2022-08-26T19:18:02.000Z",
          "updatedAt": "2022-08-26T19:18:02.000Z"
        }
      ]
    }

  ]

  const columns2 = [
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
      minWidth: "250px",
      render: (item) => (
        <Grid container>
          <Grid item xs={3} sx={{ mt: 2 }}>
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
            ) : item.bank_name === "baac" ? (
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
                    {item.bank_number}
                  </Button>
                </div>
              </CopyToClipboard>
            </Grid>
            <Grid>
              <Typography sx={{ fontSize: "14px" }}>
                {item.name}
              </Typography>
            </Grid>
            <Grid sx={{ ml: 2 }}>
              <CopyToClipboard text={item.username}>
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
      field: "sb_username",
      title: "ยอดเงินถอน",
      align: "center",
      minWidth: "130px",
      render: (item) => (
        <>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <Typography sx={{ fontSize: "14px" }}>
                {Intl.NumberFormat("TH", {
                  style: "currency",
                  currency: "THB",
                }).format(parseInt(item.amount))}
              </Typography>
            </Grid>

            <Chip
              label={"เครดิต"}
              size="small"
              style={{
                padding: 10,
                backgroundColor: "#FFB946",
                color: "#eee",
              }}
            />
          </Grid>
        </>
      ),
    },
    {
      field: "bank_time",
      title: "วันที่ถอน",
      align: "center",
      minWidth: "150px",
      // render: (item) => (
      //   <>
      //     <Grid container justifyContent="center">
      //       <Grid>
      //         <Typography sx={{ fontSize: "14px" }}>
      //           {item.bank_date}
      //         </Typography>
      //         <Typography sx={{ fontSize: "14px" }}>
      //           {item.bank_time}
      //         </Typography>
      //       </Grid>
      //     </Grid>
      //   </>
      // ),
    },
    {
      field: "updatedAt",
      title: "วันที่อัพเดท",
      align: "center",
      minWidth: "150px",
      render: (item) => (
        <>
          <Grid container justifyContent="center">
            <Grid>
              <Typography sx={{ fontSize: "14px" }}>
                {item.updated_date}
              </Typography>
              <Typography sx={{ fontSize: "14px" }}>
                {item.updated_time}
              </Typography>
            </Grid>
          </Grid>
        </>
      ),
    },

    {
      title: "สถานะ",
      align: "center",
      render: (item) => (
        <Chip
          label={
            item.transaction_status === "Fail"
              ? "ผิดพลาด"
              : item.transaction_status === "Create"
                ? "รออนุมัติ"
                : item.transaction_status === "Approve"
                  ? "อนุมัติแล้ว"
                  : item.transaction_status === "Process"
                    ? "รอทำรายการ"
                    : item.transaction_status === "Success"
                      ? "สำเร็จ"
                      : item.transaction_status === "OTP"
                        ? "OTP"
                        : item.transaction_status === "Reject"
                          ? "ยกเลิก"
                          : item.transaction_status === "manual"
                            ? "ถอนมือ"
                            : item.transaction_status === ""
                              ? "ทั้งหมด"
                              : "-"
          }
          size="small"
          style={{
            padding: 10,
            backgroundColor:
              item.transaction_status === "Fail"
                ? "#EB001B"
                : item.transaction_status === "Create"
                  ? "#16539B"
                  : item.transaction_status === "Approve"
                    ? "#16539B"
                    : item.transaction_status === "Process"
                      ? "#FFB946"
                      : item.transaction_status === "Success"
                        ? "#129A50"
                        : item.transaction_status === "OTP"
                          ? "#FFB946"
                          : item.transaction_status === "Reject"
                            ? "#FD3B52"
                            : item.transaction_status === "manual"
                              ? "#E1772B"
                              : item.transaction_status === ""
                                ? "gray"
                                : "gray",
            // item.transaction_status === 1 ? "#129A50" : "#FFB946",
            color: "#eee",
          }}
        />
      ),
    },
    {
      title: "ออโต้",
      align: "center",
      render: (item) => (
        <Chip
          label={
            item.auto_status === "withdraw Fail"
              ? "ถอนผิดพลาด"
              : item.auto_status === "queue"
                ? "อยู่ในคิว"
                : item.auto_status === "Normal"
                  ? "ปกติ"
                  : item.auto_status === "Create"
                    ? "ปกติ"
                    : item.auto_status === "Approve"
                      ? "อนุมัติ"
                      : item.auto_status === "manual"
                        ? "ถอนมือ"
                        : item.auto_status === "Manual"
                          ? "ถอนมือ"
                          : item.auto_status === "Success"
                            ? "อนุมัติ"
                            : item.auto_status === "-"
                              ? "-"
                              : item.auto_status === "null"
                                ? "-"
                                : item.auto_status === "Process"
                                  ? "ดำเนินการ"
                                  : item.auto_status === "Withdraw Success"
                                    ? "ปกติ"
                                    : item.auto_status === "wait OTP"
                                      ? "ปกติ"
                                      : "-"
          }
          size="small"
          style={{
            padding: 10,
            backgroundColor:
              item.auto_status === "withdraw Fail"
                ? "#EB001B"
                : item.auto_status === "queue"
                  ? "#16539B"
                  : item.auto_status === "Normal"
                    ? "#16539B"
                    : item.auto_status === "Create"
                      ? "#129A50"
                      : item.auto_status === "Approve"
                        ? "#16539B"
                        : item.auto_status === "manual"
                          ? "#FFB946"
                          : item.auto_status === "Manual"
                            ? "#FFB946"
                            : item.auto_status === "Success"
                              ? "#129A50"
                              : item.auto_status === "-"
                                ? "gray"
                                : item.auto_status === "null"
                                  ? "gray"
                                  : item.auto_status === "Process"
                                    ? "#16539B"
                                    : item.auto_status === "Withdraw Success"
                                      ? "#129A50"
                                      : item.auto_status === "wait OTP"
                                        ? "#129A50"
                                        : "gray",
            color: "#eee",
          }}
        />
      ),
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
      render: (item) => {
        return (
          <>
            <IconButton
              onClick={() => {
                setOpenDialogView({
                  open: true,
                  text: item.annotation,
                });
              }}
            >
              <ManageSearchIcon />
            </IconButton>
          </>
        );
      },
    },
    {
      title: "เงินในบัญชี",
      align: "center",
      minWidth: "150px",
      render: (item) => (
        <>
          <Grid container justifyContent="center">
            <Grid item xs={12} sx={{ mb: 1 }}>
              <Chip
                label={
                  item.credit_bank_before
                    ? item.credit_bank_before
                    : "0.00"
                }
                size="small"
                style={{
                  padding: 10,
                  minWidth: "80px",
                  backgroundColor: "#FD3B52",
                  color: "#eee",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Chip
                label={
                  item.credit_bank_after
                    ? item.credit_bank_after
                    : "0.00"
                }
                size="small"
                style={{
                  padding: 10,
                  minWidth: "80px",
                  backgroundColor: "#129A50",
                  color: "#eee",
                }}
              />
            </Grid>
          </Grid>
        </>
      ),
    },
    {
      title: "สลิป",
      align: "center",
      // maxWidth: "80px",
      minWidth: "130px",
      render: (item) => {
        return (
          <Grid sx={{ textAlign: "center" }}>
            <IconButton
              disabled={!item.transaction_slip}
              onClick={() => {
                setOpenDialogSlip({
                  open: true,
                  slip: item.transaction_slip,
                });
              }}
            >
              {/* <TextSnippetIcon sx={{ color: "#16539B"  }} /> */}
              <TextSnippetIcon
                color={!item.transaction_slip ? "gray" : "neutral"}
              />
            </IconButton>
          </Grid>
        );
      },
    },
  ];

  const data2 = [
    {
      "id": 54738,
      "uuid": "710039f9-a6cb-472d-8d51-64801e11bb5d",
      "bank": "2d336309-0680-4fde-b331-74811a647a8f",
      "amount": 9,
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
      "member_account_banks": [
        {
          "id": 1267,
          "uuid": "2d336309-0680-4fde-b331-74811a647a8f",
          "bank_name": "kbnk",
          "bank_account_name": "ภูชิต กุลนอก",
          "bank_number": "1338361889",
          "member_credit": 0,
          "member_uuid": "722ad776-7c39-470f-ad3c-d1aa89d30139",
          "createdAt": "2022-07-22T08:56:25.000Z",
          "updatedAt": "2022-07-22T08:56:25.000Z"
        }
      ]
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
      "member_account_banks": [
        {
          "id": 6739,
          "uuid": "479432cc-0c9a-4b17-925c-35dfdd3f9042",
          "bank_name": "kbnk",
          "bank_account_name": "ชัญญพัชร์  พึ่งทิม",
          "bank_number": "0513807236",
          "member_credit": 0,
          "member_uuid": "8407b7fb-10ab-4c58-8c24-631e36eb846b",
          "createdAt": "2022-10-17T05:37:36.000Z",
          "updatedAt": "2022-10-17T05:37:36.000Z"
        }
      ]
    },
    {
      "id": 54730,
      "uuid": "45cb3523-d203-4f33-b2c9-5d6aa24c89c8",
      "bank": "f4de8d86-c674-42bf-a3ae-743206709ba3",
      "amount": 100,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 184.9,
      "credit_after": 84.9,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:59:35",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598997579473007",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa6657512",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:59:35.000Z",
      "updatedAt": "2022-10-17T07:00:33.000Z",
      "member_account_banks": [
        {
          "id": 5942,
          "uuid": "f4de8d86-c674-42bf-a3ae-743206709ba3",
          "bank_name": "truemoney",
          "bank_account_name": "ศตายุ  อุไรโชติ",
          "bank_number": "0806657512",
          "member_credit": 0,
          "member_uuid": "152bb67d-f278-49ca-9a59-c7896196e246",
          "createdAt": "2022-10-05T10:01:27.000Z",
          "updatedAt": "2022-10-05T10:01:27.000Z"
        }
      ]
    },
    {
      "id": 54720,
      "uuid": "fd17b9ee-17a7-4395-b7bc-ed460709ca80",
      "bank": "7215b40e-4e9d-44c6-b3b7-2a503c881ac9",
      "amount": 3055,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 3055.85,
      "credit_after": 0.85,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:52:16",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598953692727057",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa1788528",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:52:17.000Z",
      "updatedAt": "2022-10-17T06:56:53.000Z",
      "member_account_banks": [
        {
          "id": 4425,
          "uuid": "7215b40e-4e9d-44c6-b3b7-2a503c881ac9",
          "bank_name": "kbnk",
          "bank_account_name": "ณัฐภาพรรณ์ โตอารีย์",
          "bank_number": "0148379173",
          "member_credit": 0,
          "member_uuid": "43bab807-5a3a-4280-8b40-fe53d40ed976",
          "createdAt": "2022-09-20T15:01:11.000Z",
          "updatedAt": "2022-09-20T15:01:11.000Z"
        }
      ]
    },
    {
      "id": 54719,
      "uuid": "188d688a-c883-4be6-8cd0-b8bee77e066f",
      "bank": "b608efdf-d489-4000-ba31-bb9ed653f41c",
      "amount": 423,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 423.6,
      "credit_after": 0.6,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:51:14",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598947427778498",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa3600716",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:51:14.000Z",
      "updatedAt": "2022-10-17T06:56:28.000Z",
      "member_account_banks": [
        {
          "id": 6718,
          "uuid": "b608efdf-d489-4000-ba31-bb9ed653f41c",
          "bank_name": "kbnk",
          "bank_account_name": "ไพโรจน์ บุตรขจร",
          "bank_number": "1023541595",
          "member_credit": 0,
          "member_uuid": "24f20e74-1306-4528-940e-59ec74d02c2e",
          "createdAt": "2022-10-16T19:14:42.000Z",
          "updatedAt": "2022-10-16T20:23:33.000Z"
        }
      ]
    },
    {
      "id": 54714,
      "uuid": "104dd47b-e1a2-43d5-af7c-b63ee21b1d8e",
      "bank": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
      "amount": 80,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 120.35,
      "credit_after": 40.35,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:46:03",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598916318666628",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa6845422",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:46:03.000Z",
      "updatedAt": "2022-10-17T06:46:37.000Z",
      "member_account_banks": [
        {
          "id": 3567,
          "uuid": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
          "bank_name": "truemoney",
          "bank_account_name": "มะคอรี ซามะลาแล",
          "bank_number": "0936845422",
          "member_credit": 0,
          "member_uuid": "47dfb5a5-482d-4772-bb4e-1a7960d52f54",
          "createdAt": "2022-08-26T19:18:02.000Z",
          "updatedAt": "2022-08-26T19:18:02.000Z"
        }
      ]
    },
    {
      "id": 54705,
      "uuid": "2a933f22-8f32-43d2-872e-8108f943a327",
      "bank": "c42cca84-aac3-4e48-a358-29ab8b09d65d",
      "amount": 200,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 242.97,
      "credit_after": 42.97,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:38:59",
      "create_by": "เกียริ",
      "annotation": "ถอนมือ",
      "ref": "PWQ166598873959064593",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa7075818",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:38:59.000Z",
      "updatedAt": "2022-10-17T06:40:04.000Z",
      "member_account_banks": [
        {
          "id": 4712,
          "uuid": "c42cca84-aac3-4e48-a358-29ab8b09d65d",
          "bank_name": "gsb",
          "bank_account_name": "ประเวช คชภักดี",
          "bank_number": "020377022601",
          "member_credit": 0,
          "member_uuid": "52c07299-ac0b-434b-a24a-aac0ac9b373b",
          "createdAt": "2022-09-23T03:52:36.000Z",
          "updatedAt": "2022-09-23T03:52:36.000Z"
        }
      ]
    },
    {
      "id": 54704,
      "uuid": "cc780851-8efb-4b59-8e5d-b3302d661511",
      "bank": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
      "amount": 52,
      "bonus_credit": null,
      "transaction_type": "2",
      "credit_before": 102.7,
      "credit_after": 50.7,
      "credit_bank_before": null,
      "credit_bank_after": null,
      "bank_time": "2022-10-17 13:35:27",
      "create_by": "เกียริ",
      "annotation": "ถอยมือ",
      "ref": "PWQ166598852731866027",
      "transaction_status": "Success",
      "auto_status": "manual",
      "transaction_slip": null,
      "username": "23maa6845422",
      "promotion_uuid": null,
      "sms_transaction_uuid": null,
      "createdAt": "2022-10-17T06:35:27.000Z",
      "updatedAt": "2022-10-17T06:36:20.000Z",
      "member_account_banks": [
        {
          "id": 3567,
          "uuid": "23f8fb5b-01b5-4948-b511-c4307bb06cc8",
          "bank_name": "truemoney",
          "bank_account_name": "มะคอรี ซามะลาแล",
          "bank_number": "0936845422",
          "member_credit": 0,
          "member_uuid": "47dfb5a5-482d-4772-bb4e-1a7960d52f54",
          "createdAt": "2022-08-26T19:18:02.000Z",
          "updatedAt": "2022-08-26T19:18:02.000Z"
        }
      ]
    }

  ]


  return (
    <Layout>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container justifyContent="start">
          {bank.map((item) =>
            <Paper
              sx={{
                backgroundImage:
                  "url(https://the1pg.com/wp-content/uploads/2022/10/BG-wallet.jpg)",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                p: 2,
                height: 150,
                width: "400px",
                mr: 2,
              }}
            >
              <Grid container>
                <Grid item xs={2} sx={{ mt: 3 }}>
                  <Box >
                    {item.bank_name === "truemoney" ? (
                      <Image src={trueL} alt="" />
                    ) : item.bank_name === "scb" ? (
                      <Image src={scbL} alt="" />
                    ) : (
                      ""
                    )}
                  </Box>
                </Grid>
                <Grid item xs={5} sx={{ ml: 2, mt: 2 }}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      mt: "5px",
                      ml: "5px",
                      color: "#EEEEEE",
                    }}
                  >
                    {item.bank_name === "truemoney"
                      ? "True Wallet"
                      : item.bank_name === "scb"
                        ? "SCB (ไทยพาณิชย์)"
                        : ""}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      mt: "5px",
                      ml: "5px",
                      color: "#EEEEEE",
                    }}
                  >
                    {item.bank_number}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      mt: "5px",
                      ml: "5px",
                      color: "#EEEEEE",
                    }}
                  >
                    {item.bank_account_name}
                  </Typography>
                  {/* <Chip
                    label={
                      item.bank_status === "1" ? "เปิดใช้งาน" : "ไม่เปิดใช้งาน"
                    }
                    size="small"
                    style={{
                      marginTop: "10px",
                      padding: 10,
                      width: 120,
                      backgroundColor:
                        item.bank_status === "1" ? "#129A50" : "#F7685B",

                      color: item.bank_status === "1" ? "#EEEEEE" : "#000000",
                    }}
                  /> */}
                </Grid>

                <Grid item xs={4}>
                  <Typography
                    sx={{
                      fontSize: "14px",
                      mt: "5px",
                      ml: "5px",
                      color: "#EEEEEE",
                    }}
                  >
                    จำนวนครั้ง
                  </Typography>
                  <Chip
                    label={Intl.NumberFormat("TH").format(parseInt(item.bank_status))}
                    size="small"
                    style={{
                      marginTop: "10px",
                      padding: 10,
                      width: 120,
                      backgroundColor: "#129A50",
                      color: "#EEEEEE",
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: "14px",
                      mt: "5px",
                      ml: "5px",
                      color: "#EEEEEE",
                    }}
                  >
                    จำนวนเงินถอน
                  </Typography>
                  <Chip
                    label={Intl.NumberFormat("TH").format(parseInt(1221100))}
                    size="small"
                    style={{
                      marginTop: "10px",
                      padding: 10,
                      width: 120,
                      backgroundColor: "#129A50",
                      color: "#EEEEEE",
                    }}
                  />
                </Grid>

              </Grid>
            </Paper>
          )}
        </Grid>
      </Paper>

      <Grid container sx={{ mt: 2 }}>
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
            <MenuItem value="Fail">ผิดพลาด</MenuItem>
            <MenuItem value="Create">รออนุมัติ</MenuItem>
            <MenuItem value="Approve">อนุมัติแล้ว</MenuItem>
            <MenuItem value="Process">กำลังทำรายการ</MenuItem>
            <MenuItem value="Success">สำเร็จ</MenuItem>
            <MenuItem value="OTP">OTP</MenuItem>
            <MenuItem value="Reject">ยกเลิก</MenuItem>
            <MenuItem value="manual">ถอนมือ</MenuItem>
          </TextField>

          <TextField
            variant="outlined"
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

          <Button
            variant="contained"
            style={{ marginRight: "8px", marginTop: 8, color: '#fff' }}
            color="primary"
            size="large"
            onClick={() => {
              getMemberList();
            }}
          >
            <Typography>ค้นหา</Typography>
          </Button>

        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container justifyContent="start">
          <MaterialTableForm data={data} columns={columns} pageSize="5" title="จัดการรายการถอน" />

        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 2 }}>
        <Grid container justifyContent="start">
          <MaterialTableForm data={data2} columns={columns2} pageSize="10" title="รายการถอนวันนี้" />

        </Grid>
      </Paper>

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
  )
}

export default withdrawpending