(() => {
  // Año footer
  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  // Menú móvil
  const burger = document.querySelector("[data-burger]");
  const mobile = document.querySelector("[data-mobile]");
  if (burger && mobile) {
    burger.addEventListener("click", () => {
      const isOpen = mobile.getAttribute("data-open") === "true";
      mobile.setAttribute("data-open", String(!isOpen));
      burger.setAttribute("aria-expanded", String(!isOpen));
    });

    mobile.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobile.setAttribute("data-open", "false");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Modal (Detalles del libro)
  const modal = document.querySelector('[data-modal="book"]');
  const openBtn = document.querySelector('[data-open-modal="book"]');
  const closeTargets = document.querySelectorAll("[data-close-modal]");

  const openModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  if (openBtn) openBtn.addEventListener("click", openModal);
  closeTargets.forEach(el => el.addEventListener("click", closeModal));

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
(() => {
  const video = document.querySelector(".videoCard__video");
  const btn = document.querySelector("[data-audio-toggle]");
  const label = document.querySelector("[data-audio-text]");

  if (!video || !btn || !label) return;

  // Estado inicial para autoplay
  video.muted = true;
  video.volume = 1;

  const sync = () => {
    const isMuted = video.muted;
    btn.setAttribute("aria-pressed", String(!isMuted));
    label.textContent = isMuted ? "Activar sonido" : "Desactivar sonido";
  };

  sync();

  btn.addEventListener("click", async () => {
    try {
      // 1) Toggle del mute
      video.muted = !video.muted;

      // 2) Asegurar reproducción (Safari a veces pausa al desmutear)
      await video.play();

      sync();
    } catch (err) {
      // Si el navegador bloquea, vuelve a muted
      video.muted = true;
      sync();
      console.warn("No se pudo activar audio:", err);
    }
  });
})();

(() => {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const qs = (s) => form.querySelector(s);
  const waNumber = "50687920910";
  const toEmail = "mvillegasv1201@gmail.com";

  const getData = () => {
    const svc = qs("#svc").value.trim();
    const date = qs("#date").value;
    const time = qs("#time").value;
    const country = qs("#country").value.trim();
    const place = qs("#place").value.trim();
    const email = qs("#email").value.trim();
    const details = qs("#details").value.trim();

    return { svc, date, time, country, place, email, details };
  };

  const formatCR = (date, time) => {
    // date: YYYY-MM-DD, time: HH:MM
    return { date, time };
  };

  const buildMsg = () => {
    const d = getData();
    const { date, time } = formatCR(d.date, d.time);

    return (
`Hola Mellky, quisiera coordinar un servicio.

• Servicio: ${d.svc}
• Fecha: ${date}
• Hora: ${time} (hora local)
• País: ${d.country}
• Lugar: ${d.place}
• Mi correo: ${d.email}

Detalles:
${d.details}`
    );
  };

  const openWhatsApp = () => {
    const msg = encodeURIComponent(buildMsg());
    const url = `https://wa.me/${waNumber}?text=${msg}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openEmail = () => {
    const subject = encodeURIComponent("Solicitud de servicio / coordinación");
    const body = encodeURIComponent(buildMsg());
    const url = `mailto:${toEmail}?subject=${subject}&body=${body}`;
    window.location.href = url;
  };

  const buildGoogleCalendarLink = () => {
    const d = getData();
    // Google calendar expects UTC-like format. Sin backend, lo hacemos "simple":
    // Usamos fecha/hora como referencia del usuario.
    // Title y details completos.
    const title = encodeURIComponent(`Servicio con Mellky Villegas — ${d.svc}`);
    const details = encodeURIComponent(buildMsg());
    const location = encodeURIComponent(`${d.place}, ${d.country}`);

    // Fecha/hora mínima: creamos un bloque de 60 min (puedes cambiarlo)
    // Formato: YYYYMMDDTHHMM00/YYYYMMDDTHHMM00
    const start = `${d.date.replaceAll("-", "")}T${d.time.replace(":", "")}00`;
    // +1h
    const [hh, mm] = d.time.split(":").map(Number);
    const endH = String((hh + 1) % 24).padStart(2, "0");
    const end = `${d.date.replaceAll("-", "")}T${endH}${String(mm).padStart(2, "0")}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  // Enviar WhatsApp
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    openWhatsApp();
  });

  // Enviar correo
  const sendEmailBtn = document.getElementById("sendEmailBtn");
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener("click", () => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      openEmail();
    });
  }

  // Añadir al calendario
  const addCalBtn = document.getElementById("addCalBtn");
  if (addCalBtn) {
    const refreshCal = () => {
      if (!form.checkValidity()) return;
      addCalBtn.href = buildGoogleCalendarLink();
    };

    ["change", "input"].forEach(evt => {
      form.addEventListener(evt, refreshCal);
    });

    // Primera vez
    refreshCal();
  }
})();
