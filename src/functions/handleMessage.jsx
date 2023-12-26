export default function handleMessage(index, dispatch){
    const messages = JSON.parse(localStorage.tips);
    const currentMessage = messages[index];
    if (!currentMessage.showed){
        const newMessages = messages.map((message, i) => i === index && i !== 4 && i !== 5 ? {...message, showed: true} : message);
        localStorage.tips = JSON.stringify(newMessages);
        dispatch({type: 'message', value: currentMessage});
    }
}
