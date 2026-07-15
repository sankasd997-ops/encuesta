/****************************************************************
 *
 *      ENERGY TRACKER
 *      dashboard.js
 *
 ****************************************************************/
import {
    respuestasCollection,
    onSnapshot,
    query,
    orderBy
} from "./firebase.js";

// ==========================================================
// ELEMENTOS DEL DOM
// ==========================================================
const totalRespuestasEl = document.getElementById("totalRespuestas");
const reactionsContainer = document.getElementById("reactionsContainer");

// ==========================================================
// NIVELES
// ==========================================================
const niveles = {
    1: { emoji: "😫", estado: "Muy baja" },
    2: { emoji: "🙁", estado: "Baja" },
    3: { emoji: "😐", estado: "Normal" },
    4: { emoji: "🙂", estado: "Buena" },
    5: { emoji: "😁", estado: "Excelente" }
};

// ==========================================================
// CONTROL DE PRIMERA CARGA
// ==========================================================
// Evita animar todas las respuestas ya existentes cuando
// la página carga por primera vez. Solo se anima lo que
// llega DESPUÉS de esa primera carga.
// ==========================================================
let primeraCarga = true;

// Evita animar dos veces el mismo documento (por ejemplo si
// Firestore dispara un "added" local optimista y luego otro
// al confirmarse con el servidor).
const idsYaAnimados = new Set();

// ==========================================================
// ANIMACIÓN DE REACCIÓN
// ==========================================================
function animarNuevaRespuesta(energia) {
    const nivel = niveles[energia];
    if (!nivel) return;

    const chip = document.createElement("span");
    chip.className = "reaction-chip";
    chip.textContent = nivel.emoji;

    reactionsContainer.appendChild(chip);

    // Se elimina solo cuando termina la animación CSS,
    // así soporta múltiples respuestas simultáneas sin
    // pisarse unas a otras.
    chip.addEventListener("animationend", () => {
        chip.remove();
    });
}

// ==========================================================
// CONSULTA EN TIEMPO REAL
// ==========================================================
const respuestasQuery = query(
    respuestasCollection,
    orderBy("timestamp", "desc")
);

onSnapshot(respuestasQuery, (snapshot) => {

    // ------------------------------------------------------
    // DETECTAR RESPUESTAS NUEVAS (para animar)
    // ------------------------------------------------------
    if (!primeraCarga) {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added" && !idsYaAnimados.has(change.doc.id)) {
                idsYaAnimados.add(change.doc.id);
                const datos = change.doc.data();
                animarNuevaRespuesta(datos.energia);
            }
        });
    } else {
        // En la primera carga solo registramos los ids
        // existentes, sin animarlos.
        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                idsYaAnimados.add(change.doc.id);
            }
        });
        primeraCarga = false;
    }

    // ------------------------------------------------------
    // RECALCULAR MÉTRICAS CON TODOS LOS DOCUMENTOS
    // ------------------------------------------------------
    const respuestas = snapshot.docs.map(doc => doc.data());
    const total = respuestas.length;

    totalRespuestasEl.textContent = total;

    const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    respuestas.forEach(r => {
        if (conteo[r.energia] !== undefined) {
            conteo[r.energia]++;
        }
    });

    const maxConteo = Math.max(...Object.values(conteo), 1);

    for (let nivel = 1; nivel <= 5; nivel++) {
        const cantidad = conteo[nivel];
        const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(0) : 0;
        const anchoBarra = (cantidad / maxConteo) * 100;

        const bar = document.getElementById(`bar${nivel}`);
        const count = document.getElementById(`count${nivel}`);
        const porcentajeEl = document.getElementById(`p${nivel}`);

        if (bar) bar.style.width = `${anchoBarra}%`;
        if (count) count.textContent = cantidad;
        if (porcentajeEl) porcentajeEl.textContent = `${porcentaje}%`;
    }

});