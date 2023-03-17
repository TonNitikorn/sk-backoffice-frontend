import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import HomeIcon from "@mui/icons-material/Home";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import SellIcon from "@mui/icons-material/Sell";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export const menuSuperAdmin = [
  {
    name: "หน้าหลัก",
    link: "/home",
    icon: <HomeIcon />,
  },
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <InsertChartIcon />,
  },
  
  {
    name: "เติมเครดิตแบบ manual",
    link: "/editError",
    icon: <EditLocationAltIcon />,
  },
  {
    name: "สร้างรายการถอน",
    link: "/withdraw",
    icon: <CurrencyExchangeIcon />,
  },
  {
    name: "จัดการข้อมูลการถอน",
    link: "/withdrawPending",
    icon: <FormatListBulletedIcon />,
  },
  {
    name: "ลูกค้า",
    // link: "/DepositWithdrawalSystem/CreditManual",
    icon: <GroupsIcon />,
    type: 'collapse',
    id: 'member',
    member: [
      {
        name: "สมัครสมาชิกลูกค้า",
        link: "/member/addMember",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "ตรวจสอบข้อมูลลูกค้า",
        link: "/member/memberInfo",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายชื่อลูกค้า",
        link: "/member/memberTable",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
    ],
  },

  {
    name: "จัดการหน้าเว็บ",
    link: "/manageWebPages",
    icon: <LibraryBooksIcon />,
  },
  
  {
    name: "บัญชีธนาคาร",
    link: "/bankAccount",
    icon: <AccountBalanceIcon />,
  },
  // {
  //   name: "โปรโมชัน",
  //   link: "/promotion",
  //   icon: <SellIcon />,
  // },
  // {
  //   name: "ข้อมูลส่วนตัว",
  //   link: "/profile",
  //   icon: <PersonIcon />,
  // },
  // {
  //   name: "Point & Ranking",
  //   link: "/ranking",
  //   icon: <PersonIcon />,
  //   type: 'collapse',
  //   id: 'point',
  //   point: [
  //     {
  //       name: "อนุมัติ Point",
  //       link: "approvePoint",
  //       icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  //     },
  //     {
  //       name: "จัดการ Rank Point",
  //       link: "rank/ranking",
  //       icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  //     }
  //   ],
  // },
  {
    name: "Rank Management",
    link: "rank/ranking",
    icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  },
  {
    name: "รายงาน",
    // link: "/DepositWithdrawalSystem/CreditManual",
    icon: <FormatListBulletedIcon />,
    type: 'collapse',
    id: 'report',
    report: [
      {
        name: "รายงานการฝาก",
        link: "/report/reportDeposit",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการถอน",
        link: "/report/reportWithdraw",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการฝากทศนิยม",
        link: "/report/reportDepositDecimal",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      // {
      //   name: "รายงานการสร้างรายการฝาก",
      //   link: "/report/reportMakeDeposit",
      //   icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      // },
      {
        name: "รายงานการเติมเครดิต(Admin)",
        link: "/report/reportError",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
    ],
  },

  // {
  //   name: "สรุป",
  //   // link: "/DepositWithdrawalSystem/CreditManual",
  //   icon: <InsertChartIcon />,
  //   children: [
  //     {
  //       name: "สรุปโปรโมชัน",
  //       link: "/summary/summaryPromotion",
  //       icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  //     },
  //     {
  //       name: "รายงานการฝาก/ถอนตามบุคคล",
  //       link: "/summary/depositWithdraw",
  //       icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  //     },
  //     {
  //       name: "รายการฝากที่ถูกซ่อน",
  //       link: "/summary/withdrawClose",
  //       icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  //     },
  //     {
  //       name: "กำไรขาดทุน",
  //       link: "/summary/profitLoss",
  //       icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  //     },
  //   ],
  // },
  // {
  //   name: "เช็คข้อมูลลูกค้า",
  //   link: "/checkUserData",
  //   icon: <LocalLibraryIcon />,
  // },
  // {
  //   name: "ลูกค้าเก่า",
  //   link: "/oldMember",
  //   icon: <PersonIcon />,
  // },
  // {
  //   name: "ฝาก 7 วัน",
  //   link: "/weekDeposit",
  //   icon: <LibraryBooksIcon />,
  // },

  {
    name: "รายชื่อพนักงาน",
    link: "/employee/employee",
    icon: <GroupIcon />,
  },
  {
    name: "คู่มือการใช้งาน",
    link: "/smssetting",
    icon: <AutoStoriesIcon />,
  },
];

export const menuAdmin = [
  {
    name: "Dashboard",
    link: "/dashboard",
    icon: <InsertChartIcon />,
  },
  {
    name: "หน้าหลัก",
    link: "/home",
    icon: <HomeIcon />,
  },
  {
    name: "สร้างรายการถอน",
    link: "/withdrawCreate",
    icon: <CurrencyExchangeIcon />,
  },
  {
    name: "จัดการข้อมูลการถอน",
    link: "/withdrawPending",
    icon: <FormatListBulletedIcon />,
  },
  {
    name: "ลูกค้า",
    // link: "/DepositWithdrawalSystem/CreditManual",
    icon: <GroupsIcon />,
    children: [
      {
        name: "สมัครสมาชิกลูกค้า",
        link: "/user/addUser",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "ข้อมูลลูกค้า",
        link: "/user/userTable",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
    ],
  },

  {
    name: "จัดการหน้าเว็บ",
    link: "/manageWebPages",
    icon: <LibraryBooksIcon />,
  },
  {
    name: "แก้ไขข้อผิดพลาด",
    link: "/editError",
    icon: <EditLocationAltIcon />,
  },
  {
    name: "บัญชีธนาคาร",
    link: "/bankAccount",
    icon: <AccountBalanceIcon />,
  },
  {
    name: "โปรโมชัน",
    link: "/promotion",
    icon: <SellIcon />,
  },
  // {
  //   name: "ข้อมูลส่วนตัว",
  //   link: "/profile",
  //   icon: <PersonIcon />,
  // },
  {
    name: "Point & Ranking",
    link: "/ranking",
    icon: <PersonIcon />,
    children: [

      {
        name: "จัดการ Rank Point",
        link: "rank/ranking",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "อนุมัติ Point",
        link: "approvePoint",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      }
    ],
  },

  {
    name: "รายงาน",
    // link: "/DepositWithdrawalSystem/CreditManual",
    icon: <FormatListBulletedIcon />,
    children: [
      {
        name: "รายงานการฝาก",
        link: "/report/reportDeposit",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการถอน",
        link: "/report/reportWithdraw",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการฝากทศนิยม",
        link: "/report/reportDepositDecimal",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      // {
      //   name: "รายงานการสร้างรายการฝาก",
      //   link: "/report/reportMakeDeposit",
      //   icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      // },
    ],
  },

  {
    name: "สรุป",
    // link: "/DepositWithdrawalSystem/CreditManual",
    icon: <InsertChartIcon />,
    children: [
      {
        name: "สรุปโปรโมชัน",
        link: "/summary/summaryPromotion",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการฝาก/ถอนตามบุคคล",
        link: "/summary/depositWithdraw",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายการฝากที่ถูกซ่อน",
        link: "/summary/withdrawClose",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "กำไรขาดทุน",
        link: "/summary/profitLoss",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
    ],
  },
  {
    name: "เช็คข้อมูลลูกค้า",
    link: "/checkUserData",
    icon: <LocalLibraryIcon />,
  },
  // {
  //   name: "ลูกค้าเก่า",
  //   link: "/oldMember",
  //   icon: <PersonIcon />,
  // },
  // {
  //   name: "ฝาก 7 วัน",
  //   link: "/weekDeposit",
  //   icon: <LibraryBooksIcon />,
  // },

  {
    name: "รายชื่อพนักงาน",
    link: "/employee/employee",
    icon: <GroupIcon />,
  },
  {
    name: "คู่มือการใช้งาน",
    link: "/smssetting",
    icon: <AutoStoriesIcon />,
  },
];

