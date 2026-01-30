/* =========================================================
   WordMasters Practice — app.js (Full Rewrite)
   - Hidden teacher mode toggle: press & hold logo 7 seconds
   - sessionStorage only (resets when tab closes)
   - No visible mention on site
   ========================================================= */

(function () {
  "use strict";

  const TEACHER_KEY = "wm_teacher_mode";
  const HOLD_MS = 7000;

  function isTeacherMode() {
    return sessionStorage.getItem(TEACHER_KEY) === "1";
  }

  function setTeacherMode(on) {
    sessionStorage.setItem(TEACHER_KEY, on ? "1" : "0");
    document.documentElement.classList.toggle("teacher", on);

    // OPTIONAL: If you have teacher-only elements, they can use:
    // data-teacher-only="1"
    document.querySelectorAll("[data-teacher-only='1']").forEach(el => {
      el.classList.toggle("hidden", !on);
    });
  }

  // Initialize teacher class on load
  setTeacherMode(isTeacherMode());

  // --------- 7-second press & hold on logo ----------
  const logo = document.getElementById("siteLogo");
  if (logo) {
    let holdTimer = null;
    let startedAt = 0;
    let holding = false;

    const startHold = (e) => {
      // prevent long-press menu on mobile
      if (e && typeof e.preventDefault === "function") e.preventDefault();

      if (holding) return;
      holding = true;
      startedAt = Date.now();

      holdTimer = window.setTimeout(() => {
        // toggle mode after 7 seconds
        setTeacherMode(!isTeacherMode());
        holding = false;
        holdTimer = null;
      }, HOLD_MS);
    };

    const cancelHold = () => {
      if (!holding) return;
      holding = false;
      if (holdTimer) {
        window.clearTimeout(holdTimer);
        holdTimer = null;
      }
    };

    // Mouse
    logo.addEventListener("mousedown", startHold);
    window.addEventListener("mouseup", cancelHold);
    window.addEventListener("mouseleave", cancelHold);

    // Touch
    logo.addEventListener("touchstart", startHold, { passive: false });
    window.addEventListener("touchend", cancelHold);
    window.addEventListener("touchcancel", cancelHold);

    // Block context menu (right click) on logo only
    logo.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // --------------------------------------------------
  // If you already have story/quiz logic in your old JS,
  // you can paste it BELOW this line and simply wrap
  // teacher-only explanations in elements with:
  //   data-teacher-only="1"
  // --------------------------------------------------

})();

