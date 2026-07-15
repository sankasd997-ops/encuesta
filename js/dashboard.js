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
const promedioEl = document.getElementById("promedio");
const ultimaHoraEl = document.getElementById("ultimaHora");
const emojiPrincipalEl = document.getElementById("emojiPrincipal");
const estadoTextoEl = document.getElementById("estadoTexto");
const tablaRespuestasEl = document.getElementById("tablaRespuestas");

// ==========================================================
// NIVELES (para pintar estado a partir del número)
// ==========================================================
const niveles = {
    1: { emoji: "😫", estado: "Muy baja" },
    2: { emoji: "🙁", estado: "Baja" },
    3: { emoji: "😐", estado: "Normal" },
    4: { emoji: "🙂", estado: "Buena" },
    5: { emoji: "😁", estado: "Excelente" }
};

// ==========================================================
// CONSULTA EN TIEMPO REAL
// ==========================================================
const respuestasQuery = query(
    respuestasCollection,
    orderBy("timestamp", "desc")
);

onSnapshot(respuestasQuery, (snapshot) => {

    const respuestas = snapshot.docs.map(doc => doc.data());

    if (respuestas.length === 0) {
        totalRespuestasEl.textContent = "0";
        promedioEl.textContent = "0.0";
        ultimaHoraEl.textContent = "--";
        estadoTextoEl.textContent = "Esperando respuestas...";
        tablaRespuestasEl.innerHTML = "";
        return;
    }

    // ------------------------------------------------------
    // TOTAL Y PROMEDIO
    // ------------------------------------------------------
    const total = respuestas.length;
    const suma = respuestas.reduce((acc, r) => acc + r.energia, 0);
    const promedio = suma / total;

    totalRespuestasEl.textContent = total;
    promedioEl.textContent = promedio.toFixed(1);

    // ------------------------------------------------------
    // ÚLTIMA RESPUESTA (la más reciente, ya que ordenamos desc)
    // ------------------------------------------------------
    const ultima = respuestas[0];
    ultimaHoraEl.textContent = ultima.hora || "--";
    emojiPrincipalEl.textContent = ultima.emoji || "😐";
    estadoTextoEl.textContent = ultima.estado || "Sin datos";

    // ------------------------------------------------------
    // CONTEO POR NIVEL (1 a 5)
    // ------------------------------------------------------
    const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    respuestas.forEach(r => {
        if (conteo[r.energia] !== undefined) {
            conteo[r.energia]++;
        }
    });

    const maxConteo = Math.max(...Object.values(conteo), 1);

    for (let nivel = 1; nivel <= 5; nivel++) {
        const cantidad = conteo[nivel];
        const porcentaje = ((cantidad / total) * 100).toFixed(0);
        const anchoBarra = (cantidad / maxConteo) * 100;

        const bar = document.getElementById(`bar${nivel}`);
        const count = document.getElementById(`count${nivel}`);
        const porcentajeEl = document.getElementById(`p${nivel}`);

        if (bar) bar.style.width = `${anchoBarra}%`;
        if (count) count.textContent = cantidad;
        if (porcentajeEl) porcentajeEl.textContent = `${porcentaje}%`;
    }

    // ------------------------------------------------------
    // TABLA DE ÚLTIMAS RESPUESTAS (las 10 más recientes)
    // ------------------------------------------------------
    const ultimas10 = respuestas.slice(0, 10);

    tablaRespuestasEl.innerHTML = ultimas10.map(r => `
        <tr>
            <td>${r.hora || "--"}</td>
            <td>${r.emoji || ""}</td>
            <td>${r.estado || "--"}</td>
        </tr>
    `).join("");

});