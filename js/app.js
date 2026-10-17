// Lista de tareas: se guarda en localStorage del navegador
const CLAVE = "pendientes-tareas";
const form = document.getElementById("form");
const texto = document.getElementById("texto");
const lista = document.getElementById("lista");
const vacio = document.getElementById("vacio");
const resumen = document.getElementById("resumen");
const botonesFiltro = document.querySelectorAll("[data-filtro]");

let tareas = cargar();
let filtro = "todas";

function cargar() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || [];
  } catch (e) {
    return [];
  }
}

function guardar() {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(tareas));
  } catch (e) {
    /* si el navegador bloquea el almacenamiento, la app sigue funcionando */
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
    check.addEventListener("change", () => {
      t.hecha = check.checked;
      guardar();
      pintar();
    });

    const span = document.createElement("span");
    span.textContent = t.texto;

    const borrar = document.createElement("button");
    borrar.type = "button";
    borrar.className = "borrar";
    borrar.textContent = "Borrar";
    borrar.setAttribute("aria-label", "Borrar tarea: " + t.texto);
    borrar.addEventListener("click", () => {
      tareas = tareas.filter((x) => x.id !== t.id);
      guardar();
      pintar();
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

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const valor = texto.value.trim();
  if (!valor) return;
  tareas.push({ id: Date.now(), texto: valor, hecha: false });
  texto.value = "";
  guardar();
  pintar();
});

botonesFiltro.forEach((b) =>
  b.addEventListener("click", () => {
    filtro = b.dataset.filtro;
    botonesFiltro.forEach((x) => x.classList.toggle("activo", x === b));
    pintar();
  })
);

document.getElementById("limpiar").addEventListener("click", () => {
  tareas = tareas.filter((t) => !t.hecha);
  guardar();
  pintar();
});

pintar();
