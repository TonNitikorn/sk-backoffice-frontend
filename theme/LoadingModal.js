import React from "react";
import Backdrop from "@mui/material/Backdrop";
// import { makeStyles } from "@mui/styles";
import { CircularProgress, Fab } from "@mui/material";
import logo_angpao from "../assets/logo_ap.png";
import Image from "next/image";

export default function LoadingModal(props) {

  return (
    <Backdrop style={{
      zIndex: 1299,
      color: "#E8EAEA",
    }} open={props.open} onClick={() => { }}>
      <div style={{
        margin: 1,
        position: "relative",
      }}>
        <Fab aria-label="save" color="neutral">
          <img
            src={"https://angpaos.games/wp-content/uploads/2023/04/Angpaos-Logo1.png"}
            alt="mascot"
            width="40px"
            height="35px"
          />
        </Fab>
        <CircularProgress
          size={78}
          thickness={5.0}
          color="primary"
          style={{
            // color: "yellow",
            position: "absolute",
            top: -11,
            left: -11,
            zIndex: 1300,
          }}
        />
      </div>
    </Backdrop>
  );
}