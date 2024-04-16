import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Account.scss"
import { FaHome } from "react-icons/fa";
import { logo } from '../MenuTop/MenuTop';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { host } from '../constant';
import { IoClose, IoCloseSharp } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { avatar } from '../MenuTop/MenuTop';
import { RiImageAddLine } from "react-icons/ri";
import { FaRegSave } from "react-icons/fa";
import { useIntl } from 'react-intl';
import { AlertContext } from '../Context/AlertContext';
import { useSelector } from 'react-redux';
import Resizer from "react-image-file-resizer";
import { action } from '../Control/Action';
import { editPass } from './Account';
import { isBrowser } from 'react-device-detect';
import { signal } from '@preact/signals-react';

export const editAccount = signal(false)
function Contact(props) {

    //console.log(logo.value)
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const user = useSelector((state) => state.admin.user)
    const username = useSelector((state) => state.admin.username)
    const mail = useSelector((state) => state.admin.mail)
    const [edit, setEdit] = useState(false);
    const [contact, setContact] = useState({
        name: '',
        addr: '',
        phone: '',
    });

    const name = useRef();
    const addr = useRef();
    const phone = useRef();

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

    const handleContact = () => {
        axios.post(host.DEVICE + "/setContact", { user: user, name: name.current.value, addr: addr.current.value, phone: phone.current.value }, { secure: true, reconnect: true })
            .then((res) => {
                console.log(res.data)
                if (res.data.status) {
                    //setEdit(false)
                    setContact({
                        name: name.current.value,
                        addr: addr.current.value,
                        phone: phone.current.value,
                    })
                }
                alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                setEdit(false);
            })
    }

    const resizeFile = (file) =>
        new Promise((resolve) => {
            Resizer.imageFileResizer(
                file,
                150,
                150,
                "PNG",
                100,
                0,
                (uri) => {
                    resolve(uri);
                },
                "file"
            );
        });

    const handleLogo = async (e) => {
        var reader = new FileReader();
        console.log("old size", e.target.files[0].size)

        if (e.target.files[0].size > 100000) {
            const image = await resizeFile(e.target.files[0]);

            reader.readAsDataURL(image);

            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", reader.result)
                logo.value = reader.result;
                axios.post(host.DEVICE + "/setLogo", { user: user, img: logo.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.status) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                        } else {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        }
                    })
            };

        } else {
            reader.readAsDataURL(e.target.files[0]);
            console.log(e.target.files[0].size)
            reader.onload = () => {
                // setAllImage(reader.result)
                //console.log("base 64 new", String(reader.result))
                logo.value = reader.result;
                axios.post(host.DEVICE + "/setLogo", { user: user, img: logo.value }, { credential: true }, { headers: { "Content-Type": "multipart/form-data" }, })
                    .then((res) => {
                        console.log(res.data)
                        if (res.data.status) {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' }))
                        } else {
                            alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' }))
                        }
                    })
            };
        }
    }

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
            {isBrowser ?
                <div className='DAT'>
                    <div className='DAT_Contact' >
                        <div className='DAT_Contact_Avatar'>
                            <span>Ảnh đại diện</span>
                            <div className='DAT_Contact_Avatar-group'>
                                <img src={avatar.value === '' ? '/dat_icon/user_manager.png' : avatar.value} alt="" />

                                <label htmlFor="file_avatar" className='DAT_Contact_Avatar-group-add' ><RiImageAddLine /></label>
                                <input accept="image/*" id="file_avatar" type="file" style={{ visibility: "hidden" }} onChange={e => handleAvatar(e)} />
                            </div>
                            <div style={{ marginBottom: "10px" }}><span>Tên</span>: {username}</div>
                            <div style={{ marginBottom: "10px" }}><span>Mail</span>: {mail}</div>
                            <div style={{ marginBottom: "10px" }}><span>Mật khẩu</span>: ******** <span style={{ cursor: "pointer" }} onClick={() => editPass.value = true} ><CiEdit /></span></div>

                        </div>
                        <div className='DAT_Contact_Infor'>
                            <span style={{ color: "blue" }}>Thông tin liên hệ</span>
                            <div className='DAT_Contact_Infor_Content'>
                                <div className='DAT_Contact_Infor_Content-edit' onClick={() => { setEdit(true) }} ><CiEdit /></div>
                                <div className='DAT_Contact_Infor_Content-inf' >
                                    <div className='DAT_Contact_Infor_Content-tit' >{contact.name}</div>
                                    <div className='DAT_Contact_Infor_Content-addr' ><span style={{ color: "blue" }} >Địa chỉ: </span> {contact.addr}</div>
                                    <div className='DAT_Contact_Infor_Content-phone' ><span style={{ color: "blue" }}>Điện thoại: </span>{contact.phone}</div>
                                </div>
                            </div>
                            <span style={{ color: "blue" }}>Logo</span>
                            <div className='DAT_Contact_Infor_Logo' >

                                <div className='DAT_Contact_Infor_Logo-img' >
                                    <img src={logo.value === '' ? '/dat_icon/logo_DAT.png' : logo.value} alt="" />
                                </div>
                                <label htmlFor="file_logo" className='DAT_Contact_Infor_Logo-add' ><RiImageAddLine /></label>
                                <input accept="image/*" id="file_logo" type="file" style={{ visibility: "hidden" }} onChange={e => handleLogo(e)} />
                            </div>

                        </div>
                    </div >
                    <div className='DAT_ContactEdit' style={{ height: (edit) ? "100vh" : "0px", transition: "0.5s" }}>
                        {edit
                            ?
                            <div className='DAT_ContactEdit_Form' >

                                <div className="DAT_ContactEdit_Form_Head">
                                    <span>Thông tin liên hệ</span>
                                    <span onClick={() => { setEdit(false) }}><IoClose size={20} color="white" /></span>
                                </div>
                                <div className="DAT_ContactEdit_Form_Row">
                                    <div className="DAT_ContactEdit_Form_Row_Item">
                                        <div className="DAT_ContactEdit_Form_Row_Item_Label">Tiêu đề</div>
                                        <input
                                            type='text'
                                            defaultValue={contact.name}
                                            ref={name}
                                            placeholder='Nhập tên liên lạc..'
                                        />
                                    </div>

                                    <div className="DAT_ContactEdit_Form_Row_Item">
                                        <div className="DAT_ContactEdit_Form_Row_Item_Label">Địa chỉ</div>
                                        <input
                                            type='text'
                                            defaultValue={contact.addr}
                                            ref={addr}
                                            placeholder='Nhập địa chỉ..'
                                        />
                                    </div>
                                </div>

                                <div className="DAT_ContactEdit_Form_Row">
                                    <div className="DAT_ContactEdit_Form_Row_Item">
                                        <div className="DAT_ContactEdit_Form_Row_Item_Label">Điện thoại</div>
                                        <input
                                            type='text'
                                            defaultValue={contact.phone}
                                            ref={phone}
                                            placeholder='Nhập số điện thoại..'
                                        />
                                    </div>
                                </div>

                                <div className="DAT_ContactEdit_Form_Row">
                                    <button className="DAT_ContactEdit_Form_Row_Button" onClick={() => { handleContact() }}>
                                        <ion-icon name="save-outline"></ion-icon>Lưu
                                    </button>
                                </div>
                            </div>
                            : <></>
                        }
                    </div>
                </div>
                : <div className='DAT_ContactMobile'>
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

                    {/* LOGO */}
                    <div className='DAT_ContactMobile_Logo'>
                        <div className='DAT_ContactMobile_ContactInfo_Head'>
                            <span>* Chỉnh sửa Logo</span>
                        </div>
                        <div className='DAT_ContactMobile_Logo_Content' >
                            <div className='DAT_ContactMobile_Logo_Content_Picture' >
                                <img src={logo.value === '' ? '/dat_icon/logo_DAT.png' : logo.value} alt="" />
                                <label htmlFor="file_logo" ><RiImageAddLine /></label>
                            </div>
                            <div className='DAT_ContactMobile_Logo_Content_Button'>
                                <input accept="image/*" id="file_logo" type="file" style={{ visibility: "hidden" }} onChange={e => handleLogo(e)} />
                            </div>
                        </div>
                    </div>

                    {/* THÔNG TIN LIÊN HỆ */}
                    <div className='DAT_ContactMobile_ContactInfo'>
                        <div className='DAT_ContactMobile_ContactInfo_Head'>
                            <span >* Thông tin liên hệ </span>
                            <div className='DAT_ContactMobile_ContactInfo_Head_Button'>
                                <label onClick={() => { setEdit(true) }}><CiEdit /></label>
                            </div>
                        </div>
                        <div className='DAT_ContactMobile_ContactInfo_Content'>
                            <div className='DAT_ContactMobile_ContactInfo_Content_Item' onClick={() => { setEdit(true) }} >
                                <span >Tên liên hệ: </span>
                                {contact.name}
                            </div>
                            <div className='DAT_ContactMobile_ContactInfo_Content_Item' onClick={() => { setEdit(true) }} >
                                <span >Địa chỉ: </span>
                                {contact.addr}
                            </div>
                            <div className='DAT_ContactMobile_ContactInfo_Content_Item' onClick={() => { setEdit(true) }} >
                                <span >Điện thoại: </span>
                                {contact.phone}
                            </div>
                        </div>
                    </div>

                    <div className='DAT_ContactEditMobile' style={{ height: (edit) ? "100vh" : "0px", transition: "0.5s" }}>
                        {edit
                            ?
                            <div className='DAT_ContactEditMobile_Form' >
                                <div className="DAT_ContactEditMobile_Form_Head">
                                    <div className="DAT_ContactEditMobile_Form_Head_Left">
                                        <span>Thông tin liên hệ</span>
                                    </div>
                                    <div className="DAT_ContactEditMobile_Form_Head_Right">
                                        <div className="DAT_ContactEditMobile_Form_Head_Right_Close">
                                            <span onClick={() => { setEdit(false) }}>
                                                <IoClose size={20} color="white" />
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_ContactEditMobile_Form_Body">
                                    <div className="DAT_ContactEditMobile_Form_Body_Content">
                                        <div className="DAT_ContactEditMobile_Form_Body_Content_Item">
                                            <div className="DAT_ContactEditMobile_Form_Body_Content_Item_Label">
                                                Tên liên hệ:
                                            </div>
                                            <input
                                                type='text'
                                                defaultValue={contact.name}
                                                ref={name}
                                                placeholder='Nhập tên liên lạc..'
                                            />                                        </div>
                                    </div>

                                    <div className="DAT_ContactEditMobile_Form_Body_Content">
                                        <div className="DAT_ContactEditMobile_Form_Body_Content_Item">
                                            <div className="DAT_ContactEditMobile_Form_Body_Content_Item_Label">
                                                Địa chỉ:
                                            </div>
                                            <input
                                                type='text'
                                                defaultValue={contact.addr}
                                                ref={addr}
                                                placeholder='Nhập địa chỉ..'
                                            />                                        </div>
                                    </div>

                                    <div className="DAT_ContactEditMobile_Form_Body_Content">
                                        <div className="DAT_ContactEditMobile_Form_Body_Content_Item">
                                            <div className="DAT_ContactEditMobile_Form_Body_Content_Item_Label">
                                                Điện thoại:
                                            </div>
                                            <input
                                                type='text'
                                                defaultValue={contact.phone}
                                                ref={phone}
                                                placeholder='Nhập số điện thoại..'
                                            />                                        </div>
                                    </div>

                                    <div className="DAT_ContactEditMobile_Form_Body_Content">
                                        <div className="DAT_ContactEditMobile_Form_Body_Content_Item">
                                            <button onClick={() => { handleContact() }}>
                                                <ion-icon name="save-outline"></ion-icon>Lưu
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <></>
                        }
                    </div>

                    {/* AVATAR */}
                    <div className='DAT_ContactMobile_Avatar'>
                        <div className='DAT_ContactMobile_Avatar_Head'>
                            <span>* Chỉnh sửa Avatar</span>
                        </div>
                        <div className='DAT_ContactMobile_Avatar_Content' >
                            <div className='DAT_ContactMobile_Avatar_Content_Picture' >
                                <img src={avatar.value === '' ? '/dat_icon/user_manager.png' : avatar.value} alt="" />
                                <label htmlFor="file_avatar"><RiImageAddLine /></label>
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

export default Contact;