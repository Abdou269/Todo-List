export default function save(array, state, dispatch){
    const oldStorage = JSON.parse(localStorage.getItem('lists'));
    const newStorage = oldStorage.map(list => list.title === state.listTitle ? {...list, tasks: array} : list);
    localStorage.setItem('lists', JSON.stringify(newStorage));
    dispatch({type: 'showList', value: true});
}