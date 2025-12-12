/* ======================================================
  SITIO: Mellky Villegas
  ARCHIVO: js/main.js
  OBJETIVO:
  - Navbar: efecto al hacer scroll
  - Video: toggle de audio (por defecto muted)
  - Launch bar: elegante, cerrable y recuerda cierre
  - Footer year
====================================================== */

(function () {
  // ===== Helpers
  const $ = (sel) => document.querySelector(sel);

  // ===== Navbar scroll effect
  const nav = $(".site-nav");
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add("nav-scrolled");
    else nav.classList.remove("nav-scrolled");
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  // ===== Year
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // ===== Video audio toggle
  const video = $("#videoPortada");
  const audioBtn = $("#audioToggle");

  if (video && audioBtn) {
    // Asegurar configuración inicial
    video.muted = true;

    const updateAudioUI = () => {
      const icon = audioBtn.querySelector(".audio-icon");
      const text = audioBtn.querySelector(".audio-text");
      const isMuted = video.muted;

      if (icon) icon.textContent = isMuted ? "🔇" : "🔊";
      if (text) text.textContent = isMuted ? "Audio desactivado" : "Audio activado";
    };

    audioBtn.addEventListener("click", async () => {
      try {
        // Si el navegador pausó el autoplay, intentamos reproducir
        if (video.paused) await video.play();
      } catch (_) {
        // si el navegador bloquea, no rompemos la UI
      }

      video.muted = !video.muted;
      updateAudioUI();
    });

    updateAudioUI();
  }

  // ===== Launch bar (Nuevo libro)
  const launchBar = $("#launchBar");
  const launchClose = $("#launchClose");
  const storageKey = "mv_launch_bar_closed";

  if (launchBar) {
    const isClosed = localStorage.getItem(storageKey) === "1";

    if (!isClosed) {
      // Mostrar después de un momento, para que se sienta premium y no “intrusivo”
      setTimeout(() => {
        launchBar.style.display = "block";
      }, 900);
    }

    if (launchClose) {
      launchClose.addEventListener("click", () => {
        launchBar.style.display = "none";
        localStorage.setItem(storageKey, "1");
      });
    }
  }
})();
