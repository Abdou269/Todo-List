/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { DndContext, MouseSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { getDatabase, ref, set } from "firebase/database";
import { useContext, useEffect, useState } from "react";
import { context } from '../context/context';
import Task from "./task";

export default function List(){
    const [state, , user] = useContext(context),
    [completed, setCompleted] = useState(false),
    [value, setValue] = useState(''),
    [impOnly, setImpOnly] = useState(false),
    currentList = user.data.filter(list => list.title == state.selectedList.title)[0],
    sensors = useSensors(useSensor(MouseSensor, {
        activationConstraint: {
            delay: 300
        }
    })),
    db = getDatabase();

    useEffect(_=> currentList?.title.includes('important') ? setImpOnly(true) : setImpOnly(false), [currentList]);

    function addTasks(title){
        const oldTasks = currentList.tasks || [],
        newTasks = [...oldTasks, 
            impOnly ? 
            {title: title, completed: false, important: true} :
            {title: title, completed: false, important: false}
        ],
        newUser = {
            ...user,
            data: user.data.map(list => list.title === currentList.title ? {...list, tasks: newTasks} : list),
        };
        set(ref(db, 'users/' + user.uid), newUser);
        setValue('');
    }    
    function handleDragEnd(event){
        const {active, over} = event;
        if (active.id !== over.id){
            const activeIndex = active.data.current.sortable.index,
            overIndex = over.data.current.sortable.index,
            newTasks = currentList.tasks.filter((_, index) => index !== activeIndex);
            newTasks.splice(overIndex, 0, currentList.tasks[activeIndex]);
            const newUser = {
                ...user,
                data: user.data.map(list => list.title === currentList.title ? {...list, tasks: newTasks} : list),
            };
            set(ref(db, 'users/' + user.uid), newUser);
        }
    }
    
    return (
        <div key={currentList?.title} className={`${state.minimized ? 'list-when-minimized' : 'list-when-unminimized'} flex justify-center p-2 bg-black/[10%] duration-300`}>
            <div className="flex flex-col gap-2 justify-between w-[95%]">
                <div className='flex items-center text-2xl gap-3 kavoon'>
                    <i className={`uil ${state.selectedList.icon} text-2xl`}></i> 
                    <p>{state.selectedList.title}</p>
                </div>
                <div className="flex flex-col gap-3 h-[90vh] overflow-y-auto">
                    {
                        currentList?.tasks?.length > 0 ? (
                            <>
                                <div className='flex flex-col gap-2 items-center'>
                                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                        <SortableContext items={currentList.tasks.map(task => task.title)} strategy={verticalListSortingStrategy}> 
                                            { 
                                                currentList?.tasks?.map((task, index) => 
                                                    task.completed == false && task.important == impOnly &&
                                                    <Task key={index} index={index} important={task.important} completed={task.completed} title={task.title}/>
                                                )
                                            }
                                        </SortableContext>
                                    </DndContext>
                                </div>
                            {
                                currentList.tasks?.filter(task => task.completed).length > 0 && (
                                    <span 
                                        className="select-none flex items-center cursor-pointer hover:bg-black/[20%] bg-black/[10%] w-fit rounded-md duration-200 px-1"
                                        onClick={_=> setCompleted(!completed)}
                                    >
                                        <p>completed</p>
                                        <i className={`uil uil-angle-down ${!completed && 'rotate-[180deg]'} duration-300`}></i>
                                    </span>
                                )
                            }
                            <div className={`${!completed && 'hidden'} duration-300`}>
                                { 
                                    currentList?.tasks?.map((task, index) => 
                                        task.completed == true && task.important == impOnly &&
                                        <Task key={index} index={index} important={task.important} completed={task.completed} title={task.title}/>
                                    )
                                }
                            </div>
                            </>
                        ):
                        <div className="flex flex-col kavoon opacity-[.6] items-center justify-center h-full z-10">
                            <i className="uil uil-clipboard-notes text-8xl font-light"></i>
                            <p>Add some tasks to see them here</p>
                        </div>
                    }
                </div>
                <div className="my-1 flex justify-center items-center w-11/12 m-auto px-2 rounded-md bg-black/[30%]">
                    <input 
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={e => e.key == 'Enter' && value !== '' && addTasks(e.target.value)}
                        className="w-full p-2 px-2 rounded-md bg-transparent outline-none"
                        type="text" 
                        placeholder="start typing your tasks here to add them..."
                    />
                    <i onClick={_=>addTasks(value)} className="text-3xl uil uil-enter cursor-pointer text-gray-500 hover:text-white"></i>
                </div>
            </div>
        </div>
    )
}