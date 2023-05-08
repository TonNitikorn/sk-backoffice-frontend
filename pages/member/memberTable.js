import React, { useState, useEffect, useRef } from "react";
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
   // Table,
   TableContainer,
   TableRow,
   TableCell,
   DialogContent,
   CssBaseline,
   MenuItem,
   Switch,
   FormControl,
   RadioGroup,
   FormControlLabel,
   Radio,
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CloseIcon from '@mui/icons-material/Close';
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';

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
   const [openDialogManual, setOpenDialogManual] = useState(false)
   const [openDialogTrans, setOpenDialogTrans] = useState(false)
   const [userData, setUserData] = useState({})
   const [transaction, setTransaction] = useState([])
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(10)
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

   const getMemberAll = async (type, start, end) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/member/member_list`,
            data: {
               // create_at_start: selectedDateRange.start,
               // create_at_end: selectedDateRange.end,
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

   const submitFormCredit = async (type) => {
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/transaction/create_manual`,
            data: {
               "member_username": userData.username,
               "amount": rowData.amount,
               "transfer_type": type,
               "content": rowData.annotationWithdraw === "อื่นๆ" ? rowData.annotation : rowData.annotationWithdraw
            },
         });

         setLoading(false);
         if (res.data.message === "สร้างรายการสำเร็จ") {
            setRowData({})
            Swal.fire({
               position: "center",
               icon: "success",
               title: "ทำรายการเรียบร้อย",
               showConfirmButton: false,
               timer: 2000,
            });
            setOpenDialogManual(false);
            getMemberList()
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

   const getTransaction = async (user) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/member/member_transaction`,
            data: {
               username: user
            }
         });

         let resData = res.data;
         let no = 1;
         resData.transaction.map((item) => {
            item.no = no++;
            item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
         });

         setTransaction(resData.transaction);
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


   useEffect(() => {
      getMemberAll()
   }, [])

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

   ////////////////////// search table /////////////////////

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
         ...getColumnSearchProps('tel'),

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
         title: "เติม/ถอน",
         align: "center",
         width: '120px',
         render: (item, data) => (
            <>
               <Grid container justifyContent="space-around">
                  <IconButton onClick={() => {
                     setUserData(data)
                     setOpenDialogManual({ open: true, type: 'deposit' })
                  }}>
                     <AddCircleOutlineIcon color="success" />
                  </IconButton>
                  <IconButton onClick={() => {
                     setUserData(data)
                     setOpenDialogManual({ open: true, type: 'withdraw' })

                  }}>
                     <RemoveCircleOutlineIcon color="error" />
                  </IconButton>

               </Grid>
            </>
         )
      },

      {
         dataIndex: "platform",
         title: "Platform",
         align: "center",
         render: (item) => (
            <Typography
               style={{
                  fontSize: '14px'
               }}
            >{item}</Typography>
         ),
         // filters: [
         //    { text: 'postman', value: 'postman' },
         //    { text: 'google', value: 'google' },

         // ],
         // onFilter: (value, record) => record.platform.indexOf(value) === 0,
         // filterSearch: true,
         ...getColumnSearchProps('platform'),

      },
      {
         dataIndex: "affiliate_by",
         title: "ผู้แนะนำ",
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
         dataIndex: "create_at",
         title: "วันที่สมัคร",
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
         title: "แก้ไข",
         align: "center",
         maxWidth: '60px',
         render: (item, data) => {
            return (
               <>
                  <IconButton
                     onClick={async () => {
                        setRowData(data)

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
      {
         title: "20 รายการล่าสุด",
         align: "center",
         render: (item, data) => {
            return (
               <>
                  <IconButton
                     onClick={async () => {
                        getTransaction(data.username)
                        setOpenDialogTrans({
                           open: true,
                        });

                     }}
                  >
                     <ManageSearchIcon color="primary" />
                  </IconButton>
               </>
            );
         },
      },
   ];

   const onChange = (pagination, filters, sorter, extra) => {
      console.log('params', pagination, filters, sorter, extra);
   };


   return (
      <Layout>
         <CssBaseline />
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

               <Button
                  variant="contained"
                  style={{ marginRight: "8px", }}
                  color="primary"
                  size="large"
                  onClick={() => {
                     getMemberList();
                  }}
               >
                  <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
               </Button>
               <Button
                  variant="contained"
                  size="large"
                  style={{
                     marginRight: "8px",
                     backgroundColor: "#129A50",
                  }}
                  onClick={async () => {
                     getMemberAll();
                  }}
               >
                  <Typography sx={{ color: '#ffff' }}>ค้นหาทั้งหมด</Typography>
               </Button>
            </Grid>
         </Grid>


         <Table columns={columns} dataSource={dataMember} onChange={onChange}
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
               let totalBorrow = 0;
               let totalRepayment = 0;
               pageData.forEach(({ borrow, repayment }) => {
                  totalBorrow += borrow;
                  totalRepayment += repayment;
               });
               return (
                  <>
                     <Table.Summary.Row>
                        <Table.Summary.Cell> <Typography >Total</Typography></Table.Summary.Cell>
                        <Table.Summary.Cell />
                        <Table.Summary.Cell />
                        <Table.Summary.Cell />
                        <Table.Summary.Cell >
                           <Typography align="center">{totalBorrow}</Typography>
                        </Table.Summary.Cell>

                     </Table.Summary.Row>
                  </>
               );
            }}
         />

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
                        {/* <Typography>Line ID*</Typography>
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
                    /> */}
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

         <Dialog
            open={openDialogManual.open}
            onClose={() => setOpenDialogManual(false)}
            fullWidth
            maxWidth="md"
         >
            <DialogTitle>
               <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                  <Grid>
                     <Typography sx={{ fontSize: '24px' }}>
                        {openDialogManual.type === "deposit" ? "เติมเครดิต" : 'ตัดเครดิต'}
                     </Typography>
                  </Grid>
                  <Grid>
                     <IconButton onClick={() => {
                        setOpenDialogManual(false)
                     }} >
                        <CloseIcon />
                     </IconButton>
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
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{userData.username}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ธนาคาร
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>
                              <Typography sx={{ fontSize: '14px' }} >
                                 {userData.bank_name === "kbnk"
                                    ? "กสิกรไทย"
                                    : userData.bank_name === "truemoney"
                                       ? "TrueMoney"
                                       : userData.bank_name === "ktba"
                                          ? "กรุงไทย"
                                          : userData.bank_name === "scb"
                                             ? "ไทยพาณิชย์"
                                             : userData.bank_name === "bay"
                                                ? "กรุงศรีอยุธยา"
                                                : userData.bank_name === "bbla"
                                                   ? "กรุงเทพ"
                                                   : userData.bank_name === "gsb"
                                                      ? "ออมสิน"
                                                      : userData.bank_name === "ttb"
                                                         ? "ทหารไทยธนชาต (TTB)"
                                                         : userData.bank_name === "BAAC"
                                                            ? "เพื่อการเกษตรและสหกรณ์การเกษตร"
                                                            : userData.bank_name === "ICBC"
                                                               ? "ไอซีบีซี (ไทย)"
                                                               : userData.bank_name === "TCD"
                                                                  ? "ไทยเครดิตเพื่อรายย่อย"
                                                                  : userData.bank_name === "CITI"
                                                                     ? "ซิตี้แบงก์"
                                                                     : userData.bank_name === "SCBT"
                                                                        ? "สแตนดาร์ดชาร์เตอร์ด (ไทย)"
                                                                        : userData.bank_name === "CIMB"
                                                                           ? "ซีไอเอ็มบีไทย"
                                                                           : userData.bank_name === "UOB"
                                                                              ? "ยูโอบี"
                                                                              : userData.bank_name === "HSBC"
                                                                                 ? "เอชเอสบีซี ประเทศไทย"
                                                                                 : userData.bank_name === "MIZUHO"
                                                                                    ? "มิซูโฮ คอร์ปอเรต"
                                                                                    : userData.bank_name === "GHB"
                                                                                       ? "อาคารสงเคราะห์"
                                                                                       : userData.bank_name === "LHBANK"
                                                                                          ? "แลนด์ แอนด์ เฮ้าส์"
                                                                                          : userData.bank_name === "TISCO"
                                                                                             ? "ทิสโก้"
                                                                                             : userData.bank_name === "kkba"
                                                                                                ? "เกียรตินาคิน"
                                                                                                : userData.bank_name === "IBANK"
                                                                                                   ? "อิสลามแห่งประเทศไทย"
                                                                                                   : ""
                                 }
                              </Typography></TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              เครดิต
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{userData.credit}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              เลขบัญชี
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{userData.bank_number}</TableCell>
                        </TableRow>
                        <TableRow>
                           <TableCell
                              sx={{ fontWeight: "bold", width: "150px", border: '1px solid #eee' }}
                              variant="head"
                           >
                              ชื่อ นามสกุล
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold", width: "200px", border: '1px solid #eee' }}>{userData.name}</TableCell>
                        </TableRow>
                     </TableContainer >
                  </Grid>

                  <Grid item xs={6}>
                     รายการ :
                     <Chip
                        label={openDialogManual.type === "deposit" ? "เติมเครดิต" : 'ตัดเครดิต'}
                        sx={{
                           p: 2,
                           ml: 1,
                           mb: 1,
                           fontSize: '14px',
                           backgroundColor: openDialogManual.type === "deposit" ? "#16539B" : "#af2f2f",
                           color: "#ffffff"
                        }}
                     />
                     <Grid container item xs={12}>
                        <Typography sx={{ fontSize: '14px', mb: 1 }}>จำนวนเครดิต *</Typography>
                        <TextField
                           name="amount"
                           type="number"
                           value={rowData?.amount || ""}
                           placeholder="จำนวนเครดิต"
                           fullWidth
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           sx={{ bgcolor: "white" }}
                           inputProps={{
                              min: 0
                           }}
                        />
                     </Grid>
                     <Grid container item xs={12}>
                        <Typography sx={{ fontSize: '14px', my: 1, mt: 2 }}>หมายเหตุ *</Typography>
                        <TextField
                           name="annotationWithdraw"
                           type="text"
                           fullWidth
                           placeholder="หมายเหตุ"
                           value={rowData?.annotationWithdraw || ""}
                           size="small"
                           onChange={(e) => handleChangeData(e)}
                           variant="outlined"
                           select
                           label="หมายเหตุ"
                        >
                           <MenuItem selected disabled value>
                              เลือกรายการ
                           </MenuItem>
                           <MenuItem value="รายการไม่เข้าธนาคาร" onChange={() => setComment(0)}>รายการไม่เข้าธนาคาร</MenuItem>
                           <MenuItem value="เครดิตเข้าธนาคารไม่เข้าผู้ใช้" onChange={() => setComment(0)}>เครดิตเข้าธนาคาร ไม่เข้าผู้ใช้</MenuItem>
                           <MenuItem value="อื่นๆ" onChange={() => setComment(1)}>อื่นๆ</MenuItem>
                        </TextField>

                     </Grid>
                     <Grid container item xs={12} sx={{ mt: 2 }}>
                        {rowData?.annotationWithdraw === "อื่นๆ" ?
                           <TextField
                              name="annotation"
                              type="text"
                              fullWidth
                              value={rowData?.annotation || ""}
                              size="small"
                              placeholder="หมายเหตุอื่นๆ"
                              onChange={(e) => handleChangeData(e)}
                              variant="outlined"
                           />
                           : ''}
                     </Grid>

                  </Grid>

                  <Grid container justifyContent='flex-end' spacing={1}>
                     <Grid container item xs={4}>
                        <Button
                           variant="contained"
                           // size="large"
                           fullWidth
                           onClick={() => {
                              console.log('first', openDialogManual.type)
                              if (!rowData?.annotationWithdraw || !rowData?.amount) {
                                 setOpenDialogManual(false)
                                 Swal.fire({
                                    position: "center",
                                    icon: "warning",
                                    title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                                    showConfirmButton: false,
                                    timer: 2000,
                                 });
                              } else if (openDialogManual.type === "withdraw") {
                                 let totalCredit = parseInt(userData.credit) - parseInt(rowData.amount)
                                 if (totalCredit <= 0) {
                                    setOpenDialogManual(false)
                                    setRowData({})
                                    Swal.fire({
                                       position: "center",
                                       icon: "error",
                                       title: "จำนวนเคตรดิตไม่เพียงพอ",
                                       showConfirmButton: false,
                                       timer: 2000,
                                    });
                                 } else {
                                    submitFormCredit("WITHDRAW")
                                 }
                              } else if (openDialogManual.type === "deposit") {
                                 submitFormCredit("DEPOSIT")
                              }
                           }
                           }
                           sx={{
                              mt: 3,
                              color: '#fff',
                           }}
                        >
                           ยืนยัน
                        </Button>
                     </Grid>
                  </Grid>
               </Grid>
            </DialogContent>
         </Dialog>

         <Dialog
            open={openDialogTrans.open}
            onClose={() => setOpenDialogTrans(false)}
            fullWidth
            maxWidth="lg"
         >
            <DialogTitle sx={{ mt: 1 }} > <ManageSearchIcon color="primary" fontSize="large" /> ประวัติการทำรายการของ : {rowData?.username}</DialogTitle>

            <DialogContent>
               <Grid>
                  <MaterialTableForm data={transaction} columns={[
                     {
                        field: "no",
                        title: "ลำดับ",
                        maxWidth: 80,
                        align: "center",
                     },
                     {
                        field: "credit",
                        title: "ยอดเงิน",
                        align: "center",
                        render: (item) => (
                           <Typography
                              style={{
                                 fontSize: '14px'
                              }}
                           >{Intl.NumberFormat("TH").format(parseInt(item.credit))}</Typography>
                        ),
                     },
                     {
                        title: "ประเภท",
                        search: true,
                        // width: "10%",
                        align: "center",
                        render: (item) => (
                           <Chip
                              label={item.transfer_type === "DEPOSIT" ? "ฝากเงิน" : "ถอนเงิน"}
                              size="small"
                              style={{
                                 background: item.transfer_type === "DEPOSIT" ? "#3d813d" : "#db9d40",
                                 color: "#ffff",
                                 width: 100
                              }}
                           />
                        ),

                     },
                     {
                        title: "เครดิตก่อนทำรายการ",
                        align: "center",
                        render: (item) => (
                           <Typography
                              style={{
                                 fontSize: '14px'
                              }}
                           >{Intl.NumberFormat("TH").format(parseInt(item.credit_before))}</Typography>
                        ),
                     },
                     {
                        title: "เครดิตหลังทำรายการ",
                        align: "center",
                        render: (item) => (
                           <Typography
                              style={{
                                 fontSize: '14px'
                              }}
                           >{Intl.NumberFormat("TH").format(parseInt(item.credit_after))}</Typography>
                        ),
                     },
                     {
                        field: "create_at",
                        title: "เวลา",
                        align: "center",
                     },
                     {
                        field: "no",
                        title: "หมายเหตุ",
                        align: "center",
                     },

                  ]} pageSize="10" title="20 รายการล่าสุด" />

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