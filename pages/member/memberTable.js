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
   MenuItem,
   Switch
} from "@mui/material";
import Layout from '../../theme/Layout'
import MaterialTableForm from "../../components/materialTableForm"
import axios from "axios";
import hostname from "../../utils/hostname";
import LoadingModal from "../../theme/LoadingModal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import KeyIcon from "@mui/icons-material/Key";
import EditIcon from "@mui/icons-material/Edit";
import Image from "next/image";
import moment from "moment/moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Swal from "sweetalert2";
import { signOut } from "../../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../store/store";

const Alert = React.forwardRef(function Alert(props, ref) {
   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function memberTable() {
   const dispatch = useAppDispatch();
   const router = useRouter()

   const [open, setOpen] = useState(false)
   const [dataMember, setDataMember] = useState([])
   const [loading, setLoading] = useState(false)
   const [openDialogEdit, setOpenDialogEdit] = useState(false)
   const [rowData, setRowData] = useState()
   const [bonus, setBonus] = useState(true);
   const [selectedDateRange, setSelectedDateRange] = useState({
      start: moment().format("YYYY-MM-DD 00:00"),
      end: moment().format("YYYY-MM-DD 23:59"),
   });
   const [search, setSearch] = useState({
      data: "",
      type: "",
   });

   const handleChangeBonus = (event) => {
      setBonus(event.target.checked);
   };

   const handleClickSnackbar = () => {
      setOpen(true);
   };

   const handleClose = (event, reason) => {
      setOpen(false);
   };

   const handleChangeData = async (e) => {
      setRowData({ ...rowData, [e.target.name]: e.target.value });
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
            data: {
               create_at_start: selectedDateRange.start,
               create_at_end: selectedDateRange.end,
               type: search.type === "all" ? "" : search.type,
               data_search: search.data
            }
         });

         let resData = res.data;
         let no = 1;
         resData.map((item) => {
            item.no = no++;
            item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
         });

         setDataMember(resData);
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

   const editUser = async (type, start, end) => {
      setLoading(false);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/member/update_member`,
            data: {
               uuid: rowData.uuid,
               fname: rowData.fname,
               lname: rowData.lname,
               // name: `${rowData.fname} ${rowData.lname}`,
               tel: rowData.tel,
               // bonus: bonus,
               line_id: rowData.line_id,
               platform: rowData.platform,
               affiliate_by: rowData.platform === "friend" ? rowData.affiliate_by : '-',
               bank_number: rowData.bank_number,
               bank_name: rowData.bank_name,
            },
         });

         if (res.data.message === "แก้ไขสมาชิกสำเร็จ") {
            Swal.fire({
               position: "center",
               icon: "success",
               title: "แก้ไขข้อมูลเรียบร้อย",
               showConfirmButton: false,
               timer: 2000,
            });
            setOpenDialogEdit(false);
            getMemberList()
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
         field: "username",
         title: "Username",
         align: "center",
         render: (item) => (
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
                  backgroundColor: "#fff",
                  border: item.bonus === 1 ? "2px solid #129A50" : "2px solid #FFB946",
                  color: item.bonus === 1 ? "#129A50" : "#FFB946",
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
         field: "create_at",
         title: "วันที่สมัคร",
         align: "center",
      },

      {
         field: "points",
         title: "Point",
         align: "center",
      },
      {
         field: "rank",
         title: "Rank",
         align: "center",
      },
      {
         title: "แก้ไข",
         align: "center",
         render: (item) => {
            return (
               <>
                  <IconButton
                     onClick={async () => {
                        console.log('item', item)
                        setRowData(item)

                        setOpenDialogEdit({
                           open: true,
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
                  <MenuItem value="all">ทั้งหมด</MenuItem>
                  <MenuItem value="username">Username</MenuItem>
                  <MenuItem value="tel">หมายเลขโทรศัพท์</MenuItem>
                  <MenuItem value="bank_number">เลขบัญชีธนาคาร</MenuItem>
                  <MenuItem value="fname">ชื่อจริง</MenuItem>
                  <MenuItem value="sname">นามสุกล</MenuItem>
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
         <MaterialTableForm data={dataMember} columns={columns} pageSize="10" title="รายชื่อลูกค้า" />

         <Dialog
            open={openDialogEdit.open}
            onClose={() => setOpenDialogEdit(false)}
            fullWidth
            maxWidth="md"
         >
            <DialogTitle sx={{ mt: 2 }} > <EditIcon color="primary" /> แก้ไขข้อมูล : {rowData?.username}</DialogTitle>

            <DialogContent>
               <Grid container justifyContent="center">
                  <Grid container spacing={2} >
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

                     <Grid container item xs={6}>
                        <Typography sx={{ mt: 1 }}>
                           รับโบนัสจากการเติมเงินหรือไม่?
                        </Typography>
                        <Switch
                           checked={bonus}
                           onChange={handleChangeBonus}
                           color="primary"
                           inputProps={{ "aria-label": "controlled" }}
                        />
                     </Grid>


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
                              setOpenDialogEdit(false)
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

export default memberTable