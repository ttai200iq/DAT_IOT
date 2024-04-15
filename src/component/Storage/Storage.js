import React, { useContext, useEffect, useRef, useState } from "react";
import "./Storage.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import DataTable from "react-data-table-component";
export default function Storage(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const icon = <ion-icon name="construct-outline"></ion-icon>
    const inf = { code: 'Device', tit: 'Kho giao diện' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
    const manager = useSelector((state) => state.admin.manager)
    const [data, setData] = useState([]);
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const [fix, setFix] = useState(false)
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
                console.log(res.data)
                var newData = res.data;
                newData.map((data, index) => {
                    return (data["ids"] = index + 1);
                });
                console.log(newData);
                setData(newData);


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
                        xóa
                    </div>

                )
            },
            width: "70px",
            center: true,
        },
    ];


    const handleDelete = (e) => {
        console.log(e.target.id);


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

    }



    return (
        <>
            <div className="DAT_Strorage">

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
                            {icon}
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









            {(fix)
                ? <div className="DAT_StrorageFix" >
                    <form className="DAT_StrorageFix-group" onSubmit={e => handleSaveFix(e)}>
                        <div className="DAT_StrorageFix-group-close" onClick={() => setFix(false)}><ion-icon name="close-outline"></ion-icon></div>
                        <div className="DAT_StrorageFix-group-row">
                            <div className="DAT_StrorageFix-group-row-tit">Tên giao diện</div>
                            <input type="text" minLength={6} defaultValue={name.current} ref={name} required ></input>
                        </div>


                        <div className="DAT_StrorageFix-group-row">
                            <button>Xác Nhận</button>
                        </div>



                    </form>
                </div>
                : <></>
            }
        </>
    )

}