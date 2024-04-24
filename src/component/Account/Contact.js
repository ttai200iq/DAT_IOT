import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Account.scss"

import { logo } from '../MenuTop/MenuTop';
import { avatar } from '../MenuTop/MenuTop';
import { host } from '../constant';
import { AlertContext } from '../Context/AlertContext';
import { action } from '../Control/Action';
import { editPass } from './Account';
import axios from 'axios';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Resizer from "react-image-file-resizer";
import { isBrowser } from 'react-device-detect';
import { signal } from '@preact/signals-react';
import { CiEdit } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { RiImageEditFill } from "react-icons/ri";

export const editAccount = signal(false)

export default function Contact(props) {
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const user = useSelector((state) => state.admin.user)
    const username = useSelector((state) => state.admin.username)
    const mail = useSelector((state) => state.admin.mail)
    // const [edit, setEdit] = useState(false);
    const [contact, setContact] = useState({
        name: '',
        addr: '',
        phone: '',
    });

    // const name = useRef();
    // const addr = useRef();
    // const phone = useRef();

    useEffect(() => {
        console.log(props.username)
        axios.post(host.DEVICE + "/getContact", { user: user }, { secure: true, reconnect: true })
            .then((res) => {
                console.log(res.data)
                if (res.data.status) {
                    setContact({
                        name: res.data.data.name,
                        addr: res.data.data.addr,
                        phone: res.data.data.phone,
                    })
                }
            })
    }, [])

    // const handleContact = () => {
    //     axios.post(host.DEVICE + "/setContact", { user: user, name: name.current.value, addr: addr.current.value, phone: phone.current.value }, { secure: true, reconnect: true })
    //         .then((res) => {
    //             console.log(res.data)
    //             if (res.data.status) {
    //                 //setEdit(false)
    //                 setContact({
    //                     name: name.current.value,
    //                     addr: addr.current.value,
    //                     phone: phone.current.value,
    //                 })
    //             }
    //             alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
    //             setEdit(false);
    //         })
    // }

    // const resizeFile = (file) =>
    //     new Promise((resolve) => {
    //         Resizer.imageFileResizer(
    //             file,
    //             150,
    //             150,
    //             "PNG",
    //             100,
    //             0,
    //             (uri) => {
    //                 resolve(uri);
    //             },
    //             "file"
    //         );
    //     });

    // const handleLogo = async (e) => {
    //     var reader = new FileReader();
    //     console.log("old size", e.target.files[0].size)

    //     if (e.target.files[0].size > 100000) {
    //         const image = await resizeFile(e.target.files[0]);

    //         reader.readAsDataURL(image);

    //         reader.onload = () => {
    //             // setAllImage(reader.result)
    //             //console.log("base 64 new", reader.result)
    //             logo.value = reader.result;
    //             axios.post(host.DEVICE + "/setLogo", { user: user, img: logo.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
    //                 .then((res) => {
    //                     console.log(res.data)
    //                     if (res.data.status) {
    //                         alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
    //                     } else {
    //                         alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
    //                     }
    //                 })
    //         };
    //     } else {
    //         reader.readAsDataURL(e.target.files[0]);
    //         console.log(e.target.files[0].size)
    //         reader.onload = () => {
    //             // setAllImage(reader.result)
    //             //console.log("base 64 new", String(reader.result))
    //             logo.value = reader.result;
    //             axios.post(host.DEVICE + "/setLogo", { user: user, img: logo.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
    //                 .then((res) => {
    //                     console.log(res.data)
    //                     if (res.data.status) {
    //                         alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
    //                     } else {
    //                         alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
    //                     }
    //                 })
    //         };
    //     }
    // }

    const resizeFilAvatar = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                180,
                180,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const handleAvatar = async (e) => {
        var reader = new FileReader();
        console.log("old size", e.target.files[0].size)
        if (e.target.files[0].size > 50000) {
            const image = await resizeFilAvatar(e.target.files[0]);
            console.log(image.size)

            reader.readAsDataURL(image);

            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", reader.result)
                avatar.value = reader.result;
                axios.post(host.DEVICE + "/setAvatar", { user: user, img: avatar.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        //console.log(res.data)
                        if (res.data.status) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                        } else {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        }
                    })
                // setSize(e.target.files[0].size);
            };
        } else {
            reader.readAsDataURL(e.target.files[0]);
            console.log(e.target.files[0].size)
            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", String(reader.result))
                avatar.value = reader.result;
                axios.post(host.DEVICE + "/setAvatar", { user: user, img: avatar.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        //console.log(res.data)
                        if (res.data.status) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                        } else {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        }
                    })
                // setSize(e.target.files[0].size);
            };
        }
    }

    return (
        <>
            {isBrowser
                ?
                <div className='DAT'>
                    <div className='DAT_Contact' >
                        <div className='DAT_Contact_Item'>
                            <div className='DAT_Contact_Item_Content'>
                                <div className='DAT_Contact_Item_Content_Tit'>
                                    Ảnh đại diện:
                                </div>
                                <img src={avatar.value === '' ? '/dat_icon/user_manager.png' : avatar.value} alt="" />
                                <input accept="image/*" id="file_avatar" type="file" style={{ visibility: "hidden" }} onChange={e => handleAvatar(e)} />
                            </div>
                            <label htmlFor="file_avatar" className='DAT_Contact_Item-add' >Thay đổi</label>
                        </div>

                        <div className='DAT_Contact_Item'>
                            <div className='DAT_Contact_Item_Content'>
                                <div className='DAT_Contact_Item_Content_Tit'>
                                    Tên:
                                </div>
                                <div className='DAT_Contact_Item_Content_Label'>
                                    {username}
                                </div>
                            </div>
                            <span>Thay đổi</span>
                        </div>

                        <div className='DAT_Contact_Item'>
                            <div className='DAT_Contact_Item_Content'>
                                <div className='DAT_Contact_Item_Content_Tit'>
                                    Số điện thoại:
                                </div>
                                <div className='DAT_Contact_Item_Content_Label'>
                                    __
                                </div>
                            </div>
                            <span>Thay đổi</span>
                        </div>

                        <div className='DAT_Contact_Item'>
                            <div className='DAT_Contact_Item_Content'>
                                <div className='DAT_Contact_Item_Content_Tit'>
                                    Địa chỉ:
                                </div>
                                <div className='DAT_Contact_Item_Content_Label'>
                                    __
                                </div>
                            </div>
                            <span>Thay đổi</span>
                        </div>

                        <div className='DAT_Contact_Item'>
                            <div className='DAT_Contact_Item_Content'>
                                <div className='DAT_Contact_Item_Content_Tit'>
                                    Mail:
                                </div>
                                <div className='DAT_Contact_Item_Content_Label'>
                                    {mail}
                                </div>
                            </div>
                            <span>Thay đổi</span>
                        </div>

                        <div className='DAT_Contact_Item'>
                            <div className='DAT_Contact_Item_Content'>
                                <div className='DAT_Contact_Item_Content_Tit'>
                                    Mật khẩu:
                                </div>
                                <div className='DAT_Contact_Item_Content_Label'>
                                    ********
                                </div>
                            </div>
                            <span onClick={() => editPass.value = true}>Thay đổi</span>
                        </div>
                    </div >
                </div>
                :
                <div className='DAT_ContactMobile'>
                    {/* THÔNG TIN TÀI KHOẢN */}
                    <div className='DAT_ContactMobile_Info'>
                        <div className='DAT_ContactMobile_Info_Head'>
                            <span>* Thông tin tài khoản </span>
                        </div>

                        <div className='DAT_ContactMobile_Info_Content'>
                            <div className='DAT_ContactMobile_Info_Content_Item' >
                                <span >Tên người dùng: </span>
                                {username}
                            </div>
                            <div className='DAT_ContactMobile_Info_Content_Item' >
                                <span>Mail: </span>
                                {mail}
                            </div>
                            <div className='DAT_ContactMobile_Info_Content_Password' >
                                <span>Mật khẩu: </span>
                                {contact.password}
                                <div className='DAT_ContactMobile_Info_Content_Password_Button'>
                                    <label onClick={() => editPass.value = true}>
                                        <CiEdit />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AVATAR */}
                    <div className='DAT_ContactMobile_Avatar'>
                        <div className='DAT_ContactMobile_Avatar_Head'>
                            <span>* Chỉnh sửa Avatar</span>
                        </div>
                        <div className='DAT_ContactMobile_Avatar_Content' >
                            <div className='DAT_ContactMobile_Avatar_Content_Picture' >
                                <img src={avatar.value === '' ? '/dat_icon/user_manager.png' : avatar.value} alt="" />
                                <label htmlFor="file_avatar"><RiImageEditFill /></label>
                                <div className='DAT_ContactMobile_Avatar_Content_Button'>
                                    <input accept="image/*" id="file_avatar" type="file" style={{ visibility: "hidden" }} onChange={e => handleAvatar(e)} />                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
