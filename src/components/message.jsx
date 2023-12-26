/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { context } from "../context/context";

export default function Message({ message, duration, showed }){
    const { dispatch } = useContext(context);
    const [position, setPosition] = useState('top-[-55px]');

    useEffect(_=> {
        let timer;
        if (!showed) {
            setPosition('top-[15px]');
            timer = setTimeout(_ => setPosition('top-[-55px]'), duration);
        }
        timer = setTimeout(_ => dispatch({ type: 'message', value: '' }), duration + 500);
        
        return _ => timer && clearTimeout(timer);
    }, [dispatch, duration, showed]);

    return (
        <div 
            className={`absolute ${position} w-max left-1/2 translate-x-[-50%] flex items-center gap-2 w-[40%] border-[#B63AFF] rounded-xl 
            border-2 bg-black/[.5] backdrop-blur-[2px] px-2 py-1 duration-[1s]`}
        >
            <div className="flex font-extrabold text-[#C86AFF] gap-1 items-center text-lg">
                <i className="uil uil-info-circle"></i>
                <p className="inline">note:</p>
            </div>
            <div className="flex font-medium text-sm"> { message } </div>
        </div>
    )
}