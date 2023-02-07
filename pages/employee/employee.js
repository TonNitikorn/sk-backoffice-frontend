import React, { useState, useEffect } from 'react'
import Layout from '../../theme/Layout'
import {
  Paper,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  DialogTitle,
  MenuItem,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
  Checkbox,
  FormControl,
  FormGroup,
  FormControlLabel,
  Chip,
  Card,
  CardContent
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import LoadingModal from "../../theme/LoadingModal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { signOut } from "../../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../store/store";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import MaterialTableForm from "../../components/materialTableForm"
import CircleIcon from '@mui/icons-material/Circle';
import VpnKeyIcon from '@mui/icons-material/VpnKey';


function employee() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [rowData, setRowData] = useState({})
  const [employee, setEmployee] = useState([])
  const [loading, setLoading] = useState(false);
  const [openEditData, setOpenEditData] = useState(false);
  const [confirmEditPassword, setConfirmEditPassword] = useState(false)
  const [newPassword, setNewPassword] = useState()
  const [employeeTotal, setEmployeeTotal] = useState({})
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

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const handleEditData = (item) => {
    setRowData(item);
    setState(item.preference)
    setOpenEditData({
      open: true,
      type: "edit",
    });

  }

  const handleChangePassword = () => {
    editPassword()
  }

  const getProfileAdmin = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "get",
        url: `${hostname}/admin/admin_list`,
      });

      let resData = res.data;

      let no = 1;
      let active_total = resData.filter(item => item.status === 'ACTIVE')
      let admin_total = resData.filter(item => item.role === 'ADMIN')
      let owner_total = resData.filter(item => item.role === 'OWNER')
      let support_total = resData.filter(item => item.role === 'SUPPORT')
      let superAdmin_total = resData.filter(item => item.role === "SUPERADMIN")

      resData.map((item) => {
        item.no = no++;
      });
      setEmployeeTotal({
        total: resData.length,
        active: active_total.length,
        admin: admin_total.length,
        owner: owner_total.length,
        support: support_total.length,
        superAdmin: superAdmin_total.length
      })
      setEmployee(resData);
      setLoading(false);
    } catch (error) {
      console.log(error);
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        dispatch(signOut());
        localStorage.clear();
        router.push("/auth/login");
      }
    }
  };

  const editEmployee = async () => {

    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/admin/update_admin_data`,
        data: {
          uuid: rowData.uuid,
          username: rowData.username,
          role: rowData.role,
          name: rowData.name,
          status: rowData.status,
          preference: state,
          tel: rowData.tel
        },
      });
      setOpenEditData(false);
      setNewPassword()
      setRowData({})
      if (res.data.message) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: res.data.message,
          showConfirmButton: false,
          timer: 3000,
        });
      }
      getProfileAdmin()
    } catch (error) {
      console.log(error);
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        dispatch(signOut());
        localStorage.clear();
        router.push("/auth/login");
      }
    }
  };

  const editPassword = async () => {
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/admin/update_admin_password`,
        data: {
          uuid: rowData.uuid
        }
      });
      setNewPassword(res.data.adminUpdate?.new_password)
      setConfirmEditPassword(false)
    } catch (error) {
      console.log(error);
      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        dispatch(signOut());
        localStorage.clear();
        router.push("/auth/login");
      }
    }
  };
  const columns = [
    {
      title: "สถานะ",
      field: "no",
      align: "center",
      render: (item) => {
        return (
          <>
            <Chip
              label={item.status === "ACTIVE" ? "เปิดใช้งาน" : "ปิดใช้งาน"}
              // size="small"
              style={{
                padding: 10,
                backgroundColor: item.status === "ACTIVE" ? "#129A50" : "#FFB946",
                color: "#fff",
                minWidth: "120px"
              }}
            />
          </>
        )

      }
    },

    {
      title: "ชื่อ - นามสกุล",
      align: "center",
      field: "name",
    },
    {
      title: "Username",
      align: "center",
      field: "username",
    },
    {
      title: "เบอร์โทร",
      align: "center",
      field: "tel",
    },

    {
      title: "ตำแหน่ง",
      align: "center",
      field: "role",
    },
    {
      title: "แก้ไข",
      align: "center",
      render: (item) => {
        return (
          <>
            <IconButton
              onClick={async () => {

                handleEditData(item)
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },

  ]

  useEffect(() => {
    getProfileAdmin()
  }, [])

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Grid
          container
          justifyContent="space-between"
          sx={{ mb: 5 }}
        >


          <Card sx={{ bgcolor: "#101D35", maxWidth: 200, width: 180, }}>
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                พนักงานทั้งหมด
              </Typography>
              <Typography variant="h5" sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}>
                {employeeTotal.total}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                คน
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: 180,
              bgcolor: "#101D35",
              maxWidth: 200,
            }}
          >
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                ใช้งานอยู่
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}
              >                  {employeeTotal.active}

              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                คน
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: 180,
              bgcolor: "#101D35",
              maxWidth: 200,
            }}
          >
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                Super Admin
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}
              >                  {employeeTotal.superAdmin}

                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                คน
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: 180,
              bgcolor: "#101D35",
              maxWidth: 200,
            }}
          >
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                Admin
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}
              >                  {employeeTotal.admin}

                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                คน
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: 180,
              bgcolor: "#101D35",
              maxWidth: 200,
            }}
          >
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                Owner
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}
              >                  {employeeTotal.owner}

                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                คน
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: 180,
              bgcolor: "#101D35",
              maxWidth: 200,
            }}
          >
            <CardContent>
              <Typography component="div" sx={{ color: "#eee" }}>
                SUPPORT
              </Typography>

              <Typography
                variant="h5"
                sx={{ textAlign: "center", color: "#41A3E3", mt: 2 }}
              >                  {employeeTotal.support}

                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
              </Typography>
              <Typography
                component="div"
                sx={{ color: "#eee", textAlign: "right" }}
              >
                คน
              </Typography>
            </CardContent>
          </Card>

        </Grid>

        <Grid container
          direction="row"
          justifyContent="space-between"
          alignItems="start">
            <Typography variant='h5'>รายชื่อพนักงาน</Typography>
          <Box>
            <Button
              variant='contained'
              onClick={() => router.push("/employee/addEmployee")}
              sx={{
                mr: "8px",
                my: 2,
                justifyContent: "flex-end",
                boxShadow: 1,
                background: "#41A3E3",
              }}>
              <PersonAddAltIcon sx={{ color: "white" }} />{" "}
              <Typography sx={{ color: "white", ml: 1 }}>
                เพิ่มรายชื่อพนักงาน
              </Typography>
            </Button>
          </Box>
        </Grid>
        <MaterialTableForm
          data={employee}
          columns={columns}
          pageSize="10"
        />
      </Paper>

      <Dialog
        open={openEditData.open}
        // onClose={() => setOpenEditData(false)}
        fullWidth
        maxWidth="lg">
        <DialogTitle>แก้ไขข้อมูลพนักงาน</DialogTitle>

        <DialogContent>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={5}>
              <TextField
                autoFocus
                margin="normal"
                name="username"
                value={rowData.username || ""}
                label="Username"
                type="text"
                size='small'
                fullWidth
                variant="outlined"
                disabled
              />
              <TextField
                autoFocus
                name="name"
                margin="normal"
                value={rowData.name || ""}
                size='small'
                label="ชื่อ"
                type="text"
                fullWidth
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
              />
              <TextField
                autoFocus
                name="tel"
                margin="normal"
                value={rowData.tel || ""}
                size='small'
                label="เบอร์โทรศัพท์"
                type="number"
                fullWidth
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
              />
              <TextField
                select
                name="role"
                margin="normal"
                type="text"
                value={rowData.role || ""}
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                placeholder="เลือกตำแหน่ง"
              >
                <MenuItem selected disabled value>
                  เลือกตำแหน่ง
                </MenuItem>
                <MenuItem value="SUPERADMIN">Super Admin</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="STAFF">Staff</MenuItem>
                <MenuItem value="OWNER">Owner</MenuItem>
                <MenuItem value="SUPPORT">Support</MenuItem>
              </TextField>
              <TextField
                name="status"
                type="text"
                margin="normal"
                value={rowData.status || ""}
                placeholder="สถานะ"
                label="สถานะ"
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
            </Grid>
            <Grid item xs={7}>
              <Paper sx={{ p: 3 }}>
                <Typography
                  sx={{ mb: 2, fontWeight: "bold", color: "#4CAEE3" }}
                  variant="h6"
                >
                  แก้ไขสิทธิ์การเข้าถึง
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Grid container direction="row">
                    <Grid item xs={4}>
                      <FormControl
                        // component="fieldset"
                        variant="standard"
                      >
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                // checked={grap}
                                defaultChecked={state?.grap || ""}

                              />
                            }
                            value={rowData.preference?.grap}
                            label="กราฟ"
                            onChange={handleChange}
                            name="grap"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.home}

                              />
                            }
                            label="หน้าหลัก"
                            onChange={handleChange}
                            name="home"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.admin_list}

                              />
                            }
                            label="รายชื่อพนักงาน"
                            onChange={handleChange}
                            name="admin_list"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.member}

                              />
                            }
                            label="สมาชิก"
                            onChange={handleChange}
                            name="member"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.whitdraw}

                              />
                            }
                            onChange={handleChange}
                            name="whitdraw"
                            label="ถอนเงิน"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.report}

                              />
                            }
                            label="รายงานสรุป"
                            onChange={handleChange}
                            name="report"
                          />
                        </FormGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl
                        component="fieldset"
                        variant="standard"

                      >
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.prefix}

                              />
                            }
                            label="Prefix"
                            onChange={handleChange}
                            name="prefix"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.editError}

                              />
                            }
                            label="แก้ไขข้อผิดพลาด"
                            onChange={handleChange}
                            name="editError"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.criminal_list}

                              />
                            }
                            label="รายชื่อมิจฉาชีพ"
                            onChange={handleChange}
                            name="criminal_list"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.deposit}

                              />
                            }
                            label="ฝากติดต่อ 7 วัน"
                            onChange={handleChange}
                            name="deposit"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.affiliate}

                              />
                            }
                            label="AFFILIATE"
                            onChange={handleChange}
                            name="affiliate"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={state?.activities_log}

                              />
                            }
                            label="ACTIVITIES LOGS"
                            onChange={handleChange}
                            name="activities_log"
                          />

                        </FormGroup>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={state?.reportWhitdrawDeposit}

                            />
                          }
                          label="รายงานฝาก-ถอน"
                          onChange={handleChange}
                          name="reportWhitdrawDeposit"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={state?.promotion}

                            />
                          }
                          label="โปรโมชัน"
                          onChange={handleChange}
                          name="promotion"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={state?.checkDataMember}

                            />
                          }
                          label="เช็คข้อมูลลูกค้า"
                          onChange={handleChange}
                          name="checkDataMember"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={state?.bank} />
                          }
                          label="Bank"
                          onChange={handleChange}
                          name="bank"
                        />
                        <FormControlLabel
                          control={
                            <Checkbox
                              defaultChecked={state?.transfer_money}
                            />
                          }
                          label="โอนเงินภายใน"
                          onChange={handleChange}
                          name="transfer_money"
                        />
                      </FormGroup>
                    </Grid>

                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Grid container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ mt: 3 }}>
            <Grid item xs={2}>

              <Button
                onClick={() => setConfirmEditPassword(true)}
                variant="contained"
                fullWidth
                sx={{ color: '#ffff', mt: 1 }}
              >
                <VpnKeyIcon sx={{ mr: 2 }} />
                เปลี่ยนรหัสผ่าน
              </Button>
            </Grid>
            <Grid item xs={5}>
              {newPassword ?
                <TextField
                  name="tel"
                  margin="normal"
                  value={newPassword || ""}
                  size='small'
                  label="รหัสผ่านใหม่"
                  type="text"
                  fullWidth
                  variant="outlined"
                  sx={{ ml: 2 }}
                /> : ''}



            </Grid>
            <Grid item xs={5} container justifyContent="end" >
              <Button onClick={() => setOpenEditData(false)} sx={{ mr: 4 }}>ยกเลิก</Button>
              <Button
                onClick={() => editEmployee()}
                variant="contained"
                sx={{ color: '#ffff' }}
              >
                ยืนยัน
              </Button>
            </Grid>

          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        open={confirmEditPassword}
        onClose={() => setConfirmEditPassword(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle >
          {"ท่านต้องการเปลี่ยนรหัสผ่าน?"}
        </DialogTitle>
        <DialogContent>
          <Typography>คุณต้องการเปลี่ยนรหัสผ่าน Username : {rowData.username}</Typography>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEditPassword(false)}>ยกเลิก</Button>

          <Button onClick={() => editPassword()} autoFocus variant="contained">
            <Typography sx={{ color: '#ffff' }}>ยืนยัน</Typography>
          </Button>
        </DialogActions>
      </Dialog>
      <LoadingModal open={loading} />

    </Layout>
  )
}

export default employee