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
            className={`flex md:w-max text-center max-sm:flex-col absolute ${position} left-1/2 translate-x-[-50%] items-center gap-2 border-[#B63AFF] rounded-xl 
            border-2 bg-black/[.5] backdrop-blur-[2px] px-2 py-1 duration-[1s] z-50`}
        >
            <div className="flex font-extrabold text-[#C86AFF] max-sm:text-sm gap-1 items-center text-lg">
                <i className="uil uil-info-circle"></i>
                <p className="inline-block">note:</p>
            </div>
            <div className="inline font-medium sm:text-sm max-[640px]:text-xs"> { message } </div>
        </div>
    )
}