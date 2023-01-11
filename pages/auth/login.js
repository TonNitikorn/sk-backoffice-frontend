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

function Login() {
  const router = useRouter();
  const line ='line'
  const dispatch = useAppDispatch();
  const [rowData, setRowData] = useState({});
  const [values, setValues] = useState({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

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

  return (
    <>
      <div style={{ padding: "0 2rem" }}>
        <CssBaseline />
        <AppBar position="fixed" color="primary" elevation={0} sx={{ borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Grid container>
                <Grid item xs={6}>
                  <Typography sx={{ mt: 1 }}
                    onClick={() => {
                      router.push('/')
                    }}>LOGO</Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </Container>
        </AppBar>

        <Grid container >
          <Grid item xs={3} />
          <Grid item xs={6}>
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
              }}
            >
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Typography variant="h5" sx={{ mt: 3, color: "#41A3E3" }}>เข้าสู่ระบบ</Typography>
              </Grid>
              <Typography sx={{ mt: 3, color: "#707070", fontSize: "14px" }}>
                เบอร์โทรศัพท์
              </Typography>
              <TextField
                name="tel"
                type="text"
                value={rowData.tel || ""}
                placeholder="000-000-000"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                inputProps={{ maxLength: 10 }}
              />
              <Typography sx={{ mt: 2, color: "#707070", fontSize: "14px" }}>รหัสผ่าน</Typography>
              <div>
                <FormControl fullWidth variant="outlined" size="small">
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    placeholder="password"
                    onChange={handleChange("password")}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    sx={{ bgcolor: "white" }}
                  />
                </FormControl>
                <Grid
                  container
                  direction="row-reverse"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Button
                    variant="text"
                    sx={{ textDecoration: "underline ", color: "#000" }}
                  >
                    ลืมรหัสผ่าน
                  </Button>
                </Grid>
              </div>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: '#41A3E3',
                  borderRadius: 5,
                  color: '#fff'
                }}
                onClick={async () => {
                  const response = await dispatch(
                    signIn({ tel: rowData.tel, password: values.password })
                  );

                  if (response.meta.requestStatus === "rejected") {
                    alert("Login failed");
                  } else {
                    router.push("/home");
                  }
                }}
              >
                เข้าสู่ระบบ
              </Button>
              <Grid container justifyContent="center">
                <Typography sx={{ my: 1, color: "#707070", fontSize: "14px" }}>หรือ</Typography>
              </Grid>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: '#00BB00',
                  borderRadius: 5,
                  color: '#fff'
                }}

              >
                เข้าสู่ระบบด้วยไลน์
              </Button>

              <Button
                variant="outlined"
                fullWidth
                sx={{
                  my: 4,
                  bgcolor: '#fff',
                  borderRadius: 5,
                  border: "2px solid #41A3E3",
                  color: '#41A3E3'
                }}
                onClick={() => router.push(`/auth/register`)}
              >
                สมัครสมาชิก
              </Button>

            </Box>
          </Grid>
          <Grid item xs={3} />
        </Grid>

        <Box
          sx={{
            display: { xs: "block", md: "none" },
            flexGrow: 1,
            mt: 20,
            p: 2,
            bgcolor: '#fff',
            borderRadius: 5,
            boxShadow: '2px 2px 5px #C1B9B9',
            border: "1px solid #C1B9B9"
          }}
        >
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h5" sx={{ mt: 3, color: "#41A3E3" }}>เข้าสู่ระบบ</Typography>
          </Grid>
          <Typography sx={{ mt: 3, color: "#707070", fontSize: "14px" }}>
            เบอร์โทรศัพท์
          </Typography>
          <TextField
            name="tel"
            type="text"
            value={rowData.tel || ""}
            placeholder="000-000-000"
            fullWidth
            size="small"
            onChange={(e) => handleChangeData(e)}
            variant="outlined"
            sx={{ bgcolor: "white" }}
            inputProps={{ maxLength: 10 }}
          />
          <Typography sx={{ mt: 2, color: "#707070", fontSize: "14px" }}>รหัสผ่าน</Typography>
          <div>
            <FormControl fullWidth variant="outlined" size="small">
              <OutlinedInput
                id="outlined-adornment-password"
                type={values.showPassword ? "text" : "password"}
                value={values.password}
                placeholder="password"
                onChange={handleChange("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{ bgcolor: "white" }}
              />
            </FormControl>
            <Grid
              container
              direction="row-reverse"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Button
                variant="text"
                sx={{ textDecoration: "underline ", color: "#000" }}
              >
                ลืมรหัสผ่าน
              </Button>
            </Grid>
          </div>
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: '#41A3E3',
              borderRadius: 5,
              color: '#fff'
            }}
            onClick={async () => {
              const response = await dispatch(
                signIn({ tel: rowData.tel, password: values.password })
              );

              if (response.meta.requestStatus === "rejected") {
                alert("Login failed");
              } else {
                router.push("/home");
              }
            }}
          >
            เข้าสู่ระบบ
          </Button>
          <Grid container justifyContent="center">
            <Typography sx={{ my: 1, color: "#707070", fontSize: "14px" }}>หรือ</Typography>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#00BB00',
              borderRadius: 5,
              color: '#fff'
            }}
            onClick={async () => {
              const response = await dispatch(
                signIn({ tel: rowData.tel, password: values.password })
              );

              if (response.meta.requestStatus === "rejected") {
                alert("Login failed");
              } else {
                router.push(`/home?by=${'line'}`);
              }
            }}
          >
            เข้าสู่ระบบด้วยไลน์
          </Button>

          <Button
            variant="outlined"
            fullWidth
            sx={{
              my: 4,
              bgcolor: '#fff',
              borderRadius: 5,
              border: "2px solid #41A3E3",
              color: '#41A3E3'
            }}
            onClick={() => router.push(`/auth/register`)}
          >
            สมัครสมาชิก
          </Button>

        </Box>
      </div>
    </>
  );
}

export default withAuth(Login);

