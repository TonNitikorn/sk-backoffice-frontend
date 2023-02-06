import React, { useState, useEffect } from "react";
import Layout from '../theme/Layout'
import {
  Grid,
  Button,
  TextField,
  Typography,
  CssBaseline,
  MenuItem,
  Paper,
  IconButton, Box, AppBar, Container, Toolbar, Tooltip, Avatar
} from "@mui/material";
import LoadingModal from "../theme/LoadingModal";
import Swal from "sweetalert2";
import { signOut } from "../store/slices/userSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "../store/store";
import Image from "next/image";
import AddIcon from '@mui/icons-material/Add';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import axios from "axios";
import hostname from "../utils/hostname";
import ClearIcon from '@mui/icons-material/Clear';

function manageWebPages() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rowData, setRowData] = useState({})
  const [prefix, setPrefix] = useState({});
  const [gameType, setGameType] = useState([])
  const [subGameType, setSubGameType] = useState([])
  const [banner, setBanner] = useState([])
  const [logo, setLogo] = useState([])
  const [slide, setSlide] = useState([])
  const [render, setRender] = useState(false)

  const uploadFile = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      setPrefix({
        ...prefix,
        logo: reader.result,
        bg: reader.result,
        bandner: reader.result,
      });

    };
    reader.readAsDataURL(file);
  };

  const uploadBanner = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      banner.push({
        img_url: reader.result,
        type: "banner",
        file: file
      })
      setRender(!render)
    };
    reader.readAsDataURL(file);
  };


  const uploadLogo = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      logo.push({
        img_url: reader.result,
        type: "logo",
      })
      setRender(!render)

    };
    reader.readAsDataURL(file);
  };

  const uploadSlide = async (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onloadend = () => {
      slide.push({
        img_url: reader.result,
        type: "slide",
      })
      setRender(!render)
    };
    reader.readAsDataURL(file);
  };


  const getGameType = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "get",
        url: `${hostname}/upload/get_game_type`,
      });

      let resData = res.data;
      // console.log('resData', resData[0].sub_game_type)
      setGameType(resData)
      setSubGameType(resData[0].sub_game_type)
      setLoading(false);
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
    }
  };

  const getAssets = async () => {
    setLoading(true);
    try {
      let res = await axios({
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        method: "get",
        url: `${hostname}/web_setting/get_web_setting`,
      });

      let resData = res.data;
      let banner = resData.filter((item) => item.type === "banner")
      let logo = resData.filter((item) => item.type === "logo")
      let slide = resData.filter((item) => item.type === "slide")
      setBanner(banner)
      setLogo(logo)
      setSlide(slide)

      setLoading(false);
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
    }
  };

  const uploadAssets = async (type) => {
    setLoading(true);
    try {
      const tempBanner = banner.filter(item => !item.uuid)
      for (const item of tempBanner) {
        const formData = new FormData();
        formData.append("upload", item.file);
        formData.append("type", type);

        let res = await axios({
          headers: {
            Authorization: "Bearer " + localStorage.getItem("TOKEN"),
          },
          method: "post",
          url: `${hostname}/web_setting/create_web_setting_img_url`,
          data: formData,
        });

      }

      setLoading(false);

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

  }

  useEffect(() => {
    getGameType()
    getAssets()
  }, [])

  return (
    <Layout>
      <CssBaseline />
      <Grid container justifyContent="space-between">
        <Grid
          sx={{
            mt: 2,
            width: "49%",
            // maxHeight: "800px",
            overflow: "auto",
          }}
        >
          <>
            <Paper sx={{ p: 2 }}>
              <Typography
                sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
              >
                จัดการหน้าเว็บ
              </Typography>
              <Grid item xs={12} container sx={{ mb: 2 }}>
                <Typography sx={{ mt: 2, mr: 2, fontSize: '20px' }}>โลโก้ </Typography>
                <Typography sx={{ mt: 2, color: '#41A3E3' }}>* (ขนาดรูป 2560 x 1440 pixels)</Typography>
                <TextField
                  required
                  sx={{ bgcolor: "white" }}
                  fullWidth
                  size="large"
                  type="file"
                  onChange={uploadLogo}
                />
              </Grid>
              {/* <Grid item xs={5} sx={{ mt: 5 }}>
                <Image alt="logo" src={prefix.logo} width={100} height={80} />
              </Grid> */}
              <Grid item xs={4} container>
                <Grid container sx={{ bgcolor: '#eee', pl: 2, mb: 1, borderRadius: '10px' }}>

                  <img src={logo[0]?.img_url} width={150} height={100} />

                </Grid>

              </Grid>
              <Grid container justifyContent='flex-end' spacing={1}>
                <Grid container item xs={3}>
                  <Button
                    color="secondary"
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      console.log('รีเซ็ต')
                    }}
                    sx={{ mt: 3 }}
                  >
                    รีเซ็ต
                  </Button>
                </Grid>
                <Grid container item xs={3}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => {
                      setOpenDialogEdit(false)
                    }}
                    sx={{ mt: 3, color: '#fff', }}
                  >
                    ยืนยัน
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, mt: 1, }}>
              <Grid item xs={12} container sx={{ mb: 2 }}>
                <Typography sx={{ mt: 2, mr: 2, fontSize: '20px' }}>Banner </Typography>
                <Typography sx={{ mt: 2, color: '#41A3E3' }}>* (ขนาดรูป 1900 x 498)</Typography>
                <TextField
                  required
                  sx={{ bgcolor: "white" }}
                  fullWidth
                  size="large"
                  type="file"
                  onChange={uploadBanner}
                />
              </Grid>
              <Grid item xs={12} container >
                {banner.map((item, index) => (
                  <>
                    <img src={item.img_url} width={350} height={130} style={{ borderRadius: '5px' }} />
                    <IconButton sx={{ mb: 15, ml: 1, mr: 2, bgcolor: '#fff', boxShadow: '2px 2px 10px #C3C1C1' }}
                      onClick={() => {
                        banner.splice(index, 1)
                        setRender(!render)
                      }} >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </>
                ))}
              </Grid>
              <Grid container justifyContent='flex-end' spacing={1}>
                <Grid container item xs={3}>
                  <Button
                    color="secondary"
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      console.log('รีเซ็ต')
                    }}
                    sx={{ mt: 3 }}
                  >
                    รีเซ็ต
                  </Button>
                </Grid>
                <Grid container item xs={3}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => {
                      uploadAssets("banner")
                    }}
                    sx={{ mt: 3, color: '#fff', }}
                  >
                    ยืนยัน
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            <Grid item xs={12} container>
              <Typography sx={{ mt: 2, mr: 2, fontSize: '20px' }}>Slide </Typography>
              <Typography sx={{ mt: 2, color: '#41A3E3' }}>* (ขนาดรูป 1400 x 900 pixels)</Typography>
              <TextField
                required
                sx={{ bgcolor: "white" }}
                fullWidth
                size="large"
                type="file"
                onChange={uploadSlide}
              />
            </Grid>
            {/* <Grid item xs={5} sx={{ mt: 5 }}>
                <Image alt="logo" src={prefix.logo} width={100} height={80} />
              </Grid> */}
            <Grid item xs={12} container>
              {slide.map((item, index) => (
                <>
                  <img src={item.img_url} width={180} height={80} style={{ borderRadius: '5px' }} />
                  <IconButton sx={{ mb: 15, ml: 1, mr: 2, bgcolor: '#fff', boxShadow: '2px 2px 10px #C3C1C1' }}
                    onClick={() => {
                      slide.splice(index, 1)
                      setRender(!render)
                    }} >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </>
              ))}
            </Grid>

            <Grid item xs={6}>
              <Typography sx={{ mt: 2 }}>ประเภทเกม *</Typography>
              <TextField
                required
                sx={{ bgcolor: "white" }}
                fullWidth
                size="large"
                type="file"
                onChange={uploadFile}
              />
            </Grid>
            <Grid item xs={5} sx={{ mt: 5 }}>
              <Image alt="logo" src={prefix.logo} width={100} height={80} />
            </Grid>
          </>
        </Grid>

        <Paper
          sx={{
            p: 2,
            mt: 2,
            width: "49%",
            maxHeight: "800px",
            overflow: "auto",
          }}
        >
          <Typography
            sx={{ fontSize: "24px", textDecoration: "underline #41A3E3 3px" }}
          >
            ตัวอย่างหน้าเว็บ
          </Typography>
          <>
            <Grid container justifyContent="center" >

              <Grid item xs={6} sx={{ mt: 1, bgcolor: '#eee', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: 900 }} >
                <Box sx={{
                  bgcolor: '#41A3E3', width: '100%',
                  height: 50,
                  borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px'
                }} >
                  <Box sx={{ pl: 2, pt: 1 }}>
                    {/* <Image alt="banner" src={logo_angpao_white} width={40} height={30} /> */}
                    <img src={logo[0]?.img_url} width={40} height={30} />
                  </Box>

                  <Box sx={{ mt: 2, mb: 1, px: 1 }}>
                    <Swiper
                      // spaceBetween={30}
                      // centeredSlides={true}
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                      }}
                      // pagination={{
                      //   clickable: true,
                      // }}

                      modules={[Autoplay, Pagination, Navigation]}
                      className="mySwiper"
                    >
                      {banner?.map((item) => (
                        <SwiperSlide>
                          <Box >
                            <img src={item.img_url} width={350} height={130} style={{ borderRadius: '5px' }} />
                            {/* <Image alt="banner" src={item.img_url} width={350} height={120} /> */}
                          </Box>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Box>

                  <Box sx={{ my: 1, mx: 1 }}>
                    <Swiper
                      loop={true}
                      spaceBetween={10}
                      slidesPerView={3}
                      loopFillGroupWithBlank={true}
                      freeMode={true}
                      watchSlidesProgress={true}
                      autoplay={{
                        delay: 500,
                        disableOnInteraction: false,
                      }}
                      modules={[FreeMode, Navigation, Thumbs, Autoplay]}
                      className="mySwiper"
                    >
                      {slide.map((item) => (
                        <SwiperSlide>
                          <Box >
                            <img src={item.img_url} width={115} height={65} style={{ borderRadius: '5px' }} />
                            {/* <Image alt="banner" src={item} width={115} height={65} /> */}
                          </Box>

                        </SwiperSlide>

                      ))}
                    </Swiper>
                  </Box>

                  <Box sx={{ m: 1, mb: 8 }}>
                    <Grid container>
                      <Grid item xs={3} container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                      // sx={{ bgcolor: 'red' }}
                      >
                        {gameType.map((item) => (
                          <>
                            <Button
                              // fullWidth
                              sx={{ mt: 1, height: '80px', width: '90%', borderRadius: '20px' }}
                              // sx={{ mt: 1 }}

                              onClick={() => {
                                console.log('item.sub_game_type', item.sub_game_type)
                                setSubGameType(item.sub_game_type)

                              }}
                            >
                              <Box >
                                {/* <Image alt="game type" src={item.type_logo} width={120} height={65} /> */}
                                <img src={item.type_logo} width={80} height={80} style={{ borderRadius: '20px' }} />
                              </Box>
                            </Button>

                          </>
                        ))}

                      </Grid>
                      <Grid item xs={9}
                        justifyContent="center"
                        alignItems="flex-start"
                      >
                        {subGameType.map((item) => (
                          <Button
                            // fullWidth
                            sx={{ mt: 1, mr: "2px", height: '70px', width: '49%' }}
                            onClick={() => handelAddData()}
                          >
                            <img src={item.game_icon} width={125} height={75} style={{ borderRadius: '5px' }} />

                          </Button>
                        ))}

                      </Grid>


                    </Grid>

                  </Box>

                </Box>
              </Grid>

            </Grid>
          </>
        </Paper>
      </Grid>


      <LoadingModal open={loading} />

    </Layout>


  )
}

export default manageWebPages