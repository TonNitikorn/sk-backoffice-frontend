import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
   Button,
   Grid,
   Typography,
   IconButton,
   TextField,
   FormControl,
   Box,
   InputAdornment,
   OutlinedInput,
   Paper,
   AppBar,
   Container,
   Toolbar
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import { signIn } from "../../store/slices/userSlice";
import withAuth from "../../routes/withAuth";
import hostname from "../../utils/hostname";
import { useAppDispatch } from "../../store/store";
import logo_angpao from "../../assets/logo_ap.png"
// import { useCounterStore } from "../../zustand/permission"

function Login() {
   const router = useRouter();
   const dispatch = useAppDispatch();

   // const addPermission = useCounterStore((state) => state.addPermission)

   const [rowData, setRowData] = useState({});
   const [values, setValues] = useState({
      amount: "",
      password: "",
      weight: "",
      weightRange: "",
      showPassword: false,
   });
   const [first, setFirst] = useState('');
   const [last, setLast] = useState('');


   const handleChangeData = async (e) => {
      setRowData({ ...rowData, [e.target.name]: e.target.value });
   };

   const handleChange = (prop) => (event) => {
      setValues({ ...values, [prop]: event.target.value });
   };

   const handleClickShowPassword = () => {
      setValues({
         ...values,
         showPassword: !values.showPassword,
      });
   };

   const handleMouseDownPassword = (event) => {
      event.preventDefault();
   };

   const handleSubmit = async (event) => {
      event.preventDefault();

      const response = await dispatch(
         signIn({ username: rowData.username, password: values.password })
      );

      if (response.meta.requestStatus === "rejected") {
         // alert("Login failed");

      } else {
         // addPermission(response.payload.preference)

         router.push("/dashboard");
      }
   };

   return (
      <>
         <div style={{ padding: "0 2rem" }} >
            <CssBaseline />
            <Grid container >
               <Grid item xs={3} />
               <Grid item xs={6} >
                  <Box
                     sx={{
                        display: { xs: "none", md: "block" },
                        flexGrow: 1,
                        mt: 20,
                        p: 2,
                        bgcolor: '#fff',
                        borderRadius: 5,
                        boxShadow: '2px 2px 5px #C1B9B9',
                        border: "1px solid #C1B9B9"
                     }} >
                     <div>
                        <form onSubmit={handleSubmit}>
                           <Grid
                              container
                              direction="column"
                              justifyContent="center"
                              alignItems="center" >
                              <Grid
                                 justifyContent="center"
                                 alignItems="center"
                                 sx={{ mt: 2 }}>
                                 <Image
                                    src={"https://public-cdn-softkingdom.sgp1.cdn.digitaloceanspaces.com/1687251601762-2Long-Angpaogames.png"}
                                    width={160}
                                    height={50}
                                 />
                              </Grid>
                              <Typography variant="h5"
                                 sx={{ mt: 3, color: "#41A3E3" }}> เข้าสู่ระบบ </Typography>
                           </Grid>
                           <Typography
                              sx={{ mt: 3, color: "#707070", fontSize: "14px" }} >
                              Username
                           </Typography>
                           <TextField name="username"
                              type="text"
                              value={rowData.username || ""}
                              placeholder="username"
                              fullWidth size="small"
                              onChange={(e) => handleChangeData(e)}
                              variant="outlined"
                              sx={{ bgcolor: "white" }}
                              inputProps={{ maxLength: 10 }}
                           />
                           <Typography sx={{ mt: 2, color: "#707070", fontSize: "14px" }} > Password </Typography>
                           <div>
                              <FormControl fullWidth variant="outlined" size="small" >
                                 <OutlinedInput id="outlined-adornment-password"
                                    type={values.showPassword ? "text" : "password"}
                                    value={values.password}
                                    placeholder="password"
                                    onChange={handleChange("password")}
                                    endAdornment={<InputAdornment position="end" >
                                       <IconButton
                                          aria-label="toggle password visibility"
                                          onClick={handleClickShowPassword}
                                          onMouseDown={handleMouseDownPassword}
                                          edge="end" >
                                          {values.showPassword ? < VisibilityOff /> : < Visibility />}
                                       </IconButton>
                                    </InputAdornment>
                                    }
                                    sx={{ bgcolor: "white" }}
                                 />
                              </FormControl>
                           </div>
                           <Button
                              variant="contained"
                              fullWidth
                              sx={{
                                 my: 5,
                                 bgcolor: '#41A3E3',
                                 borderRadius: 5,
                                 color: '#fff'
                              }}
                              type="submit"
                           >
                              เข้าสู่ระบบ
                           </Button>
                        </form>
                     </div>
                  </Box>
               </Grid>
               < Grid item xs={3} /> </Grid>
         </div>
      </>
   );
}

export default withAuth(Login);

