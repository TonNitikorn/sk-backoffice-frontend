import React, { useState, useEffect } from "react";
import Layout from "../../theme/Layout";
import {
  Paper,
  Button,
  Grid,
  Typography,
  Box,
  TextField,
  Checkbox,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import Swal from "sweetalert2";
import withAuth from "../../routes/withAuth";

function addEmployee() {
  const [rowData, setRowData] = useState({});
  const [state, setState] = React.useState({
    gilad: false,
    jason: false,
    antoine: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const { gilad, jason, antoine } = state;

  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const addEmployee = async () => {
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/api/user`,
        data: {
          prefix: rowData.prefix,
          info_name: rowData.info_name,
          username: rowData.username,
          password: rowData.password,
          role: rowData.role,
        },
      });
      if (res.data.message === "เพิ่มข้อมูลเรียบร้อยแล้ว") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: res.data.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      router.push("/employee");
    } catch (error) {
      console.log(error);
      if (error.response.data.error.status_code === 400) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: error.response.data.error.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      if (
        error.response.data.error.status_code === 401 &&
        error.response.data.error.message === "Unauthorized"
      ) {
        dispatch(signOut());
        localStorage.clear();
        router.push("/auth/login");
      }
    }
  };

  return (
    <Layout>
      <Grid container direction="row" spacing={2}>
        <Grid item xs={7}>
          <Paper sx={{ p: 5 }}>
            {" "}
            <Typography
              sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
            >
              เพิ่มพนักงาน
            </Typography>
            <Typography>ชื่อ-นามสกุล</Typography>
            <TextField
              name="info_name"
              type="text"
              fullWidth
              value={rowData.info_name || ""}
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Typography>Username</Typography>
            <TextField
              name="username"
              type="text"
              fullWidth
              value={rowData.username || ""}
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Typography>Password</Typography>
            <TextField
              name="password"
              type="password"
              fullWidth
              value={rowData.password || ""}
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Typography>ตำแหน่ง</Typography>
            <TextField
              select
              name="role"
              type="text"
              fullWidth
              value={rowData.role || ""}
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              placeholder="เลือกตำแหน่ง"
              sx={{ mb: 3 }}
            >
              <MenuItem selected disabled value>
                เลือกตำแหน่ง
              </MenuItem>
              <MenuItem value="SuperAdmin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Owner">Owner</MenuItem>
              <MenuItem value="Support">Support</MenuItem>
            </TextField>
            <Typography>prefix</Typography>
            <TextField
              name="prefix"
              type="text"
              fullWidth
              value={rowData.prefix || ""}
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => {}}
              >
                รีเซ็ท
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#41A3E3", color:"#ffff" }}
                onClick={() => addEmployee()}
              >
                ยืนยัน
              </Button>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Paper sx={{ p: 5 }}>
            <Typography
              sx={{ mb: 2, fontWeight: "bold", color: "#4CAEE3" }}
              variant="h6"
            >
              ตั้งค่าสิทธิ์การเข้าถึง
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Grid container direction="row">
                <Grid item xs={6}>
                  <FormControl
                    sx={{ m: 4 }}
                    component="fieldset"
                    variant="standard"
                    disabled
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="กราฟ"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={jason}
                            onChange={handleChange}
                            name="jason"
                          />
                        }
                        label="หน้าหลัก"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={antoine}
                            onChange={handleChange}
                            name="antoine"
                          />
                        }
                        label="รายชื่อพนักงาน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="สมาชิก"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={jason}
                            onChange={handleChange}
                            name="jason"
                          />
                        }
                        label="ถอนเงิน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={antoine}
                            onChange={handleChange}
                            name="antoine"
                          />
                        }
                        label="รายงานฝาก-ถอน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="โปรโมชัน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={jason}
                            onChange={handleChange}
                            name="jason"
                          />
                        }
                        label="เช็คข้อมูลลูกค้า"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={antoine}
                            onChange={handleChange}
                            name="antoine"
                          />
                        }
                        label="Bank"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={jason}
                            onChange={handleChange}
                            name="jason"
                          />
                        }
                        label="โอนเงินภายใน"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    sx={{ m: 4 }}
                    component="fieldset"
                    variant="standard"
                    disabled
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="Prefix"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={jason}
                            onChange={handleChange}
                            name="jason"
                          />
                        }
                        label="แก้ไขข้อผิดพลาด"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={antoine}
                            onChange={handleChange}
                            name="antoine"
                          />
                        }
                        label="รายชื่อมิจฉาชีพ"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="ฝากติดต่อ 7 วัน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={jason}
                            onChange={handleChange}
                            name="AFFILIATE"
                          />
                        }
                        label="AFFILIATE"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={antoine}
                            onChange={handleChange}
                            name="antoine"
                          />
                        }
                        label="ACTIVITIES LOGS"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={gilad}
                            onChange={handleChange}
                            name="gilad"
                          />
                        }
                        label="รายงานสรุป"
                      />
                    </FormGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default addEmployee;
