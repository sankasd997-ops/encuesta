import {
    respuestasCollection,
    onSnapshot,
    query,
    orderBy
} from "./firebase.js";


const totalRespuestasEl = document.getElementById("totalRespuestas");
const reactionsContainer = document.getElementById("reactionsContainer");


const niveles = {
    1: { emoji: "😫", estado: "Muy baja" },
    2: { emoji: "🙁", estado: "Baja" },
    3: { emoji: "😐", estado: "Normal" },
    4: { emoji: "🙂", estado: "Buena" },
    5: { emoji: "😁", estado: "Excelente" }
};


let primeraCarga = true;


const idsYaAnimados = new Set();

function animarNuevaRespuesta(energia) {
    const nivel = niveles[energia];
    if (!nivel) return;

    const chip = document.createElement("span");
    chip.className = "reaction-chip";
    chip.textContent = nivel.emoji;

    reactionsContainer.appendChild(chip);

    chip.addEventListener("animationend", () => {
        chip.remove();
    });
}

const respuestasQuery = query(
    respuestasCollection,
    orderBy("timestamp", "desc")
);

onSnapshot(respuestasQuery, (snapshot) => {


    if (!primeraCarga) {
        snapshot.docChanges().forEach(change => {
            if (change.type === "added" && !idsYaAnimados.has(change.doc.id)) {
                idsYaAnimados.add(change.doc.id);
                const datos = change.doc.data();
                animarNuevaRespuesta(datos.energia);
            }
        });
    } else {

        snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                idsYaAnimados.add(change.doc.id);
            }
        });
        primeraCarga = false;
    }

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