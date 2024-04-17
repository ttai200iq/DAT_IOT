import React, { useContext, useState } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { deviceid, register } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { LuFolderEdit } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
export default function Register(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [config, setConfig] = useState(false);
    const [tit, setTit] = useState("");
    const [positon, setPosition] = useState({ col: "", row: 0 });
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
            name: "Địa Chỉ Mã Lỗi",
            selector: (row) => (
                <>
                    <div
                        // id={"addrcode_" + row.id}
                        // onClick={(e) => handleChange(e)}
                        style={{ cursor: "pointer" }}
                    >
                        {row.addrcode}
                    </div>
                </>
            ),
            center: true,
        },
        {
            name: "Cấu hình",
            selector: (row) => (
                <>

                    <div
                        style={{ cursor: "pointer", marginBottom: "10px", marginTop: "10px" }}
                    >
                        {row.register.map((data, i) => {
                            return (
                                (i === row.register.length - 1)
                                    ? <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}><div style={{ width: "100px" }} id={"register" + "_" + row.id + "_" + parseInt(i + 1)}>{data.addr} : {data.val}</div><span id={"edit_" + row.id + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)} style={{ color: "green", marginRight: "10px" }}><ion-icon name="create-outline"></ion-icon></span><span id={"delete_" + row.id + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)} style={{ color: "red", marginRight: "10px" }}><ion-icon name="trash-outline"></ion-icon></span><span id={"add_" + row.id} onClick={(e) => handleAddItem(e)} style={{ color: "red" }}><ion-icon name="add-circle-outline"></ion-icon></span></div>
                                    : <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}><div style={{ width: "100px" }} id={"register" + "_" + row.id + "_" + parseInt(i + 1)}>{data.addr} : {data.val}</div><span id={"edit_" + row.id + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)} style={{ color: "green", marginRight: "10px" }}><ion-icon name="create-outline"></ion-icon></span><span id={"delete_" + row.id + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)} style={{ color: "red", marginRight: "10px" }}><ion-icon name="trash-outline"></ion-icon></span></div>
                            )
                        })}

                    </div>

                </>
            ),
            center: true,
        },
        {
            name: "",
            selector: (row) => (
                <>
                    <div
                        id={row.id}
                        onClick={(e) => handleDelete(e)}
                        style={{ cursor: "pointer", color: "red" }}
                    >
                        Xóa
                    </div>
                </>
            ),
            width: "100px",
            center: true,
        },
    ];

    // const handleChange = (e) => {
    //     setConfig(true);
    //     const arr = e.currentTarget.id.split("_");
    //     setPosition({ col: arr[0], row: parseInt(arr[1]) });
    //     setTit("Địa chỉ mã lỗi");
    //     var d = register.value.data.filter((data) => data.id == arr[1]);
    //     document.getElementById("configvalue").value = d[0][arr[0]]

    // };



    const handleSave = (e) => {
        e.preventDefault();
        var cf = document.getElementById("configvalue")
        //console.log(positon, cf.value)

        switch (positon.col) {
            case "addrcode":
                register.value = {
                    ...register.value,
                    data: register.value.data.map((obj) => {
                        if (obj.id === positon.row) {
                            return { ...obj, [positon.col]: cf.value };
                        }
                        return obj;
                    }),
                }
                break
            case "data":
                var newData = register.value
                const i = newData.data.findIndex((data) => data.id == positon.row)
                const r = newData.data[i].register.findIndex((data) => data.id == positon.item)


                newData.data[i].register[r].addr = cf.value.split(":")[0]
                newData.data[i].register[r].val = cf.value.split(":")[1]

                //console.log(newData)
                register.value = {
                    ...newData
                }

                break
        }

        setConfig(false);
    };

    const handleDelete = (e) => {
        register.value = {
            ...register.value,
            data: register.value.data.filter((newData) => newData.id != e.currentTarget.id).map((data, index) => ({ ...data, id: (index + 1) })),
        }


    };

    const handleAddItem = (e) => {
        //console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split("_")
        const newData = register.value
        const i = newData.data.findIndex((data) => data.id == arr[1])
        newData.data[i].register = [
            ...newData.data[i].register,
            { id: parseInt(newData.data[i].register.length) + 1, addr: parseInt(newData.data[i].register.length + 1) + "-" + newData.data[i].id, val: '1' }
        ]
        console.log(newData.data[i].register)
        register.value = {
            ...newData
        }

    };

    const handleEditItem = (e) => {
        //console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split("_")
        const i = register.value.data.findIndex((data) => data.id == arr[1])
        const r = register.value.data[i].register.find((data) => data.id == arr[2])
        setConfig(true)
        document.getElementById("configvalue").value = r.addr + ":" + r.val
        setPosition({ col: "data", row: arr[1], item: arr[2] })
        setTit("Cấu hình");
    }

    const handleDeleteItem = (e) => {
        console.log(e.currentTarget.id)
        const arr = e.currentTarget.id.split("_")
        const newData = register.value
        const i = newData.data.findIndex((data) => data.id == arr[1])

        console.log(newData.data[i].register)
        if (newData.data[i].register.length > 1) {

            newData.data[i].register = newData.data[i].register.filter((data) => data.id != arr[2]).map((data, index) => {
                return { ...data, id: index + 1 }
            })

            register.value = {
                ...newData
            }
        }
    }



    const handleClose = (e) => {
        setConfig(false);
    };

    return (
        <>
            {isBrowser ?
                <div className="DAT_Register">

                    <DataTable
                        className="DAT_Table_Container"
                        columns={col}
                        data={register.value.data}
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
                <>

                    <div className="DAT_Read">
                        <div className="DAT_Read_Head" onClick={() => props.handleCloseRead()}>
                            <IoIosArrowBack />
                            Thanh ghi
                        </div>

                        <div className="DAT_Read_Body">
                            {register.value.data.map((row, index) => {
                                console.log(row)
                                return (
                                    <div key={index} className="DAT_ViewMobile_Container_Content">
                                        <div className="DAT_ViewMobile_Container_Content_Top"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between"
                                            }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                                                <div
                                                    className="DAT_ViewMobile_Container_Content_Top_right">
                                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content">
                                                        <div className="DAT_ViewMobile_Container_Content_Top_right_content_title">
                                                            {/* Tên mã lỗi : */}
                                                            {/* {row.name} */}
                                                        </div>

                                                        {/* Nguyen nhan */}
                                                        <div className="DAT_ViewMobile_Container_Content_Top_right_content_inforTitle">
                                                            Cấu hình :
                                                        </div>
                                                        {row.register.map((infor, i) => (
                                                            (i === row.length - 1) ?
                                                                <div key={i} className="DAT_ViewMobile_Container_Content_Top_right_content_infor">
                                                                    {/* <span>{`${infor.addr}: ${infor.val}`}</span> */}
                                                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                                                        <span onClick={(e) => handleEditItem(e)}
                                                                            id={"edit_infor_" + row.code + "_" + parseInt(i + 1)}
                                                                            style={{ color: "green", marginRight: "10px" }}>
                                                                            <ion-icon name="create-outline"></ion-icon>
                                                                        </span>
                                                                        <span onClick={(e) => handleDeleteItem(e)}
                                                                            id={"delete_infor_" + row.code + "_" + parseInt(i + 1)}
                                                                            style={{ color: "red", marginRight: "10px" }}>
                                                                            <ion-icon name="trash-outline"></ion-icon>
                                                                        </span>
                                                                        <span onClick={(e) => handleAddItem(e)}
                                                                            id={"add_infor_" + row.code}
                                                                            style={{ color: "red" }}>
                                                                            <ion-icon name="add-circle-outline"></ion-icon>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div key={i} className="DAT_ViewMobile_Container_Content_Top_right_content_infor">
                                                                    <span>{infor.text}</span>
                                                                    <div className="DAT_ViewMobile_Container_Content_Top_right_content_infor_function">
                                                                        <span onClick={(e) => handleEditItem(e)}
                                                                            id={"edit_infor_" + row.code + "_" + parseInt(i + 1)}
                                                                            style={{ color: "green", marginRight: "10px" }}>
                                                                            <ion-icon name="create-outline"></ion-icon>
                                                                        </span>
                                                                        <span onClick={(e) => handleDeleteItem(e)}
                                                                            id={"delete_infor_" + row.code + "_" + parseInt(i + 1)}
                                                                            style={{ color: "red", marginRight: "10px" }}>
                                                                            <ion-icon name="trash-outline"></ion-icon>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="DAT_ViewMobile_Container_Content_Top_left" >
                                                {row.addrcode}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div >
                </>}

            <div className="DAT_Register_Config" style={{ display: config ? "block" : "none" }}>
                <div className="DAT_Register_Config-Group">

                    <div className="DAT_Register_Config-Group-Close" onClick={(e) => handleClose(e)} ><ion-icon name="close-outline"></ion-icon></div>
                    <div className="DAT_Register_Config-Group-Tit">{tit}</div>

                    <form className="DAT_Register_Config-Group-Content" onSubmit={(e) => handleSave(e)}>
                        <input type="text" id="configvalue" required></input>
                        <button>Lưu</button>
                    </form>
                </div>
            </div>
        </>
    );
}
