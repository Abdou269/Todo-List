/* eslint-disable no-unused-vars */
import { useContext, useRef, useEffect, useState } from 'react';
import handleListOrder from '../functions/handleListOrder';
import handleMessage from '../functions/handleMessage';
import { useSortable } from '@dnd-kit/sortable';
import { context } from '../context/context';
import image from '../assets/asset 1.png';
import Drag from './drag';

export default function Menu(){
  const {state, dispatch} = useContext(context);
  const [search, setSearch] = useState('');
  const oldStorage = JSON.parse(localStorage.lists);
  const searchedLists = search !== '' ? oldStorage.filter(list => list.title.toLowerCase().includes(search.toLowerCase())) : oldStorage;
  const listsTitles = oldStorage.map(list => list.title);
  const color = useRef();
  const input = useRef();
  //input focus when adding a list
  useEffect(_=> { state.addList && input.current.focus() });
  //create a random color
  function randomColor(){
    const letters = '0123456789ABCDEF';
    let randomColor = '#';
    for (let i = 0; i < 6; i++) randomColor += letters[Math.trunc(Math.random() * 16)];
    color.current = randomColor;
    return randomColor;
  }
  //create list
  function handleCreateList(){
    const newLists = [...oldStorage, {title: input.current.value, tasks: [], color: color.current}]
    localStorage.lists = JSON.stringify(newLists);
    dispatch({type:'listTitle', value: input.current.value});
    dispatch({type:'addList', value: false});
    dispatch({type:'showDetails', value: false});
    dispatch({type: 'listDelete', value: false})
    dispatch({type: 'showList', value: true});
    newLists.length == 1 && handleMessage(1, dispatch);
    newLists.length == 2 && handleMessage(0, dispatch);
  }
  //show list when clicking on a title
  function handleShowList(title){
    dispatch({type: 'listTitle', value: title});
    dispatch({type: 'editTitle', value: false});
    dispatch({type: 'showDetails', value: false});
    dispatch({type: 'listDelete', value: false})
    dispatch({type: 'showList', value: true});
    state.listTitle === title && dispatch({type: 'showList', value: !state.showList});
  }
  //drag and drop function for list titles
  function handleDragEnd(event){
    const { active, over } = event;
    const newLists = handleListOrder(event, oldStorage, dispatch);
    active.id !== over.id && localStorage.setItem('lists', JSON.stringify(newLists));
    dispatch({type: 'showList', value: false});
    dispatch({type: 'showDetails', value: false});
  }

  return (
      <div id="menu" className={`grid grid-rows-4 w-[23%] bg-black/[.3] rounded-lg gap-3 p-4 duration-500`}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center row-full">
            <h1 className="text-lg">to-do list</h1>
            <i className="fa-solid fa-bars cursor-pointer hover:text-slate-400 duration-200"></i>
          </div>
          <div className="flex gap-2 items-center text-gray row-start-2">
            <i className="absolute p-1.5 fa-solid fa-magnifying-glass text-xs"></i>
            <input
              onChange={e=>setSearch(e.target.value)}
              type="text" 
              className="px-5 w-full outline-none rounded-md border-black border-2 bg-white/[.3]" 
              placeholder="search for a list" 
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 row-start-2 row-end-5 overflow-y-auto overflow-x-hidden">
          <h1 className="text-lg">lists</h1>
          <div className="flex flex-col gap-1">
            {
              localStorage.lists?.length > 0 &&
                <Drag items={listsTitles} handleDragEnd={e=>handleDragEnd(e)}>
                {
                  searchedLists.map((list, index) => 
                    <ListTitle 
                      key={index}
                      color={list.color}
                      onClick={_=>handleShowList(list.title)}
                      listLength={list.tasks.length}
                      title={list.title}
                    />
                  )
                }
                </Drag>
            }
            {
              state.addList && 
              (
                <div className="flex items-center p-1">
                  <div className="flex justify-evenly items-center gap-1">
                    <div style={{backgroundColor: randomColor()}} className={`h-[18px] w-[18px] rounded-sm`}></div>
                    <input ref={input} type="text" className="bg-transparent w-full px-2 outline-none"/>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div 
                      onClick={_ => input.current.value !== '' && handleCreateList()} 
                      className="flex justify-center items-center hover:border-[1.5px] duration-[50ms] h-[22px] w-[22px] bg-[black]/[.2] rounded-sm cursor-pointer"
                    >
                      <i className="fa-solid fa-check text-[#1CB200]"></i>
                    </div>
                    <div 
                      onClick={_=>dispatch({type:'addList',value:false})} 
                      className="flex justify-center items-center hover:border-[1.5px] duration-[50ms] h-[22px] w-[22px] bg-black/[.2] rounded-sm cursor-pointer"
                    >
                      <i className="fa-solid fa-x text-[#FE0000]"></i>
                    </div> 
                  </div>
                </div>
              )
            }
            <p 
              onClick={_=>!state.addList&&dispatch({type:'addList',value:true})} 
              className="cursor-pointer text-center select-none duration-200 hover:bg-black/[.3] rounded-sm"
            >
              + add new list
            </p>
          </div>
        </div>
        <img src={image} alt="image" className="relative top-4 row-start-5 opacity-50 rounded-lg"/>
      </div>
  )
}

// eslint-disable-next-line react/prop-types
function ListTitle({color, onClick, title, listLength}){
  const {attributes, listeners, setNodeRef, transform, transition } = useSortable({id: title});

  return (
    <div 
      ref={setNodeRef}
      style={transform&&{transform: `translateY(${transform.y}px)`, transition: transition}}
      onClick={onClick} 
      className="group flex justify-between items-center cursor-pointer p-1 select-none rounded-sm hover active:z-50"
    >
      <div className='flex items-center gap-3 p-0.5'>
        <div style={{backgroundColor: color}} className='h-[18px] w-[18px] rounded-[3px]' {...attributes} {...listeners}></div>
        <h1 className='w-fit'>{title}</h1>
      </div>
      <div className='group-hover:bg-white/[.7] group-hover:text-red-500 flex justify-center items-center rounded-sm bg-black/[.5] px-1 duration-300'>
        { listLength }
      </div>
    </div>
  )
}