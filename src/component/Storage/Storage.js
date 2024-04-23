import React, { useContext, useEffect, useRef, useState } from "react";
import "./Storage.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import DataTable from "react-data-table-component";
import { isBrowser } from "react-device-detect";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDashboard, MdOutlineDelete } from "react-icons/md";
import { lowercasedata } from "../User/Listuser";
export default function Storage(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const inf = { code: 'Device', tit: 'Kho giao diện' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
    const manager = useSelector((state) => state.admin.manager)
    const [data, setData] = useState([]);
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [fix, setFix] = useState(false)
    const [filter, setFilter] = useState([]);

    const name = useRef()
    const id = useRef()
    const paginationComponentOptions = {
        rowsPerPageText: 'Số hàng',
        rangeSeparatorText: 'đến',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'tất cả',
    };

    useEffect(() => {
        axios.post(host.DEVICE + "/getStore", { user: manager }, { withCredentials: true }).then(
            function (res) {
                var newData = res.data;
                newData.map((data, index) => {
                    return (data["ids"] = index + 1);
                });
                setData(newData);
                setFilter(newData);
            })
    }, []);

    const head = [
        {
            name: "STT",
            selector: (row) => row.ids,
            sortable: true,
            width: "75px",
            center: true,
        },
        {
            name: "Tên giao diện",
            selector: (row) => <div id={row.id} onClick={(e) => handleFix(e)} style={{ cursor: "pointer" }}>{row.name} </div>,
            style: {
                justifyContent: "left",
            }
        },
        {
            name: "",
            selector: (row) => {
                return (
                    <div
                        id={row.id}
                        onClick={(e) => handleDelete(e)}
                        style={{ cursor: "pointer", color: "red" }}
                    >
                        <ion-icon name="trash-outline"></ion-icon>
                    </div>
                )
            },
            width: "70px",
            center: true,
        },
    ];


    const handleDelete = (e) => {
        // console.log(e.target.id);
        var newData = data
        newData = newData.filter(data => data.id != e.target.id)
        setData(newData)
        axios.post(host.DEVICE + "/removeStore", { id: e.target.id, user: manager }, { withCredentials: true }).then(
            function (res) {
                console.log(res.data)
                if (res.data.status) {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_27" }), show: 'block' } })
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                }
            })

    };

    const handleFix = (e) => {
        var newdata = data.find(item => item.id == e.target.id);
        //console.log(newdata)
        name.current = newdata.name
        id.current = newdata.id
        setFix(true)
    }

    const handleSaveFix = (e) => {
        e.preventDefault()
        var newdata = [...data]
        console.log(name.current.value, id.current)
        newdata = newdata.map(item => {
            if (item.id == id.current) {
                return { ...item, ...{ name: name.current.value } };
            }
            return item;
        });
        setData(newdata)

        axios.post(host.DEVICE + "/updateStore", { name: name.current.value, id: id.current, user: manager }, { withCredentials: true }).then(
            function (res) {
                console.log(res.data)
                if (res.data.status) {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
                } else {
                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                }
            })
        setFix(false);
    }

    const handleFilter = (e) => {
        const searchTerm = e.currentTarget.value.toLowerCase();
        if (searchTerm == "") {
            setFilter(data)
        } else {
            const df = data.filter((item) => {
                return (lowercasedata(item.name).includes(searchTerm));
            })
            setFilter(df)
        }
    }

    return (
        <>
            {isBrowser ?
                <div className="DAT_Strorage">
                    {/* Banner */}
                    <div className="DAT_Strorage_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                        {/* <div className="DAT_StrorageTop-shadow" ></div> */}
                    </div>

                    {/* Profile Detail */}
                    <div className="DAT_Strorage_Content">
                        <div className="DAT_Strorage_Content_Direct" >
                            {direct.map((data, index) => {
                                return (
                                    (index === 0)
                                        ? <Link key={index} to="/" style={{ textDecoration: 'none', color: "white" }}>
                                            <span style={{ cursor: "pointer" }}> {data.text}</span>
                                        </Link>
                                        : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }}> {' > ' + data.text}</span>
                                )
                            })}
                        </div>
                        <div className="DAT_Strorage_Content_Tit">
                            <div className="DAT_Strorage_Content_Tit-icon">
                                <MdOutlineDashboard size={25} color="grey" />
                            </div>
                            <div className="DAT_Strorage_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className="DAT_Strorage_Content_Main">
                            <div className="DAT_Strorage_Content_Main_Nav">
                                <div className="DAT_Strorage_Content_Main_Nav_Item">
                                    Danh sách giao diện
                                </div>
                            </div>

                            <div className="DAT_Strorage_Content_Main_List">
                                <DataTable
                                    className="DAT_Table_Container"
                                    columns={head}
                                    data={data}
                                    pagination
                                    paginationComponentOptions={paginationComponentOptions}
                                    noDataComponent={
                                        <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                                            <div>Chưa có giao diện trong kho</div>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                :
                <>
                    <div className="DAT_StorageMobile">
                        <div className="DAT_StorageMobile_Tit" >
                            <div className="DAT_StorageMobile_Tit-icon">
                                <MdOutlineDashboard size={25} color="grey" />
                            </div>
                            <div className="DAT_StorageMobile_Tit-content" >
                                {inf.tit}
                            </div>
                        </div>
                        <div className="DAT_Filterbar">
                            <input
                                id="search"
                                type="text"
                                placeholder="Tìm kiếm"
                                style={{ minWidth: "100%" }}
                                onChange={(e) => handleFilter(e)}
                            />
                        </div>
                    </div>
                    {filter.map((data, i) => {
                        return (
                            <div key={i} className="DAT_StorageMobile_Container">
                                <div className="DAT_StorageMobile_Container_List">
                                    <div className="DAT_StorageMobile_Container_List_Item"
                                        id={data.type}
                                    >
                                        {data.ids}
                                    </div>

                                    <div className="DAT_StorageMobile_Container_List_Info">
                                        <div className="DAT_StorageMobile_Container_List_Info_Name"
                                            id={data.id}
                                            onClick={(e) => handleFix(e)}
                                        >
                                            {data.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_StorageMobile_Container_Bottom">
                                    <div className="DAT_StorageMobile_Container_Bottom_Time">
                                        Ngày tạo : ...
                                    </div>
                                    <div className="DAT_StorageMobile_Container_Bottom_Del">
                                        {data.type !== 'master' ?
                                            <MdOutlineDelete
                                                size={20}
                                                color="red"
                                                id={data.name + "_" + data.mail}
                                                onClick={(e) => handleDelete(e)} /> : <></>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </>
            }

            {(fix)
                ? <div className="DAT_StrorageFix" >
                    <form className="DAT_StrorageFix-group" onSubmit={e => handleSaveFix(e)}>
                        <div className="DAT_StrorageFix-group-header">
                            <div className="DAT_StrorageFix-group-header-title">
                                Chỉnh sửa
                            </div>
                            <div className="DAT_StrorageFix-group-header-close"
                                onClick={() => setFix(false)}><ion-icon name="close-outline"></ion-icon></div>
                        </div>

                        <div className="DAT_StrorageFix-group-row">
                            <div className="DAT_StrorageFix-group-row-tit">Tên giao diện</div>
                            <input type="text" minLength={6} defaultValue={name.current} ref={name} required ></input>
                        </div>
                        <div className="DAT_StrorageFix-group-row">
                            <button className="DAT_StrorageFix-group-row-button" >
                                <ion-icon name="save-outline"></ion-icon> Lưu
                            </button>
                        </div>
                    </form>
                </div>
                : <></>
            }
        </>
    )

}