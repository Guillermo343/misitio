document.addEventListener("DOMContentLoaded", () => {
  // Menú móvil
  const btn = document.getElementById("menu-btn");
  const nav = document.getElementById("nav");
  btn?.addEventListener("click", () => {
    const abierto = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", abierto);
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  // Tema claro/oscuro (se recuerda en el navegador)
  const root = document.documentElement;
  const temaBtn = document.getElementById("tema-btn");
  try { const t = localStorage.getItem("tema"); if (t) root.dataset.theme = t; } catch (e) {}
  temaBtn?.addEventListener("click", () => {
    const oscuro = root.dataset.theme === "dark" ||
      (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = oscuro ? "light" : "dark";
    try { localStorage.setItem("tema", root.dataset.theme); } catch (e) {}
  });

  // Enlace activo según la página
  const actual = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (!href.includes("#") && href === actual) a.classList.add("active");
  });

  // Aparición al hacer scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), { threshold: .15 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // Año en el pie
  document.querySelectorAll(".anio").forEach(el => el.textContent = new Date().getFullYear());

  // Formulario de contacto
  const form = document.getElementById("form-contacto");
  form?.addEventListener("submit", e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    let valido = true;
    const marcar = (campo, msg) => { form.querySelector(`[data-error="${campo}"]`).textContent = msg; if (msg) valido = false; };
    marcar("nombre", datos.nombre.trim().length < 2 ? "Escribe tu nombre." : "");
    marcar("correo", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo) ? "" : "Escribe un correo válido.");
    marcar("mensaje", datos.mensaje.trim().length < 10 ? "El mensaje debe tener al menos 10 caracteres." : "");
    const estado = document.getElementById("estado");
    if (!valido) { estado.textContent = ""; return; }
    // Abre tu cliente de correo con el mensaje listo (sin necesidad de servidor)
    const asunto = encodeURIComponent("Contacto desde tu portafolio: " + datos.nombre);
    const cuerpo = encodeURIComponent(`${datos.mensaje}\n\n— ${datos.nombre} (${datos.correo})`);
    location.href = `mailto:TU_CORREO@ejemplo.com?subject=${asunto}&body=${cuerpo}`;
    estado.textContent = "Se abrió tu aplicación de correo con el mensaje.";
    form.reset();
  });
});
