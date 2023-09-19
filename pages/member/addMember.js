import React, { useState } from "react";
import Layout from '../../theme/Layout'
import {
  Grid,
  Button,
  TextField,
  Typography,
  CssBaseline,
  MenuItem,
  Switch,
  Paper
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import LoadingModal from "../../theme/LoadingModal";
import Swal from "sweetalert2";
import { signOut } from "../../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../../store/store";

function addMember() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rowData, setRowData] = useState()
  const [bonus, setBonus] = useState(true);

  const handleChangeBonus = (event) => {
    setBonus(event.target.checked);
  };

  const handleChangeData = async (e) => {
    setRowData({ ...rowData, [e.target.name]: e.target.value });
  };

  const editUser = async () => {
    setLoading(false);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "post",
        url: `${hostname}/member/create_member`,
        data: {
          // fname: rowData.fname,
          // lname: rowData.lname,
          name: `${rowData.fname} ${rowData.lname}`,
          tel: rowData.tel,
          // bonus: bonus,
          line_id: rowData.line_id,
          platform: rowData.platform,
          affiliate_by: rowData.platform === "friend" ? rowData.affiliate_by : '-',
          bank_number: rowData.bank_number,
          bank_name: rowData.bank_name,
          password: rowData.password
        },
      });

      if (res.data.message === "สร้างสมาชิกสำเร็จ") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "สร้างสมาชิกสำเร็จ",
          showConfirmButton: false,
          timer: 2000,
        });
        router.push('/memberTable')
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (
        error.response.data.error.message === "เบอร์โทรซ้ำ"
      ) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "หมายเลขโทรศัพท์นี้มีผู้ใช้แล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
      }

      if (
        error.response.data.error.message === "เลขบัญชีซ้ำ"
      ) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "เลขบัญชีธนาคารนี้มีผู้ใช้แล้ว",
          showConfirmButton: false,
          timer: 2000,
        });
      }

      if (
        error.response.data.error.message === "กรุณากรอกข้อมูลให้ครบถ้วน"
      ) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          showConfirmButton: false,
          timer: 2000,
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
      <CssBaseline />
      <Paper sx={{ p: 3 }}>
        <Typography
          sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
        >
          สมัครสมาชิกลูกค้า
        </Typography>

        <Grid container justifyContent="center" sx={{ mt: 3 }}>
          <Grid container spacing={2} >
            {/* <Grid container item xs={6}>
              <Typography>ชื่อ *</Typography>
              <TextField
                name="fname"
                type="text"
                value={rowData?.fname || ""}
                placeholder="ชื่อ"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            <Grid container item xs={6}>
              <Typography>นามสกุล *</Typography>
              <TextField
                name="lname"
                type="text"
                value={rowData?.lname || ""}
                placeholder="นามสกุล"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid> */}

            <Grid container item xs={6}>
              <Typography>หมายเลขโทรศัพท์*</Typography>
              <TextField
                name="tel"
                type="text"
                value={rowData?.tel || ""}
                placeholder="000-000-0000"
                fullWidth
                required
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>
            {/* <Grid container item xs={6}>
              <Typography>รหัสผ่าน*</Typography>
              <TextField
                name="password"
                type="text"
                value={rowData?.password || ""}
                placeholder="password"
                fullWidth
                required
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                inputProps={{ maxLength: 10 }}
              />
            </Grid> */}
            <Grid container item xs={6} /> 

            {/* <Grid container item xs={6}>
              <Typography>Line ID*</Typography>
              <TextField
                name="line_id"
                type="text"
                value={rowData?.line_id || ""}
                placeholder="Line ID"
                fullWidth
                required
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
                inputProps={{ maxLength: 10 }}
              />
            </Grid>

            <Grid container item xs={6} /> */}

            <Grid container item xs={6}>
              <Typography>โปรดเลือกบัญชีธนาคาร*</Typography>
              <TextField
                name="bank_name"
                type="text"
                value={rowData?.bank_name || ""}
                select
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              >
                <MenuItem selected disabled value>
                  เลือก ธนาคาร
                </MenuItem>
                <MenuItem value="kbnk">ธนาคารกสิกรไทย</MenuItem>
                <MenuItem value="truemoney">TrueMoney Wallet</MenuItem>
                <MenuItem value="ktb">ธนาคารกรุงไทย</MenuItem>
                <MenuItem value="scb">ธนาคารไทยพาณิชย์</MenuItem>
                <MenuItem value="bay">ธนาคารกรุงศรีอยุธยา</MenuItem>
                <MenuItem value="bbl">ธนาคารกรุงเทพ</MenuItem>
                <MenuItem value="gsb">ธนาคารออมสิน</MenuItem>
                <MenuItem value="ttb">ธนาคารทหารไทยธนชาต (TTB)</MenuItem>
                <MenuItem value="BAAC">
                  ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร
                </MenuItem>
                <MenuItem value="ICBC">ธนาคารไอซีบีซี (ไทย)</MenuItem>
                <MenuItem value="TCD">ธนาคารไทยเครดิตเพื่อรายย่อย</MenuItem>
                <MenuItem value="CITI">ธนาคารซิตี้แบงก์</MenuItem>
                <MenuItem value="SCBT">
                  ธนาคารสแตนดาร์ดชาร์เตอร์ด (ไทย)
                </MenuItem>
                <MenuItem value="CIMB">ธนาคารซีไอเอ็มบีไทย</MenuItem>
                <MenuItem value="UOB">ธนาคารยูโอบี</MenuItem>
                <MenuItem value="HSBC">ธนาคารเอชเอสบีซี ประเทศไทย</MenuItem>
                <MenuItem value="MIZUHO">ธนาคารมิซูโฮ คอร์ปอเรต</MenuItem>
                <MenuItem value="GHB">ธนาคารอาคารสงเคราะห์</MenuItem>
                <MenuItem value="LHBANK">ธนาคารแลนด์ แอนด์ เฮ้าส์</MenuItem>
                <MenuItem value="TISCO">ธนาคารทิสโก้</MenuItem>
                <MenuItem value="kkba">ธนาคารเกียรตินาคิน</MenuItem>
                <MenuItem value="IBANK">ธนาคารอิสลามแห่งประเทศไทย</MenuItem>
              </TextField>
            </Grid>

            <Grid container item xs={6}>
              <Typography>หมายเลขบัญชี*</Typography>
              <TextField
                name="bank_number"
                type="number"
                value={rowData?.bank_number || ""}
                placeholder="000-000-000"
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              />
            </Grid>

            <Grid container item xs={6}>
              <Typography>รู้จักเราผ่านช่องทางใด *</Typography>
              <TextField
                name="platform"
                type="text"
                value={rowData?.platform || ""}
                select
                fullWidth
                size="small"
                onChange={(e) => handleChangeData(e)}
                variant="outlined"
                sx={{ bgcolor: "white" }}
              >
                <MenuItem selected disabled value>
                  รู้จักเราผ่านช่องทางใด
                </MenuItem>
                <MenuItem value="google">Google</MenuItem>
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="instagram">Instagram</MenuItem>
                <MenuItem value="youtube">Youtube</MenuItem>
                <MenuItem value="twitter">Twitter</MenuItem>
                <MenuItem value="vk">VK</MenuItem>
                <MenuItem value="tiktok">Tiktok</MenuItem>
                <MenuItem value="facebook">Facebook</MenuItem>
                <MenuItem value="friend">เพื่อนแนะนำมา</MenuItem>
              </TextField>
            </Grid>

            {rowData?.platform === "friend" ?
              <Grid container item xs={6}>
                <Typography>แนะนำโดย *</Typography>
                <TextField
                  name="affiliate_by"
                  type="text"
                  value={rowData?.affiliate_by || ""}
                  placeholder="แนะนำโดย"
                  fullWidth
                  required
                  size="small"
                  onChange={(e) => handleChangeData(e)}
                  variant="outlined"
                  sx={{ bgcolor: "white" }}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid> :
              <Grid container item xs={6}> </Grid>

            }

            <Grid container item xs={6}>
              <Typography sx={{ mt: 1 }}>
                รับโบนัสจากการเติมเงินหรือไม่?
              </Typography>
              <Switch
                checked={bonus}
                onChange={handleChangeBonus}
                color="primary"
                inputProps={{ "aria-label": "controlled" }}
              />
            </Grid>


          </Grid>
          <Grid container justifyContent='center' spacing={1}>
            <Grid container item xs={4}>
              <Button
                // variant="outlined"
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                  if (!rowData) {
                    Swal.fire({
                      position: "center",
                      icon: "warning",
                      title: "กรุณากรอกข้อมูลให้ครบถ้วน",
                      showConfirmButton: false,
                      timer: 2000,
                    });
                  } else {
                    editUser();
                  }
                }}
                sx={{
                  mt: 3,
                  // background: "#129A50",
                  background: "linear-gradient(#0072B1, #41A3E3)" ,
                  color: '#fff',

                }}
              >
                ยืนยัน
              </Button>
            </Grid>

          </Grid>
        </Grid>
      </Paper>
      <LoadingModal open={loading} />
    </Layout>
  )
}

export default addMember