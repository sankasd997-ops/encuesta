/****************************************************************
 *
 *      ENERGY TRACKER
 *      firebase.js
 *
 *      Configuración central de Firebase
 *
 ****************************************************************/


// ==========================================================
// IMPORTACIONES FIREBASE
// ==========================================================

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



// ==========================================================
// CONFIGURACIÓN FIREBASE
// ==========================================================
//
// Reemplaza estos valores con los de tu proyecto Firebase
//
// Firebase Console
//  -> Configuración del proyecto
//  -> Tus aplicaciones
//  -> Aplicación Web
//
// ==========================================================


const firebaseConfig = {

apiKey: "AIzaSyCYWvc_AkYzYobtUmQNV4hu-i1oG1dg2J8",
  authDomain: "encuestasweb-92f8c.firebaseapp.com",
  projectId: "encuestasweb-92f8c",
  storageBucket: "encuestasweb-92f8c.firebasestorage.app",
  messagingSenderId: "649079601837",
  appId: "1:649079601837:web:04e8d9ca5cf33bb2e1e424"


};




// ==========================================================
// INICIALIZAR FIREBASE
// ==========================================================


const app = initializeApp(

    firebaseConfig

);



// ==========================================================
// FIRESTORE
// ==========================================================


const db = getFirestore(

    app

);



// ==========================================================
// COLECCIÓN PRINCIPAL
// ==========================================================
//
// Aquí se guardarán las respuestas:
//
// respuestas
//    └── documento
//          ├── energia
//          ├── emoji
//          ├── estado
//          ├── fecha
//          ├── hora
//          └── timestamp
//
// ==========================================================


const respuestasCollection = collection(

    db,

    "respuestas"

);



// ==========================================================
// EXPORTAR SERVICIOS
// ==========================================================


export {

    db,

    respuestasCollection,

    addDoc,

    onSnapshot,

    query,

    orderBy,

    serverTimestamp

};