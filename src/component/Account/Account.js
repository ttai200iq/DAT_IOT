import React from "react";
import "./Account.scss"
import { useState } from "react";
import { Link } from "react-router-dom";
// import Info from "../User/Info";
// import Security from "./Pass";
import Language from "./Language";
//import { useSelector } from "react-redux";
import Pass from "./Pass";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import Contact from "./Contact";
import { signal } from "@preact/signals-react";
import { isBrowser } from "react-device-detect";
import { FaRegUser } from "react-icons/fa6";
export const editPass = signal(false)

export default function Acount(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const icon = <ion-icon name="construct-outline"></ion-icon>
    const inf = { code: 'Report', tit: 'Tài khoản' }
    const direct = [{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }]
    const iconmobile = <FaRegUser color="gray" size={25} />

    const type = useSelector((state) => state.admin.type)

    const color = {
        cur: "blue",
        pre: "black"
    }
    const [nav, setNav] = useState("contact");
    return (
        <>
            {isBrowser
                ? <div className="DAT_Account" >
                    <div className="DAT_Account_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                        {/* <div className="DAT_AcountTop-shadow" ></div> */}
                    </div>
                    <div className="DAT_Account_Content">
                        <div className="DAT_Account_Content_Direct" >
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
                        <div className="DAT_Account_Content_Tit">
                            <div className="DAT_Account_Content_Tit-icon">
                                {icon}
                            </div>
                            <div className="DAT_Account_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className="DAT_Account_Content_Main">
                            <div className="DAT_Account_Content_Main_Nav">
                                <div className="DAT_Account_Content_Main_Nav_Item">
                                    Thông tin
                                </div>
                            </div>
                            <div className="DAT_Account_Content_Main_New">
                                <Contact username={props.username} />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_Account_Pass" style={{ height: editPass.value ? "100vh" : "0", transition: "0.5s" }}>
                        {editPass.value ? <Pass username={props.username} /> : <></>}
                    </div>

                </div>
                : <div className="DAT_AccountMobile">
                    <div className="DAT_AccountMobile_Head" >
                        {iconmobile}
                        <span >{inf.tit}</span>
                    </div>
                </div>
            }

        </>
    )
}