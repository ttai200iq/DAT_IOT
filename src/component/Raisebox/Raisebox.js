import React from "react";
import "./Raisebox.scss";
import { IoClose } from "react-icons/io5";
import { delstate } from "../User/Listuser";

export default function Raisebox() {
    return (
        <div className="DAT_Raisebox">
            <div className="DAT_Raisebox_Box">
                <div className="DAT_Raisebox_Box_Title">
                    <div className="DAT_Raisebox_Box_Title_Text">Raisebox</div>
                    <div className="DAT_Raisebox_Box_Title_Close">
                        <IoClose
                            size={18}
                            onClick={() => {
                                delstate.value = false;
                            }}
                        />
                    </div>
                </div>
                <div className="DAT_Raisebox_Box_Content">Bạn có chắc muốn xóa ?</div>
                <div className="DAT_Raisebox_Box_Button">
                    <div
                        className="DAT_Raisebox_Box_Button_Cancel"
                        onClick={() => {
                            delstate.value = false;
                        }}
                    >
                        Hủy
                    </div>
                    <div
                        className="DAT_Raisebox_Box_Button_Confirm"
                        onClick={() => {
                            delstate.value = false;
                        }}
                    >
                        Xác nhận
                    </div>
                </div>
            </div>
        </div>
    );
}
