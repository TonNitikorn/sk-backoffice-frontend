import React from 'react'
import MaterialTable from '@material-table/core'

function materialTableForm(props) {
    const {
        data,
        columns,
        title,
        pageSize
    } = props;



    return (
        <div>
            <MaterialTable
                title={title || ""}
                columns={columns}
                data={data}
                options={{
                    search: true,
                    background :"red",
                    // filtering: true,
                    columnsButton: true,
                    columnResizable: true,
                    rowStyle: {
                        fontSize: 14,
                        fontFamily: "Noto Sans Thai , sans-serif",
                    },
                    headerStyle: {
                        border: "1px solid rgba(224, 224, 224, 1)",
                        borderTop: "1px solid rgba(224, 224, 224, 1)",
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                        // whiteSpace: "nowrap",
                        padding: 10,
                        background: "#41A3E3",
                        color: "#fff",
                        // paddingRight: 0,
                    },
                    // actionsCellStyle: { padding: 0 },
                    // filterCellStyle: {
                    //   padding: 3,
                    //   borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    // },
                    // filterRowStyle: {
                    //   borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    // },
                    // cellStyle: {
                    //   // paddingLeft: 6,
                    //   whiteSpace: "nowrap",
                    //   minWidth: 120,
                    //   height: 70,
                    //   overflow: "hidden",
                    //   textOverflow: "ellipsis",
                    // },
                    pageSize: pageSize,
                    pageSizeOptions: [10, 20, 100],
                }}
                localization={{
                    body: {
                        emptyDataSourceMessage: <h1>ไม่พบข้อมูล</h1>,
                    },
                }}
            // onRowClick={() => {}}
            // localization={{
            //   header: { actions: "" },
            // }}
            />
        </div>
    )
}

export default materialTableForm