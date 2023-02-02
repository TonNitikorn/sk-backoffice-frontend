import React, { useState, useEffect } from "react";
import Layout from "../theme/Layout";
import { Grid, Typography, TextField, Paper, Button } from "@mui/material";
import hostname from "../utils/hostname";
import axios from "axios";
import Swal from "sweetalert2";
import withAuth from "../routes/withAuth";
import LoadingModal from "../theme/LoadingModal";
import Avatar from '@mui/material/Avatar';

function profile() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChangeData = async (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const getProfile = async (type, start, end) => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "get",
        url: `${hostname}/api/user/profile`,
      });
      let resData = res.data.data;

      setData(resData);
      setLoading(false);
    } catch (error) {
      // if (
      //   error.response.data.error.status_code === 401 &&
      //   error.response.data.error.message === "Unauthorized"
      // ) {
      //   dispatch(signOut());
      //   localStorage.clear();
      //   router.push("/auth/login");
      // }
      console.log(error);
    }
  };

  const editProfile = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "put",
        url: `${hostname}/api/user/${data.uuid}`,
        data: {
          info_name: data.info_name,
          password: data.password,
          uuid: data.uuid,
        },
      });

      if (res.data.message === "แก้ไขข้อมูลเรียบร้อย") {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "อัพเดทข้อมูลเรียบร้อย",
          showConfirmButton: false,
          timer: 2000,
        });
        getProfile();
        setLoading(false);
      }
    } catch (error) {
      if (
        error.response.data.error.status_code === 401 &&
        error.response.data.error.message === "Unauthorized"
      ) {
        dispatch(signOut());
        localStorage.clear();
        router.push("/auth/login");
      }

      console.log(error);
    }
  };

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }

  useEffect(() => {
    // getProfile();
  }, []);

  return (
    <Layout>
      <Paper sx={{ p: 3 }}>
        <Typography
          sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
        >
          ข้อมูลแอดมิน
        </Typography>
        <Grid container
          direction="row"
          justifyContent="center"
          alignItems="center">
          <Grid item  >
            <Avatar {...stringAvatar('Aent Dodds')} sx={{ width: 100, height: 100 }} />
          </Grid>
        </Grid>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item xs={8}>
            <Typography sx={{ mt: 2 }}>ชื่อ: (Info) *</Typography>
            <TextField
              name="info_name"
              type="text"
              value={data.info_name || ""}
              placeholder="ชื่อ"
              fullWidth
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={8}>
            <Typography sx={{ mt: 2 }}>Password: *</Typography>
            <TextField
              name="password"
              type="text"
              value={data.password || ""}
              placeholder="Password"
              fullWidth
              size="small"
              onChange={(e) => handleChangeData(e)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} container justifyContent="center">
            <Grid item xs={3}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => editProfile()}
                sx={{
                  mt: 3,
                }}
              >
                <Typography sx={{ color: '#ffff' }}>ยืนยัน</Typography>

              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
      <LoadingModal open={loading} />
    </Layout>
  );
}

export default withAuth(profile);
