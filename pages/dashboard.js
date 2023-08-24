import React, { useState, useEffect, useRef } from "react";
import Layout from "../theme/Layout";
import {
   Grid,
   Button,
   TextField,
   Typography,
   Box,
   Card,
   CardContent,
   Paper,
   MenuItem,
   Snackbar,
   Divider,
   Alert,
   Dialog,
   DialogContent,
   DialogTitle,
   Chip,
   IconButton
} from "@mui/material";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
} from "chart.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import hostname from "../utils/hostname";
import { useRouter } from "next/router";
import withAuth from "../routes/withAuth";
import { useAppDispatch } from "../store/store";
import { signOut } from "../store/slices/userSlice";
import LoadingModal from "../theme/LoadingModal";
import moment from "moment/moment";
import { Table, Input, Space, } from 'antd';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import { useCounterStore } from "./auth/login"

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);


function dashboard() {
   const router = useRouter();
   const dispatch = useAppDispatch();

   const { profile , setProfile } = useCounterStore()
   console.log('profile', profile)

   const [selectedDateRange, setSelectedDateRange] = useState({
      start: moment().format("YYYY-MM-DD 00:00"),
      end: moment().format("YYYY-MM-DD 23:59"),
   });
   const [loading, setLoading] = useState(false);
   const [chartDeposit, setChartDeposit] = useState([])
   const [chartWithdraw, setChartWithdraw] = useState([])
   const [chartMember, setChartMember] = useState([])
   const [result, setResult] = useState({})
   const [bank, setBank] = useState([])
   const [member, setMember] = useState()
   const [platform, setPlatform] = useState([])
   const [bankTransaction, setBankTransaction] = useState([])
   const [page, setPage] = useState(1)
   const [pageSize, setPageSize] = useState(10)
   const [dataMember, setDataMember] = useState([])
   const [open, setOpen] = useState(false)
   const [boxMember, setBoxMember] = useState(0)
   const [boxBank, setBoxBank] = useState({})
   const [openDialogTrans, setOpenDialogTrans] = useState(false)
   const [bankTrans, setBankTrans] = useState()
   const [total, setTotal] = useState({})
   const [report, setReport] = useState([])
   const [username, setUsername] = useState('')

   const handleClickSnackbar = () => {
      setOpen(true);
   };

   const getChart = async () => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/dashboard/transaction/getchart`,
            data: {
               "start_date": selectedDateRange.start,
               "end_date": selectedDateRange.end
            }
         });
         let resData = res.data;
         setChartWithdraw(resData.chart_withdraw)
         setChartDeposit(resData.chart_deposit)
         setChartMember(resData.chart_members)
         setLoading(false);
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

   const getResult = async () => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/dashboard/transaction/result`,
            data: {
               "start_date": selectedDateRange.start,
               "end_date": selectedDateRange.end
            }
         });
         let resDataDeposit = res.data.DepositTransaction;
         let resDataWithdraw = res.data.WithdrawTransaction;
         let resDataMember = res.data.newMember


         let sumCreditDeposit = []
         let sumCreditWithdraw = []

         for (const item of resDataDeposit?.transactionDeposit) {
            sumCreditDeposit.push(parseInt(item.credit))
         }
         let total_credit_deposit = sumCreditDeposit.reduce((a, b) => a + b, 0)

         for (const item of resDataWithdraw?.transactionWithdraw) {
            sumCreditWithdraw.push(parseInt(item.credit))
         }
         let total_credit_withdarw = sumCreditWithdraw.reduce((a, b) => a + b, 0)


         setResult({
            sumCreditDeposit: total_credit_deposit,
            sumCreditWithdraw: total_credit_withdarw,
            lengthDeposit: resDataDeposit.Deposit_length,
            lengthWithdraw: resDataWithdraw.Withdraw_length,
            listMemberRegister: resDataMember.newMember_length,
            listMemberDeposit: resDataMember.sumDeposit
         })
         setLoading(false);
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

   const getBank = async () => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "get",
            url: `${hostname}/dashboard/transaction/getbank`,

         });
         let resData = res.data;
         setBank(resData.banks)
         setMember(resData.all_total)
         setLoading(false);
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

   const getMemberList = async () => {
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
               // type: search.type === "all" ? "" : search.type,
               // data_search: search.data
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
         setBoxMember(1)
         setBoxBank({ open: 0 })
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

   const getPlatform = async () => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/dashboard/transaction/getplatform`,

         });
         let resData = res.data;
         setPlatform(resData)
         setLoading(false);
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

   const getTransactionBank = async (uuid) => {
      setLoading(false);

      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/bank/bank_transaction_by_uuid`,
            data: {
               "bank_uuid": uuid,
               "start_date": selectedDateRange.start,
               "end_date": selectedDateRange.end
            }
         });
         let resData = res.data.transaction;
         let no = 1;
         resData.map((item) => {
            item.no = no++;
            item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
         });
         let uuidBank = res.data.bank.uuid

         setBoxMember({ open: 0 })
         setBoxBank({
            open: 1,
            uuid: uuidBank
         })
         setBankTrans(res.data.bank)
         setBankTransaction(resData)
         setLoading(false);
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
   }

   const options = {
      responsive: true,
      layout: {
         padding: 5,
      },
      plugins: {
         legend: {
            position: "top",
         },
         title: {
            display: true,
         },
      },
      scales: {
         x: {
            display: true,
            title: {
               display: true,
               text: 'ชั่วโมง',
               color: '#000',
               font: {
                  family: 'Times',
                  size: 18,
                  style: 'normal',
                  lineHeight: 1.2
               },
            }
         },
         y: {
            display: true,
            title: {
               display: true,
               text: 'เครดิต',
               color: '#000',
               font: {
                  family: 'Times',
                  size: 18,
                  style: 'normal',
                  lineHeight: 1.2
               },
            }
         }
      }
   };

   const optionsCount = {
      responsive: true,
      layout: {
         padding: 5,
      },
      plugins: {
         legend: {
            position: "top",
         },
         title: {
            display: true,
         },
      },
      scales: {
         x: {
            display: true,
            title: {
               display: true,
               text: 'ชั่วโมง',
               color: '#000',
               font: {
                  family: 'Times',
                  size: 18,
                  style: 'normal',
                  lineHeight: 1.2
               },
            }
         },
         y: {
            display: true,
            title: {
               display: true,
               text: 'จำนวนครั้ง',
               color: '#000',
               font: {
                  family: 'Times',
                  size: 18,
                  style: 'normal',
                  lineHeight: 1.2
               },
            }
         }
      }
   };

   const labels = [...chartDeposit.map((item) => item.hour)]

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

   const columnsMember = [
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
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509600962-kbnk.png"
                     }
                     alt="kbnk"
                     width={50}
                     height={50}
                  />
               ) : item === "truemoney" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509654967-truemoney.png"
                     }
                     alt="truemoney"
                     width={50}
                     height={50}
                  />
               ) : item === "ktb" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509722840-ktb.png"
                     }
                     alt="ktb"
                     width={50}
                     height={50}
                  />
               ) : item === "scb" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509747475-scb.png"
                     }
                     alt="scb"
                     width={50}
                     height={50}
                  />
               ) : item === "bay" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509778211-bay.png"
                     }
                     alt="bay"
                     width={50}
                     height={50}
                  />
               ) : item === "bbl" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509796809-bbl.png"
                     }
                     alt="bbl"
                     width={50}
                     height={50}
                  />
               ) : item === "gsb" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509823709-gsb.png"
                     }
                     alt="gsb"
                     width={50}
                     height={50}
                  />
               ) : item === "ttb" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509868094-ttb.png"
                     }
                     alt="ttb"
                     width={50}
                     height={50}
                  />
               ) : item === "bbac" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509885549-baac.png"
                     }
                     alt="bbac"
                     width={50}
                     height={50}
                  />
               ) : item === "icbc" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509907708-icbt.png"
                     }
                     alt="icbc"
                     width={50}
                     height={50}
                  />
               ) : item === "tcd" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509929380-tcd.png"
                     }
                     alt="tcd"
                     width={50}
                     height={50}
                  />
               ) : item === "citi" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509949540-citi.png"
                     }
                     alt="citi"
                     width={50}
                     height={50}
                  />
               ) : item === "scbt" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509967883-scbt.png"
                     }
                     alt="scbt"
                     width={50}
                     height={50}
                  />
               ) : item === "cimb" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687509984083-cimb.png"
                     }
                     alt="cimb"
                     width={50}
                     height={50}
                  />
               ) : item === "uob" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510000397-uob.png"
                     }
                     alt="uob"
                     width={50}
                     height={50}
                  />
               ) : item === "hsbc" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510018318-hsbc.png"
                     }
                     alt="hsbc"
                     width={50}
                     height={50}
                  />
               ) : item === "mizuho" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510037176-mizuho.png"
                     }
                     alt="mizuho"
                     width={50}
                     height={50}
                  />
               ) : item === "ghb" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510067372-ghb.png"
                     }
                     alt="ghb"
                     width={50}
                     height={50}
                  />
               ) : item === "lhbank" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510092134-lhbank.png"
                     }
                     alt="lhbank"
                     width={50}
                     height={50}
                  />
               ) : item === "tisco" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510111592-tisco.png"
                     }
                     alt="tisco"
                     width={50}
                     height={50}
                  />
               ) : item === "kkba" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510132080-kkba.png"
                     }
                     alt="kkba"
                     width={50}
                     height={50}
                  />
               ) : item === "ibank" ? (
                  <Image
                     src={
                        "https://public-cdn-softkingdom.sgp1.digitaloceanspaces.com/1687510150924-ibank.png"
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
               <Grid sx={{ ml: 2, mt: 1 }}>
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
               <Grid>
                  <Typography sx={{ fontSize: "14px", ml: 2 }}>
                     {data.name}
                  </Typography>
               </Grid>
            </Grid>
         </Grid >,
      },
      {
         title: 'Username',
         dataIndex: 'username',
         ...getColumnSearchProps('username'),
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
         filters: [
            { text: 'postman', value: 'postman' },
            { text: 'google', value: 'google' },

         ],
         onFilter: (value, record) => record.platform.indexOf(value) === 0,
         filterSearch: true,
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


   ];

   const columnsBank = [
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
         title: 'Username',
         dataIndex: 'username',
         ...getColumnSearchProps('username'),
         render: (item, data) => (
            <CopyToClipboard text={data.members?.username}>
               <div style={{
                  "& .MuiButton-text": {
                     "&:hover": {
                        textDecoration: "underline blue 1px",
                     }
                  }
               }} >
                  <Button
                     sx={{ fontSize: "14px", p: 0, color: "blue", }}
                     onClick={handleClickSnackbar}
                  >
                     {data.members?.username}
                  </Button>
               </div>
            </CopyToClipboard>
         ),
      },
      {
         title: 'ประเภทการทำรายการ',
         dataIndex: 'transfer_type',
         align: "center",
         ...getColumnSearchProps('transfer_type'),
         render: (item) => (
            <Typography style={{ fontSize: '14px' }}>{item === "WITHDRAW" ? 'รายการถอน' : 'รายการฝาก'}</Typography>
         ),
      },

      {
         dataIndex: "credit",
         title: "เครดิต",
         align: "center",
         sorter: (record1, record2) => record1.credit - record2.credit,
         render: (item) => (
            <Typography style={{ fontSize: '14px' }} >{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
         ),
      },

      {
         dataIndex: "credit_before",
         title: "เครดิตก่อน",
         align: "center",
         sorter: (record1, record2) => record1.credit_before - record2.credit_before,
         render: (item) => (
            <Typography style={{ fontSize: '14px' }}>{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
         ),
      },
      {
         dataIndex: "credit_after",
         title: "เครดิตหลัง",
         align: "center",
         sorter: (record1, record2) => record1.credit_after - record2.credit_after,
         render: (item) => (
            <Typography style={{ fontSize: '14px' }}>{Intl.NumberFormat("TH").format(parseInt(item))}</Typography>
         ),

      },
      {
         dataIndex: "status_transction",
         title: "สถานะ",
         align: "center",
         filters: [
            {
               text: 'สำเร็จ',
               value: 'SUCCESS',
            },
            {
               text: 'ไม่สำเร็จ',
               value: 'UNSUCCESS',
            },

         ],
         render: (item) => (
            <Chip
               label={item === 'SUCCESS' ? "สำเร็จ" : 'ไม่สำเร็จ'}
               size="small"
               style={{ padding: 10, backgroundColor: item === 'SUCCESS' ? "#129A50" : "#BB2828", color: "#eee", }}
            />
         ),
      },
      {
         dataIndex: "transfer_by",
         title: "ทำรายการโดย",
         align: "center",
         ...getColumnSearchProps('transfer_by'),
         render: (item) => (
            <Typography style={{ fontSize: '14px' }}>{item}</Typography>
         ),
      },
      {
         dataIndex: "create_at",
         title: "วันที่ทำรายการ",
         align: "center",
         render: (item) => (
            <Typography style={{ fontSize: '14px' }}>{item}</Typography>
         ),
      },


   ];


   const onChange = (pagination, filters, sorter, extra) => {
      console.log('params', pagination, filters, sorter, extra);
   };
   const handleOpenDetail = (type) => {
      setOpenDialogTrans(true)
      getReport(type)
   }

   const getReport = async (type) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "post",
            url: `${hostname}/report/get_transaction`,

            data: {
               "create_at_start": selectedDateRange.start,
               "create_at_end": selectedDateRange.end,
               "transfer_type": type,
               "username": username
            }
         });

         let transaction = res.data.transaction
         let no = 1;
         transaction.map((item) => {
            item.no = no++;
            item.create_at = moment(item.create_at).format('DD/MM/YYYY HH:mm')
            item.bank_name = item.members?.bank_name
            item.bank_number = item.members?.bank_number
            item.username = item.members?.username
         });

         sumData(transaction, res.data.sumCredit)
         setReport(transaction);
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

   const sumData = (transaction, sumCredit) => {
      let dataTypeManual = transaction.filter((item) => item.status_transction === "MANUAL")
      let dataTypeAuto = transaction.filter((item) => item.status_transction === "AUTO")
      let sumManual = []
      let sumAuto = []
      let sumPrice = 0
      let price = []
      for (const item of dataTypeManual) {
         sumManual.push(parseInt(item.credit))
      }
      let manual = sumManual.reduce((a, b) => a + b, 0)
      for (const item of dataTypeAuto) {
         sumAuto.push(parseInt(item.credit))
      }
      let auto = sumAuto.reduce((a, b) => a + b, 0)
      for (const item of transaction) {
         price.push(item.amount)
      }
      sumPrice = price.reduce((a, b) => a + b, 0)
      setTotal({
         totalList: transaction.length,
         sumPrice: parseInt(Intl.NumberFormat("TH").format(parseInt(sumPrice))),
         sumCredit: parseInt(Intl.NumberFormat("TH").format(parseInt(sumCredit))),
         typeManual: dataTypeManual.length,
         typeAuto: dataTypeAuto.length,
         sumManual: Intl.NumberFormat("TH").format(parseInt(manual)),
         sumAuto: Intl.NumberFormat("TH").format(parseInt(auto)),
         sumTotal: Intl.NumberFormat("TH").format(parseInt(manual, auto))
      })
   }

   useEffect(() => {
      getChart();
      getResult()
      getBank()
      getPlatform()
   }, []);
   return (
      <Layout>
         <Paper sx={{ p: 3, textAlign: 'start', mb: 2 }}>
            <Typography sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}> Dashboard สรุปภาพรวม</Typography>
         </Paper>

         <Paper sx={{ p: 3, mt: 2 }}>
            <Grid
               container
               direction="row"
               justifyContent="space-between"
               alignItems="center"
            >
               {/* <Typography variant="h5">สมาชิก & บัญชีธนาคาร</Typography> */}
               <Typography variant="h5">สมาชิก</Typography>


            </Grid>

            <Divider sx={{ bgcolor: '#C3C3C3', my: 2 }} />
            <Grid container
               direction="row"
               justifyContent="flex-start"
               alignItems="center">
               <Card sx={{ minWidth: 235, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#0072B1, #41A3E3)" }}>
                  <CardContent>
                     <Typography sx={{ color: "#eee" }}>ลูกค้าทั้งหมด</Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                           <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                              {member?.total_member}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee", mb: 1 }}> ยูสเซอร์ </Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#eee', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1, color: "#eee" }} onClick={() => getMemberList()}>
                           ดูเพิ่มเติม...
                        </Button>
                     </Box>
                  </CardContent>
               </Card>
               {/* {bank.map((item) =>
                  <Card sx={{ minWidth: 242, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#09893f, #41db82)" }}>
                     <CardContent>
                        <Grid >
                           <Typography sx={{ color: "#eee", }}> ธนาคาร {item.bank_name} บัญชี {item.bank_number} </Typography>
                        </Grid>
                        <Grid container justifyContent="center">
                           <Grid item xs={4}>
                           </Grid>
                           <Grid item xs={4}>
                              <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                 {Intl.NumberFormat("THB").format(item.bank_total)}
                              </Typography>
                           </Grid>
                           <Grid item xs={4}>
                              <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท </Typography>
                           </Grid>
                        </Grid>
                        <Divider sx={{ bgcolor: '#eee', mt: 1 }} />
                        <Box sx={{ textAlign: 'right' }}>
                           <Button variant="text" sx={{ color: '#eee' }} onClick={() => getTransactionBank(item.uuid)}>
                              ดูเพิ่มเติม...
                           </Button>
                        </Box>

                     </CardContent>
                  </Card>
               )} */}
            </Grid>

            {boxMember === 1 ?
               <>
                  <Grid
                     container
                     direction="row"
                     justifyContent="space-between"
                     alignItems="center" sx={{ mt: 3 }}>
                     <Typography sx={{ fontSize: '22px', textDecoration: "underline #41A3E3 3px", mb: 2 }}>รายชื่อลูกค้าทั้งหมด</Typography>
                     <Grid item>
                        <Button variant="text" onClick={() => setBoxMember(0)}><CloseIcon /></Button>
                     </Grid>
                  </Grid>
                  <Table
                     columns={columnsMember}
                     dataSource={dataMember}
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
               </>
               : ''
            }

            {boxBank.open === 1 ?
               <Paper sx={{ p: 3, mt: 2 }}>
                  <Typography sx={{ fontSize: '22px', textDecoration: "underline #41A3E3 3px", mb: 2 }}>บัญชีธนาคาร : {bankTrans.bank_name} {bankTrans.bank_number}</Typography>
                  <Grid
                     container
                     direction="row"
                     justifyContent="space-between"
                     alignItems="center" sx={{ mt: 3 }}>
                     <Grid item sx={{ mb: 3 }}>
                        <TextField
                           label="เริ่ม"
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
                           style={{ marginRight: "8px", marginTop: 8, color: '#fff' }}
                           color="primary"
                           onClick={() => {
                              getTransactionBank(boxBank.uuid);
                           }}
                        >
                           <Typography>ค้นหา</Typography>
                        </Button>
                     </Grid>
                     <Grid item>
                        <Button variant="text" onClick={() => setBoxBank({ open: 0 })}><CloseIcon /></Button>
                     </Grid>
                  </Grid>
                  <Table
                     columns={columnsBank}
                     dataSource={bankTransaction}
                     onChange={onChange}
                     pagination={{
                        current: page,
                        pageSize: pageSize,
                        onChange: (page, pageSize) => {
                           setPage(page)
                           setPageSize(pageSize)
                        }
                     }} />
               </Paper>
               : ''}

         </Paper>

         <Paper sx={{ p: 3, mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="h5">สรุปภาพรวมตามช่วงเวลา</Typography>
            </Box>
            <Grid container sx={{ mt: 3 }}>
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
                     InputLabelProps={{
                        shrink: true,
                     }}
                     required
                  />

                  <Button
                     variant="contained"
                     style={{ marginRight: "8px", marginTop: 9, color: '#fff', width: 150, background: "linear-gradient(#0072B1, #41A3E3)" }}
                     size="small"
                     onClick={() => {
                        getChart()
                        getResult()
                     }}
                  >
                     <Typography>ค้นหา</Typography>
                  </Button>
               </Grid>
            </Grid>
         </Paper>
         <Paper sx={{ p: 3, mt: 3 }}>


            {/* ================ card =============== */}
            <Box sx={{ textAlign: 'start' }}>
               <Typography> ข้อมูลตั้งแต่วันที่ {selectedDateRange.start} ถึง {selectedDateRange.end}</Typography>
            </Box>
            <Grid
               container
               direction="row"
               justifyContent="flex-start"
               alignItems="center" >

               <Card sx={{ minWidth: 235, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#0072B1, #41A3E3)" }}>
                  <CardContent>
                     <Typography component="div" sx={{ color: "#eee" }}> จำนวนสมัครสมาชิก </Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={4}></Grid>
                        <Grid item xs={4}>
                           <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }} >
                              {result?.listMemberRegister}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>คน</Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#eee', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1 }} >

                        </Button>
                     </Box>

                  </CardContent>
               </Card>

               <Card sx={{ minWidth: 242, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#0072B1, #41A3E3)" }}>
                  <CardContent>
                     <Typography component="div" sx={{ color: "#eee" }}> สมัครสมาชิกใหม่ที่ฝากเงินวันนี้ </Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={5}>
                           <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }} >
                              {result?.listMemberDeposit === null ? 0 : Intl.NumberFormat("TH").format(parseInt(result?.listMemberDeposit))}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท</Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#eee', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1 }} >

                        </Button>
                     </Box>
                  </CardContent>
               </Card>



               <Card sx={{ minWidth: 242, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#09893f, #41db82)" }}>
                  <CardContent>
                     <Typography component="div" sx={{ color: "#eee" }}> จำนวนครั้งในการฝาก </Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={5}>
                           <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }} >
                              {result?.lengthDeposit}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#eee', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1, color: "#eee" }} onClick={() => handleOpenDetail('DEPOSIT')}>
                           ดูเพิ่มเติม...
                        </Button>
                     </Box>
                  </CardContent>
               </Card>

               <Card sx={{ minWidth: 242, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#09893f, #41db82)" }}>
                  <CardContent>
                     <Typography component="div" sx={{ color: "#eee" }}> ฝากเงินทั้งหมด </Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={5}>
                           <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }} >
                              {Intl.NumberFormat("TH").format(parseInt(result?.sumCreditDeposit))}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท</Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#eee', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1 }} >

                        </Button>
                     </Box>
                  </CardContent>
               </Card>



               <Card sx={{ minWidth: 242, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#c9881e, #ffc463)" }}>
                  <CardContent>
                     <Typography component="div" sx={{ color: "#eee " }}> จำนวนครั้งในการถอน </Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={5}>
                           <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }} >
                              {result?.lengthWithdraw}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#fff', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1, color: '#eee' }} onClick={() => handleOpenDetail('WITHDRAW')}>
                           ดูเพิ่มเติม...
                        </Button>
                     </Box>
                  </CardContent>
               </Card>

               <Card sx={{ minWidth: 242, maxHeight: 160, my: 2, ml: 2, background: "linear-gradient(#c9881e, #ffc463)" }}>
                  <CardContent>
                     <Typography component="div" sx={{ color: "#eee " }}> ถอนเงินทั้งหมด </Typography>
                     <Grid container justifyContent="center">
                        <Grid item xs={3}></Grid>
                        <Grid item xs={5}>
                           <Typography variant="h5" sx={{ textAlign: "center", color: "#eee", mt: 2 }} >
                              {Intl.NumberFormat("TH").format(parseInt(result?.sumCreditWithdraw))}
                           </Typography>
                        </Grid>
                        <Grid item xs={4}>
                           <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท</Typography>
                        </Grid>
                     </Grid>
                     <Divider sx={{ bgcolor: '#fff', mt: 1 }} />
                     <Box sx={{ textAlign: 'right' }}>
                        <Button variant="text" sx={{ p: 1 }} >

                        </Button>
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
         </Paper>


         <Paper sx={{ p: 3, mt: 2 }}>
            <Typography> ภาพรวมสรุปตั้งแต่วันที่ {selectedDateRange.start} ถึง {selectedDateRange.end}</Typography>
            <Grid
               container
               direction="row"
            // justifyContent="center"
            // alignItems="center"
            >

               <Grid item xs={6} sx={{ background: 'linear-gradient(#e4e3e3, #faf8f8)', borderRadius: '20px', px: 2, my: 1 }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '18px', textDecoration: "underline #41A3E3 3px", mt: 2 }}> ยอดการถอนรายชั่วโมง </Typography>
                  <Bar options={options} data={{
                     labels,
                     datasets: [
                        {
                           label: "ยอดการถอนรายชั่วโมง",
                           data: [...chartWithdraw.map((item) => item.withdraw_total)],
                           // borderColor: "#129A50",
                           backgroundColor: [
                              'rgba(255, 99, 132)',
                              'rgba(255, 159, 64)',
                              'rgba(255, 205, 86)',
                              'rgba(75, 192, 192)',
                              'rgba(54, 162, 235)',
                              'rgba(153, 102, 255)',
                              'rgba(201, 203, 207)'
                           ],
                           barThickness: 20,
                        },
                     ],
                  }} />
               </Grid>
               <Grid item xs={6} sx={{ background: 'linear-gradient(#e4e3e3, #faf8f8)', borderRadius: '20px', px: 2, my: 1 }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '18px', textDecoration: "underline #41A3E3 3px", mt: 2 }}> จำนวนครั้งการถอนรายชั่วโมง </Typography>
                  <Bar options={optionsCount} data={{
                     labels,
                     datasets: [
                        {
                           label: "จำนวนครั้งการถอนรายชั่วโมง",
                           data: [...chartWithdraw.map((item) => item.withdraw_count)],
                           // borderColor: "#129A50",
                           backgroundColor: [
                              'rgba(255, 99, 132)',
                              'rgba(255, 159, 64)',
                              'rgba(255, 205, 86)',
                              'rgba(75, 192, 192)',
                              'rgba(54, 162, 235)',
                              'rgba(153, 102, 255)',
                              'rgba(201, 203, 207)'
                           ],
                           barThickness: 20,
                        },
                     ],
                  }} />
               </Grid>
               <Grid item xs={6} sx={{ background: 'linear-gradient(#e4e3e3, #faf8f8)', borderRadius: '20px', px: 2, my: 1 }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '18px', textDecoration: "underline #41A3E3 3px", mt: 2 }}> ยอดการฝากรายชั่วโมง </Typography>
                  <Bar options={options} data={{
                     labels,
                     datasets: [
                        {
                           label: "ยอดการฝากรายชั่วโมง",
                           data: [...chartDeposit.map((item) => item.deposit_total)],
                           // borderColor: "#129A50",
                           backgroundColor: [
                              'rgba(255, 99, 132)',
                              'rgba(255, 159, 64)',
                              'rgba(255, 205, 86)',
                              'rgba(75, 192, 192)',
                              'rgba(54, 162, 235)',
                              'rgba(153, 102, 255)',
                              'rgba(201, 203, 207)'
                           ],
                           barThickness: 20,
                        },
                     ],
                  }} />
               </Grid>
               <Grid item xs={6} sx={{ background: 'linear-gradient(#e4e3e3, #faf8f8)', borderRadius: '20px', px: 2, my: 1 }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '18px', textDecoration: "underline #41A3E3 3px", mt: 2 }}> จำนวนครั้งการฝากรายชั่วโมง </Typography>
                  <Bar options={optionsCount} data={{
                     labels,
                     datasets: [
                        {
                           label: "จำนวนครั้งการฝากรายชั่วโมง",
                           data: [...chartDeposit.map((item) => item.deposit_count)],
                           // borderColor: "#129A50",
                           backgroundColor: [
                              'rgba(255, 99, 132)',
                              'rgba(255, 159, 64)',
                              'rgba(255, 205, 86)',
                              'rgba(75, 192, 192)',
                              'rgba(54, 162, 235)',
                              'rgba(153, 102, 255)',
                              'rgba(201, 203, 207)'
                           ],
                           barThickness: 20,
                        },
                     ],
                  }} />
               </Grid>
               <Grid item xs={6} sx={{ background: 'linear-gradient(#e4e3e3, #faf8f8)', borderRadius: '20px', px: 2, my: 1 }}>
                  <Typography sx={{ textAlign: 'center', fontSize: '18px', textDecoration: "underline #41A3E3 3px", mt: 2 }}> ยอดการสมัคร </Typography>
                  <Bar options={options} data={{
                     labels,
                     datasets: [
                        {
                           label: "ยอดการสมัคร",
                           data: [...chartMember.map((item) => item.member_count)],
                           // borderColor: "#129A50",
                           backgroundColor: [
                              'rgba(255, 99, 132)',
                              'rgba(255, 159, 64)',
                              'rgba(255, 205, 86)',
                              'rgba(75, 192, 192)',
                              'rgba(54, 162, 235)',
                              'rgba(153, 102, 255)',
                              'rgba(201, 203, 207)'
                           ],
                           barThickness: 20,
                        },
                     ],
                  }} />
               </Grid>
            </Grid>


         </Paper>

         {/* <Grid container direction="row" sx={{ mt: 3 }}>
            <Card sx={{ minWidth: 250, maxWidth: 230, my: 2, bgcolor: "#101D35", }}>
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}> twitter </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography variant="h5" sx={{ textAlign: "center", color: "#eee" }} >
                           {platform.twitter}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>
            <Card sx={{ minWidth: 250, maxWidth: 230, my: 2, mx: 2, bgcolor: "#101D35", }}>
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}> friend </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography variant="h5" sx={{ textAlign: "center", color: "#eee" }} >
                           {platform.friend}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>
            <Card sx={{ minWidth: 250, maxWidth: 230, my: 2, bgcolor: "#101D35", }}>
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}> posman </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography variant="h5" sx={{ textAlign: "center", color: "#eee" }} >
                           {platform.posman}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>


         </Grid> */}

         <Dialog
            open={openDialogTrans}
            onClose={() => setOpenDialogTrans(false)}
            fullWidth
            maxWidth="lg"
         >
            <DialogTitle sx={{ mt: 1 }} >
               <Grid container direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item>
                     <Typography> ประวัติการทำรายการ </Typography>
                  </Grid>
                  <Grid item>
                     <IconButton aria-label="delete" size="large" onClick={() => setOpenDialogTrans(false)}>
                        <CloseIcon fontSize="inherit" />
                     </IconButton>

                  </Grid>
               </Grid>
            </DialogTitle>

            <DialogContent>
               <Grid>
                  <Table
                     dataSource={report}
                     onChange={onChange}
                     size="small"
                     pagination={{
                        current: page,
                        pageSize: 20,
                        onChange: (page, pageSize) => {
                           setPage(page)
                           setPageSize(pageSize)
                        }
                     }}

                     columns={[
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
                           dataIndex: 'transfer_type',
                           title: "ประเภท",
                           align: "center",
                           render: (item) => (
                              <Chip
                                 label={item === "DEPOSIT" ? "ฝากเงิน" : "ถอนเงิน"}
                                 size="small"
                                 style={{
                                    // padding: 5,
                                    backgroundColor: item === "DEPOSIT" ? "#129A50" : "#FFB946",
                                    color: "#fff",
                                    minWidth: "120px"
                                 }}
                              />
                           ),
                           filters: [
                              { text: 'ถอนเงิน', value: 'WITHDRAW' },
                              { text: 'ฝากเงิน', value: 'DEPOSIT' },
                           ],
                           onFilter: (value, record) => record.transfer_type.indexOf(value) === 0,
                        },
                        {
                           title: 'Username',
                           dataIndex: 'username',
                           ...getColumnSearchProps('username'),
                           render: (item, data) => (
                              <CopyToClipboard text={item}>
                                 <div style={{
                                    "& .MuiButton-text": { "&:hover": { textDecoration: "underline blue 1px", } }
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
                           dataIndex: "credit",
                           title: "ยอดเงิน",
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
                           dataIndex: 'credit_before',
                           title: "เครดิตก่อนทำรายการ",
                           align: "center",
                           render: (item) => (
                              <Typography sx={{ color: 'red', fontSize: '14px', }}>
                                 {Intl.NumberFormat("TH").format(parseInt(item))}
                              </Typography>
                           ),
                        },
                        {
                           dataIndex: 'credit_after',
                           title: "เครดิตหลังทำรายการ",
                           align: "center",
                           render: (item) => (
                              <Typography sx={{ color: '#129A50', fontSize: '14px', }}>
                                 {Intl.NumberFormat("TH").format(parseInt(item))}
                              </Typography>
                           ),
                        },
                        {
                           dataIndex: 'status_transction',
                           title: "สถานะ",
                           align: "center",
                           render: (item, data) => (
                              <Chip
                                 label={item === "SUCCESS" ? 'AUTO' : item === "MANUAL" ? 'MANUAL' : 'CANCEL'}
                                 size="small"
                                 style={{
                                    padding: 10,
                                    backgroundColor: item === "SUCCESS" ? '#129A50' : item === "MANUAL" ? '#4a5eb3' : '#BB2828',
                                    color: "#fff",
                                 }}
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
                           dataIndex: "content",
                           title: "หมายเหตุ",
                           align: "center",
                           render: (item) => (
                              <Typography
                                 style={{
                                    fontSize: '14px'
                                 }}
                              >{item}</Typography>
                           ),
                        },

                     ]}

                  />


               </Grid>
            </DialogContent>
         </Dialog>

         <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
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

// export default (dashboard);
export default withAuth(dashboard);
