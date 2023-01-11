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
   const [selectedDateRange, setSelectedDateRange] = useState({
      start: moment().format("YYYY-MM-DD 00:00"),
      end: moment().format("YYYY-MM-DD 23:59"),
   });
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState([]);
   const [report, setReport] = useState({});

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
         {/* <Paper sx={{ p: 4 }}> */}
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

               <Button
                  variant="contained"
                  style={{ marginRight: "8px", marginTop: 9 , color:'#fff'}}
                  color="primary"
                  size="large"
                  onClick={() => {
                     getUser();
                     getReport();
                  }}
               >
                  <Typography>ค้นหา</Typography>
               </Button>
               <Button
                  variant="contained"
                  style={{
                     marginRight: "8px",
                     marginTop: 9,
                     backgroundColor: "#FFB946",
                     color:'#fff'
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
                     color:'#fff'
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

         <Grid container justifyContent="center">
            <Box sx={{ width: "80%", mt: "20px", bgcolor: "#101D35" }}>
               {/* <Line options={options} data={data} height="100px" /> */}
               <Bar options={options} data={data} />
            </Box>
         </Grid>

         <Typography sx={{ fontSize: "18px", mt: 5 }}>
            วันที่ {moment(selectedDateRange.start).format("DD/MM/YYYY")} -{" "}
            {moment(selectedDateRange.end).format("DD/MM/YYYY")}
         </Typography>

         <Grid container justifyContent="start" sx={{ mt: 1 }}>
            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  mt: 4,
                  bgcolor: "#129A50",
                  mr: "3px",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     ยอดฝากทั้งหมด
                  </Typography>

                  <Typography
                     variant="h3"
                     sx={{ mb: 2, mt: 4, textAlign: "center", color: "white" }}
                  >
                     {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))}
                  </Typography>
                  <Typography
                     component="div"
                     sx={{ color: "#eee", textAlign: "right", mt: 3 }}
                  >
                     บาท
                  </Typography>
               </CardContent>
            </Card>

            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  mt: 4,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     ยอดสมัครรวม
                  </Typography>
                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(parseInt(report.sumAll))}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>
         </Grid>

         <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  my: 2,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     SEO
                  </Typography>

                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.filter((item) => item.know_us === "seo").length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(parseInt(report.sumSeo))}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>

            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  my: 2,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     Twitter
                  </Typography>

                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.filter((item) => item.know_us === "twitter").length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(
                              parseInt(report.sumTwitter)
                           )}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>

            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  my: 2,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     Line
                  </Typography>

                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.filter((item) => item.know_us === "line").length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(parseInt(report.sumLine))}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>

            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  my: 2,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     Tiktok
                  </Typography>

                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.filter((item) => item.know_us === "tiktok").length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(parseInt(report.sumTiktok))}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>

            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  my: 2,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     Facebook
                  </Typography>

                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.filter((item) => item.know_us === "facebook").length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(
                              parseInt(report.sumFacebook)
                           )}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>

            <Card
               sx={{
                  minWidth: 250,
                  maxWidth: 260,
                  minHeight: 20,
                  my: 2,
                  bgcolor: "#101D35",
               }}
            >
               <CardContent>
                  <Typography component="div" sx={{ color: "#eee" }}>
                     Friend
                  </Typography>

                  <Grid container justifyContent="center">
                     <Grid item xs={3}></Grid>
                     <Grid item xs={5}>
                        <Typography
                           variant="h3"
                           sx={{ mt: 2, textAlign: "center", color: "#eee" }}
                        >
                           {user.filter((item) => item.know_us === "friend").length}
                        </Typography>
                     </Grid>
                     <Grid item xs={4}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           ครั้ง
                        </Typography>
                     </Grid>

                     <Grid item xs={3}>
                        <Typography
                           sx={{
                              fontSize: "16px",
                              mt: 2,
                              textAlign: "center",
                              color: "#eee",
                           }}
                        >
                           ฝาก
                        </Typography>
                     </Grid>
                     <Grid item xs={6}>
                        <Typography
                           variant="h5"
                           sx={{ mt: 4, textAlign: "center", color: "#129A50" }}
                        >
                           {Intl.NumberFormat("TH").format(
                              parseInt(report.sumFriend)
                           )}
                        </Typography>
                     </Grid>
                     <Grid item xs={3}>
                        <Typography sx={{ mt: 5, textAlign: "end", color: "#eee" }}>
                           บาท
                        </Typography>
                     </Grid>
                  </Grid>
               </CardContent>
            </Card>
         </Grid>
         {/* </Paper> */}
         <LoadingModal open={loading} />
      </Layout>
   );
}

// export default (dashboard);
export default (dashboard);
