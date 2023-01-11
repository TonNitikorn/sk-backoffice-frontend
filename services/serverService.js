import axios from "axios";
import hostname from "../utils/hostname";
import Swal from "sweetalert2";
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert from '@mui/material/Alert';
export const signIn = async (user) => {
  try {
    let res = await axios({
      method: "post",
      url: `${hostname}/auth/login`,
      data: {
        "tel": user.tel,
        "password": user.password
      }
    });
    localStorage.setItem("access_token", res.data.accesstoken);
    return res.data;


  } catch (error) {
    console.log(error);
    // Swal.fire({
    //   position: "center",
    //   icon: "error",
    //   title: error.response.data.error.message,
    //   showConfirmButton: false,
    //   timer: 4000,
    // });
  }
};
