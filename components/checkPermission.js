import { useCounterStore } from "../zustand/permission";

export default function checkPermissionDisabled(page, action) {
  const permission = useCounterStore((state) => state.permission);
  const temp = permission?.find((item) => page === item.menu);
  const subMenu = temp?.sub_menu;
  const findDis = subMenu?.find((item) => item.sub_menu_name === action);

  if (findDis?.sub_menu_name === action) {
    if (findDis?.sub_menu_active === false) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
