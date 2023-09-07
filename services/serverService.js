import axios from "axios";
import hostname from "../utils/hostname";
import Swal from "sweetalert2";


function stringToHex(input) {
  return Array.from(input, (char) => char.charCodeAt(0).toString(16)).join('');
}

export const signIn = async (user) => {
  try {
    let res = await axios({
      method: "post",
      url: `${hostname}/auth/login`,
      data: {
        "username": user.username,
        "password": user.password
      }
    });
    localStorage.setItem("access_token", res.data.access_token);

    let profile = await axios({
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      method: "get",
      url: `${hostname}/admin/profile`,
    });
    let resData = profile.data;
    localStorage.setItem("username", resData.username);

    const jsonData = JSON.stringify(resData.role_name.permission);

    const encodedText = stringToHex(jsonData);
    await localStorage.setItem("role", encodedText);


    return res.data;
    // return resData;



  } catch (error) {
    console.log(error.response.data.error);
    if (error.response.data.error.message === "รหัสผ่านไม่ถูกต้อง") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.response.data.error.message,
        showConfirmButton: false,
        timer: 4000,
      });
    }
    if (error.response.data.error.message === "Username หรือ Password ไม่ถูกต้อง") {
      Swal.fire({
        position: "center",
        icon: "error",
        title: error.response.data.error.message,
        showConfirmButton: false,
        timer: 4000,
      });
    }

  }
};
