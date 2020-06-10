import React from 'react';
import { toast } from 'react-toastify';
import { Button } from '@material-ui/core';
export const showInfoMsg = (msg, callBackfunction) => {
    const Msg = ({ closeToast }) => (
        <div>
            <div className="d-block pb-2">{msg}</div>

            <div className="d-block text-right">
                <Button variant="contained" color="primary" onClick={callBackfunction}>Yes</Button>
                <Button variant="contained" className ="ml-3"color="secondary" onClick={closeToast}>Close</Button>
            </div>

        </div>
    )
    return toast.info(<Msg />, {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 5 * 1000
    });
}
export const showSuccessMsg = (msg = '') => {
    return toast.success(msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2 * 1000
    });
}
export const showErrorMsg = (msg) => {
    return toast.error(msg, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2 * 1000
    });
}