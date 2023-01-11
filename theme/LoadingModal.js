import React from "react";
import Backdrop from "@mui/material/Backdrop";
// import { makeStyles } from "@mui/styles";
import { CircularProgress, Fab } from "@mui/material";

export default function LoadingModal(props) {

  return (
    <Backdrop style={{
      zIndex: 1299,
      color: "#fff",
    }} open={props.open} onClick={() => { }}>
      <div style={{
        margin: 1,
        position: "relative",
      }}>
        <Fab aria-label="save" color="neutral">
          <img
            src={"https://the1pg.com/wp-content/uploads/2022/09/The1PG-6-2.png"}
            alt="mascot"
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