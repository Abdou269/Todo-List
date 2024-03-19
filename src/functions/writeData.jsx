import { getDatabase, ref, set } from "firebase/database";

export default function writeData(user){
    const db = getDatabase();
    set(ref(db, 'users/' + user.uid), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        data: [
            { title: 'this day', tasks: [] },
            { title: 'important tasks', tasks: [] },
            { title: 'tasks to do', tasks: [] },
        ],
    })
}