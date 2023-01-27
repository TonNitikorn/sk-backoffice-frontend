import {
  Box,
  Divider,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Grid,
  Button
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
import { signOut } from "../store/slices/userSlice";
import { useAppDispatch } from "../store/store";
import hostname from "../utils/hostname";
import axios from "axios";
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MuiDrawer from '@mui/material/Drawer';
import { styled, useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { menuSuperAdmin, menuAdmin } from "../routes/menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import Logout from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import logo_angpao from "../assets/logo_angpao.png"

//  function drawer
const drawerWidth = 250;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
//  function drawer


function Layout({ children, page }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openListMenu, setOpenListMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const openAcc = Boolean(anchorEl);

  const handleClickAcc = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAcc = () => {
    setAnchorEl(null);
  };


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    setOpenListMenu(!openListMenu);
  };


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Grid container justifyContent="space-between">
            {/* <Typography variant="h6" component="div">
              อั่งเปา
            </Typography> */}
            <Image
              src={logo_angpao}
              alt="scb"
              width={100}
              height={50}
            />
            <Button
              onClick={handleClickAcc}
              variant="contained"
              size="small"
              sx={{ ml: 2, bgcolor: "#eee" }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <AccountCircleIcon sx={{ width: 35, height: 35, mr: 2 }} />
              <Typography>asdasd</Typography>
              <ArrowDropDownIcon />
            </Button>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openAcc}
              onClose={handleCloseAcc}
              onClick={handleCloseAcc}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem
                onClick={async () => {
                  await dispatch(signOut());
                  localStorage.clear();
                  router.push("/auth/login");
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                ออกจากระบบ
              </MenuItem>


            </Menu>
          </Grid>



        </Toolbar>
      </AppBar>
      <Drawer variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            backgroundColor: "#eee",
            color: "#000",
          },
          "& .MuiListItemButton-root": {
            "&:hover": {
              backgroundColor: "#41A3E3",
              borderRadius: "6px",
            },
          },
        }} open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuSuperAdmin.map((item) => (
            <>
              {!item.children ? <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => {
                    router.push(`${item.link}`)
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem> : ""}

              {item.children ? (
                <>
                  <ListItemButton onClick={handleClick}>
                    <ListItemIcon >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    {openListMenu ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openListMenu} timeout="auto" unmountOnExit>
                    {item.children.map((e) => (
                      <List component="div" disablePadding>
                        <Link href={`${e.link}`}>
                          <ListItemButton sx={{ pl: 4 }}>
                            <ListItemIcon >
                              {e.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={e.name}
                            />
                          </ListItemButton>
                        </Link>
                      </List>
                    ))}
                  </Collapse>
                </>
              ) : (
                ""
              )}
            </>

          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
      
    </Box>
  );
}

export default Layout;
