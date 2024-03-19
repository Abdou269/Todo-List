/* eslint-disable no-unused-vars */
import handleImportant from "../functions/handleTaskImportant";
import handleComplete from "../functions/handleTaskComplete";
import { useSortable } from "@dnd-kit/sortable";
import { context } from "../context/context";
import { useContext } from "react";

// eslint-disable-next-line react/prop-types
export default function Task({ title, completed, important }){
    const [state, dispatch, user] = useContext(context),
    {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({id: title}),
    currentList = user.data?.filter(list => list.title == state.selectedList.title)[0];
    
    return (
        <div 
            ref={setNodeRef}
            onClick={_=> {
                dispatch({type: 'details', payload: true});
                dispatch({type: 'selectedTask', payload: title});
            }}
            style={{transform: `translateY(${transform?.y || 0}px) ${isDragging ? 'scale(1.02)' : ''}`, transition: transform?.y && transition}}
            className='flex items-center justify-between p-2 border-b border-[#343434]/[50%] w-full rounded-sm transition-colors 
            hover:bg-black/[15%] duration-300 rounded-lg active:z-50 backdrop-blur-sm'
            {...attributes} 
            {...listeners}
        >
            <div className='flex items-center gap-3 '>
                <span 
                    onClick={e=>{
                        e.stopPropagation();
                        handleComplete(currentList, title, completed, state, user);
                    }}
                    title='Mark as Completed' 
                    className={`group ${completed ? 'bg-white' : 'hover:bg-white/[70%]'} duration-200 flex items-center justify-center 
                    pb-0.5 rounded-full border border-white w-[21px] h-[21px] cursor-pointer z-50`}
                >
                    <span className={`${completed ? 'border-black' : 'group-hover:border-black'} duration-200 border-l-[3px] 
                        border-b-[3px] rounded-[1px] rotate-[-45deg] w-[13px] h-[7px]`}
                    >
                    </span>
                </span>
            </div>
            <div className="flex items-center px-3 w-full h-full active:cursor-grabbing active:z-50">
                <p>{title}</p>
            </div>
            <i 
                onClick={e=>{
                    e.stopPropagation();
                    handleImportant(currentList, title, important, user, state, dispatch);
                }}
                title='Save as Important' 
                className={`uil uil-star ${important ? 'text-green-500' : 'hover:text-green-500'} cursor-pointer z-50`}
            >
            </i>
        </div>
    )
}