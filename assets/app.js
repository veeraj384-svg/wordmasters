/* =========================================================
   WordMasters Practice — Full Engine (Quiz + Story)
   - Hidden teacher mode: press & hold logo 7 seconds
   - Teacher mode reveals explanations only (no site mention)
   - Quiz pages render into #qwrap
   - Story page renders inline dropdown blanks
   ========================================================= */

(function () {
  "use strict";

  // ---------------------------
  // Hidden teacher mode
  // ---------------------------
  const TEACHER_KEY = "wm_teacher_mode";
  const HOLD_MS = 7000;

  function isTeacherMode() {
    return sessionStorage.getItem(TEACHER_KEY) === "1";
  }

  function applyTeacherMode(on) {
    sessionStorage.setItem(TEACHER_KEY, on ? "1" : "0");
    document.documentElement.classList.toggle("teacher", on);
    document.querySelectorAll("[data-teacher-only='1']").forEach(el => {
      el.classList.toggle("hidden", !on);
    });
  }

  applyTeacherMode(isTeacherMode());

  const logo = document.getElementById("siteLogo") || document.querySelector(".logo");
  if (logo) {
    let timer = null;
    let holding = false;

    const start = (e) => {
      if (e && typeof e.preventDefault === "function") e.preventDefault();
      if (holding) return;
      holding = true;

      timer = window.setTimeout(() => {
        applyTeacherMode(!isTeacherMode());
        holding = false;
        timer = null;
      }, HOLD_MS);
    };

    const cancel = () => {
      if (!holding) return;
      holding = false;
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }
    };

    logo.addEventListener("mousedown", start);
    window.addEventListener("mouseup", cancel);
    window.addEventListener("mouseleave", cancel);

    logo.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("touchend", cancel);
    window.addEventListener("touchcancel", cancel);

    logo.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // ---------------------------
  // Data (REPLACE WITH YOUR REAL SETS)
  // ---------------------------
  // Each item:
  // { prompt, choices: [..], answer, explanation }
  const WEEK1 = [
    {
      prompt: "The director gave a brief, ______ speech that avoided unnecessary details.",
      choices: ["verbose", "succinct", "erratic", "arbitrary"],
      answer: "succinct",
      explanation: "“Succinct” means brief and clearly expressed. “Verbose” is the opposite."
    },
    {
      prompt: "Despite the noise, she remained ______ and focused on her work.",
      choices: ["placid", "fickle", "boisterous", "frantic"],
      answer: "placid",
      explanation: "“Placid” means calm and peaceful; it contrasts with the noisy setting."
    },
    {
      prompt: "His apology sounded ______, as if he were only saying the words.",
      choices: ["sincere", "glib", "arduous", "solemn"],
      answer: "glib",
      explanation: "“Glib” suggests smooth but shallow speech, not genuine feeling."
    }
  ];

  const WEEK2 = [
    {
      prompt: "The scientist was ______ about the early results and refused to celebrate too soon.",
      choices: ["wary", "ecstatic", "reckless", "docile"],
      answer: "wary",
      explanation: "“Wary” means cautious or watchful—appropriate for preliminary results."
    },
    {
      prompt: "The speaker’s examples were ______; each one directly supported the main point.",
      choices: ["tangential", "pertinent", "cryptic", "obsolete"],
      answer: "pertinent",
      explanation: "“Pertinent” means relevant; “tangential” would drift away from the point."
    },
    {
      prompt: "The team’s plan was ______, leaving no room for last-minute changes.",
      choices: ["rigid", "nimble", "tentative", "haphazard"],
      answer: "rigid",
      explanation: "“Rigid” means inflexible; it matches “no room for changes.”"
    }
  ];

  function MIXED() {
    return [...WEEK1, ...WEEK2];
  }

  // Story config:
  // parts is text chunks between blanks; blanks are { choices, answer, explanation }
  const STORY = {
    title: "A Careful Report",
    parts: [
      "The research team spoke in a ",
      ", choosing words that were precise rather than dramatic. The lead analyst stayed ",
      " even when a few early graphs looked confusing. Instead of making a ",
      " claim, she waited for more data. By the end, their conclusion felt ",
      " because every example was directly connected to the central question."
    ],
    blanks: [
      {
        choices: ["boisterous", "succinct", "frantic", "obscure"],
        answer: "succinct",
        explanation: "The team spoke briefly and clearly—“succinct.”"
      },
      {
        choices: ["placid", "reckless", "tangential", "hostile"],
        answer: "placid",
        explanation: "“Placid” means calm, which fits staying steady during confusion."
      },
      {
        choices: ["arbitrary", "wary", "pertinent", "glib"],
        answer: "arbitrary",
        explanation: "An “arbitrary” claim is made without a solid reason or evidence."
      },
      {
        choices: ["pertinent", "obsolete", "nimble", "cryptic"],
        answer: "pertinent",
        explanation: "“Pertinent” means relevant; examples connected to the main question."
      }
    ]
  };

  // ---------------------------
  // Helpers
  // ---------------------------
  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of children) node.appendChild(c);
    return node;
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------------------------
  // Quiz Engine
  // ---------------------------
  function getQuizSet(page) {
    if (page === "week1") return WEEK1;
    if (page === "week2") return WEEK2;
    if (page === "mixed") return MIXED();
    return null;
  }

  function renderQuiz(page) {
    const wrap = document.getElementById("qwrap");
    const scoreEl = document.getElementById("scoreLine");
    const checkBtn = document.getElementById("checkBtn");
    const resetBtn = document.getElementById("resetBtn");
    if (!wrap || !checkBtn || !resetBtn || !scoreEl) return;

    const set = getQuizSet(page);
    if (!set) return;

    // Optional: shuffle questions for mixed only
    const questions = (page === "mixed") ? shuffle(set) : set;

    wrap.innerHTML = "";

    const selects = [];

    questions.forEach((q, idx) => {
      const qbox = el("div", { class: "q" });

      const head = el("div", { class: "qhead" }, [
        el("div", { class: "qnum", text: `Q${idx + 1}` }),
        el("div", { class: "small-note", text: "Choose one" })
      ]);

      const prompt = el("div", { class: "prompt", text: q.prompt });

      const row = el("div", { class: "row" });
      const select = el("select", { "aria-label": `Question ${idx + 1}` });

      // placeholder option
      select.appendChild(el("option", { value: "", text: "— select —" }));
      q.choices.forEach(choice => select.appendChild(el("option", { value: choice, text: choice })));

      const resultTag = el("span", { class: "small-note", text: "" });

      const explain = el("div", {
        class: "explain hidden",
        "data-teacher-only": "1"
      }, [
        el("div", { class: "label", text: "Explanation:" }),
        el("div", { text: q.explanation })
      ]);

      row.appendChild(select);
      row.appendChild(resultTag);

      qbox.appendChild(head);
      qbox.appendChild(prompt);
      qbox.appendChild(row);
      qbox.appendChild(explain);

      wrap.appendChild(qbox);
      selects.push({ select, resultTag, q, explain });
    });

    function clearMarks() {
      selects.forEach(({ select, resultTag }) => {
        select.classList.remove("is-correct", "is-wrong");
        resultTag.textContent = "";
        resultTag.className = "small-note";
      });
      scoreEl.textContent = "";
      // Apply teacher mode visibility after reset
      applyTeacherMode(isTeacherMode());
    }

    function checkAnswers() {
      let correct = 0;
      let answered = 0;

      selects.forEach(({ select, resultTag, q }) => {
        const val = select.value;
        select.classList.remove("is-correct", "is-wrong");

        if (!val) {
          resultTag.textContent = "Not answered";
          resultTag.className = "small-note";
          return;
        }

        answered++;
        if (val === q.answer) {
          correct++;
          select.classList.add("is-correct");
          resultTag.textContent = "Correct";
          resultTag.className = "correct-badge";
        } else {
          select.classList.add("is-wrong");
          resultTag.textContent = "Try again";
          resultTag.className = "wrong-badge";
        }
      });

      scoreEl.textContent = `Score: ${correct} / ${questions.length}   •   Answered: ${answered} / ${questions.length}`;
      applyTeacherMode(isTeacherMode()); // keep explanations in sync
    }

    checkBtn.addEventListener("click", checkAnswers);
    resetBtn.addEventListener("click", () => {
      // reset selects to placeholder
      selects.forEach(({ select }) => (select.value = ""));
      clearMarks();
    });

    clearMarks();
  }

  // ---------------------------
  // Story Engine
  // ---------------------------
  function renderStory() {
    const storyTitle = document.getElementById("storyTitle");
    const storyText = document.getElementById("storyText");
    const scoreEl = document.getElementById("scoreLine");
    const checkBtn = document.getElementById("checkBtn");
    const resetBtn = document.getElementById("resetBtn");
    if (!storyTitle || !storyText || !scoreEl || !checkBtn || !resetBtn) return;

    storyTitle.textContent = STORY.title;
    storyText.innerHTML = "";

    const selects = [];

    // Build text + blank selects inline
    for (let i = 0; i < STORY.blanks.length; i++) {
      storyText.appendChild(document.createTextNode(STORY.parts[i]));

      const blankWrap = el("span", { class: "blank" });
      const sel = el("select", { class: "blank-select", "aria-label": `Blank ${i + 1}` });

      sel.appendChild(el("option", { value: "", text: "—" }));
      STORY.blanks[i].choices.forEach(c => sel.appendChild(el("option", { value: c, text: c })));

      blankWrap.appendChild(sel);
      storyText.appendChild(blankWrap);

      selects.push({ sel, data: STORY.blanks[i] });
    }
    // trailing text
    storyText.appendChild(document.createTextNode(STORY.parts[STORY.parts.length - 1]));

    // Teacher-only explanation list (no answers shown unless you edit it)
    const explainBlock = el("div", { class: "explain hidden", "data-teacher-only": "1" }, [
      el("div", { class: "label", text: "Explanations:" })
    ]);

    STORY.blanks.forEach((b, idx) => {
      explainBlock.appendChild(el("div", { text: `Blank ${idx + 1}: ${b.explanation}` }));
    });

    // Insert explanations under story
    storyText.parentElement.appendChild(explainBlock);

    function clearMarks() {
      selects.forEach(({ sel }) => sel.classList.remove("is-correct", "is-wrong"));
      scoreEl.textContent = "";
      applyTeacherMode(isTeacherMode());
    }

    function checkStory() {
      let correct = 0;
      let answered = 0;

      selects.forEach(({ sel, data }) => {
        const v = sel.value;
        sel.classList.remove("is-correct", "is-wrong");

        if (!v) return;
        answered++;

        if (v === data.answer) {
          correct++;
          sel.classList.add("is-correct");
        } else {
          sel.classList.add("is-wrong");
        }
      });

      scoreEl.textContent = `Score: ${correct} / ${selects.length}   •   Answered: ${answered} / ${selects.length}`;
      applyTeacherMode(isTeacherMode());
    }

    checkBtn.addEventListener("click", checkStory);
    resetBtn.addEventListener("click", () => {
      selects.forEach(({ sel }) => (sel.value = ""));
      clearMarks();
    });

    clearMarks();
  }

  // ---------------------------
  // Boot by page
  // ---------------------------
  const page = document.body.getAttribute("data-page");
  if (page === "week1" || page === "week2" || page === "mixed") renderQuiz(page);
  if (page === "story") renderStory();

})();





