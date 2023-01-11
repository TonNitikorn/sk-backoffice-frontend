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
   CssBaseline,
} from "@mui/material";
import Layout from '../../theme/Layout'
import TablePagination from "@mui/material/TablePagination";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TableForm from "../../components/tableForm";
import MaterialTableForm from "../../components/materialTableForm"

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

   const columns = [
      { title: "First Name", field: "firstName" },
      { title: "Last Name", field: "lastName" },
      { title: "Birth Year", field: "birthYear", },
      { title: "Availablity", field: "availability" },
   ];

   const data = [
      { firstName: "Tod", lastName: "Miles", birthYear: 1987, availability: true },
      { firstName: "Jess", lastName: "Smith", birthYear: 2000, availability: false }
   ];



   return (
      <Layout>
         <CssBaseline />
         <MaterialTableForm data={data} columns={columns} pageSize="10" title="รายชื่อลูกค้า" />

      </Layout>
   )
}

export default memberTable