import React from "react";
import { useCounterStore } from "../zustand/permission";
import Swal from "sweetalert2";


export default function checkPermissionDisabled(page, action) {
  const permission = useCounterStore((state) => state.permission);
  const temp = permission.find((item) => page === item.menu);
  const subMenu = temp.sub_menu;
  const findDis = subMenu.find((item) => item.sub_menu_name === action);

  if (findDis?.sub_menu_name === action) {
    if (findDis.sub_menu_active === false) {
      return  Swal.fire({
        position: "center",
        icon: "warning",
        title: "ไม่มีสิทธ์การเข้าถึง",
        showConfirmButton: false,
        timer: 2000,
     });;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
