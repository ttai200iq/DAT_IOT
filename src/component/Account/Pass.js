import React, { useContext, useRef } from "react";
import "./Account.scss"
import { AlertContext } from "../Context/AlertContext";
import { useIntl } from "react-intl";
import axios from "axios";
import { host } from "../constant";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import { editPass } from "./Account";

export default function Pass(props) {
    const mail = useRef("");
    const currentPass = useRef("");
    const newPass = useRef("");
    const confirmPass = useRef("");
    const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.user)


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

    return (
        <div className="DAT_Security">

            <form className="DAT_Security_Form" onSubmit={(e) => handleSave(e)}>
                <div className="DAT_Security_Form_Head">
                    <div className="DAT_Security_Form_Head_Left">
                        <span>Đổi mật khẩu</span>
                    </div>
                    <div className="DAT_Security_Form_Head_Right">
                        <div className="DAT_Security_Form_Head_Righ_Close">
                            <span style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "red"
                            }}
                                onClick={() => editPass.value = false}>
                                <IoClose size={20} color="white" />
                            </span>
                        </div>
                    </div>
                </div>
                <div className="DAT_Security_Form_Row">
                    <div className="DAT_Security_Form_Row_Item">
                        <div className="DAT_Security_Form_Row_Item_Label"> Email</div>
                        <input type="email" placeholder="Nhập Email" ref={mail} required />
                    </div>
                </div>
                <div className="DAT_Security_Form_Row">
                    <div className="DAT_Security_Form_Row_Item">
                        <div className="DAT_Security_Form_Row_Item_Label"> Mật khẩu hiện tại</div>
                        <input type="password" placeholder="Mật Khẩu Hiện Tại" minLength={6} ref={currentPass} required />
                    </div>
                </div>

                <div className="DAT_Security_Form_Row">
                    <div className="DAT_Security_Form_Row_Item">
                        <div className="DAT_Security_Form_Row_Item_Label"> Mật khẩu mới</div>
                        <input type="password" placeholder="Mật Khẩu Mới" ref={newPass} minLength={6} required />
                    </div>
                </div>

                <div className="DAT_Security_Form_Row">
                    <div className="DAT_Security_Form_Row_Item">
                        <div className="DAT_Security_Form_Row_Item_Label"> Xác nhận mật khẩu mới</div>
                        <input type="password" placeholder="Nhập Lại Mật Khẩu Mới" ref={confirmPass} minLength={6} required />
                    </div>
                </div>
                <div className="DAT_Security_Form_Row">
                    <button className="DAT_Security_Form_Row_Button" >
                        <ion-icon name="save-outline"></ion-icon> Lưu
                    </button>
                </div>

            </form>
        </div>

    );
}