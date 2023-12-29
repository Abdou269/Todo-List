/* eslint-disable no-unused-vars */
import handleListOrder from '../functions/handleListOrder';
import { useContext, useEffect, useState } from 'react';
import handleMessage from '../functions/handleMessage';
import { useSortable } from '@dnd-kit/sortable'; 
import { context } from '../context/context';
import save from '../functions/save';
import Drag from './drag';

export default function List(){
    const {state, dispatch, width} = useContext(context);
    const [info, setInfo] = useState({listTitle: '', taskTitle: ''});
    const [style, setStyle] = useState('w-[20%] opacity-0');
    const [render, setRender] = useState(false);
    const oldStorage = JSON.parse(localStorage.lists);
    const currentList = oldStorage.filter(list => list.title === state.listTitle)[0];
    const tasks = currentList?.tasks || [];
    const tasksTitles = tasks.map(item => item.title);
    //animation of the list
    useEffect(_=>{
        let hide;
        if (state.showList) {
            setRender(true);
            const show = setTimeout(_=>{
                state.showDetails ? 
                (width < 1024 ? setStyle(`w-[60%] opacity-1`) : setStyle(`w-[51%] opacity-1`))
                : 
                (width < 1024 ? setStyle(`w-[90%] opacity-1`) : setStyle(`w-[70%] opacity-1`));
                width <= 768 && setStyle('w-full opacity-1');
                clearTimeout(show);
            }, 100)
        }
        else {
            setStyle('w-[20%] opacity-0');
            hide = setTimeout(_=> setRender(false), 800);
        }
        width <= 768 && (
            state.menuShrink && !state.showDetails ? 
            dispatch({type: 'showList', value: true}) 
            :
            dispatch({type: 'showList', value: false})
        )
        
        return _=> clearTimeout(hide);
    }, [dispatch, state.menuShrink, state.showDetails, state.showList, style, width])
    //edit list title
    function handleEditList(){
        const newStorage = oldStorage.map(list => list.title === state.listTitle ? {...list, title: info.listTitle} : list);
        localStorage.lists = JSON.stringify(newStorage);
        dispatch({type: 'listTitle', value: info.listTitle});
        dispatch({type: 'editTitle', value: !state.editTitle});
    }
    //delete list
    function handleDeleteList(){
        const newStorage = oldStorage.filter(list => list.title !== state.listTitle);
        localStorage.lists = JSON.stringify(newStorage);
        dispatch({type: 'showList', value: false});
        dispatch({type: 'showDetails', value: false});
    }
    //adding tasks
    function handleAddTask(){
        const newTasks = [...currentList.tasks, {title: info.taskTitle, checked: false, subtasks: []}];
        save(newTasks, state, dispatch);
        setInfo({...info, taskTitle: ''});
        newTasks.length == 2 && handleMessage(2, dispatch);
    }
    //checking tasks
    function handleCheckTask(index){
        const newTasks = tasks.map((task, i) => index === i ? {...task, checked: !task.checked} : task);
        save(newTasks, state, dispatch);
    }
    //showing the details menu
    function handleShowDetails(index){
        const currentTask = tasks[index];
        dispatch({type: 'taskInfo', value: {
            id: index,
            title: currentTask.title,
            description: currentTask.description || ''
        }});
        dispatch({type: 'showDetails', value: true});
        state.task.id === index && dispatch({type: 'showDetails', value: !state.showDetails});
    }
    //drag and drop function for tasks
    function handleDragEnd(event){
        const {active, over} = event;
        const newTasks = handleListOrder(event, tasks);
        active.id !== over.id && save(newTasks, state, dispatch);
        dispatch({type: 'showDetails', value: false});
    }

    return render && (
        <div className={`flex flex-col ${style} bg-black/[.3] p-4 rounded-lg duration-1000 z-10  max-md:text-xs`}>
            <div className='flex items-center justify-between mb-8 mx-4'>
                <div className='flex items-center gap-4'>
                    {
                        state.editTitle ? 
                        <input
                            value={info.listTitle}
                            onChange={e=>setInfo({...info, listTitle: e.target.value})}
                            onKeyDown={e=>e.key == 'Enter' && info.listTitle !== '' && handleEditList()}
                            className="px-2 py-1 outline-none rounded-md bg-white/[.2] w-[50%]"
                            placeholder="edit the list's title"
                        /> :
                        <h1 className='w-fit text-2xl'>{state.listTitle}</h1>
                    }
                    <i
                        onClick={_=>{dispatch({type: 'editTitle', value: !state.editTitle});setInfo({...info, listTitle: state.listTitle})}}
                        className={`${state.editTitle && 'text-green-500'} fa-solid fa-pen-to-square hover:text-green-500 duration-200 cursor-pointer`}
                    >
                    </i>
                    
                    <h1 className='flex justify-center items-center rounded-sm bg-black/[.3] m-1 rounded-lg px-1'>
                        { tasks.length }
                    </h1>
                </div>
                {
                    state.listDelete ? 
                    <div className="flex gap-2 items-center ">
                        <p>sure you want to delete the list ? </p>
                        <div 
                        onClick={handleDeleteList} 
                        className="flex justify-center items-center hover:border-[1.5px] duration-[50ms] h-[22px] w-[22px] bg-[black]/[.2] rounded-sm cursor-pointer"
                        >
                            <i className="fa-solid fa-check text-[#1CB200]"></i>
                        </div>
                        <div 
                        onClick={_=>dispatch({type: 'listDelete', value: false})} 
                        className="flex justify-center items-center hover:border-[1.5px] duration-[50ms] h-[22px] w-[22px] bg-black/[.2] rounded-sm cursor-pointer"
                        >
                            <i className="fa-solid fa-x text-[#FE0000]"></i>
                        </div> 
                    </div>
                    :
                    <i 
                        onClick={_=>{dispatch({type: 'listDelete', value: true});dispatch({type: 'showDetails', value: false})}} 
                        className="justify-self-end fa-solid fa-trash text-red-500 hover:text-green-600 duration-200 cursor-pointer"
                    >
                    </i>
                }
                
            </div>
            <div className='flex flex-col gap-4 items-center'>
                <input 
                    value={info.taskTitle} 
                    onChange={e=>setInfo({...info, taskTitle: e.target.value})} 
                    onKeyDown={e=>e.key == 'Enter' && info.taskTitle !== '' && handleAddTask()}
                    className="px-2 py-1 w-11/12 outline-none rounded-md border-black border-2 bg-white/[.3]" 
                    placeholder='+ add a new task'
                />
            </div>
            <div className={`flex flex-col items-center gap-4 overflow-y-auto overflow-x-hidden m-4 md:mx-5`}>
                <Drag items={tasksTitles} handleDragEnd={e=>handleDragEnd(e)}>
                    {
                        tasks.map((task, index) => {
                            return (
                                <Item
                                    key={index}
                                    onChange={_=>handleCheckTask(index)}
                                    checked={task.checked}
                                    title={task.title}
                                    onClick={_=>handleShowDetails(index)}
                                />
                            )
                        })
                    }
                </Drag>
            </div>
        </div>
    )
}
// eslint-disable-next-line react/prop-types
function Item({onChange, checked, title, onClick}){
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: title});

    return (
        <div 
            ref={setNodeRef}
            style={transform&&{transform: `translateY(${transform.y}px)`, transition: transition}}
            className={`flex flex-col justify-center items-center gap-2 w-full active:z-50`}
        >
            <div className={`flex justify-between items-center p-2 w-11/12 `} > 
                <div className='flex items-center gap-4'>
                    <input 
                        className="h-[18px] w-[18px]" 
                        onChange={onChange} 
                        checked={checked}
                        type="checkbox"
                    />
                    <h1 {...attributes} {...listeners}>{title}</h1>
                </div>
                <i onClick={onClick} className="hover p-1 rounded-sm duration-200 fa-solid fa-angle-right cursor-pointer"></i> 
            </div>
            <hr className="w-11/12 border-white/[.5]"/>
        </div>
    )
}