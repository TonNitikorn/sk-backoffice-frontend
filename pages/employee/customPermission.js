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
    IconButton,
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import Swal from "sweetalert2";
import withAuth from "../../routes/withAuth";
import { useRouter } from "next/router";
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';

function customPermission() {
    const router = useRouter()
    const [rowData, setRowData] = useState({});
    const [boxRole, setBoxRole] = useState(false)
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
            <Paper sx={{ p: 5 }}>
                <Grid container direction="row" spacing={5}>
                    <Grid item xs={5}>
                        <Grid
                            container
                            justifyContent="flex-start"
                            direction="row"
                        >
                            <SettingsIcon sx={{ mr: 1 }} />
                            <Typography
                                sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
                            >
                                ตั้งค่าสิทธ์การเข้าถึง
                            </Typography>
                        </Grid>
                        <Typography sx={{ mt: 3 }}>ตำแหน่ง</Typography>
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

                        <Grid item xs={12} container direction="row">


                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="start">
                            <Button onClick={() => {
                                setBoxRole(true)
                            }}>
                                <SettingsIcon sx={{ mr: 1 }} />
                                <Typography> เพิ่มตำแหน่ง</Typography>
                            </Button>
                            <IconButton onClick={() => {
                                setBoxRole(false)
                            }}>
                                <CloseIcon sx={{ fontSize: '30px' }} />
                            </IconButton>
                        </Grid>

                        {boxRole ?
                            <Box sx={{ mt: 2 }}>
                                <Typography>ชื่อตำแหน่งที่ต้องการเพิ่ม</Typography>
                                <TextField
                                    name="role"
                                    type="text"
                                    fullWidth
                                    placeholder="ชื่อตำแหน่งที่ต้องการเพิ่ม"
                                    value={rowData.role || ""}
                                    size="small"
                                    onChange={(e) => handleChangeData(e)}
                                    variant="outlined"
                                    sx={{ mb: 3 }}
                                />



                            </Box>
                            : ''}


                    </Grid>

                    <Grid item xs={7}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="start">
                            <Typography
                                sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px", mb: 3 }}
                            >
                                สิทธิ์การเข้าถึง
                            </Typography>

                            <IconButton onClick={() => router.push("/employee/addEmployee")}>
                                <CloseIcon sx={{ fontSize: '30px' }} />
                            </IconButton>
                        </Grid>

                        <Box sx={{ display: "flex" }}>
                            <Grid container direction="row">
                                <Grid item xs={4}>
                                    <FormControl
                                        sx={{ m: 2 }}
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
                                <Grid item xs={4}>
                                    <FormControl
                                        sx={{ m: 2 }}
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
                                                label="จัดการหน้าเว็บ"
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
                                <Grid item xs={4}>
                                    <FormControl
                                        sx={{ m: 2 }}
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
                                                label="จัดการหน้าเว็บ"
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

                    </Grid>
                    <Grid
                        container
                        direction="row"
                        justifyContent="flex-end"
                        sx={{ mt: 5 }}
                    >

                        <Grid
                            container
                            item md={3}
                        >
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ bgcolor: "#41A3E3", color: "#ffff" }}
                                onClick={() => addEmployee()}
                            >
                                บันทึก
                            </Button>
                        </Grid>
                        </Grid>

                    </Grid>

            </Paper>
        </Layout>
    )
}

export default customPermission