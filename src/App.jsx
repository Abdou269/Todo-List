/* eslint-disable no-unused-vars */
import messages from './context/messages.json'
import { context } from './context/context';
import Details from './components/details';
import Message from './components/message';
import Menu from './components/menu';
import List from './components/list';
import { useReducer } from "react";

const initialState = {
  message: '',
  listTitle: '',
  editTitle: false,
  addList: false,
  showList: false,
  showDetails: false,
  listDelete: false,
  task: {
    id: '',
    title: '',
    description: '',
  },
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  //create help messages array in local storage if there isn't
  localStorage.lists == null && localStorage.setItem('lists', JSON.stringify([]));
  localStorage.tips == null && localStorage.setItem('tips', JSON.stringify(messages));
  //reducer function for variables that are used in all components
  function reducer(state, action){
    switch (action.type){
      case 'message':
        return {...state, message: action.value};
      case 'listTitle':
        return {...state, listTitle: action.value};
      case 'editTitle':
        return {...state, editTitle: action.value};
      case 'addList' : 
        return {...state, addList: action.value};
      case 'showList' : 
        return {...state, showList: action.value};
      case 'showDetails':
        return {...state, showDetails: action.value};
      case 'listDelete':
        return {...state, listDelete: action.value};
      case 'taskInfo':
        return {...state, task: action.value};
    }
  }
  return (
    <>
        <div className="flex gap-4 w-full h-[100vh] bg-gradient-to-r from-[#F24B46] to-[#8224B8] text-white p-4 overflow-hidden">
          <context.Provider value={{state, dispatch}}>
            <Message 
              key={state.message.id} 
              message={state.message.message} 
              duration={state.message.duration} 
              showed={state.message.showed} 
            />
            <Menu />
            <List />
            <Details />
          </context.Provider>
        </div>
    </>
  )
}