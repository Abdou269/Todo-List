export default function handleListOrder(event, array){
    let fromIndex, toIndex;
    const {active, over} = event;
    array.map((item, index) => {
        if (item.title === active.id) fromIndex = index;
        if (item.title === over.id) toIndex = index;
    });
    const newArray = [...array];
    const elementToMove = newArray.splice(fromIndex, 1)[0];
    newArray.splice(toIndex, 0, elementToMove);
    return newArray;
}