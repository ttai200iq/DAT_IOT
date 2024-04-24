import React, { useEffect } from "react";
import "./User.scss"
import { useState } from "react";
import { Link } from "react-router-dom";
import Info from "./Info";
import { useSelector } from "react-redux";
import Listuser, { delstate } from "./Listuser";
import { IoMdAdd } from "react-icons/io";
import { signal } from "@preact/signals-react";
import { isBrowser } from "react-device-detect";
import { HiOutlineUsers } from "react-icons/hi2";
import Raisebox from "../Raisebox/Raisebox";
export const editUser = signal(false)

export default function User(props) {
    const [data, setData] = useState([]);
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const inf = { code: 'Report', tit: 'Người dùng' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])
    const color = {
        cur: "blue",
        pre: "black"
    }
    const type = useSelector((state) => state.admin.type)
    const [nav, setNav] = useState("info");
    const [changefilter, setChangefilter] = useState(true)
    const handleNav = () => {
        editUser.value = true
    };

    return (
        <>
            {isBrowser ?
                <div className="DAT_User" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    <div className="DAT_User_Banner">
                        {/* <div className="DAT_UserTop-shadow" ></div> */}
                    </div>
                    <div className="DAT_User_Content">

                        <div className="DAT_User_Content_Direct" >
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
                        <div className="DAT_User_Content_Tit">
                            <div className="DAT_User_Content_Tit-icon">
                                <HiOutlineUsers size={25} color="grey" />
                            </div>
                            <div className="DAT_User_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className="DAT_User_Content_Main">
                            <div className="DAT_User_Content_Main_Nav">


                                <div className="DAT_User_Content_Main_Nav_Item">
                                    Danh sách người dùng
                                </div>

                                <div
                                    className="DAT_User_Content_Main_Nav_Add"
                                    onClick={(e) => {
                                        handleNav();
                                    }}
                                >
                                    <IoMdAdd color="white" size={18} />
                                </div>

                            </div>

                            {/* Content */}
                            <div className="DAT_User_Content_Main_New">

                                <Listuser username={props.username} />
                            </div>
                        </div>

                    </div>


                </div> :

                <div className="DAT_UserListDetail">
                    <div className="DAT_UserListDetail_HeadTit">
                        <HiOutlineUsers size={25} color="grey" />
                        <span >{inf.tit}</span>
                    </div>
                    <div className="DAT_UserListDetail_Content">
                        <div className="DAT_UserListDetail_Content_List">
                            <Listuser username={props.username} />
                        </div>
                    </div>

                </div >
            }

            <div className="DAT_User_Fix" style={{ height: editUser.value ? "100vh" : "0", transition: "0.5s" }}>
                {editUser.value ? <Info username={props.username} /> : <></>}
            </div>
            <div className="DAT_User_Fix" style={{ height: delstate.value ? "100vh" : "0", transition: "0.5s" }}>
                {delstate.value ? <Raisebox /> : <></>}
            </div>
        </>
    )
}