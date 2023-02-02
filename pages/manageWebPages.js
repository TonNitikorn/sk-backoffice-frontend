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
import logo_angpao from "../assets/logo_ap.png"
import logo_angpao_white from "../assets/logo_ap_white.png"
import axios from "axios";
import hostname from "../utils/hostname";
import banner1 from "../assets/banner1.jpg"
import banner2 from "../assets/banner2.jpg"
import banner3 from "../assets/banner3.jpg"
import banner4 from "../assets/banner4.jpg"

function manageWebPages() {
  const dispatch = useAppDispatch();
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rowData, setRowData] = useState({})
  const [prefix, setPrefix] = useState({});
  const [categoryType, setCategoryType] = useState('game')
  const [gameType, setGameType] = useState([])
  const [subGameType, setSubGameType] = useState([])

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

  const images = [
    banner1, banner2, banner3, banner4
  ];

  const category = [
    {
      type: 'game',
      img: 'game',
      category: 'game'
    },
    {
      type: 'poker',
      img: 'game',
      category: 'poker'
    },
    {
      type: 'slot',
      img: 'game',
      category: 'slot',
    },
    {
      type: 'esport',
      img: 'game',
      category: 'esport',
    },
    {
      type: 'casino',
      img: 'game',
      category: 'casino',
    },
    {
      type: 'casino',
      img: 'game',
      category: 'casino',
    },
  ];

  const games1 = [
    {
      type: 'game',
      img: 'game'
    },
    {
      type: 'poker',
      img: 'game'
    },
    {
      type: 'slot',
      img: 'game'
    },
    {
      type: 'esport',
      img: 'game'
    },
    {
      type: 'casino',
      img: 'game'
    },
    {
      type: 'casino',
      img: 'game'
    },
    {
      type: 'game',
      img: 'game'
    },
    {
      type: 'poker',
      img: 'game'
    },
    {
      type: 'slot',
      img: 'game'
    },
    {
      type: 'esport',
      img: 'game'
    },
    {
      type: 'casino',
      img: 'game'
    },
    {
      type: 'casino',
      img: 'game'
    },
  ];

  const games2 = [
    {
      type: 'poker',
      img: 'game'
    },
    {
      type: 'poker',
      img: 'game'
    },
  ];


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

  useEffect(() => {
    getGameType()
  }, [])

  return (
    <Layout>
      <CssBaseline />
      <Grid container justifyContent="space-between">
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
            จัดการหน้าเว็บ
          </Typography>
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography sx={{ mt: 2 }}>โลโก้ *</Typography>
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
              <Grid item xs={6}>
                <Typography sx={{ mt: 2 }}>Banner *</Typography>
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
              <Grid item xs={6}>
                <Typography sx={{ mt: 2 }}>Slide *</Typography>
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
            </Grid>
          </>
        </Paper>

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
                    <Image alt="banner" src={logo_angpao_white} width={40} height={30} />
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
                      {images.map((item) => (
                      <SwiperSlide>
                        <Box >
                          <Image alt="banner" src={item} width={350} height={120} />
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
                      {images.map((item) => (
                        <SwiperSlide>
                          <Box >
                            <Image alt="banner" src={item} width={115} height={65} />
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
                              {/* <Typography
                                sx={{ fontWeight: "bold", textAlign: "center", color: "black" }}
                              >
                                {item.type}
                              </Typography> */}

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
                      // sx={{ bgcolor: 'green' }}
                      >
                        {/* {categoryType === "game" ? games1.map((item) => ( */}
                        {categoryType === "game" ? subGameType.map((item) => (
                          <Button
                            variant="contained"
                            // fullWidth
                            sx={{ mt: 1, mr: "2px", bgcolor: "#fff", height: '70px', width: '49%' }}
                            onClick={() => handelAddData()}
                          >
                            <img src={item.game_icon} width={80} height={80} style={{ borderRadius: '20px' }} />

                          </Button>
                        )) : games2.map((item) => (
                          <Button
                            variant="contained"
                            // fullWidth
                            sx={{ mt: 1, mr: "2px", bgcolor: "#fff", height: '70px', width: '49%' }}
                          // onClick={() => setPrice(100)}
                          >
                            <Typography
                              sx={{ fontWeight: "bold", textAlign: "center", color: "black" }}
                            >
                              {item.type}
                            </Typography>
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