/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { getDatabase, ref, set } from "firebase/database";
import { useContext, useEffect, useState } from 'react';
import { signInWithPopup } from "firebase/auth";
import { context } from '../context/context';
import { auth, provider } from "../main";
import guest from '../assets/guest.png';
import Option from "./option";

export default function Menu(){
    const [state, dispatch, user] = useContext(context),
    [style, setStyle] = useState('opacity-1'),
    [active, setActive] = useState(null),
    db = getDatabase();

    useEffect(_ => {
        if (state.minimized){
            setStyle('opacity-0');
            setTimeout(_ => setStyle('hidden'), 300);
        }
        else setStyle('opacity-1');
    }, [state.minimized]);

    function handleActive(title, index){
        setActive(title);
        dispatch({type: 'selectedList', payload: {title: title, icon: state.icons[index]}});
    }
    function handleAddList(){
        //re-write the logic to add a custom list
        const newData = user.data.map(list => 
            list.title === 'custom lists' ? 
            (
                {...list, 
                    lists: (
                        list.lists ? 
                        [...list.lists, {title: 'new list'}] : 
                        [{title: 'new list'}]
                    )
                }
            ):
            list
        ),
        newUser = { ...user, data: newData };
        set(ref(db, 'users/' + user.uid), newUser);
    }

    return (
        <div 
            className={`flex flex-col justify-center overflow-hidden text-nowrap ${state.minimized ? 'w-[55px]' : 'w-[280px]'}
            duration-300 h-screen bg-[#343434]/[20%] backdrop-blur shadow-[7px_0_10px_0] shadow-black/[25%] gap-4 z-50`}
        >
            <div className={`flex items-center kavoon ${state.minimized ? 'justify-center' : 'justify-between'} bg-black/[20%] p-2 w-full`}>
                <h1 className={`${state.minimized && 'hidden'}`}>todo-list web app</h1>
                <i 
                    onClick={_ => dispatch({type: 'minimized', payload: !state.minimized})}
                    className={`uil uil-list-ui-alt ${state.minimized && 'rotate'} duration-300 text-3xl cursor-pointer`}
                >
                </i>
            </div>
            <div className='flex gap-3 items-center px-3 h-[30%]'>
                <img 
                    className='rounded-full border-2 border-black'
                    src={state.isSigned ? user.photoURL : guest}
                    alt="user-logo"
                    width={'40px'}
                    height={'40px'}
                />
                <div className='text-sm kavoon' onClick={_=>signInWithPopup(auth, provider)}>
                    <p className={`${style} duration-300`}>
                        {state.isSigned ? `Welcome, ${user.displayName}` : 'hi there guest,'}
                    </p>
                    <div className={`${style} w-fit duration-300 flex items-center text-[#D7D7D7] cursor-pointer group w-full`}>
                        <a className='group-hover:text-white duration-300'>
                            {state.isSigned ? user.email : 'you can sign-in here'}
                        </a>
                        <i className="uil uil-angle-down text-[#D7D7D7] group-hover:text-white"></i>
                    </div>
                </div>
            </div>
            <hr />
            <div className='flex flex-col items-center gap-3 kavoon px-2'>
                {
                    state.titles.map((title, index) => {
                        return (
                            <Option click={_=> handleActive(title, index)} active={state.selectedList.title == title || active == title} key={index} title={title} style={style}>
                                <i className={`uil ${state.icons[index]} group-hover:text-[#FE426A]`}></i> 
                            </Option>
                        )
                    })
                }
                <Option title={'calender'} style={style}>
                    <i className={`uil ${state.icons[3]} group-hover:text-[#FE426A]`}></i> 
                </Option>
            </div>
            <hr />
            <div className={`flex flex-col items-center justify-between gap-2 kavoon px-[0.575rem] py-1 w-full h-full`}>
                <div className="flex flex-col gap-2 w-full">
                    {/* the custom list logic in here */}
                    {/* {
                        user?.data.filter(list => list.title === 'custom lists')[0].lists?.map((list, index) => 
                            <div key={index} className="flex items-center justify-between group cursor-pointer hover:bg-black/[15%] duration-300 px-2 py-1 rounded-lg"> 
                                <div className="flex gap-2 items-center">
                                    <i className="uil uil-file-edit-alt"></i>
                                    <p className={`group-hover:text-[#FE426A] duration-300 ${style}`}>{list.title}</p>
                                </div>
                                <i className={`uil uil-edit text-sm hover:text-[#FE426A] ${style}`}></i>
                            </div>
                        )
                    } */}
                </div>
                <p 
                    onClick={handleAddList}
                    className={`${style} duration-300 text-sm rounded-md p-1 px-2 my-1 cursor-pointer hover:bg-black/[30%]`}
                >
                    add new list +
                </p>
            </div>
        </div>
    )
}
