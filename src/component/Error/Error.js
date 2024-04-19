import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import "./Error.scss";
import { Link } from "react-router-dom";
import Register from "./Register";
import Listerr from "./Listerr";
import Reader from "./Reader";
import { effect, signal } from "@preact/signals-react";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { IoIosAddCircle } from "react-icons/io";
import { BiMessageAltError } from "react-icons/bi";

export const readstate = signal(false);

export const register = signal({
    data: [],
});

export const reader = signal({
    data: [],
});

export const list = signal([]);
export const deviceid = signal("");
export const i_ = signal(0);
const tab = signal("1");

export default function Error(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)";
    const icon = <ion-icon name="construct-outline"></ion-icon>;
    const inf = { code: "Error", tit: "Cài đặt lỗi" };
    const direct = [
        { id: "home", text: "Trang chủ" },
        { id: "list", text: inf.tit },
    ];
    const [readstate, setReadstate] = useState(false);
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);

    const color = {
        cur: "blue",
        pre: "black",
    };

    useLayoutEffect(() => {
        console.log(props.username);
        list.value = [];
        axios
            .post(
                host.DEVICE + "/getErrbyUser",
                { user: props.username, type: "Project" },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)

                var listp = res.data;

                axios
                    .post(
                        host.DEVICE + "/getErrbyUser",
                        { user: props.username, type: "None" },
                        { secure: true, reconnect: true }
                    )
                    .then((res) => {
                        //console.log(res.data)

                        list.value = [...listp, ...res.data];
                        list.value = list.value.map((data, index) => ({
                            ...data,
                            id: index + 1,
                        }));

                        // if(res.data[0] !== undefined){
                        //     i_.value = res.data[0].id
                        //     register.value = res.data[0].setting
                        // }
                    });

                // if(res.data[0] !== undefined){
                //     i_.value = res.data[0].id
                //     register.value = res.data[0].setting
                // }
            });

        axios
            .post(
                host.DEVICE + "/getInfErr",
                { user: props.username },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)

                reader.value = res.data.sort((a, b) => a.code - b.code);
                reader.value =
                    reader.value.map((data, index) => ({ ...data, id: index + 1 })) || [];

                //list.value = res.data.map((data, index) => ({ ...data, id: index + 1 })) || []
                // if(res.data[0] !== undefined){
                //     i_.value = res.data[0].id
                //     register.value = res.data[0].setting
                // }
            });
        // eslint-disable-next-line
    }, []);

    const [nav, setNav] = useState("errlist");
    const handleNav = (e) => {
        var id = e.currentTarget.id;
        setNav(id);
    };

    const handleAddRegister = (e) => {
        e.preventDefault();
        var err = document.getElementById("errcode");
        register.value = {
            ...register.value,
            data: [
                ...register.value.data,
                {
                    id: parseInt(register.value.data.length) + 1,
                    addrcode: err.value,
                    register: [
                        {
                            id: 1,
                            addr: "1-" + parseInt(register.value.data.length + 1),
                            val: 1,
                        },
                    ],
                },
            ],
        };
    };

    const handleUpdate = (e) => {
        console.log(register.value);
        axios
            .post(
                host.DEVICE + "/updateErr",
                {
                    user: props.username,
                    deviceid: deviceid.value,
                    setting: JSON.stringify(register.value),
                },
                { secure: true, reconnect: true }
            )
            .then((res) => {
                //console.log(res.data)
                if (res.data.status) {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_5" }),
                            show: "block",
                        },
                    });
                } else {
                    alertDispatch({
                        type: "LOAD_CONTENT",
                        payload: {
                            content: dataLang.formatMessage({ id: "alert_3" }),
                            show: "block",
                        },
                    });
                }
            });
    };

    const handleAddReader = (e) => {
        e.preventDefault();
        var err = document.getElementById("errid");

        var newData = reader.value.filter((data) => data.code == err.value);
        //console.log(newData)

        if (newData.length > 0) {
            console.log("already exist!");
            alertDispatch({
                type: "LOAD_CONTENT",
                payload: {
                    content: dataLang.formatMessage({ id: "alert_41" }),
                    show: "block",
                },
            });
        } else {
            axios
                .post(
                    host.DEVICE + "/addInfErr",
                    {
                        code: err.value,
                        name: "Lỗi " + parseInt(reader.value.length + 1),
                        type: "Error",
                        infor: JSON.stringify([{ id: 1, text: "..." }]),
                        solution: JSON.stringify([{ id: 1, text: "..." }]),
                        user: props.username,
                    },
                    { secure: true, reconnect: true }
                )
                .then((res) => {
                    console.log(res.data);
                    if (res.data.status) {
                        reader.value = [
                            ...reader.value,
                            {
                                id: parseInt(reader.value.length + 1),
                                code: err.value,
                                name: "Lỗi " + parseInt(reader.value.length + 1),
                                type: "Error",
                                infor: [{ id: 1, text: "..." }],
                                solution: [{ id: 1, text: "..." }],
                            },
                        ];
                        alertDispatch({
                            type: "LOAD_CONTENT",
                            payload: {
                                content: dataLang.formatMessage({ id: "alert_5" }),
                                show: "block",
                            },
                        });
                    } else {
                        alertDispatch({
                            type: "LOAD_CONTENT",
                            payload: {
                                content: dataLang.formatMessage({ id: "alert_3" }),
                                show: "block",
                            },
                        });
                    }
                });
        }
    };

    useEffect(() => {
        console.log(readstate.value);
    }, [readstate.value]);

    return (
        <>
            {isBrowser ? (
                <div className="DAT_Err">
                    <div
                        className="DAT_Err_Banner"
                        style={{
                            backgroundImage: banner,
                            backgroundPosition: "bottom",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                        }}
                    >
                        {/* <div className="DAT_ErrTop-shadow" ></div> */}
                    </div>
                    <div className="DAT_Err_Content">
                        <div className="DAT_Err_Content-Direct">
                            {direct.map((data, index) => {
                                return index === 0 ? (
                                    <Link
                                        key={index}
                                        to="/"
                                        style={{ textDecoration: "none", color: "white" }}
                                    >
                                        <span style={{ cursor: "pointer" }}> {data.text}</span>
                                    </Link>
                                ) : (
                                    <span
                                        key={index}
                                        id={data.id + "_DIR"}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {" "}
                                        {" > " + data.text}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="DAT_Err_Content-Tit">
                            <div className="DAT_Err_Content-Tit-icon">
                                <BiMessageAltError size={25} color="grey" />
                            </div>
                            <div className="DAT_Err_Content-Tit-content">{inf.tit}</div>
                        </div>

                        <div className="DAT_Err_Content_Main">
                            <div className="DAT_Err_Content_Main_Nav">
                                <div
                                    className="DAT_Err_Content_Main_Nav_Item"
                                    id="errlist"
                                    style={{ color: nav === "errlist" ? color.cur : color.pre }}
                                    onClick={(e) => {
                                        handleNav(e);
                                    }}
                                >
                                    Danh sách
                                </div>
                                <div
                                    className="DAT_Err_Content_Main_Nav_Item"
                                    id="register"
                                    style={{ color: nav === "register" ? color.cur : color.pre }}
                                    onClick={(e) => {
                                        handleNav(e);
                                    }}
                                >
                                    Thanh ghi
                                </div>
                                <div
                                    className="DAT_Err_Content_Main_Nav_Item"
                                    id="reader"
                                    style={{ color: nav === "reader" ? color.cur : color.pre }}
                                    onClick={(e) => {
                                        handleNav(e);
                                    }}
                                >
                                    Thông tin
                                </div>
                                {/* HEAD TITLE */}
                                {nav === "register" && deviceid.value !== "" ? (
                                    <div className="DAT_Err_Content_Main_Nav_Add">
                                        <button
                                            className="DAT_Err_Content_Main_Nav_Add-Save"
                                            onClick={(e) => handleUpdate(e)}
                                            style={{ marginRight: "10px" }}
                                        >
                                            <ion-icon name="save"></ion-icon>
                                        </button>
                                        <form onSubmit={(e) => handleAddRegister(e)}>
                                            <input
                                                placeholder="Nhập địa chỉ"
                                                id="errcode"
                                                required
                                            ></input>
                                            <button>
                                                <ion-icon name="add-outline"></ion-icon>
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {nav === "reader" ? (
                                    <div className="DAT_Err_Content_Main_Nav_Add">
                                        <form onSubmit={(e) => handleAddReader(e)}>
                                            <input
                                                placeholder="Nhập mã lỗi"
                                                id="errid"
                                                required
                                            ></input>
                                            <button>
                                                <ion-icon name="add-outline"></ion-icon>
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </div>

                            {/* SWITCH  */}
                            <div className="DAT_Err_Content_Main_List">
                                {(() => {
                                    switch (nav) {
                                        case "errlist":
                                            return (
                                                <>
                                                    <Listerr username={props.username} />
                                                </>
                                            );
                                        case "register":
                                            return (
                                                <>
                                                    <Register username={props.username} />
                                                </>
                                            );
                                        case "reader":
                                            return (
                                                <>
                                                    <Reader username={props.username} />
                                                </>
                                            );
                                        default:
                                            <></>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="DAT_ViewMobile_Container">
                        <div className="DAT_ViewMobile_Container_Head">
                            <BiMessageAltError size={25} color="grey" />
                            <span>{inf.tit}</span>
                        </div>
                        <div className="DAT_ViewMobile_Container_Bar">
                            {/* backgroundColor: tab.value === '1' ? 'rgb(38, 143, 214)' : 'white', */}
                            <div
                                className="DAT_ViewMobile_Container_Bar_project"
                                onClick={() => {
                                    tab.value = "1";
                                }}
                            >
                                <div
                                    className="DAT_ViewMobile_Container_Bar_project_bg"
                                    style={{
                                        height: tab.value === "1" ? "140px" : "200px",
                                        transition: "0.5s",
                                    }}
                                ></div>
                                <div
                                    className="DAT_ViewMobile_Container_Bar_project_add"
                                    style={{
                                        height: tab.value === "1" ? "60px" : "0",
                                        transition: "0.5s",
                                    }}
                                >
                                    <span>Danh sách Gateway</span>
                                </div>
                            </div>
                            <div
                                className="DAT_ViewMobile_Container_Bar_device"
                                onClick={() => {
                                    tab.value = "2";
                                }}
                            >
                                <div
                                    className="DAT_ViewMobile_Container_Bar_device_bg"
                                    style={{
                                        height: tab.value === "2" ? "140px" : "200px",
                                        transition: "0.5s",
                                    }}
                                ></div>
                                <div
                                    className="DAT_ViewMobile_Container_Bar_device_add"
                                    style={{
                                        height: tab.value === "2" ? "60px" : "0",
                                        transition: "0.5s",
                                    }}
                                >
                                    <span>Thêm mã lỗi</span>
                                    <IoIosAddCircle size={30} color="gray" />
                                </div>
                            </div>
                        </div>
                        <div>
                            {tab.value === "1" ? (
                                <Listerr username={props.username} />
                            ) : (
                                <Reader username={props.username} />
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
