import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBISE2yJ8EuwhobLlwp1Ga6mYpdMTcLPec",
  authDomain: "todo-list-1707158522328.firebaseapp.com",
  projectId: "todo-list-1707158522328",
  storageBucket: "todo-list-1707158522328.appspot.com",
  messagingSenderId: "997228176492",
  appId: "1:997228176492:web:64c1358e7b52d1079a6449",
  databaseURL: 'https://todo-list-1707158522328-default-rtdb.europe-west1.firebasedatabase.app/'
};

initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
