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
    name: "Dashboard",
    id: "dashboard",
    link: "/dashboard",
    icon: <InsertChartIcon />,
  },
  {
    name: "รายการเดินบัญชี",
    link: "/home",
    id: "home",
    icon: <HomeIcon />,
  },
  {
    name: "จัดการเครดิต/ข้อมูลลูกค้า",
    link: "/memberTable",
    id: "member_table",
    icon: <EditLocationAltIcon />,
  },
  {
    name: "จัดการข้อมูลการถอน",
    link: "/withdrawPending",
    id: "withdraw_pending",
    icon: <FormatListBulletedIcon />,
  },
  {
    name: "สร้างรายการถอน",
    link: "/withdraw",
    id: "withdraw",
    icon: <CurrencyExchangeIcon />,
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
        id: "add_member",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "ตรวจสอบข้อมูลลูกค้า",
        link: "/member/memberInfo",
        id: "info_member",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      // {
      //   name: "รายชื่อลูกค้า",
      //   link: "/member/memberTable",
      //   icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      // },
    ],
  },
  {
    name: "บัญชีธนาคาร",
    // link: "/bankAccount",
    icon: <AccountBalanceIcon />,
    type: 'collapse',
    id: 'bank',
    bank: [
      {
        name: "บัญชีทั้งหมด",
        link: "/bankAccount",
        id: "bank_account",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "บัญชีฝาก",
        link: "/bank/bankDeposit",
        id: "bank_deposit",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "บัญชีถอน",
        link: "/bank/bankWithdraw",
        id: "bank_withdraw",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
    ]
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
  // {
  //   name: "Rank Management",
  //   link: "rank/ranking",
  //   icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
  // },


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
    id: "employee",
    icon: <GroupIcon />,
  },

  // {
  //   name: "จัดการหน้าเว็บ",
  //   link: "/manageWebPages",
  //   icon: <LibraryBooksIcon />,
  // },
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
        id: "report_deposit",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการถอน",
        link: "/report/reportWithdraw",
        id: "report_withdraw",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการตัดเครดิต",
        link: "/report/reportCutCredit",
        id: "report_cutcredit",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
      {
        name: "รายงานการเติมเครดิต",
        link: "/report/reportAddCredit",
        id: "report_addcredit",
        icon: <Brightness1Icon sx={{ fontSize: "small" }} />,
      },
    ],
  },
  // {
  //   name: "คู่มือการใช้งาน",
  //   link: "/smssetting",
  //   icon: <AutoStoriesIcon />,
  // },
];



