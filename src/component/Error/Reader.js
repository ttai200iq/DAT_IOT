import React, { useContext, useState } from "react";
import "./Error.scss";
import DataTable from "react-data-table-component";
import { reader } from "./Error";
import axios from "axios";
import { host } from "../constant";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";
import { isBrowser } from "react-device-detect";
import { IoIosArrowBack } from "react-icons/io";

export default function Reader(props) {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  const [config, setConfig] = useState(false);
  const [tit, setTit] = useState("");
  const [positon, setPosition] = useState({ col: "", row: 0 });
  const paginationComponentOptions = {
    rowsPerPageText: 'Số hàng',
    rangeSeparatorText: 'đến',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'tất cả',
  };
  const col = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Mã Lỗi",
      selector: (row) => row.code,
      sortable: true,
      width: "100px",

    },
    {
      name: "Tên Lỗi",
      selector: (row) => (
        <>
          <div
            id={"name_" + row.code}
            onClick={(e) => handleChange(e)}
            style={{ cursor: "pointer" }}
          >
            {row.name}
          </div>
        </>
      ),
      sortable: true,
      minWidth: "250px",
      style: {
        justifyContent: "left",
      }

    },
    {
      name: "Loại Lỗi",
      selector: (row) => (
        <>
          <div
            id={"type_" + row.code}
            onClick={(e) => handleChange(e)}
            style={{ cursor: "pointer" }}
          >
            {row.type}
          </div>
        </>
      ),
      width: "100px",
      center: true,
    },
    {
      name: "Nguyên Nhân",
      selector: (row) => (
        <>
          <div

            style={{ cursor: "pointer" }}
          >
            {row.infor.map((data, i) => {
              return (
                (i === row.infor.length - 1)
                  ? <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}><span id={"text_infor" + "_" + row.id + "_" + parseInt(i + 1)} style={{ width: "200px", marginRight: "10px", textAlign: "justify", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>- {data.text}</span><span id={"edit_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)} style={{ color: "green", marginRight: "10px" }}><ion-icon name="create-outline"></ion-icon></span><span id={"delete_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)} style={{ color: "red", marginRight: "10px" }}><ion-icon name="trash-outline"></ion-icon></span><span id={"add_infor_" + row.code} onClick={(e) => handleAddItem(e)} style={{ color: "red" }}><ion-icon name="add-circle-outline"></ion-icon></span></div>
                  : <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}><span id={"text_infor" + "_" + row.id + "_" + parseInt(i + 1)} style={{ width: "200px", marginRight: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>- {data.text}</span><span id={"edit_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)} style={{ color: "green", marginRight: "10px" }}><ion-icon name="create-outline"></ion-icon></span><span id={"delete_infor_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)} style={{ color: "red", marginRight: "10px" }}><ion-icon name="trash-outline"></ion-icon></span></div>
              )
            })}
          </div>
        </>
      ),
      minWidth: "300px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "Biện Pháp",
      selector: (row) => (
        <>
          <div

            style={{ cursor: "pointer" }}
          >
            {row.solution.map((data, i) => {
              return (
                (i === row.solution.length - 1)
                  ? <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}><span id={"text_solution_" + "_" + row.code + "_" + parseInt(i + 1)} style={{ width: "200px", marginRight: "10px", textAlign: "justify", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>- {data.text}</span><span id={"edit_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)} style={{ color: "green", marginRight: "10px" }}><ion-icon name="create-outline"></ion-icon></span><span id={"delete_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)} style={{ color: "red", marginRight: "10px" }}><ion-icon name="trash-outline"></ion-icon></span><span id={"add_solution_" + row.code} onClick={(e) => handleAddItem(e)} style={{ color: "red" }}><ion-icon name="add-circle-outline"></ion-icon></span></div>
                  : <div key={i} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}><span id={"text_solution_" + "_" + row.code + "_" + parseInt(i + 1)} style={{ width: "200px", marginRight: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>- {data.text}</span><span id={"edit_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleEditItem(e)} style={{ color: "green", marginRight: "10px" }}><ion-icon name="create-outline"></ion-icon></span><span id={"delete_solution_" + row.code + "_" + parseInt(i + 1)} onClick={(e) => handleDeleteItem(e)} style={{ color: "red", marginRight: "10px" }}><ion-icon name="trash-outline"></ion-icon></span></div>
              )
            })}
          </div>
        </>
      ),
      minWidth: "300px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "",
      selector: (row) => (
        <>
          <div
            id={row.code}
            onClick={(e) => handleDelete(e)}
            style={{ cursor: "pointer", color: "red" }}
          >
            Xóa
          </div>
        </>
      ),
      width: "70px",
      center: true,
    },
    {
      name: "",
      selector: (row) => (
        <>
          <div
            id={row.code}
            onClick={(e) => handleSaveNew(e)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Lưu
          </div>
        </>
      ),
      width: "70px",
      center: true,
    },
  ];

  const handleChange = (e) => {
    setConfig(true);
    const arr = e.currentTarget.id.split("_");
    setPosition({ col: arr[0], code: arr[1] });
    switch (arr[0]) {
      case "code":
        setTit("Mã lỗi");
        break;
      case "name":
        setTit("Tên lỗi");
        break;
      case "type":
        setTit("Loại");
        break;
      default:
        setTit("Unknown");
        break;
    }

    var d = reader.value.find((data) => data.code == arr[1]);
    document.getElementById("configvalue").value = d[arr[0]]
  };

  const handleSave = (e) => {
    e.preventDefault();
    var cf = document.getElementById("configvalue")
    //console.log(positon, cf.value)

    switch (positon.col) {
      case "infor":
        var newData = reader.value
        const i = newData.findIndex((data) => data.code == positon.code)
        const r = newData[i].infor.findIndex((data) => data.id == positon.item)
        newData[i].infor[r].text = cf.value
        reader.value = [
          ...newData
        ]

        break;
      case "solution":
        var newData = reader.value
        const i2 = newData.findIndex((data) => data.code == positon.code)
        const r2 = newData[i2].solution.findIndex((data) => data.id == positon.item)
        newData[i2].solution[r2].text = cf.value
        reader.value = [
          ...newData
        ]
        break;
      default:
        var newData = reader.value
        const i3 = newData.findIndex((data) => data.code == positon.code)

        newData[i3][positon.col] = cf.value
        reader.value = [
          ...newData
        ]

        break
    }


    setConfig(false);

  };



  const handleDelete = (e) => {

    var code = e.currentTarget.id

    //reader.value = reader.value.filter((newData) => newData.code != e.currentTarget.id).map((data, index) => ({ ...data, id: (index + 1) }))
    axios.post(host.DEVICE + "/removeInfErr", { code: code, user: props.username }, { secure: true, reconnect: true }).then(
      (res) => {

        console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
          reader.value = reader.value.filter((newData) => newData.code != code).map((data, index) => ({ ...data, id: (index + 1) }))
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }


      }
    )

  };


  const handleSaveNew = (e) => {

    var doc = reader.value.find((data) => data.code == e.currentTarget.id)
    //console.log(doc)


    axios.post(host.DEVICE + "/updateInfErr", { code: doc.code, name: doc.name, type: doc.type, infor: JSON.stringify(doc.infor), solution: JSON.stringify(doc.solution), user: props.username }, { secure: true, reconnect: true }).then(
      (res) => {

        console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_5" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }


      }
    )
  };


  const handleAddItem = (e) => {
    //console.log(e.currentTarget.id)
    const arr = e.currentTarget.id.split("_")
    const newData = reader.value
    const i = newData.findIndex((data) => data.code == arr[2])
    //console.log(i)

    newData[i][arr[1]] = [
      ...newData[i][arr[1]],
      { id: parseInt(newData[i][arr[1]].length) + 1, text: "..." }
    ]

    reader.value = [
      ...newData
    ]
  };

  const handleEditItem = (e) => {
    //console.log(e.currentTarget.id)
    const arr = e.currentTarget.id.split("_")
    const i = reader.value.findIndex((data) => data.code == arr[2])
    const r = reader.value[i][arr[1]].find((data) => data.id == arr[3])
    //console.log(i, r)
    setConfig(true)
    document.getElementById("configvalue").value = r.text
    setPosition({ col: arr[1], code: arr[2], item: arr[3] })
    setTit((arr[1] === "infor") ? "Nguyên nhân" : "Biên pháp");


  }

  const handleDeleteItem = (e) => {
    console.log(e.currentTarget.id)
    const arr = e.currentTarget.id.split("_")
    const newData = reader.value
    const i = newData.findIndex((data) => data.code == arr[2])

    console.log(newData[i].data)
    if (newData[i][arr[1]].length > 1) {

      newData[i][arr[1]] = newData[i][arr[1]].filter((data) => data.id != arr[3]).map((data, index) => {
        return { ...data, id: index + 1 }
      })

      reader.value = [
        ...newData
      ]
    }

  }

  const handleClose = (e) => {
    setConfig(false);
  };

  return (
    <>
      {isBrowser ?
        <div className="DAT_Reader">
          <DataTable
            className="DAT_Table_Container"
            columns={col}
            data={reader.value}
            pagination
            paginationComponentOptions={paginationComponentOptions}
            fixedHeader={true}
            noDataComponent={
              <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                <div>Bạn vui lòng thêm thông tin sự cố!</div>
              </div>
            }
          />
        </div>
        :
        <div className="DAT_Read">
          <div className="DAT_Read_Head" onClick={() => props.handleCloseRead()}>
            <IoIosArrowBack />
            Thanh ghi
          </div>

          <div className="DAT_Read_Body">
            {reader.value.map((row, index) => (
              <div key={index} className="DAT_Read_Body-Item">
                <div className="DAT_Read_Body-Item-Title">
                  {row.code}
                </div>
              </div>
            ))}

          </div>
        </div>
      }



      <div className="DAT_Register_Config" style={{ display: config ? "block" : "none" }}>
        <div className="DAT_Register_Config-Group">

          <div className="DAT_Register_Config-Group-Close" onClick={(e) => handleClose(e)} ><ion-icon name="close-outline"></ion-icon></div>
          <div className="DAT_Register_Config-Group-Tit">{tit}</div>

          <form className="DAT_Register_Config-Group-Content" onSubmit={(e) => handleSave(e)}>
            <input type="text" id="configvalue" required></input>
            <button>Lưu</button>
          </form>
        </div>
      </div>
    </>
  );
}
