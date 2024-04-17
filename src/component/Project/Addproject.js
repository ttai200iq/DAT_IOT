import React, { useContext, useState } from "react";
import "./Project.scss";
import { useRef } from "react";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { setKey, geocode, RequestType } from "react-geocode";
import { IoClose } from "react-icons/io5";
import { editProject } from "./Project";

export default function AddProject(props) {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  const ProjectAddid = useRef();
  const name = useRef();
  const company = useRef();
  const info = useRef();
  const long = useRef();
  const lat = useRef();
  const bu = useRef('AUTO');
  const [state, setState] = useState(true)


  const ProjectAdd = ['Old', 'New']

  const BU = ['AUTO', 'ELEV', 'SOL', 'UPS']

  const handleProjectAdd = (e) => {
    //console.log(e.currentTarget.value)
    if (e.currentTarget.value === 'Old') {
      setState(false)
    } else {
      setState(true)
    }


  };

  const handleInput = (e) => {

    console.log(info.current.value)
    setKey(process.env.REACT_APP_GGKEY);
    geocode(RequestType.ADDRESS, info.current.value)
      .then((response) => {
        console.log(response.results[0].geometry.location);

        var long_ = document.getElementById("long")
        var lat_ = document.getElementById("lat")
        lat_.value = response.results[0].geometry.location.lat
        long_.value = response.results[0].geometry.location.lng


      })
      .catch((error) => {
        alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_30" }), show: 'block' } })
        console.log(error);
      });

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (state) {
      console.log(ProjectAddid.current.value, name.current.value, company.current.value, info.current.value, long.current.value, lat.current.value)
      axios.post(host.DEVICE + "/createlistProject", { user: props.username, projectid: ProjectAddid.current.value, name: name.current.value, company: company.current.value, addr: info.current.value, lat: lat.current.value, lng: long.current.value }, { secure: true, reconnect: true }).then(
        function (res) {
          console.log(res.data)
          if (res.data.status) {
            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_37" }), show: 'block' } })
          } else {
            if (res.data.number === 1) {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_38" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          }
        })
    } else {
      console.log(ProjectAddid.current.value, bu.current.value)
      axios.post(host.DEVICE + "/addlistProject", { username: props.username, projectid: ProjectAddid.current.value, code: bu.current.value }, { secure: true, reconnect: true }).then(
        function (res) {
          console.log(res.data)
          if (res.data.status) {
            alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_43" }), show: 'block' } })
          } else {
            if (res.data.number === 1) {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_45" }), show: 'block' } })
            } else if (res.data.number === 2) {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_44" }), show: 'block' } })
            } else {
              alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
            }
          }
        })

    }


  };

  return (
    <div className="DAT_ProjectAdd">
      <form className="DAT_ProjectAdd_Form" onSubmit={(e) => handleSubmit(e)}>
        <div className="DAT_ProjectAdd_Form_Head">
          <div className="DAT_ProjectAdd_Form_Head_Left">
            <span>Thêm dự án</span>
          </div>
          <div className="DAT_ProjectAdd_Form_Head_Right">
            <div className="DAT_ProjectAdd_Form_Head_Righ_Close">
              <span style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red"
              }}
                onClick={() => editProject.value = false}>
                <IoClose size={20} color="white" />
              </span>
            </div>
          </div>
        </div>
        <div className="DAT_ProjectAdd_Form_Row">
          <div className="DAT_ProjectAdd_Form_Row_Item">
            <div className="DAT_ProjectAdd_Form_Row_Item_Label">
              * Mã dự án
            </div>
            <input type="text" ref={ProjectAddid} required />
          </div>
        </div>

        {(state)
          ? <>

            <div className="DAT_ProjectAdd_Form_Row">
              <div className="DAT_ProjectAdd_Form_Row_Item">
                <div className="DAT_ProjectAdd_Form_Row_Item_Label">
                  * Tên dự án
                </div>
                <input type="text" ref={name} required />
              </div>
              <div className="DAT_ProjectAdd_Form_Row_Item">
                <div className="DAT_ProjectAdd_Form_Row_Item_Label">
                  * Công ty
                </div>
                <input type="text" ref={company} required />
              </div>
            </div>

            <div className="DAT_ProjectAdd_Form_Row">
              <div className="DAT_ProjectAdd_Form_Row_Item">
                <div className="DAT_ProjectAdd_Form_Row_Item_Label">
                  * Vị trí
                </div>
                <input type="text" ref={info} required />
              </div>
            </div>

            <div className="DAT_ProjectAdd_Form_Row">
              <div className="DAT_ProjectAdd_Form_Row_Item">
                <div className="DAT_ProjectAdd_Form_Row_Item_Label">
                  Vĩ độ
                </div>
                <input type="text" id="lat" ref={lat} onClick={(e) => handleInput(e)} required />
              </div>
              <div className="DAT_ProjectAdd_Form_Row_Item">
                <div className="DAT_ProjectAdd_Form_Row_Item_Label">
                  Kinh độ
                </div>
                <input type="text" id="long" ref={long} onClick={(e) => handleInput(e)} required />
              </div>
            </div>
          </>
          : <div className="DAT_ProjectAdd_Form_Row_Item">
            <div className="DAT_ProjectAdd_Form_Row_Item_Label">
              Mã BU
            </div>
            <select ref={bu}>
              {BU.map((data, index) => {
                return (
                  <option key={index} value={data}>
                    {data}
                  </option>
                );
              })}
            </select>
          </div>
        }

        <div className="DAT_ProjectAdd_Form_Row">
          <button className="DAT_ProjectAdd_Form_Row_Button">
            <ion-icon name="save-outline"></ion-icon>Thêm
          </button>
        </div>
      </form>

    </div>

  );
}