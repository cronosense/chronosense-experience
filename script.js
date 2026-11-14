const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const seedMemories = [
  { title: "Una tarde junto al mar", type: "Fotografía", date: "2026-10-12", desc: "Un paseo tranquilo por la costa y una conversación que merece conservarse.", icon: "◉" },
  { title: "La canción de los domingos", type: "Audio", date: "2026-09-28", desc: "Una melodía que acompañaba las reuniones familiares.", icon: "♫" },
  { title: "La receta de la abuela", type: "Historia", date: "2026-09-16", desc: "Un relato familiar sobre una receta que pasó de generación en generación.", icon: "✎" },
  { title: "Nuestro primer viaje", type: "Fotografía", date: "2026-08-04", desc: "Un recuerdo de aquel viaje en el que todos estuvimos juntos.", icon: "⌖" },
  { title: "Consejo para el futuro", type: "Historia", date: "2026-07-21", desc: "Una reflexión personal para compartir con la familia.", icon: "✧" },
  { title: "Voces queridas", type: "Audio", date: "2026-06-02", desc: "Un ejemplo de archivo de voz familiar.", icon: "♫" }
];
const seedFamily = [
  { name: "María López", role: "Administradora", initials: "ML" },
  { name: "Carlos López", role: "Familiar", initials: "CL" },
  { name: "Ana López", role: "Familiar", initials: "AL" },
  { name: "Elena Ruiz", role: "Cuidador autorizado", initials: "ER" }
];
const seedLegacy = [
  { title: "Para los días difíciles", to: "Mi familia", message: "Recordad que los pequeños momentos compartidos son los que construyen una vida.", date: "2026-09-10" },
  { title: "Nuestra historia", to: "A las próximas generaciones", message: "Quiero que conozcáis las historias que nos trajeron hasta aquí.", date: "2026-08-18" },
  { title: "Un mensaje de cariño", to: "Mis seres queridos", message: "Gracias por estar cerca y cuidar los vínculos que nos unen.", date: "2026-07-02" }
];

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(`chrono_${key}`);
    if (!raw) return clone(fallback);
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : clone(fallback);
  } catch (error) {
    console.warn(`No se pudieron leer los datos ${key}`, error);
    return clone(fallback);
  }
}
let memories = load("memories", seedMemories);
let family = load("family", seedFamily);
let legacy = load("legacy", seedLegacy);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}
function toast(message) {
  const element = $("#toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => element.classList.remove("show"), 3200);
}
function persist() {
  try {
    localStorage.setItem("chrono_memories", JSON.stringify(memories));
    localStorage.setItem("chrono_family", JSON.stringify(family));
    localStorage.setItem("chrono_legacy", JSON.stringify(legacy));
    return true;
  } catch (error) {
    console.error("No se pudieron guardar los datos locales", error);
    toast("No se pudo guardar: el almacenamiento del navegador puede estar lleno o bloqueado.");
    return false;
  }
}
function dateFmt(value) {
  if (!value) return "Sin fecha";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}
function showView(name) {
  $$(".view").forEach(view => view.classList.toggle("active", view.id === `view-${name}`));
  $$("[data-view]").forEach(button => {
    const active = button.dataset.view === name;
    button.classList.toggle("active", active);
    if (button.matches(".nav-link")) {
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
  });
  $("#mainNav")?.classList.remove("open");
  $("#mobileMenu")?.setAttribute("aria-expanded", "false");
  $("#mobileMenu")?.setAttribute("aria-label", "Abrir menú");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (name === "overview") renderOverview();
}
$$("[data-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.view)));
$("#mobileMenu")?.addEventListener("click", () => {
  const isOpen = $("#mainNav").classList.toggle("open");
  $("#mobileMenu").setAttribute("aria-expanded", String(isOpen));
  $("#mobileMenu").setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

function renderOverview() {
  $("#memoryCount").textContent = memories.length;
  $("#familyCount").textContent = family.length;
  $("#legacyCount").textContent = legacy.length;
  $("#recentMemories").innerHTML = memories.slice(0, 3).map(memory => `
    <div class="memory-row"><div class="memory-thumb" aria-hidden="true">${esc(memory.icon || "✧")}</div>
      <div><b>${esc(memory.title)}</b><small>${esc(memory.type)} · ${dateFmt(memory.date)}</small></div></div>`).join("") || '<p class="muted">Todavía no hay recuerdos guardados.</p>';
}
function renderMemories(filter = "Todos") {
  const visible = filter === "Todos" ? memories : memories.filter(memory => memory.type === filter);
  $("#memoryGrid").innerHTML = visible.map(memory => `
    <article class="memory-card"><div class="memory-art" aria-hidden="true">${esc(memory.icon || "✧")}</div>
      <div class="memory-card-body"><h3>${esc(memory.title)}</h3><p>${esc(memory.desc || "Recuerdo familiar guardado en esta demostración.")}</p>
      <div class="memory-meta"><span>${esc(memory.type)}</span><span>${dateFmt(memory.date)}</span></div></div></article>`).join("") || '<p class="muted">No hay recuerdos en esta categoría.</p>';
}
function renderFamily() {
  $("#familyList").innerHTML = family.map(member => `
    <div class="family-member"><div class="member-avatar" aria-hidden="true">${esc(member.initials || member.name.slice(0, 2).toUpperCase())}</div>
      <div class="member-info"><b>${esc(member.name)}</b><small>${esc(member.role)}</small></div><span class="member-access">Perfil demo</span></div>`).join("") || '<p class="muted">Todavía no hay perfiles familiares.</p>';
}
function renderLegacy() {
  $("#legacyList").innerHTML = legacy.map(message => `
    <article class="legacy-card"><div class="legacy-icon" aria-hidden="true">◇</div><h3>${esc(message.title)}</h3><p>${esc(message.message)}</p>
      <small>Para: ${esc(message.to || "Sin destinatario")} · ${dateFmt(message.date)}</small></article>`).join("") || '<p class="muted">Todavía no hay mensajes guardados.</p>';
}
function openDialog(id) {
  const dialog = $(`#${id}`);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else toast("Tu navegador no admite esta ventana de diálogo.");
}
$$('[data-action="new-memory"]').forEach(button => button.addEventListener("click", () => openDialog("memoryDialog")));
$$('[data-action="new-legacy"]').forEach(button => button.addEventListener("click", () => openDialog("legacyDialog")));
$$('[data-action="add-member"]').forEach(button => button.addEventListener("click", () => openDialog("memberDialog")));

function activeFilter() { return $(".filter.active")?.dataset.filter || "Todos"; }
$$(".filter").forEach(button => button.addEventListener("click", () => {
  $$(".filter").forEach(item => {
    const active = item === button;
    item.classList.toggle("active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderMemories(button.dataset.filter);
}));

$("#memoryForm").addEventListener("submit", event => {
  if (event.submitter?.id !== "saveMemory") return;
  event.preventDefault();
  const title = $("#memoryTitle").value.trim();
  if (!title) return $("#memoryTitle").focus();
  const type = $("#memoryType").value;
  memories.unshift({ title, type, date: $("#memoryDate").value || new Date().toISOString().slice(0, 10), desc: $("#memoryDescription").value.trim(), icon: { "Fotografía": "◉", "Audio": "♫", "Historia": "✎" }[type] });
  if (!persist()) { memories.shift(); return; }
  $("#memoryDialog").close(); event.target.reset(); renderMemories(activeFilter()); renderOverview(); toast("Recuerdo añadido y guardado en este navegador.");
});
$("#legacyForm").addEventListener("submit", event => {
  if (event.submitter?.id !== "saveLegacy") return;
  event.preventDefault();
  const title = $("#legacyTitle").value.trim();
  const message = $("#legacyMessage").value.trim();
  if (!title || !message) return;
  legacy.unshift({ title, to: $("#legacyTo").value.trim(), message, date: new Date().toISOString().slice(0, 10) });
  if (!persist()) { legacy.shift(); return; }
  $("#legacyDialog").close(); event.target.reset(); renderLegacy(); renderOverview(); toast("Mensaje guardado en este navegador.");
});
$("#memberForm").addEventListener("submit", event => {
  if (event.submitter?.id !== "saveMember") return;
  event.preventDefault();
  const name = $("#memberName").value.trim();
  if (!name) return;
  family.push({ name, role: $("#memberRole").value, initials: name.split(/\s+/).map(part => part[0]).join("").slice(0, 2).toUpperCase() });
  if (!persist()) { family.pop(); return; }
  $("#memberDialog").close(); event.target.reset(); renderFamily(); renderOverview(); toast("Perfil añadido a esta demostración.");
});

$("#simulateLocation").addEventListener("click", () => {
  $("#safetyFeedback").textContent = "Ubicación simulada: Parque familiar · Punto de referencia ficticio. No se ha utilizado GPS ni se ha compartido una ubicación real.";
  toast("Simulación de ubicación. No se ha usado GPS.");
});
$("#simulateSOS").addEventListener("click", () => {
  $("#safetyFeedback").textContent = "SIMULACIÓN SOS: en un producto real podría generarse una solicitud de ayuda a contactos autorizados. No se ha enviado ninguna alerta ni se ha contactado con emergencias.";
  toast("Simulación SOS. No se ha contactado con emergencias.");
});

$("#showContext").addEventListener("click", () => {
  const context = $("#contextSelect").value;
  const terms = { music: ["audio", "canción", "música", "melodía"], place: ["mar", "viaje", "paseo", "lugar"], person: ["familia", "abuela", "querida", "consejo", "persona"] }[context];
  const match = memories.find(memory => terms.some(term => `${memory.title} ${memory.desc} ${memory.type}`.toLocaleLowerCase("es").includes(term)));
  const labels = { music: "Música familiar", place: "Lugar conocido", person: "Persona importante" };
  const fallback = {
    music: "Esta canción podría servir como punto de partida para compartir una historia familiar.",
    place: "Un lugar conocido podría evocar conversaciones y recuerdos compartidos.",
    person: "Una persona importante puede ser un punto de conexión con historias familiares."
  };
  const title = match ? match.title : labels[context];
  const description = match ? (match.desc || fallback[context]) : fallback[context];
  $("#noaResult").innerHTML = `<b>Recuerdo sugerido · ${esc(title)}</b><p>${esc(description)}</p><small>${match ? "Coincidencia ilustrativa con un recuerdo local." : "Ejemplo ficticio sin coincidencia en el archivo."} No es una inferencia clínica ni una recomendación automatizada.</small>`;
});

$("#exportDemoData")?.addEventListener("click", () => {
  const payload = { product: "Chronosense Experience", type: "demo-data-export", exportedAt: new Date().toISOString(), notice: "Datos locales de demostración. No contienen sincronización ni respaldo cloud.", memories, family, legacy };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = `chronosense-demo-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  toast("Exportación JSON preparada.");
});
$("#resetDemoData")?.addEventListener("click", () => {
  if (!window.confirm("¿Restablecer la demostración? Se borrarán los cambios locales y volverán los datos de ejemplo.")) return;
  memories = clone(seedMemories); family = clone(seedFamily); legacy = clone(seedLegacy);
  try {
    ["chrono_memories", "chrono_family", "chrono_legacy"].forEach(key => localStorage.removeItem(key));
    renderAll(); toast("Datos de demostración restablecidos.");
  } catch (error) {
    toast("No se pudo limpiar el almacenamiento local de este navegador.");
  }
});
function renderAll() { renderOverview(); renderMemories(); renderFamily(); renderLegacy(); }
renderAll();
