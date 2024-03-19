import { getDatabase, ref, set } from "firebase/database";

export default function handleImportant(currentList, title, important, user, state){
    const newList = state.details ? user.data.filter(list => list.tasks?.filter(task => task.title === state.selectedTask))[0] : currentList,
    newTasks = newList.tasks?.map(task => task.title === title ? {...task, important: !important} : task),
    importantTasks = newTasks.filter(task => task.important === true),
    unimportantTasks = newTasks.filter(task => task.important === false),
    db = getDatabase();
    
    let oldData, newData;

    if (newList.title == state.titles[1]){
        oldData = user.data.map(list =>
            list.title == state.titles[2] ?
            {...list, tasks: list.tasks == undefined ? unimportantTasks : [...list.tasks, ...unimportantTasks]} :
            list
        )
        newData = {
            ...user, 
            data: oldData.map(list => 
                list.title == state.titles[1] ?
                {...list, tasks: importantTasks} :
                list
            ),
        }
    }
    else {
        oldData = user.data.map(list =>
            list.title == newList.title ?
            {...list, tasks: unimportantTasks} :
            list
        )
        newData = {
            ...user, 
            data: oldData.map(list => 
                list.title == state.titles[1] ?
                {...list, tasks: list.tasks == undefined ? importantTasks : [...list.tasks, ...importantTasks]} :
                list
            ),
        }
    }
    set(ref(db, 'users/' + user.uid), newData);
}