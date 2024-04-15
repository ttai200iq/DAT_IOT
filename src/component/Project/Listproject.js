import React, { useContext, useEffect, useRef } from "react";
import "./Project.scss";
import DataTable from "react-data-table-component";
import { useState } from "react";
import axios from "axios";
import { host } from "../constant";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";
import { AlertContext } from "../Context/AlertContext";



export default function Listproject() {
  const dataLang = useIntl();
  const { alertDispatch } = useContext(AlertContext);
  const user = useSelector((state) => state.admin.user)
  const manager = useSelector((state) => state.admin.manager)
  const type = useSelector((state) => state.admin.type)
  const [data, setData] = useState([]);
  const rootDispatch = useDispatch()

  const paginationComponentOptions = {
    rowsPerPageText: 'Số hàng',
    rangeSeparatorText: 'đến',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'tất cả',
  };

  useEffect(() => {
    axios.post(host.DEVICE + "/getProject", { user: manager }, { withCredentials: true }).then(
      function (res) {
        console.log(res.data)
        var newData = res.data;
        newData.map((data, index) => {
          return (data["id"] = index + 1);
        });
        console.log(newData);
        setData(newData);


      })
  }, []);


  const head = [
    {
      name: "STT",
      selector: (row) => row.id,
      sortable: true,
      width: "75px",
      center: true,
    },
    {
      name: "ID",
      selector: (row) => row.projectid,
      width: "100px"
    },
    {
      name: "Tên Dự án",
      selector: (row) => row.name,
      style: {
        justifyContent: "left",
      }

    },

    {
      name: "Công ty",
      selector: (row) => row.company,
      style: {
        justifyContent: "left",
      }

    },

    {
      name: "Thông tin",
      selector: (row) => row.addr,
      sortable: true,
      width: "400px",
      style: {
        justifyContent: "left",
      }
    },
    {
      name: "",
      selector: (row) => {
        return (


          <div
            id={row.projectid}
            onClick={(e) => handleDelete(e)}
            style={{ cursor: "pointer", color: "red" }}
          >
            xóa
          </div>

        )
      },
      width: "70px",
      center: true,
    },
  ];


  const handleDelete = (e) => {
    console.log(e.target.id);


    var newData = data
    newData = newData.filter(data => data.projectid != e.target.id)
    setData(newData)
    axios.post(host.DEVICE + "/deletelistProject", { projectid: e.target.id }, { withCredentials: true }).then(
      function (res) {
        console.log(res.data)
        if (res.data.status) {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_18" }), show: 'block' } })
        } else {
          alertDispatch({ type: 'LOAD_CONTENT', payload: { content: dataLang.formatMessage({ id: "alert_3" }), show: 'block' } })
        }
      })

  };

  return (
    <div className="DAT_UserList">
      <DataTable
        className="DAT_Table_Container"
        columns={head}
        data={data}
        pagination
        paginationComponentOptions={paginationComponentOptions}
        noDataComponent={
          <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
            <div>Danh sách trống</div>
            <div>Vui lòng tạo dự án</div>
          </div>
        }
      />
    </div>

  );
}