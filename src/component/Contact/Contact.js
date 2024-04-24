import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Contact.scss"

import { logo } from '../MenuTop/MenuTop';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { host } from '../constant';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { AlertContext } from '../Context/AlertContext';
import Resizer from "react-image-file-resizer";
import { action } from '../Control/Action';

import { MdOutlineContactPhone } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { RiImageEditFill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';
import { isBrowser } from 'react-device-detect';

export default function Contact(props) {
    const banner = "linear-gradient(140deg, #0061f2, #6900c7)"
    const inf = { code: 'Report', tit: 'Liên hệ' }
    const direct = [{ id: 'home', text: 'Trang chủ' }, { id: 'list', text: inf.tit }]
    const dataLang = useIntl();
    const { alertDispatch } = useContext(AlertContext);
    const user = useSelector((state) => state.admin.user)
    const [edit, setEdit] = useState(false);
    const [contact, setContact] = useState({
        name: '',
        addr: '',
        phone: '',
    });

    const name = useRef();
    const addr = useRef();
    const phone = useRef();

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
    };

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
    };

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

    return (
        <>
            {isBrowser
                ?
                <div className='DAT_Contact'>
                    <div className="DAT_Contact_Banner" style={{ backgroundImage: banner, backgroundPosition: "bottom", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
                    </div>

                    <div className='DAT_Contact_Content'>
                        <div className='DAT_Contact_Content_Direct'>
                            {direct.map((data, index) => {
                                return (
                                    (index === 0)
                                        ? <Link key={index} to="/"
                                            style={{ textDecoration: 'none', color: "white", fontFamily: "Montserrat-SemiBold" }}
                                        >
                                            <span style={{ cursor: "pointer" }}> {data.text}</span>
                                        </Link>
                                        : <span key={index} id={data.id + "_DIR"} style={{ cursor: "pointer" }}> {' > ' + data.text}</span>
                                )
                            })}
                        </div>

                        <div className="DAT_Contact_Content_Tit">
                            <div className="DAT_Contact_Content_Tit-icon">
                                <MdOutlineContactPhone size={30} color="white" />
                            </div>
                            <div className="DAT_Contact_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className="DAT_Contact_Content_Main">
                            <div className="DAT_Contact_Content_Main_New">
                                <div className='DAT_Contact_Content_Main_New_Content'>
                                    <p style={{ color: "gray" }}>Thông tin liên hệ</p>
                                    <div style={{ paddingLeft: "8px" }}>
                                        <div className='DAT_Contact_Content_Main_New_Content-edit' onClick={() => { setEdit(true) }} ><CiEdit /></div>
                                        <div className='DAT_Contact_Content_Main_New_Content-inf' >
                                            <div className='DAT_Contact_Content_Main_New_Content-tit' >{contact.name}</div>
                                            <div className='DAT_Contact_Content_Main_New_Content-addr' ><span >Địa chỉ: </span> {contact.addr}</div>
                                            <div className='DAT_Contact_Content_Main_New_Content-phone' ><span>Điện thoại: </span>{contact.phone}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className='DAT_Contact_Content_Main_New_Logo'>
                                    <span>Logo</span>
                                    <div>
                                        <div className='DAT_Contact_Content_Main_New_Logo-img' >
                                            <img src={logo.value === '' ? '/dat_icon/logo_DAT.png' : logo.value} alt="" />
                                        </div>
                                        <label htmlFor="file_logo" className='DAT_Contact_Content_Main_New_Logo-add' ><RiImageEditFill /></label>
                                        <input accept="image/*" id="file_logo" type="file" style={{ visibility: "hidden" }} onChange={e => handleLogo(e)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='DAT_ContactEdit' style={{ height: (edit) ? "100vh" : "0px", transition: "0.5s" }}>
                            {edit
                                ?
                                <div className='DAT_ContactEdit_Form' >

                                    <div className="DAT_ContactEdit_Form_Head">
                                        <span>Thông tin liên hệ</span>
                                        <span
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "red",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => { setEdit(false) }}
                                        >
                                            <IoClose size={20} color="white" />
                                        </span>
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
                </div>
                :
                <div className='DAT_ContactMobile'>
                    <div className='DAT_ContactMobile_Content'>
                        <div className='DAT_ContactMobile_Content_Tit'>
                            <div className="DAT_ContactMobile_Content_Tit-icon">
                                <MdOutlineContactPhone size={30} color="gray" />
                            </div>
                            <div className="DAT_ContactMobile_Content_Tit-content" >{inf.tit}</div>
                        </div>

                        <div className='DAT_ContactMobile_Content_Main'>
                            <div className='DAT_ContactMobile_Content_Main_New'>
                                {/* LOGO */}
                                <div className='DAT_ContactMobile_Content_Main_New_Logo'>
                                    <div className='DAT_ContactMobile_Content_Main_New_Logo_Head'>
                                        <span>* Chỉnh sửa Logo</span>
                                    </div>
                                    <div className='DAT_ContactMobile_Content_Main_New_Logo_Content' >
                                        <div className='DAT_ContactMobile_Content_Main_New_Logo_Content_Picture' >
                                            <img src={logo.value === '' ? '/dat_icon/logo_DAT.png' : logo.value} alt="" />
                                            <label htmlFor="file_logo" ><RiImageEditFill /></label>
                                        </div>
                                        <div className='DAT_ContactMobile_Content_Main_New_Logo_Content_Button'>
                                            <input accept="image/*" id="file_logo" type="file" style={{ visibility: "hidden" }} onChange={e => handleLogo(e)} />
                                        </div>
                                    </div>
                                </div>

                                {/* THÔNG TIN LIÊN HỆ */}
                                <div className='DAT_ContactMobile_Content_Main_New_ContactInfo'>
                                    <div className='DAT_ContactMobile_Content_Main_New_ContactInfo_Head'>
                                        <span >* Thông tin liên hệ </span>
                                        <div className='DAT_ContactMobile_Content_Main_New_ContactInfo_Head_Button'>
                                            <label onClick={() => { setEdit(true) }}><CiEdit size={25} /></label>
                                        </div>
                                    </div>
                                    <div className='DAT_ContactMobile_Content_Main_New_ContactInfo_Content'>
                                        <div className='DAT_ContactMobile_Content_Main_New_ContactInfo_Content_Item' onClick={() => { setEdit(true) }} >
                                            <span >Tên liên hệ: </span>
                                            {contact.name}
                                        </div>
                                        <div className='DAT_ContactMobile_Content_Main_New_ContactInfo_Content_Item' onClick={() => { setEdit(true) }} >
                                            <span >Địa chỉ: </span>
                                            {contact.addr}
                                        </div>
                                        <div className='DAT_ContactMobile_Content_Main_New_ContactInfo_Content_Item' onClick={() => { setEdit(true) }} >
                                            <span >Điện thoại: </span>
                                            {contact.phone}
                                        </div>
                                    </div>
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
                                                />
                                            </div>
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
                                                />
                                            </div>
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
                                                />
                                            </div>
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
                    </div>
                </div>
            }
        </>
    );
}