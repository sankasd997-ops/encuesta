import { initializeApp }

from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


import {

    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp

}

from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {

apiKey: "AIzaSyCYWvc_AkYzYobtUmQNV4hu-i1oG1dg2J8",
  authDomain: "encuestasweb-92f8c.firebaseapp.com",
  projectId: "encuestasweb-92f8c",
  storageBucket: "encuestasweb-92f8c.firebasestorage.app",
  messagingSenderId: "649079601837",
  appId: "1:649079601837:web:04e8d9ca5cf33bb2e1e424"


};

const app = initializeApp(

    firebaseConfig

);


const db = getFirestore(

    app

);

const respuestasCollection = collection(

    db,

    "respuestas"

);

export {

    db,

    respuestasCollection,

    addDoc,

    onSnapshot,

    query,

    orderBy,

    serverTimestamp

};