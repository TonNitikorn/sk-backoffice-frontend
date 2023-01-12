import React, { useState, useEffect } from "react";
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
   Table,
   TableRow,
   TableCell,
   DialogContent,
   CssBaseline,
} from "@mui/material";
import Layout from '../../theme/Layout'
import TablePagination from "@mui/material/TablePagination";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TableForm from "../../components/tableForm";
import MaterialTableForm from "../../components/materialTableForm"
import axios from "axios";
import hostname from "../../utils/hostname";
import LoadingModal from "../../theme/LoadingModal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import KeyIcon from "@mui/icons-material/Key";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";

function memberTable() {
   //   const classes = useStyles();

   const [dataMember, setDataMember] = useState([])
   const [loading, setLoading] = useState(false)

   const handleClickSnackbar = () => {
      setOpen(true);
   };

   const getMemberList = async (type, start, end) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/member/member_list`,
         });

         let resData = res.data;
         let no = 1;
         console.log('resData', resData)
         resData.map((item) => {
            item.no = no++;
            //  item.bank_name = item.member_account_banks[0].bank_name
            //  item.bank_number = item.member_account_banks[0].bank_number
            //  item.bank_account_name = item.member_account_banks[0].bank_account_name

         });

         setDataMember(resData);
         setLoading(false);
      } catch (error) {
         console.log(error);
         //   if (
         //     error.response.data.error.status_code === 401 &&
         //     error.response.data.error.message === "Unauthorized"
         //   ) {
         //     dispatch(signOut());
         //     localStorage.clear();
         //     router.push("/auth/login");
         //   }
      }
   };

   useEffect(() => {
      getMemberList()
   }, [])

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
               </Grid>
            </Grid >
         ),
      },
      {
         field: "sb_username",
         title: "Username",
         align: "center",
         render: (item) => (
            <CopyToClipboard text={item.sb_username}>
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
                     {item.sb_username}
                  </Button>
               </div>
            </CopyToClipboard>
         ),
      },
      {
         field: "tel",
         title: "หมายเลขโทรศัพท์",
         align: "center",
      },

      {
         title: "Bonus",
         align: "center",
         render: (item) => (
            <Chip
               label={item.bonus === 1 ? "รับโบนัส" : "ไม่รับโบนัส"}
               size="small"
               style={{
                  padding: 10,
                  backgroundColor: item.bonus === 1 ? "#129A50" : "#FFB946",
                  color: "#eee",
               }}
            />
         ),
      },
      {
         field: "platform",
         title: "Platform",
         align: "center",
      },
      {
         field: "affiliate_by",
         title: "ผู้แนะนำ",
         align: "center",
      },
      {
         field: "createdAt",
         title: "วันที่สมัคร",
         align: "center",
      },

      {
         field: "role",
         title: "Point",
         align: "center",
      },
      {
         field: "role",
         title: "Rank",
         align: "center",
      },

      {
         title: "ฝาก/ถอน",
         align: "center",
         render: (rowData) => {
            return (
               <Grid sx={{ textAlign: "center" }}>
                  <IconButton
                     onClick={() => {
                        getDepositWithdraw(rowData.sb_username);
                     }}
                  >
                     <ZoomInIcon sx={{ color: "green" }} />
                  </IconButton>
               </Grid>
            );
         },
      },
      {
         title: "รีเซ็ตรหัส",
         align: "center",
         render: (rowData) => {
            return (
               <Grid sx={{ textAlign: "center" }}>
                  <IconButton
                     onClick={() => {
                        Swal.fire({
                           title: "ยืนยันการเปลี่ยนรหัส",
                           text: `ท่านการรีเซ็ตรหัสของ : ${rowData.sb_username} ?`,
                           icon: "info",
                           showCancelButton: true,
                           cancelButtonColor: "#EB001B",
                           confirmButtonColor: "#129A50",
                           cancelButtonText: "ยกเลิก",
                           confirmButtonText: "ยืนยัน",
                        }).then(async (result) => {
                           if (result.isConfirmed) {
                              setLoading(true);
                              try {
                                 let res = await axios({
                                    headers: {
                                       Authorization:
                                          "Bearer " +
                                          localStorage.getItem("access_token"),
                                    },
                                    method: "get",
                                    url: `${hostname}/api/member/change-password/${rowData.uuid}`,
                                 });
                                 console.log("res.data.data", res.data.data);
                                 let resData = res.data.data;
                                 setLoading(false);
                                 setOpenDialogPassword({
                                    open: true,
                                    name: rowData.sb_username,
                                    pass: resData.new_password,
                                 });
                              } catch (error) {
                                 console.log(error);
                              }
                           }
                        });
                     }}
                  >
                     <KeyIcon sx={{ color: "green" }} />
                  </IconButton>
               </Grid>
            );
         },
      },
      {
         title: "แก้ไข",
         align: "center",
         render: (item) => {
            return (
               <>
                  <IconButton
                     onClick={async () => {
                        setLoading(true);
                        try {
                           let res = await axios({
                              headers: {
                                 Authorization:
                                    "Bearer " +
                                    localStorage.getItem("access_token"),
                              },
                              method: "get",
                              url: `${hostname}/api/member/edit/${item.uuid}`,
                           });
                           let data = res.data.data;
                           let bank = res.data.bank;

                           let resData = {
                              bank_name: bank.bank_name,
                              bank_number: bank.bank_number,
                              first_name: data.first_name,
                              last_name: data.last_name,
                              know_us: data.know_us,
                              tel: data.tel,
                              bonus: data.bonus,
                              uuid: data.uuid,
                           };

                           setRowData(resData);
                           setLoading(false);
                        } catch (error) {
                           console.log(error);
                        }

                        setOpenDialogEdit({
                           open: true,
                           name: item.sb_username,
                        });
                     }}
                  >
                     <EditIcon />
                  </IconButton>
               </>
            );
         },
      },
   ];




   return (
      <Layout>
         <CssBaseline />
         <MaterialTableForm data={dataMember} columns={columns} pageSize="10" title="รายชื่อลูกค้า" />
         <LoadingModal open={loading} />

      </Layout>
   )
}

export default memberTable