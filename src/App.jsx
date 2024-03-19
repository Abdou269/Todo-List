/* eslint-disable no-unused-vars */
import { useEffect, useReducer, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import readData from './functions/readData.jsx';
import { context } from './context/context.jsx';
import Details from './components/details.jsx';
import Menu from './components/menu.jsx';
import List from './components/list.jsx';
import { auth } from './main.jsx';

const initialState = {
  titles : ['this day', 'important tasks', 'tasks to do'],
  icons : ['uil-estate', 'uil-clipboard-alt', 'uil-file-check-alt', 'uil-schedule'],
  isSigned: false,
  minimized: false,
  details: false,
  selectedTask: null,
  selectedList: {title: "tasks to do", icon: 'uil-estate'}
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState),
  [user, setUser] = useState(null);
  
  useEffect(_ => onAuthStateChanged(auth, userData => userData && readData(userData, setUser)), []);
  user && !state.isSigned && dispatch({type: 'isSigned', payload: true});

  function reducer(state, action){
    switch (action.type){
      case 'isSigned':
        return {...state, isSigned: action.payload}
      case 'minimized':
        return {...state, minimized: action.payload}
      case 'details':
        return {...state, details: action.payload}
      case 'selectedTask':
        return {...state, selectedTask: action.payload}
      case 'selectedList':
        return {...state, selectedList: action.payload}
    }
  }

  return (
    <div className="flex bg-gradient-to-r from-[#FD416B] to-[#7A05CC] overflow-hidden h-screen">
      <context.Provider value={[state, dispatch, user]}>
        <Menu/>
        { state.isSigned && <List/> }
        { state.details && <Details/> }
      </context.Provider>
    </div>
  )
}