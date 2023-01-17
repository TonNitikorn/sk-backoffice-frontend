import React, {useState,useEffect} from 'react'
import Layout from '../../theme/Layout'
import {
  Paper,
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Dialog,
  TextField,
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




function employee() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [rowData, setRowData] = useState({})
  const [employee, setEmployee] = useState([])
  const [loading, setLoading] = useState(false);

  const getProfileAdmin= async () => {
    // setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/admin/admin_profile`,
      });
      let data = []
      let resData = res.data;
      data.push(resData)
      let no = 1;
      data.map((item) => {
        item.no = no++;
      });
      setEmployee(data);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // if (
      //   error.response.data.error.status_code === 401 &&
      //   error.response.data.error.message === "Unauthorized"
      // ) {
      //   dispatch(signOut());
      //   localStorage.clear();
      //   router.push("/auth/login");
      // }
    }
  };
  useEffect(() => {
    getProfileAdmin()
  }, [])
  console.log('employee', employee)
  
  const columns = [
    {
      title: "ลำดับที่",
      field: "no",
      align: "center",
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
                setRowData(item);
                setOpenDialogAdd({
                  open: true,
                  type: "edit",
                });
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      },
    },
    {
      title: "ลบ", field: "availability", align: "center",
      render: (item) => {
        return (
          <>
            <IconButton
              onClick={async () => {
                Swal.fire({
                  title: "ยืนยันการลบข้อมูล",
                  icon: "info",
                  showCancelButton: true,
                  cancelButtonColor: "#EB001B",
                  confirmButtonColor: "#129A50",
                  cancelButtonText: "ยกเลิก",
                  confirmButtonText: "ยืนยัน",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    try {
                      let res = await axios({
                        headers: {
                          Authorization:
                            "Bearer " +
                            localStorage.getItem("access_token"),
                        },
                        method: "Post",
                        url: `${hostname}/bank/delete_bank`,
                        data: {
                          uuid: item.uuid
                        }
                      });
                      if (
                        res.data.message === "ลบบัญชีธนาคารสำเร็จ"
                      ) {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "ลบบัญชีธนาคารสำเร็จ",
                          showConfirmButton: false,
                          timer: 2000,
                        });
                        getBank();
                      }
                    } catch (error) {
                      console.log(error);
                    }
                  }
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ]

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Grid container
          direction="row"
          justifyContent="end"
          alignItems="center">
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
                สร้าง Member
              </Typography>
            </Button>
          </Box>

        </Grid>

        <MaterialTableForm
          data={employee}
          columns={columns}
          pageSize="10"
          title="รายชื่อลูกค้า"
        />
      </Paper>
      <LoadingModal open={loading} />

    </Layout>
  )
}

export default employee
