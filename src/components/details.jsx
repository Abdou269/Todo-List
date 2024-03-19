/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from "react";
import handleImportant from "../functions/handleTaskImportant";
import handleComplete from "../functions/handleTaskComplete";
import { getDatabase, ref, set } from "firebase/database";
import { context } from "../context/context";

export default function Details(){
    const [state, dispatch, user] = useContext(context),
    [style, setStyle] = useState('opacity-0 w-0'),
    currentList = user.data?.filter(list => list.title == state.selectedList.title)[0],
    currentTask = user.data.map(list => list.tasks?.filter(task => task.title === state.selectedTask)[0]).filter(item => item != undefined)[0],
    textRef = useRef(),
    db = getDatabase();

    useEffect(_=> {textRef.current.textContent = currentTask.title}, [currentTask.title, user]);
    useEffect(_ => state.details && setStyle('opacity-1 w-[280px]'), [state.details]);
    
    function handleEditTask(newTitle){
        if (newTitle !== '') {
            const newTasks = currentList.tasks.map(task => task.title == currentTask.title ? {...currentTask, title: newTitle} : task),
            newUser = {
                ...user,
                data: user.data.map(list => list.title === currentList.title ? {...currentList, tasks: newTasks} : list)
            };
            dispatch({type: 'selectedTask', payload: newTitle});
            set(ref(db, 'users/' + user.uid), newUser);
        }
        else textRef.current.appendChild(document.createTextNode(currentTask.title));
    }
    function handleDeleteTask(){
        const newCurrentList = {...currentList, tasks : currentList.tasks.filter(task => task.title != currentTask.title)},
        newUser = {
            ...user,
            data: user.data.map(list => list.title === state.selectedList.title ? newCurrentList : list),
        };
        set(ref(db, 'users/' + user.uid), newUser);
        dispatch({type:'details', payload: false});
    }
    function closeDetails(){
        setStyle('opacity-0 w-0');
        setTimeout(_=>{
            dispatch({type:'details', payload: false});
        }, 300);
    }
    
    return (
        <div className={`flex flex-col justify-between ${style} p-2 h-screen bg-black/[30%] backdrop-blur-sm absolute right-0 z-50 duration-300 overflow-hidden`}>
            <div className="flex flex-col items-end w-full gap-2">
                <i onClick={closeDetails} className="m-1 text-2xl uil uil-times cursor-pointer hover:text-red-500"></i>
                <div className="flex flex-col items-center w-full rounded-md bg-black/[25%] py-2">
                    <div 
                        className='flex flex items-center justify-between gap-3 p-2 w-full rounded-sm transition-colors 
                        duration-300 rounded-lg active:z-50'
                    >
                        <div className='flex items-center gap-3'>
                            <span 
                                onClick={e=>{
                                    e.stopPropagation();
                                    handleComplete(currentList, currentTask.title, currentTask.completed, state, user);
                                }}
                                title='Mark as Completed' 
                                className={`group ${currentTask.completed ? 'bg-white' : 'hover:bg-white/[70%]'} duration-200 flex items-center justify-center 
                                pb-0.5 rounded-full border-2 border-white w-[21px] h-[21px] cursor-pointer z-50`}
                            >
                                <span className={`${currentTask.completed ? 'border-black' : 'group-hover:border-black'} duration-200 border-l-[3px] 
                                    border-b-[3px] rounded-[1px] rotate-[-45deg] w-[13px] h-[7px]`}
                                >
                                </span>
                            </span>
                        </div>
                        <div
                            ref={textRef}
                            contentEditable={true}
                            onBlur={e=>handleEditTask(e.target.innerText)}
                            onKeyDown={e=> {
                                if (e.key === 'Enter'){
                                    e.preventDefault();
                                    handleEditTask(e.target.innerText);
                                    textRef.current.blur();
                                }
                            }}
                            className='w-full drop-shadow-none rounded-sm font-bold capitalize resize-none overflow-hidden' 
                        ></div>
                        <i 
                            onClick={e=>{
                                e.stopPropagation();
                                handleImportant(currentList, currentTask.title, currentTask.important, user, state, dispatch);
                            }}
                            title='Save as Important' 
                            className={`uil uil-star ${currentTask.important ? 'text-green-500' : 'hover:text-green-500'} cursor-pointer z-50`}
                        >
                        </i>
                    </div>
                    <div className="flex flex-col justify-center">
                        {/* add logic to ADD A SUBTASK here*/}
                        <p className="kavoon text-sm cursor-pointer hover:text-gray-300 duration-300">add a subtask</p>
                    </div>
                </div>
                <textarea
                    className="bg-black/[25%] resize-none w-full rounded-md p-2 overflow-hidden"
                    placeholder="you can write a note here..."
                    rows={3}
                ></textarea>
            </div>
            <div className="flex justify-end w-full px-2 ">
                {/* add time of creating in here */}
                <i onClick={handleDeleteTask} className="uil uil-trash-alt hover:text-red-500 cursor-pointer"></i>
            </div>
        </div>
    )
}