/* eslint-disable no-unused-vars */
import { useContext, useEffect, useRef, useState } from 'react';
import handleListOrder from '../functions/handleListOrder';
import handleMessage from '../functions/handleMessage';
import { useSortable } from '@dnd-kit/sortable'; 
import { context } from '../context/context';
import save from '../functions/save';
import Drag from './drag';

export default function Details(){
    const {state, dispatch} = useContext(context);
    const [value, setValue] = useState('');
    const [editSubtask, setEditSubtask] = useState(false);
    const [subtaskIndex, setSubtaskindex] = useState(null);
    const [render, setRender] = useState(false);
    const [style, setStyle] = useState('w-[5%] opacity-0');
    const oldStorage = JSON.parse(localStorage.getItem('lists'));
    const currentList = oldStorage.filter(list => list.title === state.listTitle)[0];
    const tasks = currentList?.tasks;
    const subtasks = state.showDetails ? tasks[state.task.id].subtasks : [];
    const subtasksTitles = subtasks.map(subtask => subtask.title);
    const input = useRef();
    //animation of details menu
    useEffect(_=>{
        let hide;
        if (state.showDetails){
            setRender(true);
            const show = setTimeout(_=>{
                setStyle('w-[23%] opacity-1');
                clearTimeout(show);
            }, 100)
        }
        else {
            setStyle('w-[0%] opacity-0');
            hide = setTimeout(_=>setRender(false), 1000)
        }
        return _=> clearTimeout(hide);
    }, [state.showDetails])
    //changing tasks's title and description
    function handleTaskInfo(key, value){
        key === 'title' ? 
        dispatch({type: 'taskInfo', value: {...state.task, title: value}}) :
        dispatch({type: 'taskInfo', value: {...state.task, description: value}});
    }
    //editing and adding subtasks
    function handleSubtasks(){
        //adding subtasks
        let newTasks = [], newSubtasks = [];
        if (editSubtask === false && value !== ''){
            newTasks = tasks.map((task, index) => {
                newSubtasks = [...task.subtasks, {checked: false, title: value, edit:false}]
                return index === state.task.id ? {...task, subtasks: newSubtasks}: task;
            }
            );
        }
        //editing subtasks
        else {
            newSubtasks = (
                value === '' ? 
                tasks[state.task.id].subtasks.filter((subtask, i) => i !== subtaskIndex && subtask) :
                subtasks.map((subtask, index) => 
                    index === subtaskIndex ? {...subtask, edit: false, title: value} : subtask
                )
            )
            newTasks = tasks.map((task ,i) => 
                i === state.task.id ? {...task, subtasks: newSubtasks} : task
            );
        }
        //saving
        setValue('');
        save(newTasks, state, dispatch);
        setEditSubtask(false);
        newSubtasks.length == 1 && handleMessage(3, dispatch);
    }
    //checking subtasks
    function handleCheckSubtask(index){
        const newSubtasks = tasks[state.task.id].subtasks.map((subtask, i) => 
            i === index ? {...subtask, checked: !subtask.checked} : subtask
        );
        const newTasks = tasks.map((task ,i) => 
            i === state.task.id ? {...task, subtasks: newSubtasks} : task
        );
        save(newTasks, state, dispatch);
    }
    //editing subtasks's titles
    function handleEditSubtask(title, index, edit){
        const newSubtasks = tasks[state.task.id].subtasks.map((subtask, i) => 
            i === index ? 
            {...subtask, title: title, edit: !edit} :
            {...subtask, edit: false}
        )
        const newTasks = tasks.map((task ,i) => 
            i === state.task.id ? {...task, subtasks: newSubtasks} : task
        );
        input.current.focus();
        setValue(value !== title ? title : '');    
        setEditSubtask(!edit);
        setSubtaskindex(index);
        save(newTasks, state, dispatch);
    }
    //the save button's function
    function handleSaveButton(){
        const newTasks = tasks.map((task, index) => 
            index === state.task.id ? {...task, title: state.task.title, description: state.task.description} : task
        )
        save(newTasks, state, dispatch);
        handleMessage(4, dispatch);
    }
    //the delete button's function
    function handleDeleteButton(){
         const newTasks = tasks.filter((task, index) => 
            index !== state.task.id && task
        );
        save(newTasks, state, dispatch);
        dispatch({type: 'showDetails', value: false});
        handleMessage(5, dispatch);
    }
    //drag and drop function for subtasks
    function handleDragEnd(event){
        let newTasks = [];
        const {active, over} = event;
        const newSubtasks = handleListOrder(event, subtasks);
        if (active.id !== over.id){
            newTasks = tasks.map((task ,i) => 
                i === state.task.id ? {...task, subtasks: newSubtasks} : task
            );
            save(newTasks, state, dispatch);
        }
    }

    return render && (
        <div 
            className={`flex flex-col ${style} gap-4 bg-black/[.3] p-4 rounded-lg overflow-x-hidden duration-1000`}
        >
            <div className='flex flex-col gap-2 h-[45%]'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-lg'>task title :</h1>
                    <i 
                        onClick={_=>dispatch({type: 'showDetails', value:false})} 
                        className="fa-solid fa-x text-[#FE0000] hover:text-green-500 cursor-pointer duration-200"
                    >
                    </i>
                </div>
                <input
                    value={state.task.title} 
                    onChange={e=>handleTaskInfo('title', e.target.value)} 
                    className="px-2 py-1 w-full outline-none rounded-md border-black border-2 bg-white/[.3]" 
                    type="text" 
                    placeholder='title'
                />
                <h1 className='text-lg'>task description :</h1>
                <textarea 
                    value={state.task.description} 
                    onChange={e=>handleTaskInfo('description', e.target.value)} 
                    className='p-1 resize-none outline-none px-2 py-1 w-full outline-none rounded-md border-black border-2 bg-white/[.3]' 
                    rows="5" 
                    placeholder='description'
                >
                </textarea>
            </div>
            <div className='flex flex-col gap-2 h-[40%]'>
                <h1>{editSubtask && 'edit '}subtasks :</h1>
                <input 
                    ref={input}
                    value={value} 
                    onChange={e=>setValue(e.target.value)} 
                    onKeyDown={e=>e.key == 'Enter' && handleSubtasks()}
                    className="px-2 py-1 outline-none rounded-md border-black border-2 bg-white/[.3]" 
                    type="text" 
                    placeholder={`${ editSubtask ? 'edit the subtask': '+ add a subtask'}`}
                />
                <div className='flex flex-col gap-2 overflow-y-auto overflow-x-hidden text-center'>
                    <Drag items={subtasksTitles} handleDragEnd={e=>handleDragEnd(e)}>
                        {
                            subtasks?.map((subtask, index) => 
                                <Subtask 
                                    key={index}
                                    onChange={_=>handleCheckSubtask(index)}
                                    checked={subtask.checked}
                                    title={subtask.title}
                                    onClick={_=>handleEditSubtask(subtask.title, index, subtask.edit)}
                                    edit={subtask.edit}
                                />
                            )
                        }
                    </Drag>
                </div>
            </div>
            <div className='flex items-center justify-between h-[10%]'>
                <button onClick={handleDeleteButton} className='bg-[#B81611] hover:bg-[#96130f]'>delete</button>
                <button onClick={handleSaveButton} className='bg-[#8224B8] hover:bg-[#621c8a]'>save</button>
            </div>
        </div>
    )
}

// eslint-disable-next-line react/prop-types
function Subtask({onChange, checked, title, onClick, edit}){
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: title});

    return (
        <div 
            ref={setNodeRef}
            style={transform&&{transform: `translateY(${transform.y}px)`, transition: transition}}
            className='flex flex-col justify-center gap-2 w-[98%] text-sm'
        >
            <div className='flex gap-2 items-center justify-between text-left' >
                <div className='flex items-center gap-2'>
                    <input
                        onChange={onChange} 
                        type="checkbox"
                        className='h-[18px] w-[18px]' 
                        checked={checked}
                    />
                    <h1 className='w-fit' {...attributes} {...listeners}>{title}</h1>
                </div>
                <i
                    onClick={onClick}
                    className={`${edit && 'text-green-500'} fa-solid fa-pen-to-square hover:text-green-500 duration-200 cursor-pointer`}
                >
                </i>
            </div>
            <hr />
        </div>
    )
}