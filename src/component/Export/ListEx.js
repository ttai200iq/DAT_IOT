import { useContext, useEffect } from "react"
import { exp, reporttime, devicetime } from "./Export"
import DataTable from "react-data-table-component";
import axios from "axios";
import { host } from "../constant";
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";

export default function ListEx(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);

    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng',
        rangeSeparatorText: 'đến',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'tất cả',
    };

    const col = [
        {
            name: "STT",
            selector: (row) => row.id,
            sortable: true,
            width: "80px",
            center: true,
        },
        {
            name: "Gateway",
            selector: (row) => <div id={row.deviceid} style={{ cursor: "pointer", color: (devicetime.value == row.deviceid) ? "blue" : "black" }} onClick={(e) => handleDevice(e)}>{row.deviceid}</div>,
            style: {
                justifyContent: "left",
            }
        },
    ];


    const handleDevice = (e) => {
        devicetime.value = e.currentTarget.id
        reporttime.value = []
        axios.post(host.DEVICE + "/getReportTime", { id: e.currentTarget.id }, { secure: true, reconnect: true })
            .then((res) => {


                console.log(res.data)
                if (res.data[0] != undefined) {
                    reporttime.value = res.data
                    reporttime.value.map((data, i) => {
                        data.id = (i + 1)
                    })
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_33" }), show: 'block' } })
                }

            })
    }

    return (
        <>
            <DataTable
                className="DAT_Table_Container"
                columns={col}
                data={exp.value}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                noDataComponent={
                    <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                        <div>Danh sách trống</div>
                        <div>Thêm thiết bị để trải nghiệm tính năng này!</div>
                    </div>
                }

            />


        </>
    )
}

