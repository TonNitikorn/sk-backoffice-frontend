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
   Tabs
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
import { Bar } from "react-chartjs-2";
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

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };
   //   const getUser = async (type, start, end) => {
   //     setLoading(true);
   //     try {
   //       let res = await axios({
   //         headers: {
   //           Authorization: "Bearer " + localStorage.getItem("access_token"),
   //         },
   //         method: "get",
   //         url: `${hostname}/api/member/listmember?start_date=${
   //           type === undefined ? selectedDateRange.start : start
   //         }&end_date=${type === undefined ? selectedDateRange.end : end}`,
   //       });
   //       let resData = res.data;

   //       setUser(resData);
   //       setLoading(false);
   //     } catch (error) {
   //       // if (
   //       //   error.response.data.error.status_code === 401 &&
   //       //   error.response.data.error.message === "Unauthorized"
   //       // ) {
   //       //   dispatch(signOut());
   //       //   localStorage.clear();
   //       //   router.push("/auth/login");
   //       // }
   //       console.log(error);
   //     }
   //   };

   const getReport = async (type, start, end) => {
      setLoading(true);
      try {
         let res = await axios({
            headers: {
               Authorization: "Bearer " + localStorage.getItem("access_token"),
            },
            method: "get",
            url: `${hostname}/api/report/deposit/?start_date=${type === undefined ? selectedDateRange.start : start
               }&end_date=${type === undefined ? selectedDateRange.end : end
               }&username=`,
         });

         let resData = res.data;
         let no = 1;
         resData.map((item) => {
            item.no = no++;
            item.bank_name = item.member_account_banks[0].bank_name;
            item.bank_number = item.member_account_banks[0].bank_number;
            item.bank_account_name = item.member_account_banks[0].bank_account_name;
            item.know_us = item.member[0].know_us;
            item.register_date = moment(item.member[0].register_date).format(
               "YYYY-MM-DD"
            );
            item.createdAt = moment(item.createdAt).format("YYYY-MM-DD");
         });

         let twitter = resData.filter(
            (item) =>
               item.know_us === "twitter" &&
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );
         let seo = resData.filter(
            (item) =>
               item.know_us === "seo" &&
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );
         let line = resData.filter(
            (item) =>
               item.know_us === "line" &&
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );
         let facebook = resData.filter(
            (item) =>
               item.know_us === "facebook" &&
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );
         let tiktok = resData.filter(
            (item) =>
               item.know_us === "tiktok" &&
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );

         let friend = resData.filter(
            (item) =>
               item.know_us === "friend" &&
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );

         let all = resData.filter(
            (item) =>
               item.register_date ===
               moment(type === undefined ? selectedDateRange.start : start).format(
                  "YYYY-MM-DD"
               )
         );

         let sumTwitter;
         let arrTwitter = [];
         let sumSeo;
         let arrSeo = [];
         let sumLine;
         let arrLine = [];
         let sumFacebook;
         let arrFacebook = [];
         let sumTiktok;
         let arrTiktok = [];
         let sumFriend;
         let arrFriend = [];
         let sumAll;
         let arrAll = [];
         let sumAmountAll;
         let arrAmountAll = [];

         for (const item of all) {
            arrAll.push(parseInt(item.amount));
         }
         sumAll = arrAll.reduce((a, b) => a + b, 0);

         for (const item of twitter) {
            arrTwitter.push(parseInt(item.amount));
         }
         sumTwitter = arrTwitter.reduce((a, b) => a + b, 0);
         for (const item of seo) {
            arrSeo.push(parseInt(item.amount));
         }
         sumSeo = arrSeo.reduce((a, b) => a + b, 0);
         for (const item of line) {
            arrLine.push(parseInt(item.amount));
         }
         sumLine = arrLine.reduce((a, b) => a + b, 0);
         for (const item of facebook) {
            arrFacebook.push(parseInt(item.amount));
         }
         sumFacebook = arrFacebook.reduce((a, b) => a + b, 0);
         for (const item of tiktok) {
            arrTiktok.push(parseInt(item.amount));
         }
         sumTiktok = arrTiktok.reduce((a, b) => a + b, 0);
         for (const item of friend) {
            arrFriend.push(parseInt(item.amount));
         }
         sumFriend = arrFriend.reduce((a, b) => a + b, 0);

         for (const item of resData) {
            arrAmountAll.push(parseInt(item.amount));
         }
         sumAmountAll = arrAmountAll.reduce((a, b) => a + b, 0);

         setReport({
            sumTwitter: sumTwitter,
            sumSeo: sumSeo,
            sumLine: sumLine,
            sumFacebook: sumFacebook,
            sumTiktok: sumTiktok,
            sumFriend: sumFriend,
            sumAll: sumAll,
            sumAmountAll: sumAmountAll,
         });
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

   const labels = ["Facebook", "Line", "Seo", "Twitter", "Tiktok"];

   const data = {
      labels,
      datasets: [
         {
            label: "จำนวน",
            data: {
               Facebook: user.filter((item) => item.know_us === "facebook").length,
               Line: user.filter((item) => item.know_us === "line").length,
               Seo: user.filter((item) => item.know_us === "seo").length,
               Twitter: user.filter((item) => item.know_us === "twitter").length,
               Tiktok: user.filter((item) => item.know_us === "tiktok").length,
            },
            borderColor: "#129A50",
            backgroundColor: "#129A50",
            barThickness: 50,
         },
      ],
   };

   useEffect(() => {
      // getUser();
      // getReport();
   }, []);

   return (
      <Layout>
         <Paper sx={{p: 3,textAlign: 'start',mb:2}}>
            <Typography  sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}> Dashboard สรุปภาพรวม</Typography>
         </Paper>


         <Paper sx={{ p: 3 }}>
            <Grid
               container
               direction="row"
               justifyContent="center"
               alignItems="center"
            >
               {/* <Box sx={{ width: "80%", mt: "20px", bgcolor: "#101D35" }}>
                <Line options={options} data={data} height="100px" /> 
               
            </Box>*/}
               <Grid item xs={6} >
                  <Bar options={options} data={data} />
               </Grid>
               <Grid item xs={6} >
                  <Bar options={options} data={data} />
               </Grid>
               <Grid item xs={6} >
                  <Bar options={options} data={data} />
               </Grid>
               <Grid item xs={6} >
                  <Bar options={options} data={data} />
               </Grid>
            </Grid>
         </Paper>


         <Paper sx={{ p: 3, mt: 2 }}>
            <Box sx={{ textAlign: 'center' }}>
               <Typography variant="h5">สรุปภาพรวมตามช่วงเวลา</Typography>
            </Box>

            {/* วันที่ค้นหา */}
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
         </Paper>
         <Grid container
            direction="row"
            justifyContent="center"
            alignItems="center" spacing={3}>

            <Grid item xs={4}>
               <Paper sx={{ p: 3, mt: 1, }}>
                  <Box sx={{ borderColor: 'divider' }}>
                     <Tabs
                        value={value}
                        // variant="fullWidth"
                        onChange={handleChange} >
                        <Tab label="วันนี้" {...a11yProps(0)} />
                        <Tab label="เมื่อวาน" {...a11yProps(1)} />
                        <Tab label="สัปดาห์" {...a11yProps(2)} />
                        <Tab label="เดือน" {...a11yProps(3)} />
                     </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} sx={{ width: 199 }}>
                     <Grid container>
                        <Grid item xs={12}>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิก </span>10 ยูสเซอร์</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงิน</span> 2500 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 566 รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 566 รายการ</Typography>
                        </Grid>
                     </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                     <Grid container>
                     <Grid item xs={12}>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิก </span>10 ยูสเซอร์</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงิน</span> 2500 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 566 รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 566 รายการ</Typography>
                        </Grid>
                     </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                     <Grid container>
                     <Grid item xs={12}>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิก </span>10 ยูสเซอร์</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงิน</span> 2500 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 566 รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 566 รายการ</Typography>
                        </Grid>
                     </Grid>
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                     <Grid container>
                     <Grid item xs={12}>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิก </span>10 ยูสเซอร์</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงิน</span> 2500 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>สมัครสมาชิกฝากเงินรับโบนัส</span> - รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากเงิน</span> 566 รายการ</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 55,000 บาท</Typography>
                           <Typography sx={{ mt: 1 }}><span style={{ fontWeight: 'bold' }}>ฝากถอน</span> 566 รายการ</Typography>
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
                     <Grid item xs={6}  >
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 100, my: 2, bgcolor: "#101D35", mt: 1 }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#FFC300" }}>ยอดเงินคงเหลือ</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {user.filter((item) => item.know_us === "seo").length}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท </Typography>
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 100, my: 2, bgcolor: "#101D35", }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#FFC300" }}>ยอดเงินคงเหลือ</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {user.filter((item) => item.know_us === "seo").length}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท </Typography>
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 100, my: 2, bgcolor: "#101D35", }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#FFC300" }}>ยอดเงินคงเหลือ</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {user.filter((item) => item.know_us === "seo").length}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท </Typography>
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>


                     </Grid>

                     <Grid item xs={6} >
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 100, my: 2, bgcolor: "#101D35", mt: 1 }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#FFC300" }}>ลูกค้าทั้งหมด</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {user.filter((item) => item.know_us === "seo").length}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ยูสเซอร์ </Typography>
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 100, my: 2, bgcolor: "#101D35", }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#FFC300" }}>สมัครใหม่วันนี้</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {user.filter((item) => item.know_us === "seo").length}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> ยูสเซอร์ </Typography>
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>
                        <Card sx={{ minWidth: 300, maxWidth: 460, minHeight: 20, maxHeight: 100, my: 2, bgcolor: "#101D35", }}>
                           <CardContent>
                              <Grid container justifyContent="center">
                                 <Grid item xs={4}>
                                    <Typography component="div" sx={{ color: "#FFC300" }}>สมัครใหม่วันนี้เงินฝาก</Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography variant="h5" sx={{ mt: 3, textAlign: "center", color: "#eee" }}>
                                       {user.filter((item) => item.know_us === "seo").length}
                                    </Typography>
                                 </Grid>
                                 <Grid item xs={4}>
                                    <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}> บาท </Typography>
                                 </Grid>
                              </Grid>
                           </CardContent>
                        </Card>

                     </Grid>
                  </Grid>
               </Paper>
            </Grid>



         </Grid>

         <Paper sx={{ p: 3, mt: 2 }}>
            <Grid
               container
               direction="row"
               justifyContent="center"
               alignItems="center"
            >
               {/* <Box sx={{ width: "80%", mt: "20px", bgcolor: "#101D35" }}>
                <Line options={options} data={data} height="100px" /> 
               
            </Box>*/}
               <Grid item xs={6} >
                  <Bar options={options} data={data} />
               </Grid>
               <Grid item xs={6} >
                  <Bar options={options} data={data} />
               </Grid>
            </Grid>
         </Paper>
         <LoadingModal open={loading} />
      </Layout>
   );
}

// export default (dashboard);
export default (dashboard);
