import React, { useState, useEffect } from "react";
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
   Tab,
   Tabs,
   Divider
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
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import hostname from "../utils/hostname";
import { useRouter } from "next/router";
import withAuth from "../routes/withAuth";
import { useAppDispatch } from "../store/store";
import { signOut } from "../store/slices/userSlice";
import LoadingModal from "../theme/LoadingModal";
import moment from "moment/moment";
import PropTypes from 'prop-types';
import AssessmentIcon from '@mui/icons-material/Assessment';

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`simple-tabpanel-${index}`}
         aria-labelledby={`simple-tab-${index}`}
         {...other}
      >
         {value === index && (
            <Box sx={{ p: 3 }}>
               <Typography>{children}</Typography>
            </Box>
         )}
      </div>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired,
};

function a11yProps(index) {
   return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
   };
}

function dashboard() {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const [selectedDateRange, setSelectedDateRange] = useState({
      start: moment().format("YYYY-MM-DD 00:00"),
      end: moment().format("YYYY-MM-DD 23:59"),
   });
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState([]);
   const [report, setReport] = useState({});
   const [value, setValue] = useState(0);
   const [chartDeposit, setChartDeposit] = useState([])
   const [chartWithdraw, setChartWithdraw] = useState([])
   const [chartMember, setChartMember] = useState([])
   const [result, setResult] = useState()
   const [bank, setBank] = useState([])
   const [member, setMember] = useState()
   const [platform, setPlatform] = useState([])

   const handleChange = (event, newValue) => {
      setValue(newValue);
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
         let resData = res.data.total_member;
         setResult(resData)
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
         console.log(error);
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
         console.log(error);
      }
   };
   console.log('platform', platform)

   const options = {
      responsive: true,
      layout: {
         padding: 10,
      },
      plugins: {
         legend: {
            position: "top",
         },
         title: {
            display: true,
         },
      },
   };

   const labels = [...chartDeposit.map((item) => item.hour)]

   const textResult = <>

      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิก </span>{result?.total_member} ยูสเซอร์</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงิน</span> {result?.total_credit} บาท</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> {result?.register_deposit_bonus_total} บาท</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> {result?.register_deposit_bonus_length} รายการ</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> {result?.deposit_total} บาท</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> {result?.deposit_length} รายการ</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> {result?.withdraw_total} บาท</Typography>
      <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> {result?.withdraw_length} รายการ</Typography>
   </>


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




         {/* <Paper sx={{ p: 3, mt: 2 }}>
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
                     style={{ marginRight: "8px", marginTop: 9, color: '#fff', width: 150 }}
                     color="primary"
                     size="small"
                     onClick={() => {
                        getUser();
                        getReport();
                     }}
                  >
                     <Typography>ค้นหา</Typography>
                  </Button>
               </Grid>
            </Grid>
         </Paper> */}
         <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center" spacing={2}>

            <Grid item xs={4}>
               <Paper sx={{ p: 2, mt: 2, }}>
                  <Grid container spacing={1}>
                     <Grid item xs={8}>
                        <TextField
                           fullWidth
                           label=""
                           style={{
                              marginRight: "8px",
                              marginTop: "8px",
                              backgroundColor: "white",
                              borderRadius: 4,
                           }}
                           variant="outlined"
                           size="small"
                           disabled
                           type="datetime-local"
                           name="start"
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
                        />
                     </Grid>
                     <Grid item xs={4}>
                        <Button
                           fullWidth
                           variant="contained"
                           style={{ marginRight: "8px", marginTop: 9, color: '#fff', }}
                           color="primary"
                           size=""
                           onClick={() => {
                              getChart()
                              getResult()
                           }}
                        >
                           <Typography>ค้นหา</Typography>
                        </Button>
                     </Grid>

                  </Grid>

                  <Box sx={{ borderColor: 'divider' }}>
                     <Tabs
                        value={value}
                        variant="fullWidth"
                        onChange={handleChange} >
                        <Tab
                           label="วันนี้" {...a11yProps(0)}
                           onClick={() =>
                              setSelectedDateRange({
                                 start: moment().format("YYYY-MM-DD 00:00:00"),
                                 end: moment().format("YYYY-MM-DD 23:59:00")
                              })} />
                        <Tab
                           label="เมื่อวาน" {...a11yProps(1)}
                           onClick={() =>
                              setSelectedDateRange({
                                 start: moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00"),
                                 end: moment().format("YYYY-MM-DD 23:59:00")
                              })} />

                        <Tab label="สัปดาห์" {...a11yProps(2)}
                           onClick={() =>
                              setSelectedDateRange({
                                 start: moment().subtract(7, "days").format("YYYY-MM-DD 00:00:00"),
                                 end: moment().format("YYYY-MM-DD 23:59:00")
                              })} />

                        <Tab label="เดือน" {...a11yProps(3)}
                           onClick={() =>
                              setSelectedDateRange({
                                 start: moment().subtract(30, "days").format("YYYY-MM-DD 00:00:00"),
                                 end: moment().format("YYYY-MM-DD 23:59:00")
                              })} />

                     </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} sx={{ width: 199 }}>
                     <Grid container>
                        <Grid item xs={12}>
                           {textResult}
                        </Grid>
                     </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                     <Grid container>
                        <Grid item xs={12}>
                           {textResult}

                        </Grid>
                     </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                     <Grid container>
                        <Grid item xs={12}>
                           {textResult}

                        </Grid>
                     </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                     <Grid container>
                        <Grid item xs={12}>
                           {textResult}
                        </Grid>
                     </Grid>
                  </TabPanel>
               </Paper>
            </Grid>

            <Grid item xs={8}>
               <Paper sx={{ p: 3, mt: 2, ml: 2 }}>
                  <Grid container
                     direction="row"
                     justifyContent="center"
                     alignItems="center" spacing={3}>
                     <Grid item xs={6} >
                        {bank.map((item) =>
                           <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 110, my: 2, bgcolor: "#101D35", mt: 1 }}>
                              <CardContent>
                                 <Grid container justifyContent="center">
                                    <Grid item xs={4}>
                                       <Typography component="div" sx={{ color: "#41A3E3" }}>ยอดเงินคงเหลือ</Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                       <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#C3C3C3" }}>
                                          {Intl.NumberFormat("THB").format(item.bank_total)}
                                       </Typography>
                                    </Grid>
                                    <Grid item xs={4}>
                                       <Typography sx={{ mt: 5, textAlign: "end", color: "#C3C3C3" }}> บาท </Typography>
                                    </Grid>
                                 </Grid>
                                 <Divider sx={{ bgcolor: '#41A3E3' }} />
                                 <Typography sx={{ color: "#C3C3C3", fontSize: '12px', p: 1 }}> ธนาคาร {item.bank_name} บัญชี {item.bank_number} </Typography>
                              </CardContent>
                           </Card>
                        )}
                     </Grid>

                     <Grid item xs={6} >
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 110, my: 2, bgcolor: "#101D35", mt: 1 }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#41A3E3" }}>ลูกค้าทั้งหมด</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {member?.total_member}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee", mb: 1 }}> ยูสเซอร์ </Typography>
                                 </Grid>
                              </Grid>
                              <Typography sx={{ color: "#eeee", fontSize: '12px', p: 1 }}> </Typography>
                           </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 110, my: 2, bgcolor: "#101D35", }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#41A3E3" }}>สมัครใหม่วันนี้</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {member?.member_regiser_today}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ยูสเซอร์ </Typography>
                                 </Grid>
                              </Grid>
                              <Typography sx={{ color: "#eeee", fontSize: '12px', p: 1 }}> </Typography>
                           </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 110, my: 2, bgcolor: "#101D35", }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#41A3E3" }}>สมัครใหม่วันนี้เงินฝาก</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {member?.sum_deposit_day}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท </Typography>
                                 </Grid>
                              </Grid>
                              <Typography sx={{ color: "#eeee", fontSize: '12px', p: 1 }}> </Typography>
                           </CardContent>
                        </Card>
                     </Grid>
                  </Grid>
               </Paper>
            </Grid>
         </Grid>


         <Paper sx={{ p: 3, mt: 2 }}>
         <Typography> ภาพรวมสรุปตั้งแต่วันที่ {selectedDateRange.start} ถึง {selectedDateRange.end}</Typography>
            <Grid
               container
               direction="row"
               justifyContent="center"
               alignItems="center"
            >
              
               {/* <Box sx={{ width: "80%", mt: "20px", bgcolor: "#101D35" }}>
                <Line options={options} data={data} height="100px" /> 
               
            </Box> */}
               <Grid item xs={6} >
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
               <Grid item xs={6} >
                  <Bar options={options} data={{
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
               <Grid item xs={6} >
                  <Bar options={options} data={{
                     labels,
                     datasets: [
                        {
                           label: "ยอดการฝการายชั่วโมง",
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
               <Grid item xs={6} >
                  <Bar options={options} data={{
                     labels,
                     datasets: [
                        {
                           label: "ยอดการฝากรายชั่วโมง",
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
               <Grid item xs={6} >
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



         <Grid container  direction="row"  sx={{ mt: 3 }}> 
            <Card sx={{ minWidth: 250, maxWidth: 260, minHeight: 20, my: 2, bgcolor: "#101D35", }}>
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}> twitter </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography variant="h3" sx={{  textAlign: "center", color: "#eee" }} >
                           {platform.twitter}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>
            <Card sx={{ minWidth: 250, maxWidth: 260, minHeight: 20, my: 2, mx: 2,bgcolor: "#101D35", }}>
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}> friend </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography variant="h3" sx={{  textAlign: "center", color: "#eee" }} >
                        {platform.friend}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>
            <Card sx={{ minWidth: 250, maxWidth: 260, minHeight: 20, my: 2, bgcolor: "#101D35", }}>
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}> posman </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography variant="h3" sx={{  textAlign: "center", color: "#eee" }} >
                        {platform.posman}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ครั้ง</Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>


         </Grid>
         <LoadingModal open={loading} />
      </Layout>
   );
}

// export default (dashboard);
export default (dashboard);
