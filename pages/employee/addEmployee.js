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
import { useRouter } from "next/router";

function addEmployee() {
  const router = useRouter()

  const [rowData, setRowData] = useState({});
  const [state, setState] = useState({
    grap: false,
    home: false,
    member: false,
    whitdraw: false,
    reportWhitdrawDeposit: false,
    promotion: false,
    checkDataMember: false,
    bank: false,
    prefix: false,
    transfer_money: false,
    editError: false,
    criminal_list: false,
    deposit: false,
    affiliate: false,
    activities_log: false,
    report: false,
    admin_list: false,
  });

  const { grap, home, member, whitdraw, reportWhitdrawDeposit,
    promotion, checkDataMember, bank, prefix, transfer_money, editError,
    criminal_list, deposit, affiliate, activities_log, report, admin_list } = state;

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };



  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  // console.log('state', state)

  const addEmployee = async () => {
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/admin/register`,
        data: {
          name: rowData.name,
          username: rowData.username,
          password: rowData.password,
          role: rowData.role,
          tel: rowData.tel,
          status: rowData.status,
          preference: state
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
      router.push("/employee/employee");
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
              name="name"
              type="text"
              fullWidth
              value={rowData.name || ""}
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Typography>เบอร์โทรศัพท์</Typography>
            <TextField
              name="tel"
              type="number"
              fullWidth
              value={rowData.tel || ""}
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
            
            <Typography>สถานะ</Typography>
            <TextField
              name="status"
              type="text"
              value={rowData.status || ""}
              placeholder="ชื่อ"
              fullWidth
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
              sx={{ mb: 3 }}
              select
            >
              <MenuItem selected disabled value>
                เลือกสถานะ
              </MenuItem>
              <MenuItem value="ACTIVE">เปิดใช้งาน</MenuItem>
              <MenuItem value="INACTIVE">ปิดใช้งาน</MenuItem>
            </TextField>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => { setRowData({}) }}
              >
                รีเซ็ท
              </Button>

              <Button
                variant="contained"
                sx={{ bgcolor: "#41A3E3", color: "#ffff" }}
                onClick={() => addEmployee()}
              >
                ยืนยัน
              </Button>
            </Grid>
          </Paper>
        </Grid>

        {/* preference */}

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

                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={grap}
                            onChange={handleChange}
                            name="grap"
                          />
                        }
                        label="กราฟ"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={home}
                            onChange={handleChange}
                            name="home"
                          />
                        }
                        label="หน้าหลัก"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={admin_list}
                            onChange={handleChange}
                            name="admin_list"
                          />
                        }
                        label="รายชื่อพนักงาน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={member}
                            onChange={handleChange}
                            name="member"
                          />
                        }
                        label="สมาชิก"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={whitdraw}
                            onChange={handleChange}
                            name="whitdraw"
                          />
                        }
                        label="ถอนเงิน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={reportWhitdrawDeposit}
                            onChange={handleChange}
                            name="reportWhitdrawDeposit"
                          />
                        }
                        label="รายงานฝาก-ถอน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={promotion}
                            onChange={handleChange}
                            name="promotion"
                          />
                        }
                        label="โปรโมชัน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkDataMember}
                            onChange={handleChange}
                            name="checkDataMember"
                          />
                        }
                        label="เช็คข้อมูลลูกค้า"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={bank}
                            onChange={handleChange}
                            name="bank"
                          />
                        }
                        label="Bank"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={transfer_money}
                            onChange={handleChange}
                            name="transfer_money"
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

                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={prefix}
                            onChange={handleChange}
                            name="prefix"
                          />
                        }
                        label="Prefix"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={editError}
                            onChange={handleChange}
                            name="editError"
                          />
                        }
                        label="แก้ไขข้อผิดพลาด"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={criminal_list}
                            onChange={handleChange}
                            name="criminal_list"
                          />
                        }
                        label="รายชื่อมิจฉาชีพ"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={deposit}
                            onChange={handleChange}
                            name="deposit"
                          />
                        }
                        label="ฝากติดต่อ 7 วัน"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={affiliate}
                            onChange={handleChange}
                            name="affiliate"
                          />
                        }
                        label="AFFILIATE"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={activities_log}
                            onChange={handleChange}
                            name="activities_log"
                          />
                        }
                        label="ACTIVITIES LOGS"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={report}
                            onChange={handleChange}
                            name="report"
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
