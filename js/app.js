// Lista de tareas: se guarda en MySQL a través de la API (Express)
const API = "/api/tareas";
const form = document.getElementById("form");
const texto = document.getElementById("texto");
const lista = document.getElementById("lista");
const vacio = document.getElementById("vacio");
const resumen = document.getElementById("resumen");
const botonesFiltro = document.querySelectorAll("[data-filtro]");

let tareas = [];
let filtro = "todas";

async function pedir(url, opciones) {
  const r = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opciones,
  });
  if (!r.ok) throw new Error("Error " + r.status);
  return r.json();
}

function fallo() {
  pintar();
  resumen.textContent = "No se pudo conectar con el servidor";
}

async function cargar() {
  try {
    const datos = await pedir(API);
    tareas = datos.map((d) => ({
      id: d.id,
      texto: d.titulo,
      hecha: !!d.completada,
    }));
    pintar();
  } catch (e) {
    fallo();
  }
}

function visibles() {
  if (filtro === "pendientes") return tareas.filter((t) => !t.hecha);
  if (filtro === "hechas") return tareas.filter((t) => t.hecha);
  return tareas;
}

function pintar() {
  lista.innerHTML = "";
  const items = visibles();

  items.forEach((t) => {
    const li = document.createElement("li");
    if (t.hecha) li.className = "hecha";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.hecha;
    check.setAttribute("aria-label", "Marcar como hecha: " + t.texto);
    check.addEventListener("change", async () => {
      try {
        await pedir(API + "/" + t.id, {
          method: "PUT",
          body: JSON.stringify({ completada: check.checked }),
        });
        t.hecha = check.checked;
        pintar();
      } catch (e) {
        fallo();
      }
    });

    const span = document.createElement("span");
    span.textContent = t.texto;

    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "borrar";
    borrar.textContent = "Borrar";
    borrar.setAttribute("aria-label", "Borrar tarea: " + t.texto);
    borrar.addEventListener("click", async () => {
      try {
        await pedir(API + "/" + t.id, { method: "DELETE" });
        tareas = tareas.filter((x) => x.id !== t.id);
        pintar();
      } catch (e) {
        fallo();
      }
    });

    li.append(check, span, borrar);
    lista.appendChild(li);
  });

  vacio.hidden = items.length > 0;
  const pendientes = tareas.filter((t) => !t.hecha).length;
  resumen.textContent = tareas.length
    ? pendientes + " pendiente(s) de " + tareas.length + " tarea(s)"
    : "";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const valor = texto.value.trim();
  if (!valor) return;
  try {
    const nueva = await pedir(API, {
      method: "POST",
      body: JSON.stringify({ titulo: valor }),
    });
    tareas.push({ id: nueva.id, texto: nueva.titulo, hecha: false });
    texto.value = "";
    pintar();
  } catch (e) {
    fallo();
  }
});

botonesFiltro.forEach((b) =>
  b.addEventListener("click", () => {
    filtro = b.dataset.filtro;
    botonesFiltro.forEach((x) => x.classList.toggle("activo", x === b));
    pintar();
  }),
);

document.getElementById("limpiar").addEventListener("click", async () => {
  try {
    await pedir(API + "/completadas", { method: "DELETE" });
    tareas = tareas.filter((t) => !t.hecha);
    pintar();
  } catch (e) {
    fallo();
  }
});

cargar();
