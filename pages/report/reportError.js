import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Grid,
    Typography,
    Box,
    TextField,
    TableRow,
    TableContainer,
    TableBody,
    TableHead,
    TableCell,
    Table,
    Tabs,
    Tab,
    Card,
    CardContent
} from "@mui/material";
import axios from "axios";
import hostname from "../../utils/hostname";
import moment from "moment/moment";
import PropTypes from "prop-types";
import withAuth from "../../routes/withAuth";
import LoadingModal from "../../theme/LoadingModal";
import Swal from "sweetalert2";
import Layout from '../../theme/Layout'
import MaterialTableForm from "../../components/materialTableForm";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function reportError() {
    const [value, setValue] = useState(0);
    const [page, setPage] = useState(0);
    const [selectedDateRange, setSelectedDateRange] = useState({
        start: moment().format("YYYY-MM-DD 00:00"),
        end: moment().format("YYYY-MM-DD 23:59"),
    });
    const [rowData, setRowData] = useState({});
    const [username, setUsername] = useState("");
    const [allError, setAllError] = useState([]);

    const [creditPromo, setCreditPromo] = useState([]);
    const [upCredit, setUpCredit] = useState([]);
    const [cutCredit, setCutCredit] = useState([]);

    const [slipCreditTotal, setSlipCreditTotal] = useState(0);
    const [cutCreditTotal, setCutCreditTotal] = useState(0);
    const [addCreditTotal, setAddCreditTotal] = useState(0);

    const [loading, setLoading] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Layout>
            <Paper sx={{ p: 3, mt: 3 }}>
                <Grid container>
                    <Typography variant="h5" sx={{ p: 3 }}>
                    รายงานการเติมเครดิตแบบ manual
                    </Typography>
                    <Grid xs={12} sx={{ mb: 3 }}>
                        <TextField
                            label="เริ่ม"
                            style={{
                                marginRight: "8px",
                                marginTop: "8px",
                                backgroundColor: "white",
                                borderRadius: 4,
                            }}
                            variant="outlined"
                            size=""
                            type="datetime-local"
                            name="start"
                            value={selectedDateRange.start}
                            onChange={(e) => {
                                setSelectedDateRange({
                                    ...selectedDateRange,
                                    [e.target.name]: e.target.value,
                                });
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="สิ้นสุด"
                            style={{
                                marginRight: "8px",
                                marginTop: "8px",
                                color: "white",
                                backgroundColor: "white",
                                borderRadius: 4,
                            }}
                            variant="outlined"
                            size=""
                            type="datetime-local"
                            name="end"
                            value={selectedDateRange.end}
                            onChange={(e) => {
                                setSelectedDateRange({
                                    ...selectedDateRange,
                                    [e.target.name]: e.target.value,
                                });
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                        />
                        <TextField
                            name="username"
                            type="text"
                            value={username || ""}
                            label="ค้นหาโดยใช้ Username"
                            placeholder="ค้นหาโดยใช้ Username"
                            onChange={(e) => setUsername(e.target.value)}
                            variant="outlined"
                            sx={{ mt: 1, mr: 2 }}
                        />
                        <Button
                            variant="contained"
                            style={{ marginRight: "8px", marginTop: 13 }}
                            color="primary"
                            size="large"
                            onClick={() => {
                                getAllError();
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                marginRight: "8px",
                                marginTop: 13,
                                backgroundColor: "#FFB946",
                            }}
                            size="large"
                            onClick={async () => {
                                let start = moment()
                                    .subtract(1, "days")
                                    .format("YYYY-MM-DD 00:00");
                                let end = moment()
                                    .subtract(1, "days")
                                    .format("YYYY-MM-DD 23:59");
                                getAllError("yesterday", start, end);
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>เมื่อวาน</Typography>
                        </Button>
                        <Button
                            variant="contained"
                            style={{
                                marginRight: "8px",
                                marginTop: 13,
                                backgroundColor: "#129A50",
                            }}
                            size="large"
                            onClick={async () => {
                                let start = moment().format("YYYY-MM-DD 00:00");
                                let end = moment().format("YYYY-MM-DD 23:59");
                                getAllError("today", start, end);
                            }}
                        >
                            <Typography sx={{ color: '#ffff' }}>วันนี้</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Grid>
            <Tabs
              textColor="black"
              indicatorColor="black"
              value={value}
              sx={{
                bgcolor: "#DFE3EA",
                borderRadius: 3,
                mb: 2,
                boxShadow: "2px 2px 10px #737373",
                "& button": { borderRadius: 2 },
                "& button.Mui-selected": {
                  background: "#41A3E3",
                  color: "#EEE",
                },
              }}
              variant="fullWidth"
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="ทั้งหมด"
                {...a11yProps(0)}
              // onClick={() => getAllError()}
              />
              <Tab
                label="ตัดเครดิต"
                {...a11yProps(1)}
              // onClick={() => getCreditCut()}
              />
              <Tab
                label="เพิ่มเครดิตโปรโมชั่น"
                {...a11yProps(2)}
              // onClick={() => getCreditPromo()}
              />
              <Tab
                label="เติมเครดิต"
                {...a11yProps(3)}
              // onClick={() => getUpCredit()}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <MaterialTableForm
                pageSize={10}
                // title="รายการฝาก"
                data={allError}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                    minWidth: "120px",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <MaterialTableForm
                // title="รายการฝาก"
                pageSize={10}
                data={cutCredit}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <MaterialTableForm
                // title="รายการฝาก"
                pageSize={10}
                data={creditPromo}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <MaterialTableForm
                // title="รายการฝาก"
                pageSize={10}
                data={upCredit}
                columns={[
                  {
                    field: "no",
                    title: "ลำดับ",
                    maxWidth: 80,
                    align: "center",
                  },
                  {
                    field: "error_list_name",
                    title: "รายการ",
                    align: "center",
                  },

                  {
                    field: "username",
                    title: "Username",
                    align: "center",
                  },

                  {
                    field: "amount",
                    title: "ยอดเงิน",
                    align: "center",
                  },
                  {
                    field: "bonus_credit",
                    title: "โบนัส",
                    align: "center",
                  },
                  {
                    field: "credit_before",
                    title: "เครดิตก่อนเติม",
                    align: "center",
                  },

                  {
                    field: "credit_after",
                    title: "เครดิตหลังเติม",
                    align: "center",
                  },
                  {
                    field: "date",
                    title: "วันที่",
                    align: "center",
                  },
                  {
                    field: "create_by",
                    title: "Create By.",
                    align: "center",
                  },
                  {
                    field: "annotation",
                    title: "หมายเหตุ",
                    align: "center",
                  },
                  {
                    field: "ref",
                    title: "Ref.",
                    align: "center",
                  },
                ]}
              />
            </TabPanel>
          </Grid>
            </Paper>
        </Layout>
    )
}

export default reportError
