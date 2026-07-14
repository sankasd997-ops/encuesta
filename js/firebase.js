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


    apiKey: "TU_API_KEY",


    authDomain:
    "TU_PROYECTO.firebaseapp.com",


    projectId:
    "TU_PROJECT_ID",


    storageBucket:
    "TU_BUCKET.appspot.com",


    messagingSenderId:
    "TU_MESSAGING_ID",


    appId:
    "TU_APP_ID"


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