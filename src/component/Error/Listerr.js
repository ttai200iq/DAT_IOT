import React, { useContext } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { deviceid, list, register } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";


export default function Listerr(props) {
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
           
        },
        {
            name: "Gateway",
            selector: (row) => <div id={row.deviceid} style={{ cursor: "pointer", color: (deviceid.value == row.deviceid) ? "blue" : "black" }} onClick={(e) => handleDevice(e)}>{row.deviceid}</div>,
            sortable: true,
            style: {
                justifyContent: "left",
            }
        },
    ];


    const handleDevice = (e) => {
        deviceid.value = e.currentTarget.id
        register.value = { data: [] }
        axios.post(host.DEVICE + "/getErr", { id: e.currentTarget.id, user: props.username }, { secure: true, reconnect: true })
            .then((res) => {
                
               
                    console.log(res.data)
                    if(res.data[0] != undefined){
                        register.value = {
                            data: res.data[0].setting.data
                        }
                    }else{
                        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_33" }), show: 'block' } })
                    }
                  
                    
                        
                    
                

            })
    }




    return (
        <div className="DAT_Listerr">

            {/* <div className="DAT_Listerr-Add">
                <form className="DAT_Listerr-Add-group" onSubmit={(e) => handleAdd(e)}>
                    <input placeholder="Nhập mã thiết bị" id="gateway" required></input>
                    <button ><ion-icon name="add-outline"></ion-icon></button>
                </form>
            </div> */}
            <DataTable
                className="DAT_Table_Container"
                columns={col}
                data={list.value}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                fixedHeader={true}
                noDataComponent={
                    <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                        <div>Danh sách trống</div>
                        <div>Thêm thiết bị để trải nghiệm tính năng này!</div>
                    </div>
                }

            />


        </div>
    );
}
