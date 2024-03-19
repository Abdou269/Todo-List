import { getDatabase, ref, set } from "firebase/database";

export default function handleComplete(currentList, title, completed, state, user){
    const db = getDatabase();
    const newList = state.details ? user.data.filter(list => list.tasks?.filter(task => task.title === state.selectedTask))[0] : currentList,
    newTasks = newList.tasks.map(task => task.title === title ? {...task, completed: !completed} : task),
    newData = {
        ...user, 
        data: user.data.map(list => list.title === newList.title ? {...list, tasks: newTasks, } : list),
    }
    set(ref(db, 'users/' + user.uid), newData);
}