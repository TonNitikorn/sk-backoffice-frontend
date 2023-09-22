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
    const [roleList, setRoleList] = useState()
    const [permissionList, setPermissionList] = useState()
    const [checkedPermission, setCheckedPermission] = useState({})
    const [selectRole, setSelectRole] = useState([])

    const handleChangeData = async (e) => {
        setRowData({ ...rowData, [e.target.name]: e.target.value });
        if (e.target.name === "role") {
            let tempRole = roleList.filter(item => item.role_name === e.target.value)
            setSelectRole(tempRole)
        }

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

    const getRoleList = async () => {
        // setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/permission/role_list`,
            });
            let resData = res.data;

            setRoleList(resData)

            // setLoading(false);

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

    const getPermission = async () => {
        // setLoading(true);
        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "post",
                url: `${hostname}/permission/get_permission_list`,
            });
            let resData = res.data;

            setPermissionList(resData)

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

    const handleChangeCheck = (event) => {
        for (const item of permissionList) {
            if (event.target.name === item.menu) {
                item.view = event.target.checked
                // setSelectRole({
                //     ...selectRole,
                //     [event.target.name]: event.target.checked,
                // });
                setCheckedPermission({
                    ...checkedPermission,
                    [event.target.name]: event.target.checked,
                });
            }

            if (item.sub_menu !== null) {
                for (const sub of item.sub_menu) {
                    if (event.target.name === sub.sub_menu_name) {
                        sub.sub_menu_active = event.target.checked
                        // setSelectRole({
                        //     ...selectRole,
                        //     [event.target.name]: event.target.checked,
                        // });
                        setCheckedPermission({
                            ...checkedPermission,
                            [event.target.name]: event.target.checked,
                        });
                    }

                }
            }

        }
    }

    console.log('selectRole', selectRole[0]?.permission)
    console.log('checkedPermission', checkedPermission)



    useEffect(() => {
        getRoleList()
        getPermission()
    }, [])


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
                            {roleList?.map((item) => (
                                <MenuItem value={item.role_name}>{item.role_name}</MenuItem>
                            ))}

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
                                <Grid item xs={12}>
                                    <FormControl
                                        sx={{ m: 2 }}
                                        component="fieldset"
                                        variant="standard"
                                    >
                                        <FormGroup column>
                                            {rowData.role ?
                                                selectRole[0]?.permission.map((item, index) => (
                                                    <>
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={checkedPermission[item.menu] || item.view}
                                                                    onChange={handleChangeCheck}
                                                                    name={item.menu}
                                                                />
                                                            }
                                                            label={item.menu === "dashboard" ? "Dashboard"
                                                                : item.menu === "home" ? "รายการเดินบัญชี"
                                                                    : item.menu === "member_table" ? "จัดการเครดิต/ข้อมูลลูกค้า"
                                                                        : item.menu === "withdraw_pending" ? "จัดการข้อมูลการถอน"
                                                                            : item.menu === "withdraw" ? "สร้างรายการถอน"
                                                                                : item.menu === "add_member" ? "สมัครสมาชิกลูกค้า"
                                                                                    : item.menu === "info_member" ? "ตรวจสอบข้อมูลลูกค้า"
                                                                                        : item.menu === "bank_account" ? "บัญชีธนาคาร"
                                                                                            : item.menu === "bank_deposit" ? "บัญชีธนาคารสําหรับฝาก"
                                                                                                : item.menu === "bank_withdraw" ? "บัญชีธนาคารสําหรับถอน"
                                                                                                    : item.menu === "employee" ? "รายชื่อพนักงาน"
                                                                                                        : item.menu === "report_deposit" ? "รายงานการฝาก"
                                                                                                            : item.menu === "report_withdraw" ? "รายงานการถอน"
                                                                                                                : item.menu === "report_cutcredit" ? "รายงานการตัดเครดิต"
                                                                                                                    : item.menu === "report_addcredit" ? "รายงานการเติมเครดิต"
                                                                                                                        : 'test'}
                                                        />
                                                        {item.sub_menu !== null ?
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                                                {item.sub_menu.map((subMenu) => (<>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={checkedPermission[subMenu.sub_menu_name] || subMenu.sub_menu_active}
                                                                                onChange={handleChangeCheck}
                                                                                name={subMenu.sub_menu_name}
                                                                            />}
                                                                        label={subMenu.sub_menu_name === "approve_home" ? "อนุมัติการฝากผิดบัญชี"
                                                                            : subMenu.sub_menu_name === "edit_member" ? "แก้ไขข้อมูลลูกค้า"
                                                                                : subMenu.sub_menu_name === "manage_withdraw" ? "เติมเครดิต"
                                                                                    : subMenu.sub_menu_name === "manage_deposit" ? "ถอนเครดิต"
                                                                                        : subMenu.sub_menu_name === "manage_role_permission" ? "ตั้งค่าสิทธ์การเข้าถึง"
                                                                                            : subMenu.sub_menu_name === "edit_employee" ? "แก้ไข"
                                                                                                : subMenu.sub_menu_name === "edit_pass_employee" ? "เปลี่ยนรหัสพนักงาน"
                                                                                                    : subMenu.sub_menu_name === "add_employee" ? "เพิ่มพนักงาน"
                                                                                                        : subMenu.sub_menu_name === "manage_bank" ? "จัดการบัญชีธนาคาร"
                                                                                                            : subMenu.sub_menu_name === "manage_bank_withdraw" ? "จัดการบัญชีธนาคารถอน"
                                                                                                                : subMenu.sub_menu_name === "manage_bank_deposit" ? "จัดการบัญชีธนาคารฝาก"
                                                                                                                    : subMenu.sub_menu_name === "approve_withdraw" ? "อนุมัติการถอน"
                                                                                                                        : ''}
                                                                    />
                                                                </>))}
                                                            </Box>
                                                            : ''}
                                                    </>
                                                ))
                                                : permissionList?.map((item, index) => (
                                                    <>
                                                        <FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={checkedPermission[item.menu] || false}
                                                                    onChange={handleChangeCheck}
                                                                    name={item.menu}
                                                                />
                                                            }
                                                            label={item.menu === "dashboard" ? "Dashboard"
                                                                : item.menu === "home" ? "รายการเดินบัญชี"
                                                                    : item.menu === "member_table" ? "จัดการเครดิต/ข้อมูลลูกค้า"
                                                                        : item.menu === "withdraw_pending" ? "จัดการข้อมูลการถอน"
                                                                            : item.menu === "withdraw" ? "สร้างรายการถอน"
                                                                                : item.menu === "add_member" ? "สมัครสมาชิกลูกค้า"
                                                                                    : item.menu === "info_member" ? "ตรวจสอบข้อมูลลูกค้า"
                                                                                        : item.menu === "bank_account" ? "บัญชีธนาคาร"
                                                                                            : item.menu === "bank_deposit" ? "บัญชีธนาคารสําหรับฝาก"
                                                                                                : item.menu === "bank_withdraw" ? "บัญชีธนาคารสําหรับฝาก"
                                                                                                    : item.menu === "employee" ? "รายชื่อพนักงาน"

                                                                                                        : item.menu === "report_deposit" ? "รายงานการฝาก"
                                                                                                            : item.menu === "report_withdraw" ? "รายงานการถอน"
                                                                                                                : item.menu === "report_cutcredit" ? "รายงานการตัดเครดิต"
                                                                                                                    : item.menu === "report_addcredit" ? "รายงานการเติมเครดิต"



                                                                                                                        : ''}
                                                        />
                                                        {item.sub_menu !== null ?
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                                                {item.sub_menu.map((subMenu) => (<>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Checkbox
                                                                                checked={checkedPermission[subMenu.sub_menu_name] || false}
                                                                                onChange={handleChangeCheck}
                                                                                name={subMenu.sub_menu_name}
                                                                            />}
                                                                        label={subMenu.sub_menu_name === "dashboard" ? "Dashboard"
                                                                            : subMenu.sub_menu_name === "approve_home" ? "อนุมัติการฝากผิดบัญชี"
                                                                                : subMenu.sub_menu_name === "edit_member" ? "แก้ไขข้อมูลลูกค้า"
                                                                                    : subMenu.sub_menu_name === "manage_withdraw" ? "เติมเครดิต"
                                                                                        : subMenu.sub_menu_name === "manage_deposit" ? "ถอนเครดิต"
                                                                                            : subMenu.sub_menu_name === "manage_role_permission" ? "ตั้งค่าสิทธ์การเข้าถึง"
                                                                                                : subMenu.sub_menu_name === "edit_employee" ? "แก้ไข"
                                                                                                    : subMenu.sub_menu_name === "edit_pass_employee" ? "เปลี่ยนรหัสพนักงาน"
                                                                                                        : subMenu.sub_menu_name === "add_employee" ? "เพิ่มพนักงาน"
                                                                                                            : subMenu.sub_menu_name === "manage_bank" ? "จัดการบัญชีธนาคาร"
                                                                                                                : subMenu.sub_menu_name === "manage_bank_withdraw" ? "จัดการบัญชีธนาคารถอน"
                                                                                                                    : subMenu.sub_menu_name === "manage_bank_deposit" ? "จัดการบัญชีธนาคารฝาก"
                                                                                                                        : subMenu.sub_menu_name === "approve_withdraw" ? "อนุมัติการถอน"
                                                                                                                            : ''}
                                                                    />
                                                                </>))}
                                                            </Box>
                                                            : ''}
                                                    </>
                                                ))}

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