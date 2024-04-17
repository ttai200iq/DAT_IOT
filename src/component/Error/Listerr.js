import React, { useContext, useState } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { deviceid, list, register } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { LuFolderEdit } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import Reader from "./Reader";
import Register from "./Register";


export default function Listerr(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const avatar = '/avatar/auto.jpg'
    const [readstate, setReadstate] = useState(false)

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
                if (res.data[0] != undefined) {
                    register.value = {
                        data: res.data[0].setting.data
                    }
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_33" }), show: 'block' } })
                }
            })
    }

    const handleCloseRead = () => {
        setReadstate(!readstate)
    }

    return (
        <>
            {isBrowser
                ?
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
                </div> :
                //MOBILE SECTION
                <>
                    {readstate === false ?
                        list.value.map((data, key) => (
                            <div key={key} className="DAT_ViewMobile_Container_Content">
                                <div className="DAT_ViewMobile_Container_Content_Top"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                        <div className="DAT_ViewMobile_Container_Content_Top_left"
                                            style={{ color: "white" }}
                                        >
                                            {/* <img alt="" src={avatar} ></img> */}
                                            {data.id}
                                        </div>
                                        <div
                                            className="DAT_ViewMobile_Container_Content_Top_right"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div className="DAT_ViewMobile_Container_Content_Top_right_tit"
                                                id={data.deviceid}
                                                style={{
                                                    color: (deviceid.value == data.deviceid) ? "blue" : "black"
                                                }} onClick={(e) => handleDevice(e)}
                                            >
                                                {data.deviceid}
                                            </div>
                                            {/* <div className="DAT_ViewMobile_Container_Content_Top_right_company">Công ty: { }</div>
                                            <div className="DAT_ViewMobile_Container_Content_Top_right_state">
                                                Trạng thái:
                                                <img alt="" style={{ width: "13px" }} src="/lib/true_state.png">
                                                </img>
                                            </div> */}

                                        </div>
                                    </div>
                                    <LuFolderEdit size={15}
                                        id={data.deviceid}
                                        onClick={(e) => { handleCloseRead(); console.log(readstate); handleDevice(e) }}
                                    />
                                </div>
                                {/* <div className="DAT_ViewMobile_Container_Content_Bottom" >
                                    <div className="DAT_ViewMobile_Container_Content_Bottom_addr">data.addr</div>
                                    <div className="DAT_ViewMobile_Container_Content_Bottom_edit" >
                                        <LuFolderEdit size={15} />
                                        <RiDeleteBin6Line size={15} />
                                    </div>
                                </div> */}
                            </div>
                        )) :
                        <>
                            <Register username={props.username} handleCloseRead={handleCloseRead} />
                        </>}


                </>
            }
        </>
    );
}
