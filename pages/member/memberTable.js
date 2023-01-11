import React, { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
   Grid,
   Button,
   TextField,
   Typography,
   Chip,
   Box,
   Dialog,
   IconButton,
   DialogTitle,
   DialogActions,
   Table,
   TableRow,
   TableCell,
   DialogContent,
} from "@mui/material";
import Layout from '../../theme/Layout'
import TablePagination from "@mui/material/TablePagination";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TableForm from "../../components/tableForm";

function memberTable() {
   //   const classes = useStyles();

   const [dataMember, setDataMember] = useState([])

   useEffect(() => {
      setDataMember([
         {
            'fname': 'fname',
            'lname': 'lname'
         },
         {
            'fname': 'fname2',
            'lname': 'lname2'
         }
      ])
   }, [])





   return (
      <Layout>
         memberTable
         <TableForm data={dataMember} />

      </Layout>
   )
}

export default memberTable