import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Button,
  AppBar,
  Drawer,
  Toolbar,
  Collapse,
  MenuIcon,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { menuSuperAdmin } from "../routes/menu";
import { useAppDispatch } from "../store/store";
import Router, { useRouter } from "next/router";
import { signOut } from "../store/slices/userSlice";
import Image from "next/image";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import LogoutIcon from "@mui/icons-material/Logout";
import { useCounterStore } from "../zustand/permission"



const drawerWidth = 260;

function Layout({ children, page }) {
  const setPermission = useCounterStore((state) => state.setPermission)

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  let permssionLocal = 'test'
  if (typeof window !== "undefined") {
    permssionLocal = localStorage.getItem("role");
  }

  const handleClick = (id) => {
    if (id === "member") {
      setOpen({
        member: !open.member,
      });
    }
    if (id === "point") {
      setOpen({
        point: !open.point,
      });
    }
    if (id === "report") {
      setOpen({
        report: !open.report,
      });
    }
    if (id === "rank") {
      setOpen({
        rank: !open.rank,
      });
    }
    if (id === "bank") {
      setOpen({
        bank: !open.bank,
      });
    }
  };

  function hexToString(input) {
    return input
      .match(/.{1,2}/g)
      .map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join("");
  }

  const permssionDecrypt = hexToString(permssionLocal);
  const [menuFilter, setMenuFilter] = useState()

  const getPermission = async () => {
    try {
      const jsonData = await JSON.parse(permssionDecrypt)

      setPermission(jsonData)

      let menuActive = jsonData.filter(item => item.view === true)
      let reportActive = jsonData.filter(item => item.menu.includes('report'))
      reportActive = reportActive.filter(item => item.view === true)
      let bankActive = jsonData.filter(item => item.menu.includes('bank'))
      bankActive = bankActive.filter(item => item.view === true)
      let memberActive = jsonData.filter(item => item.menu.includes('_member'))
      memberActive = memberActive.filter(item => item.view === true)

      console.log('memberActive', memberActive)

      let tempmenFilter = menuSuperAdmin.filter(item => menuActive.some((value) => value.menu === item.id));
      let tempReportFilter = menuSuperAdmin.filter(item => reportActive.some((value) => value.menu.includes('report') === item.id.includes('report')));
      let reportsub = tempReportFilter[0].report.filter(item => reportActive.some((value) => value.menu === item.id));
      tempReportFilter[0].report = reportsub


      let tempBankFilter = menuSuperAdmin.filter(item => bankActive.some((value) => value.menu.includes('bank') === item.id.includes('bank')));
      let banksub = tempBankFilter[0].bank.filter(item => bankActive.some((value) => value.menu === item.id));
      tempBankFilter[0].bank = banksub

      let tempMemberFilter = menuSuperAdmin.filter(item => memberActive.some((value) => value.menu.includes('_member') === item.id.includes('member')));
      let membersub = tempMemberFilter[1].member.filter(item => memberActive.some((value) => value.menu === item.id));
      tempMemberFilter[1].member = membersub

      console.log('menuSuperAdmin', menuSuperAdmin)

      console.log('tempMemberFilter', tempMemberFilter[1])


      setMenuFilter([...tempmenFilter, ...tempBankFilter, tempMemberFilter[1], ...tempReportFilter,])

    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if (typeof window !== "undefined") {
      getPermission()
      setUsername(localStorage.getItem("username"));
      if (window.location.pathname.includes("/member")) {
        setOpen({ member: true });
      }
      if (window.location.pathname.includes("/bank")) {
        setOpen({ bank: true });
      }
      if (window.location.pathname.includes("/report")) {
        setOpen({ report: true });
      }
    }
  }, []);


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          height: 73,
          background: "linear-gradient(#0072B1, #41A3E3)",
        }}
      >
        <Toolbar>
          <Grid
            container
            justifyContent="flex-end"
            onClick={() => router.push("/profile")}
          >
            <Button sx={{ bgcolor: "#0465a587", mt: 1 }}>
              <AccountCircleIcon
                fontSize="large"
                sx={{ color: "#fff", mr: 1 }}
              />
              <Typography
                sx={{ color: "#fff", fontSize: "16px", mt: 0.5, mr: 1 }}
              >
                {username}
              </Typography>
            </Button>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#eee",
          },
          "& .MuiListItemButton-root": {
            "&:hover": {
              backgroundColor: "#5caee3",
              // borderRadius: "6px",
            },
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Grid justifyContent="center" alignItems="center" sx={{ pl: 6, pt: 2 }}>
          <Image
            src={
              "https://public-cdn-softkingdom.sgp1.cdn.digitaloceanspaces.com/1687251601762-2Long-Angpaogames.png"
            }
            alt="scb"
            width={160}
            height={50}
            onClick={() => router.push("/dashboard")}
          />
        </Grid>
        <Divider />

        <List>
          {menuFilter?.map((item) => (
            <>
              {item.type === "collapse" ? (
                <>
                  <ListItemButton onClick={() => handleClick(item.id)}>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />

                    {item.id === "member" ? (
                      open.member ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : item.id === "point" ? (
                      open.point ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : item.id === "report" ? (
                      open.report ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : item.id === "rank" ? (
                      open.rank ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : item.id === "bank" ? (
                      open.bank ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )
                    ) : (
                      ""
                    )}
                  </ListItemButton>

                  <Collapse in={open.member} timeout="auto" unmountOnExit>
                    {item.member?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            // borderRadius: "6px",
                            backgroundColor:
                              typeof window !== "undefined"
                                ? window.location.pathname === `${e.link}`
                                  ? "#AED6F1"
                                  : "#eee"
                                : "",
                          }}
                          onClick={() => {
                            router.push(e.link);
                          }}
                        >
                          <ListItemIcon>{e.icon}</ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>

                  <Collapse in={open.point} timeout="auto" unmountOnExit>
                    {item.point?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            // borderRadius: "6px",
                            backgroundColor:
                              typeof window !== "undefined"
                                ? window.location.pathname === `${e.link}`
                                  ? "#AED6F1"
                                  : "#eee"
                                : "",
                          }}
                          onClick={() => {
                            router.push(e.link);
                          }}
                        >
                          <ListItemIcon>{e.icon}</ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>

                  <Collapse in={open.report} timeout="auto" unmountOnExit>
                    {item.report?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            // borderRadius: "6px",
                            backgroundColor:
                              typeof window !== "undefined"
                                ? window.location.pathname === `${e.link}`
                                  ? "#AED6F1"
                                  : "#eee"
                                : "",
                          }}
                          onClick={() => {
                            router.push(e.link);
                          }}
                        >
                          <ListItemIcon>{e.icon}</ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>

                  <Collapse in={open.bank} timeout="auto" unmountOnExit>
                    {item.bank?.map((e) => (
                      <List component="div" disablePadding>
                        <ListItemButton
                          sx={{
                            pl: 4,
                            // borderRadius: "6px",
                            backgroundColor:
                              typeof window !== "undefined"
                                ? window.location.pathname === `${e.link}`
                                  ? "#AED6F1"
                                  : "#eee"
                                : "",
                          }}
                          onClick={() => {
                            router.push(e.link);
                          }}
                        >
                          <ListItemIcon>{e.icon}</ListItemIcon>
                          <ListItemText primary={e.name} />
                        </ListItemButton>
                      </List>
                    ))}
                  </Collapse>
                </>
              ) : (
                <ListItem key={item} disablePadding>
                  <ListItemButton
                    onClick={() => router.push(item.link)}
                    sx={{
                      // borderRadius: "6px",
                      backgroundColor:
                        typeof window !== "undefined"
                          ? window.location.pathname === `${item.link}`
                            ? "#AED6F1"
                            : "#eee"
                          : "",
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.name} />
                  </ListItemButton>
                </ListItem>
              )}
            </>
          ))}
        </List>

        <Divider />
        <List>
          {/* <ListItem disablePadding>
            <ListItemButton onClick={() => router.push('/profile')}
              sx={{
                borderRadius: "6px",
                backgroundColor: typeof window !== "undefined" ? window.location.pathname === '/profile' ? "#AED6F1" : '#eee' : ''
              }}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="โปรไฟล์" />
            </ListItemButton>
          </ListItem> */}
          <ListItem disablePadding>
            <ListItemButton
              onClick={async () => {
                await dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="ออกจากระบบ" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3, mt: 2 }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
