import React, { useContext, useEffect, useRef, useState } from "react";
import "./Account.scss"

import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import axios from "axios";
import { host } from "../constant";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { editPass } from "./Account";
import { LiaEyeSolid, LiaEyeSlashSolid } from "react-icons/lia";

export default function Pass(props) {
    const mail = useRef("");
    const currentPass = useRef("");
    const newPass = useRef("");
    const confirmPass = useRef();
    const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.user)
    const [confirmpass, setConfirmpass] = useState(true);
    const [oldpass, setOldpass] = useState(true);
    const [newpass, setNewpass] = useState(true);
    const handleSave = (e) => {
        e.preventDefault();
        if (newPass.current.value !== currentPass.current.value) {
            if (newPass.current.value === confirmPass.current.value) {
                console.log(props.username)
                axios.post(host.DEVICE + "/changePassword", { user: user, mail: mail.current.value, curpwd: currentPass.current.value, newpwd: confirmPass.current.value }, { withCredentials: true }).then(
                    function (res) {
                        console.log(res.data)
                        if (res.data.status) {
                            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_24" }), show: 'block' } })
                        } else {
                            switch (res.data.number) {
                                case 1:
                                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_20" }), show: 'block' } })
                                    break
                                case 2:
                                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_21" }), show: 'block' } })
                                    break
                                default:
                                    alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
                                    break

                            }
                        }
                    })

            } else {
                alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_22" }), show: 'block' } })
            }
        } else {
            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_23" }), show: 'block' } })
        }
    };

    const popup_state = {
        pre: { transform: "rotate(0deg)", transition: "0.5s", color: "white" },
        new: { transform: "rotate(90deg)", transition: "0.5s", color: "white" },
    };

    const handlePopup = (state) => {
        const popup = document.getElementById("Popup");
        popup.style.transform = popup_state[state].transform;
        popup.style.transition = popup_state[state].transition;
        popup.style.color = popup_state[state].color;
    };

    // Handle close when press ESC
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                props.handleClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="DAT_Security">
            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                <div className="DAT_Security_Form_Head">
                    <div className="DAT_Security_Form_Head_Left">
                        <p>Đổi mật khẩu</p>
                    </div>

                    <div className="DAT_Security_Form_Head_Right">
                        <div className="DAT_Security_Form_Head_Righ_Icon"
                            id="Popup"
                            onMouseEnter={(e) => handlePopup("new")}
                            onMouseLeave={(e) => handlePopup("pre")}
                            onClick={() => editPass.value = false}
                        >
                            <IoClose size={25} />
                        </div>
                    </div>
                </div>

                <div className="DAT_Security_Form_Body">
                    <div className="DAT_Security_Form_Body_Row">
                        <label>
                            Email
                        </label>
                        <div className="DAT_Security_Form_Body_Row_Item">
                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                <input type="email" placeholder="Nhập Email" ref={mail} required />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_Security_Form_Body_Row">
                        <label>
                            Mật khẩu hiện tại
                        </label>
                        <div className="DAT_Security_Form_Body_Row_Item">
                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                <input type={oldpass === true ? "password" : "text"}
                                    ref={currentPass}
                                    placeholder="Mật Khẩu Hiện Tại" minLength={6}
                                    required />
                                <label onClick={() => setOldpass(!oldpass)}>
                                    {oldpass === false ? (
                                        <LiaEyeSolid size={20} />
                                    ) : (
                                        <LiaEyeSlashSolid size={20} />
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_Security_Form_Body_Row">
                        <label>
                            Mật khẩu mới
                        </label>
                        <div className="DAT_Security_Form_Body_Row_Item">
                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                <input type={newpass === true ? "password" : "text"}
                                    ref={newPass}
                                    placeholder="Mật Khẩu Mới"
                                    minLength={6} required />
                                <label>
                                    {newpass === false ? (
                                        <LiaEyeSolid
                                            size={20}
                                            onClick={() => setNewpass(!newpass)}
                                        />
                                    ) : (
                                        <LiaEyeSlashSolid
                                            size={20}
                                            onClick={() => setNewpass(!newpass)}
                                        />
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_Security_Form_Body_Row">
                        <label>
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="DAT_Security_Form_Body_Row_Item">
                            <div className="DAT_Security_Form_Body_Row_Item_Input">
                                <input
                                    type={confirmpass === true ? "password" : "text"}
                                    ref={confirmPass}
                                    placeholder="Nhập Lại Mật Khẩu Mới"
                                    minLength={6} required />
                                <label onClick={() => setConfirmpass(!confirmpass)}>
                                    {confirmpass === false ? (
                                        <LiaEyeSolid size={20} />
                                    ) : (
                                        <LiaEyeSlashSolid size={20} />
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="DAT_Security_Form_Foot">
                    <button className="DAT_Security_Form_Body_Row_Button" >
                        Xác nhận
                    </button>
                </div>
            </form >
        </div >
    );
}