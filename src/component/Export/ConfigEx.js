
import DataTable from "react-data-table-component";
import { devicetime, reporttime } from "./Export";
import { useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { host } from "../constant";
import { CiEdit } from "react-icons/ci";

export default function ConfigEx(props) {

    const [report, setReport] = useState("")
    const [mcode, setMcode] = useState('0')
    const [config, setConfig] = useState({})
    const [state, setState] = useState(false)

    const id = useRef();
    const name = useRef();
    const cal = useRef();
    const cal_bit_0 = useRef();
    const cal_bit_1 = useRef();


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
            center: true,
        },
        {
            name: "Mã báo cáo",
            selector: (row) => row.code,
            center: true,
            minWidth: "120px",
        },
        {
            name: "Tên",
            selector: (row) => row.name,
            center: true,
            minWidth: "300px",
        },

        {
            name: "Thanh ghi (Ngày)",
            selector: (row) => (
                <>

                    <div
                        style={{ cursor: "pointer", marginBottom: "10px", marginTop: "10px" }}
                    >
                        {row.register.map((item, index) => {

                            return (
                                <div className="DAT_ConfigExRegister" key={index} >
                                    <span >{item.id}</span>
                                    <span>{item.name}</span>
                                    {(item.type === 'word')
                                        ? <span>{item.cal}</span>
                                        : <><span>{JSON.parse(item.cal)[0]}</span>:<span>{JSON.parse(item.cal)[1]}</span></>
                                    }
                                    <span>{item.type}</span>
                                    <span id={`${row.code}_${item.id}_Daily`} style={{ cursor: "pointer" }} onClick={(e) => handleConfig(e)} ><CiEdit /></span>
                                </div>
                            )
                        })}

                    </div>

                </>
            ),
            center: true,
            minWidth: "400px",
        },
        {
            name: "Thanh ghi (Tháng)",
            selector: (row) => (
                <>

                    <div
                        style={{ cursor: "pointer", marginBottom: "10px", marginTop: "10px" }}
                    >
                        {row.registermonth.map((item, index) => {

                            return (
                                <div className="DAT_ConfigExRegister" key={index} >
                                    <span >{item.id}</span>
                                    <span>{item.name}</span>
                                    {(item.type === 'word')
                                        ? <span>{item.cal}</span>
                                        : <><span>{JSON.parse(item.cal)[0]}</span>:<span>{JSON.parse(item.cal)[1]}</span></>
                                    }
                                    <span>{item.type}</span>

                                    <span id={`${row.code}_${item.id}_Month`} style={{ cursor: "pointer" }} onClick={(e) => handleConfig(e)} ><CiEdit /></span>
                                </div>
                            )
                        })}

                    </div>

                </>
            ),
            center: true,
            minWidth: "400px",
        },
    ];

    const handleConfig = (e) => {
        console.log(e.currentTarget.id);
        var arr = e.currentTarget.id.split("_");
        console.log(arr);
        let newData = reporttime.value.find((item) => {
            return item.code == arr[0]
        })
        setReport(arr[2])
        setMcode(arr[0])
        if (arr[2] == 'Daily') {
            newData = newData.register.find((item) => {
                return item.id == arr[1]
            })
            setConfig(newData)
        } else {
            newData = newData.registermonth.find((item) => {
                return item.id == arr[1]
            })
            setConfig(newData)
        }
        setState(!state)
        //console.log(newData);
    }

    const handleSave = (e) => {


        let register = { id: config.id, name: name.current.value, type: config.type, cal: (config.type === 'real') ? `["${cal_bit_0.current.value}", "${cal_bit_1.current.value}"]` : cal.current.value }

        axios.post(host.DEVICE + "/updateReport", { deviceid: devicetime.value, code: mcode, report: report, register: register }, { secure: true, reconnect: true })
            .then((res) => {
                console.log(res.data)
                if (res.data.status) {
                    let i = reporttime.value.findIndex((item) => {
                        return item.code == mcode
                    })
                    if (report == 'Daily') {
                        let j = reporttime.value[i].register.findIndex((item) => {
                            return item.id == config.id
                        })
                        reporttime.value[i].register[j] = register
                    } else {
                        let j = reporttime.value[i].registermonth.findIndex((item) => {
                            return item.id == config.id
                        })
                        reporttime.value[i].registermonth[j] = register
                    }

                }

            })
    }


    return (
        <>
            <DataTable
                 className="DAT_Table_Container"
                columns={col}
                data={reporttime.value}
                pagination
                paginationComponentOptions={paginationComponentOptions}
                noDataComponent={
                    <div style={{ margin: "auto", textAlign: "center", color: "red", padding: "20px" }}>
                        <div>Danh sách trống</div>
                        <div>Thêm thiết bị để trải nghiệm tính năng này!</div>
                    </div>
                }

            />
            {state
                ? <div className="DAT_Config" >

                    <div className="DAT_Config-Content" >
                        <div className="DAT_Config-Content-Close" onClick={() => setState(!state)} ><IoClose /></div>
                        <div className="DAT_Config-Content-Tit" >{mcode} {report}</div>
                        <span>ID</span>
                        <input type="text" defaultValue={config.id} ref={id} />
                        <span>Tên</span>
                        <input type="text" defaultValue={config.name} ref={name} />

                        <div><span >Loại: {config.type}</span></div>
                        {(config.type === 'word')
                            ? <>
                                <span>Thanh ghi</span>
                                <input type="text" defaultValue={config.cal} ref={cal} />
                            </>
                            : <>
                                <span>Thanh ghi Bit 0</span>
                                <input type="text" defaultValue={JSON.parse(config.cal)[0]} ref={cal_bit_0} />
                                <span>Thanh ghi Bit 1</span>
                                <input type="text" defaultValue={JSON.parse(config.cal)[1]} ref={cal_bit_1} />
                            </>

                        }
                        <button onClick={() => handleSave()} >Lưu</button>
                    </div>
                </div>
                : <></>
            }



        </>
    )
}