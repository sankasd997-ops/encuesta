import {

    respuestasCollection,
    addDoc,
    serverTimestamp

} from "./firebase.js";

const formulario = document.getElementById("energyForm");

const mensaje = document.getElementById("mensaje");

const boton = document.getElementById("btnEnviar");

const opciones = document.querySelectorAll(".emoji-option");
const niveles = {

    1:{
        emoji:"😫",
        estado:"Muy baja"
    },

    2:{
        emoji:"🙁",
        estado:"Baja"
    },

    3:{
        emoji:"😐",
        estado:"Normal"
    },

    4:{
        emoji:"🙂",
        estado:"Buena"
    },

    5:{
        emoji:"😁",
        estado:"Excelente"
    }

};

opciones.forEach(opcion=>{

    const radio = opcion.querySelector("input");

    radio.addEventListener("change",()=>{

        opciones.forEach(o=>{

            o.classList.remove("selected");

        });

        opcion.classList.add("selected");

    });

});

function mostrarMensaje(texto,color){

    mensaje.innerHTML=texto;

    mensaje.style.color=color;

}

function bloquearBoton(){

    boton.disabled=true;

    boton.classList.add("btn-loading");

    boton.innerHTML=`
        <i class="fa-solid fa-spinner"></i>
        Enviando...
    `;

}

function desbloquearBoton(){

    boton.disabled=false;

    boton.classList.remove("btn-loading");

    boton.innerHTML=`
        <i class="fa-solid fa-paper-plane"></i>
        Enviar respuesta
    `;

}

formulario.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const seleccion=document.querySelector(

        "input[name='energia']:checked"

    );

    if(!seleccion){

        mostrarMensaje(

            "Selecciona un nivel de energía.",

            "#FF6B6B"

        );

        return;

    }

    bloquearBoton();

    try{

        const energia=parseInt(

            seleccion.value

        );

        const datos=niveles[energia];

        await addDoc(

            respuestasCollection,

            {

                energia:energia,

                emoji:datos.emoji,

                estado:datos.estado,

                fecha:new Date().toLocaleDateString(),

                hora:new Date().toLocaleTimeString(),

                timestamp:serverTimestamp()

            }

        );

        mostrarMensaje(

            "✅ ¡Gracias! Tu respuesta fue registrada.",

            "#39D98A"

        );

        formulario.reset();

        opciones.forEach(opcion=>{

            opcion.classList.remove("selected");

        });

    }

    catch(error){

        console.error(error);

        mostrarMensaje(

            "Ocurrió un error al guardar la respuesta.",

            "#FF6B6B"

        );

    }

    desbloquearBoton();

});