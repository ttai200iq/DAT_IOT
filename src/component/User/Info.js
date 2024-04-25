import React, { useContext, useEffect, useRef, useState } from "react";
import "./User.scss";
import { useSelector } from "react-redux";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { IoClose } from "react-icons/io5";
import { editUser } from "./User";
import { data } from "./Listuser";

export default function Info() {
    const type = useSelector((state) => state.admin.type);
    const user = useSelector((state) => state.admin.user);
    const userName = useRef("");
    const mail = useRef("");
    const pass = useRef("");
    const authpass = useRef("");
    const fullname = useRef("");
    const { alertDispatch } = useContext(AlertContext);
    const dataLang = useIntl();
    const [gettype, setGettype] = useState("");


    useEffect(() => {
        if (type === "master") {
            setGettype("admin");
        } else {
            setGettype("user");
        }
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        if (pass.current.value === authpass.current.value) {
            axios
                .post(
                    host.DEVICE + "/createAcount",
                    {
                        user: userName.current.value,
                        username: fullname.current.value,
                        mail: mail.current.value,
                        pass: authpass.current.value,
                        type: gettype,
                        admin: user,
                        manager: userName.current.value,
                    },
                    { withCredentials: true }
                )
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.status) {
                        alertDispatch({
                            type: "LOAD_CONTENT",
                            payload: {
                                content: dataLang.formatMessage({ id: "alert_12" }),
                                show: "block",
                            },
                        });
                        editUser.value = false;

                        axios.post(host.DEVICE + "/getAcount", { admin: user }, { withCredentials: true }).then(
                            function (res) {
                                var newData = res.data.map((data, index) => {
                                    data["id"] = index + 1;
                                    return data;
                                });
                                data.value = newData;
                            })

                    } else {
                        switch (res.data.number) {
                            case 1:
                                alertDispatch({
                                    type: "LOAD_CONTENT",
                                    payload: {
                                        content: dataLang.formatMessage({ id: "alert_10" }),
                                        show: "block",
                                    },
                                });
                                break;
                            case 2:
                                alertDispatch({
                                    type: "LOAD_CONTENT",
                                    payload: {
                                        content: dataLang.formatMessage({ id: "alert_11" }),
                                        show: "block",
                                    },
                                });
                                break;
                            default:
                                alertDispatch({
                                    type: "LOAD_CONTENT",
                                    payload: {
                                        content: dataLang.formatMessage({ id: "alert_3" }),
                                        show: "block",
                                    },
                                });
                                break;
                        }
                    }
                });
        } else {
            alertDispatch({
                type: "LOAD_CONTENT",
                payload: {
                    content: dataLang.formatMessage({ id: "alert_22" }),
                    show: "block",
                },
            });
        }
        //console.log(userName.current.value, mail.current.value, pass.current.value, authpass.current.value, fullname.current.value, id.current.value)
    };

    return (
        <div className="DAT_Info">
            <form className="DAT_Info_Form" onSubmit={(e) => handleSave(e)}>
                <div className="DAT_Info_Form_Head">
                    <div className="DAT_Info_Form_Head_Left">
                        <span>Thêm người dùng</span>
                    </div>
                    <div className="DAT_Info_Form_Head_Right">
                        <div className="DAT_Info_Form_Head_Right_Close">
                            <span
                                style={{
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "red",
                                }}
                                onClick={() => (editUser.value = false)}
                            >
                                <IoClose size={20} color="white" />
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    className="DAT_Info_Form_Row"
                    style={{ borderRadius: "5px 5px 0 0" }}
                >
                    <div className="DAT_Info_Form_Row_Item">
                        <div className="DAT_Info_Form_Row_Item_Label">Tên</div>
                        <input type="text" placeholder="Nhập tên" ref={fullname} required />
                    </div>

                    <div className="DAT_Info_Form_Row_Item">
                        <div className="DAT_Info_Form_Row_Item_Label">Email</div>
                        <input type="email" placeholder="Nhập Email" ref={mail} required />
                    </div>
                </div>

                <div className="DAT_Info_Form_Row">
                    <div className="DAT_Info_Form_Row_Item">
                        <div className="DAT_Info_Form_Row_Item_Label">Tài khoản</div>
                        <input
                            type="text"
                            placeholder="Tài khoản"
                            ref={userName}
                            required
                        />
                    </div>
                </div>

                <div className="DAT_Info_Form_Row">
                    <div className="DAT_Info_Form_Row_Item">
                        <div className="DAT_Info_Form_Row_Item_Label">Mật khẩu</div>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            ref={pass}
                            required
                        />
                    </div>
                </div>
                <div className="DAT_Info_Form_Row">
                    <div className="DAT_Info_Form_Row_Item">
                        <div className="DAT_Info_Form_Row_Item_Label">
                            Xác nhận mật khẩu
                        </div>
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            ref={authpass}
                            required
                        />
                    </div>
                </div>

                <div
                    className="DAT_Info_Form_Row"
                    style={{ borderRadius: "0 0 5px 5px" }}
                >
                    <button className="DAT_Info_Form_Row_Button">
                        <ion-icon name="save-outline"></ion-icon>Thêm
                    </button>
                </div>
            </form>
        </div>
    );
}
