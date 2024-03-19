import { getDatabase, onValue, ref } from "firebase/database";
import writeData from "../functions/writeData";

export default function readData(user, action){
    const db = getDatabase();
    onValue(ref(db, 'users/' + user.uid), snapshot => {
        snapshot.val() == null ? 
        writeData(user) : 
        action(snapshot.val());
    });
}