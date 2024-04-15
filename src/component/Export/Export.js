import React, { useEffect } from "react";
import "./Export.scss"
import { Link } from "react-router-dom";
import { useState } from "react";
import { signal } from "@preact/signals-react";
import axios from "axios";
import { host } from "../constant";
import ListEx from "./ListEx";
import ConfigEx from "./ConfigEx";

export const exp = signal([])
export const devicetime = signal('')
export const reporttime = signal([])


export default function Export(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const icon = <ion-icon name="notifications-outline"></ion-icon>
    const inf = { code: 'Notif', tit: 'Cài đặt báo cáo' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])


    const [nav, setNav] = useState("list");

    const color = {
        cur: "blue",
        pre: "black",
    };


    const handleNav = (e) => {
        var id = e.currentTarget.id;

        console.log(id);
        setNav(id);
    };

    useEffect(() => {
        console.log(props.username)
        exp.value = []
        axios.post(host.DEVICE + "/getErrbyUser", { user: props.username, type: "Project" }, { secure: true, reconnect: true })
            .then((res) => {
                console.log(res.data)

                var listp = res.data

                axios.post(host.DEVICE + "/getErrbyUser", { user: props.username, type: "None" }, { secure: true, reconnect: true })
                    .then((res) => {
                        console.log(res.data)

                        exp.value = [...listp, ...res.data]
                        exp.value = exp.value.map((data, index) => ({ ...data, id: index + 1 }))

                        // if(res.data[0] !== undefined){        
                        //     i_.value = res.data[0].id
                        //     register.value = res.data[0].setting
                        // }

                    })

                // if(res.data[0] !== undefined){        
                //     i_.value = res.data[0].id
                //     register.value = res.data[0].setting
                // }

            })






    }, [])



    //     axios.post(host.DEVICE + "/getInfErr", { user: props.username }, { secure: true, reconnect: true })
    //         .then((res) => {
    //             console.log(res.data)
    //             reader.value = res.data.map((data, index) => ({ ...data, id: index + 1 })) || []
    //             //list.value = res.data.map((data, index) => ({ ...data, id: index + 1 })) || []
    //             // if(res.data[0] !== undefined){        
    //             //     i_.value = res.data[0].id
    //             //     register.value = res.data[0].setting
    //             // }

    //         })
    //     // eslint-disable-next-line
    // }, [])







    return (
        <>
            <div className="DAT_Export" >
                <div className="DAT_Export_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    {/* <div className="DAT_Export_Banner_Shadow" ></div> */}

                </div>

                <div className="DAT_Export_Content">
                    <div className="DAT_Export_Content_Direct" >
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
                    <div className="DAT_Export_Content_Tit">
                        <div className="DAT_Export_Content_Tit-icon">
                            {icon}
                        </div>
                        <div className="DAT_Export_Content_Tit-content" >Cài đặt báo cáo</div>
                    </div>
                    {/* Nav */}
                    <div className="DAT_Export_Content_Main">

                        <div className="DAT_Export_Content_Main_Nav">
                            <div
                                className="DAT_Export_Content_Main_Nav_Item"
                                id="list"
                                style={{ color: nav === "list" ? color.cur : color.pre }}
                                onClick={(e) => {
                                    handleNav(e);
                                }}
                            >
                                Danh sách
                            </div>
                            <div
                                className="DAT_Export_Content_Main_Nav_Item"
                                id="config"
                                style={{ color: nav === "config" ? color.cur : color.pre }}
                                onClick={(e) => {
                                    handleNav(e);
                                }}
                            >
                                Cấu hình
                            </div>
                        </div>

                        {/* Content */}
                        <div className="DAT_Export_Content_Main_List">
                            {(() => {
                                switch (nav) {
                                    case "list":
                                        return (
                                            <>
                                                <ListEx username={props.username} />
                                            </>
                                        );
                                    case "config":
                                        return (
                                            <>
                                                <ConfigEx username={props.username} />
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
            {/* Main */}


        </>
    )
}