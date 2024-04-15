import React, { useState } from "react";
import "./Project.scss"
import { Link } from "react-router-dom";
import Addproject from "./Addproject";
import Listproject from "./Listproject";
import { IoMdAdd } from "react-icons/io";
import { signal } from "@preact/signals-react";
export const editProject = signal(false)


export default function Project(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const icon = <ion-icon name="construct-outline"></ion-icon>
    const inf = { code: 'Device', tit: 'Dự án' }
    const [direct, SetDirect] = useState([{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }])

    // const tit = {
    //     project: "Dự Án",
    //     device: "Thiết Bị",
    // };

    const color = {
        cur: "blue",
        pre: "black",
    };

    const [nav, setNav] = useState("project");
    const handleNav = (e) => {
        editProject.value = true
    };



    return (
        <>
            <div className="DAT_Project" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                <div className="DAT_Project_Banner">
                    {/* <div className="DAT_ProjectTop-shadow" ></div> */}
                </div>
                <div className="DAT_Project_Content">

                    <div className="DAT_Project_Content_Direct" >
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
                    <div className="DAT_Project_Content_Tit">
                        <div className="DAT_Project_Content_Tit-icon">
                            {icon}
                        </div>
                        <div className="DAT_Project_Content_Tit-content" >{inf.tit}</div>
                    </div>
                    {/* Nav */}
                    <div className="DAT_Project_Content_Main">

                        <div className="DAT_Project_Content_Main_Nav">

                            <div
                                className="DAT_Project_Content_Main_Nav_Item"
                            >
                                Danh sách dự án
                            </div>

                            <div
                                className="DAT_Project_Content_Main_Nav_Add"
                                onClick={(e) => {
                                    handleNav();
                                }}
                            >
                                <IoMdAdd color="white" size={18} />
                            </div>

                        </div>
                        <div className="DAT_Project_Content_Main_New">
                            <Listproject username={props.username} />
                        </div>
                    </div>
                </div>

                <div className="DAT_Project_Fix" style={{ height: editProject.value ? "100vh" : "0", transition: "0.5s" }}>
                    {editProject.value ? <Addproject username={props.username} /> : <></>}
                </div>

            </div>




        </>
    )
}
