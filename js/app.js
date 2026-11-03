/* NIGHT SHIFT OS — window manager + apps. Content comes from js/data.js */
(() => {
  "use strict";
  const D = window.OS_DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem("nsos:" + k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem("nsos:" + k, v); } catch { /* storage unavailable */ } },
  };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Icons (inline SVG, stroke only) ----------
  const ICON = {
    readme: '<path d="M8 4h16l8 8v24H8z"/><path d="M24 4v8h8M13 18h14M13 23h14M13 28h9"/>',
    casefile: '<path d="M4 10h12l3 3h17v21H4z"/><circle cx="16" cy="23" r="5"/><path d="M20 27l6 6"/>',
    training: '<path d="M5 5v30h30"/><path d="M8 10c4 0 5 10 9 12s4-6 7-3 5 9 9 9"/>',
    agi: '<rect x="10" y="10" width="20" height="20"/><path d="M15 5v5M20 5v5M25 5v5M15 30v5M20 30v5M25 30v5M5 15h5M5 20h5M5 25h5M30 15h5M30 20h5M30 25h5"/><path d="M16 16h8v8h-8z"/>',
    trivia: '<circle cx="20" cy="20" r="15"/><path d="M15 15a5 5 0 1 1 7 4.5c-1.5.8-2 1.8-2 3.5M20 28v.5"/>',
    amp: '<path d="M14 30V8l18-4v22"/><circle cx="10" cy="30" r="4"/><circle cx="28" cy="26" r="4"/>',
    passport: '<rect x="8" y="4" width="24" height="32" rx="2"/><circle cx="20" cy="17" r="6"/><path d="M14 17h12M20 11c-3 3-3 9 0 12M20 11c3 3 3 9 0 12M14 29h12"/>',
    voice: '<rect x="15" y="4" width="10" height="18" rx="5"/><path d="M9 18a11 11 0 0 0 22 0M20 29v6M14 35h12"/>',
    projects: '<path d="M4 8h12l3 4h17v22H4z"/><path d="M4 16h32"/>',
    loadout: '<rect x="5" y="5" width="13" height="13"/><rect x="22" y="5" width="13" height="13"/><rect x="5" y="22" width="13" height="13"/><rect x="22" y="22" width="13" height="13"/><path d="M9 12l3-4 3 4M26 9v6M29 12h-6"/>',
    terminal: '<rect x="4" y="6" width="32" height="28"/><path d="M10 15l5 4-5 4M18 25h10"/>',
    secret: '<rect x="9" y="17" width="22" height="17"/><path d="M14 17v-5a6 6 0 0 1 12 0v5M20 23v5"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 40 40" aria-hidden="true">${ICON[k]}</svg>`;

  // ---------- Apps ----------
  const APPS = {
    readme:   { label: "README.txt",      icon: "readme",   w: 520, h: 460, render: renderReadme },
    casefile: { label: "CASE_FILE.exe",   icon: "casefile", w: 860, h: 720, color: "red", render: renderCaseFile },
    training: { label: "TRAINING_RUN.log",icon: "training", w: 720, h: 680, render: renderTraining },
    agi:      { label: "AGI_ROADMAP.md",  icon: "agi",      w: 700, h: 700, render: renderAgi },
    trivia:   { label: "TRIVIA.exe",      icon: "trivia",   w: 520, h: 480, color: "amber", render: renderTrivia },
    amp:      { label: "AMP.exe",         icon: "amp",      w: 440, h: 460, render: renderAmp },
    passport: { label: "PASSPORT",        icon: "passport", w: 720, h: 640, color: "amber", render: renderPassport },
    voice:    { label: "VOICE_LOGS",      icon: "voice",    w: 560, h: 520, color: "red", render: renderVoice },
    projects: { label: "PROJECTS/",       icon: "projects", w: 780, h: 600, color: "amber", render: renderProjects },
    loadout:  { label: "LOADOUT.inv",     icon: "loadout",  w: 600, h: 460, render: renderLoadout },
    terminal: { label: "TERMINAL",        icon: "terminal", w: 600, h: 400, render: renderTerminal },
    secret:   { label: "SECRET.txt",      icon: "secret",   w: 460, h: 380, color: "red", render: renderSecret, hidden: true },
  };

  // ---------- Boot ----------
  function boot() {
    const log = $("#boot-log"), btn = $("#boot-btn");
    let i = 0, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      log.textContent = D.boot.join("\n");
      btn.classList.remove("hidden");
      btn.focus();
    };
    const next = () => {
      if (done) return;
      if (i >= D.boot.length) return finish();
      log.textContent += (i ? "\n" : "") + D.boot[i++];
      setTimeout(next, reduceMotion ? 0 : 180 + Math.random() * 260);
    };
    next();
    const skip = (e) => {
      if (!done) { finish(); e.preventDefault(); return; }
      if (e.key === "Enter" || e.key === " ") enter();
    };
    document.addEventListener("keydown", skip);
    $("#boot").addEventListener("click", (e) => { if (e.target !== btn) finish(); });
    btn.addEventListener("click", enter);
    function enter() {
      document.removeEventListener("keydown", skip);
      $("#boot").classList.add("hidden");
      $("#desktop").classList.remove("hidden");
      $("#taskbar").classList.remove("hidden");
      openApp("readme");
    }
  }

  // ---------- Desktop ----------
  function renderIcons() {
    const icons = $("#icons");
    icons.innerHTML = "";
    for (const [id, a] of Object.entries(APPS)) {
      if (a.hidden && store.get("secret") !== "1") continue;
      icons.insertAdjacentHTML("beforeend",
        `<button class="icon ${a.color || ""}" data-app="${id}" type="button">${svg(a.icon)}<span>${esc(a.label)}</span></button>`);
    }
    icons.onclick = (e) => { const b = e.target.closest(".icon"); if (b) openApp(b.dataset.app); };

    const menu = $("#start-menu"), sb = $("#start-btn");
    menu.innerHTML = `<div class="head">${esc(D.owner.name)}<br><span class="muted" style="font-weight:400;font-size:13px">${esc(D.owner.role)}</span></div>` +
      Object.entries(APPS).filter(([, a]) => !a.hidden || store.get("secret") === "1")
        .map(([id, a]) => `<button role="menuitem" data-app="${id}" type="button">${esc(a.label)}</button>`).join("") +
      `<button role="menuitem" data-act="reboot" type="button">⏻ Reboot</button>`;
  }

  function desktop() {
    $(".wp-motto").textContent = D.owner.motto;
    renderIcons();
    const menu = $("#start-menu"), sb = $("#start-btn");
    sb.onclick = () => { const open = menu.classList.toggle("hidden") === false; sb.setAttribute("aria-expanded", open); };
    menu.onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      menu.classList.add("hidden"); sb.setAttribute("aria-expanded", "false");
      if (b.dataset.act === "reboot") location.reload(); else openApp(b.dataset.app);
    };
    document.addEventListener("click", (e) => {
      if (!menu.contains(e.target) && e.target !== sb) { menu.classList.add("hidden"); sb.setAttribute("aria-expanded", "false"); }
    });

    const clock = $("#clock");
    const tick = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
    tick(); setInterval(tick, 10000);

    const mb = $("#motion-btn");
    const setCrt = (on) => { document.body.classList.toggle("no-crt", !on); mb.textContent = "CRT: " + (on ? "ON" : "OFF"); store.set("crt", on ? "1" : "0"); };
    setCrt(store.get("crt") !== "0" && !reduceMotion);
    mb.onclick = () => setCrt(document.body.classList.contains("no-crt"));

    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && focused) closeWin(focused); });
    if (!reduceMotion) whispers();
  }

  function whispers() {
    const lines = ["did you hear that?", "seek discomfort", "it's 3 AM", "the loss is going down…", "don't look behind you", "someone opened CASE_FILE", "the ghost likes metal"];
    const w = $("#whisper");
    setInterval(() => {
      if (document.hidden || Math.random() < 0.4) return;
      w.textContent = lines[Math.floor(Math.random() * lines.length)];
      w.style.left = 20 + Math.random() * 55 + "%";
      w.style.top = 15 + Math.random() * 60 + "%";
      w.classList.add("show");
      setTimeout(() => w.classList.remove("show"), 2600);
    }, 22000);
  }

  // ---------- Window manager ----------
  const wins = new Map();
  let z = 10, focused = null, cascade = 0;

  function openApp(id) {
    const app = APPS[id]; if (!app) return;
    if (wins.has(id)) return focusWin(id);
    const el = document.createElement("section");
    el.className = "win";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", app.label);
    const vw = innerWidth, vh = innerHeight - 44;
    const w = Math.min(app.w, vw - 24), h = Math.min(app.h, vh - 24);
    const left = Math.max(12, Math.min(vw - w - 12, 220 + cascade * 30));
    const top = Math.max(12, Math.min(vh - h - 12, 20 + cascade * 26));
    cascade = (cascade + 1) % 8;
    Object.assign(el.style, { width: w + "px", height: h + "px", left: left + "px", top: top + "px" });
    el.innerHTML = `<div class="win-bar"><span class="win-title">${esc(app.label)}</span><button class="win-x" type="button" aria-label="Close ${esc(app.label)}">×</button></div><div class="win-body"></div>`;
    $("#windows").appendChild(el);
    const entry = { el, app, cleanup: [] };
    wins.set(id, entry);
    $(".win-x", el).onclick = () => closeWin(id);
    el.addEventListener("pointerdown", () => focusWin(id));
    drag(el, $(".win-bar", el));
    app.render($(".win-body", el), entry);
    focusWin(id);
  }

  function focusWin(id) {
    const w = wins.get(id); if (!w) return;
    w.el.style.zIndex = ++z;
    focused = id;
    for (const [k, v] of wins) v.el.classList.toggle("focused", k === id);
    renderTasks();
  }

  function closeWin(id) {
    const w = wins.get(id); if (!w) return;
    w.cleanup.forEach((fn) => fn());
    w.el.remove();
    wins.delete(id);
    focused = [...wins.keys()].pop() || null;
    if (focused) focusWin(focused); else renderTasks();
  }

  function renderTasks() {
    const t = $("#tasks");
    t.innerHTML = [...wins.entries()].map(([id, w]) =>
      `<button class="task ${id === focused ? "active" : ""}" data-app="${id}" type="button">${esc(w.app.label)}</button>`).join("");
    t.onclick = (e) => { const b = e.target.closest(".task"); if (b) focusWin(b.dataset.app); };
  }

  function drag(win, handle) {
    let sx, sy, ox, oy, on = false;
    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button") || innerWidth <= 720) return;
      on = true; sx = e.clientX; sy = e.clientY; ox = win.offsetLeft; oy = win.offsetTop;
      handle.setPointerCapture(e.pointerId);
    });
    handle.addEventListener("pointermove", (e) => {
      if (!on) return;
      const x = Math.max(-win.offsetWidth + 80, Math.min(innerWidth - 80, ox + e.clientX - sx));
      const y = Math.max(0, Math.min(innerHeight - 90, oy + e.clientY - sy));
      win.style.left = x + "px"; win.style.top = y + "px";
    });
    handle.addEventListener("pointerup", () => { on = false; });
  }

  // ---------- README ----------
  function renderReadme(body) {
    const o = D.owner;
    body.innerHTML = `
      <h2>whoami</h2>
      <p><b style="color:var(--amber)">${esc(o.name)}</b> — ${esc(o.role)}</p>
      <p>You've booted my machine at 3 AM. Everything about me is on this desktop — the risks I've taken, the mistakes I've reopened, the models I've trained and the music that was playing while I did it.</p>
      <p class="muted">Motto: <span style="color:var(--blood)">${esc(o.motto)}</span> · ${esc(o.location)}</p>
      <h3>Where to start</h3>
      <p>
        <button class="btn small" data-go="casefile" type="button">Investigate the case</button>
        <button class="btn small" data-go="training" type="button">Watch my training run</button>
        <button class="btn small" data-go="trivia" type="button">Beat the quiz</button>
      </p>
      <p class="muted">This whole site was built by voice with Wispr Flow — receipts in <a href="#" data-go="voice">VOICE_LOGS</a>.</p>
      <p>${o.github ? `<a href="https://github.com/${esc(o.github)}" target="_blank" rel="noopener">GitHub</a> · ` : ""}<a href="${esc(o.linkedin)}" target="_blank" rel="noopener">LinkedIn</a> · <a href="mailto:${esc(o.email)}">Email</a></p>`;
    goLinks(body);
  }
  function goLinks(body) {
    body.addEventListener("click", (e) => { const g = e.target.closest("[data-go]"); if (g) { e.preventDefault(); openApp(g.dataset.go); } });
  }

  // ---------- CASE_FILE ----------
  function renderCaseFile(body, entry) {
    const cf = D.caseFile;
    body.innerHTML = `
      <h2>${esc(cf.title)}</h2>
      <p class="muted">Leads = chances I took. Cold cases = mistakes I reopened and learned from. Click any card.</p>
      <div class="board"><svg class="strings" aria-hidden="true"></svg>
        ${cf.cards.map((c) => `<button class="card ${c.type}" data-id="${c.id}" type="button" style="left:${c.x}%;top:${c.y}%">
          <span class="ct">${esc(c.title)}</span><span class="ch">${esc(c.head)}</span><span>${esc(c.date)}</span></button>`).join("")}
      </div>
      <div class="case-detail" aria-live="polite"><span class="muted">Select a piece of evidence…</span></div>
      <div class="stamp">${esc(cf.verdict)}</div>`;
    const board = $(".board", body), lines = $("svg.strings", body), detail = $(".case-detail", body);
    const draw = () => {
      const b = board.getBoundingClientRect();
      const ctr = (id) => { const r = $(`[data-id="${id}"]`, board).getBoundingClientRect(); return [r.left - b.left + r.width / 2, r.top - b.top + 4]; };
      lines.innerHTML = cf.strings.map(([a, c]) => { const [x1, y1] = ctr(a), [x2, y2] = ctr(c); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`; }).join("");
    };
    const ro = new ResizeObserver(draw); ro.observe(board);
    entry.cleanup.push(() => ro.disconnect());
    board.addEventListener("click", (e) => {
      const card = e.target.closest(".card"); if (!card) return;
      const c = cf.cards.find((x) => x.id === card.dataset.id);
      const paras = [].concat(c.body).map((p) => `<p>${esc(p)}</p>`).join("");
      detail.innerHTML = `<h3>${esc(c.title)} — ${esc(c.head)}</h3><span class="muted">${esc(c.date)}</span>${paras}${c.lesson ? `<p class="lesson">▸ ${esc(c.lesson)}</p>` : ""}`;
      body.scrollTo({ top: detail.offsetTop - body.offsetTop - 8, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // ---------- TRAINING_RUN ----------
  function renderTraining(body) {
    const tr = D.trainingRun, ep = tr.epochs;
    const W = 600, H = 260, P = { l: 44, r: 16, t: 16, b: 34 };
    const maxL = Math.ceil(Math.max(...ep.map((e) => e.loss)));
    // one extra slot on the right for the unknown next checkpoint
    const x = (i) => P.l + (i * (W - P.l - P.r)) / ep.length;
    const y = (v) => P.t + (1 - v / maxL) * (H - P.t - P.b);
    const d = ep.map((e, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(e.loss).toFixed(1)}`).join("");
    const last = ep.length - 1, nx = x(ep.length), ny = y(ep[last].loss * 0.7);
    const grid = Array.from({ length: maxL + 1 }, (_, v) => `<line x1="${P.l}" x2="${W - P.r}" y1="${y(v)}" y2="${y(v)}"/>`).join("");
    const yl = Array.from({ length: maxL + 1 }, (_, v) => `<text x="${P.l - 8}" y="${y(v) + 4}" text-anchor="end">${v.toFixed(1)}</text>`).join("");
    const xl = ep.map((e, i) => `<text x="${x(i)}" y="${H - 10}" text-anchor="middle">${esc(e.label)}</text>`).join("") +
      `<text x="${nx}" y="${H - 10}" text-anchor="middle">????</text>`;
    body.innerHTML = `
      <h2>$ python train.py --model "${esc(tr.model)}"</h2>
      <p class="muted">Each point is a level. Lower loss = understood more. <span style="color:var(--blood)">Red spikes</span> = setbacks. After the spike, the learning rate went up, not down.</p>
      <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Life training loss curve">
        <defs><linearGradient id="lossfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#39ff88" stop-opacity=".25"/><stop offset="1" stop-color="#39ff88" stop-opacity="0"/></linearGradient></defs>
        <g class="grid">${grid}</g><g class="axis">${yl}${xl}</g>
        <path class="area" d="${d}L${x(last)},${y(0)}L${x(0)},${y(0)}Z"/>
        <path class="loss" d="${d}"/>
        <path class="next" d="M${x(last)},${y(ep[last].loss)}L${nx},${ny}"/>
        <text class="next-q" x="${nx}" y="${ny - 12}" text-anchor="middle">?</text>
        ${ep.map((e, i) => `<g class="pt ${e.spike ? "spike" : ""}" data-i="${i}" tabindex="0" role="button" aria-label="Level ${i + 1}, ${esc(e.label)}: ${esc(e.title)}"><circle cx="${x(i)}" cy="${y(e.loss)}" r="7"/></g>`).join("")}
      </svg>
      <article class="level" aria-live="polite"></article>
      <div class="level-nav"><button class="btn small" data-step="-1" type="button">◂ PREV LEVEL</button><button class="btn small" data-step="1" type="button">NEXT LEVEL ▸</button></div>`;
    const panel = $(".level", body), chart = $(".chart", body);
    const [prev, next] = body.querySelectorAll(".level-nav .btn");
    let cur = 0;
    const select = (i, scroll) => {
      cur = Math.max(0, Math.min(last, i));
      const e = ep[cur];
      chart.querySelectorAll(".pt").forEach((p) => p.classList.toggle("sel", +p.dataset.i === cur));
      panel.className = "level" + (e.spike ? " spike" : "");
      panel.innerHTML = `
        <div class="level-meta"><b>LEVEL ${String(cur + 1).padStart(2, "0")}</b> · ${esc(e.label)} · loss=${e.loss.toFixed(2)} · lr=${esc(e.lr)}${e.spike ? ' <span class="warn">⚠ LOSS SPIKE</span>' : ""}</div>
        <h3>${esc(e.title)}</h3><div class="level-sub">${esc(e.sub)}</div>
        ${[].concat(e.body).map((p) => `<p>${esc(p)}</p>`).join("")}
        ${e.lesson ? `<p class="lesson">▸ ${esc(e.lesson)}</p>` : ""}`;
      prev.disabled = cur === 0;
      next.disabled = cur === last;
      next.textContent = cur === last ? "NEXT CHECKPOINT UNKNOWN" : "NEXT LEVEL ▸";
      if (scroll) body.scrollTo({ top: panel.offsetTop - body.offsetTop - 8, behavior: reduceMotion ? "auto" : "smooth" });
    };
    chart.addEventListener("click", (e) => { const p = e.target.closest(".pt"); if (p) select(+p.dataset.i, true); });
    chart.addEventListener("keydown", (e) => { const p = e.target.closest(".pt"); if (p && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); select(+p.dataset.i, true); } });
    body.querySelector(".level-nav").addEventListener("click", (e) => { const b = e.target.closest("[data-step]"); if (b) select(cur + +b.dataset.step, true); });
    select(0);
  }

  // ---------- AGI_ROADMAP ----------
  function renderAgi(body) {
    const en = D.agiEndings, src = D.agiSource;
    body.innerHTML = `
      <h2># From LLMs → AGI → ASI</h2>
      <p class="muted">${esc(D.agiIntro)}</p>
      <h3>The gaps (and how solved I think each one is)</h3>
      ${D.agiRoadmap.map((s, i) => `<div class="stage"><div class="stage-head"><span>${String(i + 1).padStart(2, "0")} · ${esc(s.stage)}</span><span class="muted">${s.progress}%</span></div>
        <div class="bar"><i data-w="${s.progress}"></i></div><div>${esc(s.text)}</div>
        ${s.ai2027 ? `<div class="ai27"><b>AI 2027 ▸</b> ${esc(s.ai2027)}</div>` : ""}</div>`).join("")}
      <h3>Then it compounds</h3>
      <p class="muted">Once AI does AI research, the scenario's milestones arrive months apart, not decades:</p>
      <ol class="takeoff">${D.agiTakeoff.map((t) => `<li><span>${esc(t.when)}</span>${esc(t.what)}</li>`).join("")}</ol>
      <h3>Two endings, one decision</h3>
      <p>${esc(en.split)}</p>
      <div class="endings">
        <div class="ending race"><b>RACE</b><p>${esc(en.race)}</p></div>
        <div class="ending slow"><b>SLOWDOWN</b><p>${esc(en.slowdown)}</p></div>
      </div>
      <p class="lesson-line">▸ ${esc(en.lesson)}</p>
      <h3>My take</h3><div class="take">${[].concat(D.agiTake).map((p) => `<p>${esc(p)}</p>`).join("")}</div>
      <h3>What I'd want to work on</h3><div class="take">${esc(D.agiWork)}</div>
      <p class="muted" style="font-size:12px;margin-top:14px">Source: <a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.title)}</a>. Numbers and events above are the scenario's, not real-world fact.</p>`;
    requestAnimationFrame(() => setTimeout(() => body.querySelectorAll(".bar i").forEach((b) => { b.style.width = b.dataset.w + "%"; }), 60));
  }

  // ---------- TRIVIA ----------
  function renderTrivia(body) {
    const qs = D.trivia, need = Math.ceil(qs.length * 0.7);
    let i = 0, score = 0;
    const intro = () => {
      body.innerHTML = `<h2>TRIVIA.exe</h2><p>${qs.length} questions — half about me, half about AI.</p>
        <p class="muted">Score ${need}+ to unlock a hidden file.</p><button class="btn" type="button">INSERT COIN ▸</button>`;
      $("button", body).onclick = () => { i = 0; score = 0; ask(); };
    };
    const ask = () => {
      const q = qs[i];
      body.innerHTML = `<div class="hud"><span>Q ${i + 1}/${qs.length}</span><span>SCORE ${score}</span></div>
        <div class="q">${esc(q.q)}</div><div class="opts">${q.opts.map((o, k) => `<button class="opt" data-k="${k}" type="button">${"ABCD"[k]}) ${esc(o)}</button>`).join("")}</div>`;
      $(".opt", body).focus();
      $(".opts", body).onclick = (e) => {
        const b = e.target.closest(".opt"); if (!b) return;
        const k = +b.dataset.k;
        body.querySelectorAll(".opt").forEach((o) => { o.disabled = true; if (+o.dataset.k === q.a) o.classList.add("right"); });
        if (k === q.a) score++; else b.classList.add("wrong");
        setTimeout(() => { i++; i < qs.length ? ask() : end(); }, 900);
      };
    };
    const end = () => {
      const win = score >= need;
      body.innerHTML = `<h2>GAME OVER</h2><div class="big">${score}/${qs.length}</div>
        <p>${win ? "Access granted. A new file has appeared on the desktop…" : `You need ${need} to unlock the hidden file. The ghost believes in you.`}</p>
        <button class="btn" type="button">${win ? "OPEN SECRET.txt" : "RETRY"}</button>`;
      $("button", body).onclick = () => (win ? openApp("secret") : (i = 0, score = 0, ask()));
      if (win && store.get("secret") !== "1") {
        store.set("secret", "1");
        APPS.secret.hidden = false;
        renderIcons();
        const ic = $('[data-app="secret"]', $("#icons")); if (ic) ic.classList.add("new");
      }
    };
    intro();
  }

  function renderSecret(body) {
    body.innerHTML = `<h2>SECRET.txt</h2><pre style="white-space:pre-wrap;font-family:var(--font-mono)">${esc(D.secret + D.owner.name)}</pre>`;
  }

  // ---------- AMP (live-synthesised riff + 7s song previews from the iTunes Search API) ----------
  function renderAmp(body, entry) {
    const pl = D.playlist;
    body.innerHTML = `
      <div class="amp">
        <div class="amp-screen"><div class="amp-now"><span>★ NIGHT SHIFT FM ★ ${esc(pl.map((t) => `${t.artist} — ${t.title}`).join("  ·  "))}</span></div><canvas width="300" height="96"></canvas></div>
        <div class="amp-ctrls"><button class="btn small" data-a="play" type="button">▶ PLAY DROP-D RIFF</button><button class="btn small danger" data-a="stop" type="button">■ STOP</button></div>
        <p class="muted" style="margin:0 0 6px;font-size:12px">Hover a track (or tap it) for a 7-second preview.</p>
        <ol class="tracks">${pl.map((t, i) => `<li class="track" data-i="${i}" tabindex="0" role="button" aria-label="Preview ${esc(t.title)} by ${esc(t.artist)}">
          <span class="tn">${i + 1}. ${esc(t.artist)} — ${esc(t.title)}</span>
          <a href="${esc(t.link || "https://www.youtube.com/results?search_query=" + encodeURIComponent(t.artist + " " + t.title))}" target="_blank" rel="noopener">full song ▸</a>
          <span class="tp"><i></i></span></li>`).join("")}</ol>
        <p class="muted" style="margin:8px 0 0;font-size:11px">Previews courtesy of Apple Music.</p>
      </div>`;
    const cv = $("canvas", body), g = cv.getContext("2d");
    let ac = null, an = null, timer = null, raf = 0, step = 0, nextT = 0;
    const NOTE = { D: 73.42, F: 87.31, G: 98.0, Gs: 103.83, A: 110.0, C: 130.81 };
    const riff = ["D", "D", "D", "-", "D", "D", "F", "-", "D", "D", "D", "-", "Gs", "G", "F", "-"];

    const curve = (() => { const c = new Float32Array(1024); for (let i = 0; i < 1024; i++) { const x = (i / 512) - 1; c[i] = Math.tanh(x * 12); } return c; })();
    const hit = (f, t) => {
      const o1 = ac.createOscillator(), o2 = ac.createOscillator(), sh = ac.createWaveShaper(), lp = ac.createBiquadFilter(), v = ac.createGain();
      o1.type = o2.type = "sawtooth"; o1.frequency.value = f; o2.frequency.value = f * 1.5; o2.detune.value = 6;
      sh.curve = curve; lp.type = "lowpass"; lp.frequency.value = 1400;
      v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(0.5, t + 0.005); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      o1.connect(sh); o2.connect(sh); sh.connect(lp); lp.connect(v); v.connect(an);
      o1.start(t); o2.start(t); o1.stop(t + 0.15); o2.stop(t + 0.15);
    };
    const kick = (t) => {
      const o = ac.createOscillator(), v = ac.createGain();
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
      v.gain.setValueAtTime(0.9, t); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      o.connect(v); v.connect(an); o.start(t); o.stop(t + 0.2);
    };
    const sched = () => {
      const s16 = 60 / 150 / 4;
      while (nextT < ac.currentTime + 0.1) {
        const n = riff[step % riff.length];
        if (n !== "-") hit(NOTE[n], nextT);
        if (step % 4 === 0) kick(nextT);
        nextT += s16; step++;
      }
    };
    const play = () => {
      if (timer) return;
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (!an) { an = ac.createAnalyser(); an.fftSize = 128; const m = ac.createGain(); m.gain.value = 0.18; an.connect(m); m.connect(ac.destination); }
      ac.resume(); step = 0; nextT = ac.currentTime + 0.05;
      timer = setInterval(sched, 25);
    };
    const stop = () => { clearInterval(timer); timer = null; };

    // song previews
    const PREVIEW_MS = 7000, now = $(".amp-now span", body), ticker = now.textContent, tracks = $(".tracks", body);
    const audio = new Audio();
    const found = {};
    let cur = -1, startedAt = 0, endTimer = 0, hoverTimer = 0, fade = 0;
    const lookup = (t) => found[t.title] || (found[t.title] = fetch(`https://itunes.apple.com/search?media=music&entity=song&limit=15&term=${encodeURIComponent(t.artist + " " + t.title)}`)
      .then((r) => r.json())
      .then(({ results }) => {
        const a = t.artist.toLowerCase(), n = t.title.toLowerCase();
        const mine = results.filter((r) => r.previewUrl && r.artistName.toLowerCase().includes(a) && r.trackName.toLowerCase().startsWith(n));
        const best = mine.find((r) => !/live|demo|version/i.test(r.trackName)) || mine[0];
        return best ? best.previewUrl : null;
      })
      .catch(() => null));
    const fadeTo = (vol, ms, done) => {
      clearInterval(fade);
      const from = audio.volume, t0 = performance.now();
      fade = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        audio.volume = from + (vol - from) * k;
        if (k === 1) { clearInterval(fade); done && done(); }
      }, 30);
    };
    const mark = () => tracks.querySelectorAll(".track").forEach((li) => li.classList.toggle("on", +li.dataset.i === cur));
    const endPreview = () => {
      clearTimeout(endTimer);
      if (cur < 0) return;
      cur = -1; mark(); now.textContent = ticker;
      fadeTo(0, 300, () => audio.pause());
    };
    const preview = async (i) => {
      if (cur === i) return;
      stop();
      cur = i; mark();
      const t = pl[i];
      now.textContent = `Loading ${t.artist} — ${t.title}…`;
      const url = await lookup(t);
      if (cur !== i) return;
      if (!url) { now.textContent = `No preview for ${t.title}. Try "full song".`; return; }
      clearInterval(fade);
      audio.src = url; audio.volume = 0;
      try { await audio.play(); } catch { now.textContent = "Click once anywhere, then hover again."; cur = -1; mark(); return; }
      if (cur !== i) { audio.pause(); return; }
      startedAt = performance.now();
      now.textContent = `♪ NOW PLAYING ♪ ${t.artist} — ${t.title}`;
      fadeTo(0.6, 400);
      clearTimeout(endTimer);
      endTimer = setTimeout(endPreview, PREVIEW_MS);
    };
    pl.forEach(lookup); // warm the search cache so hovering starts fast
    tracks.addEventListener("pointerover", (e) => {
      const li = e.target.closest(".track");
      if (!li || e.pointerType !== "mouse" || e.target.closest("a")) return;
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => preview(+li.dataset.i), 180);
    });
    tracks.addEventListener("pointerout", (e) => {
      const li = e.target.closest(".track");
      if (!li || li.contains(e.relatedTarget)) return;
      clearTimeout(hoverTimer);
      if (+li.dataset.i === cur) endPreview();
    });
    tracks.addEventListener("click", (e) => {
      const li = e.target.closest(".track");
      if (!li || e.target.closest("a")) return;
      +li.dataset.i === cur ? endPreview() : preview(+li.dataset.i);
    });
    tracks.addEventListener("keydown", (e) => {
      const li = e.target.closest(".track");
      if (li && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); +li.dataset.i === cur ? endPreview() : preview(+li.dataset.i); }
    });
    const bins = new Uint8Array(64);
    const frame = () => {
      g.clearRect(0, 0, cv.width, cv.height);
      if (an && timer) an.getByteFrequencyData(bins); else bins.fill(0);
      const n = 24, bw = cv.width / n, t = performance.now(), live = cur >= 0 && !audio.paused;
      const bar = cur >= 0 && $(`.track[data-i="${cur}"] .tp i`, tracks);
      if (bar) bar.style.width = live ? Math.min(100, ((t - startedAt) / PREVIEW_MS) * 100) + "%" : "0";
      for (let i = 0; i < n; i++) {
        const v = timer ? bins[i + 1] / 255
          : live ? Math.min(1, (0.35 + 0.45 * Math.abs(Math.sin(t / 140 + i * 0.8)) * (1 - i / n * 0.5)) * (0.8 + Math.random() * 0.25))
          : 0.04 + 0.03 * Math.sin(t / 400 + i);
        const h = Math.max(2, v * cv.height);
        g.fillStyle = v > 0.8 ? "#ff3b3b" : v > 0.55 ? "#ffb547" : "#39ff88";
        g.fillRect(i * bw + 1, cv.height - h, bw - 3, h);
      }
      raf = requestAnimationFrame(frame);
    };
    frame();
    body.addEventListener("click", (e) => { const a = e.target.closest("[data-a]")?.dataset.a; if (a === "play") { endPreview(); play(); } if (a === "stop") { stop(); endPreview(); } });
    entry.cleanup.push(() => { stop(); cancelAnimationFrame(raf); clearTimeout(endTimer); clearInterval(fade); audio.pause(); if (ac) ac.close(); });
  }

  // ---------- PASSPORT ----------
  function renderPassport(body) {
    const total = new Set(D.trips.flatMap((t) => t.countries)).size;
    body.innerHTML = `<h2>PASSPORT</h2><p class="muted">${esc(D.passportIntro)}</p>
      <div class="hud" style="margin-bottom:12px"><span>COUNTRIES VISITED: ${total}</span><span>COMFORT ZONE: LEFT BEHIND</span></div>
      <div class="passport">${D.trips.map((t, i) => `<div class="visa${t.big ? " big" : ""}" style="--r:${[-2, 1.5, -1, 2][i % 4]}deg">
        <div class="place">${esc(t.place)}</div><div class="yr">— ${esc(t.year)} —</div>
        ${t.countries.length > 1 ? `<div class="countries">${t.countries.map((c) => `<span class="tag">${esc(c)}</span>`).join("")}</div>` : ""}
        ${[].concat(t.body).map((p) => `<p>${esc(p)}</p>`).join("")}
        ${t.notes && t.notes.length ? `<div class="notes"><b>FIELD NOTES</b><ul>${t.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></div>` : ""}</div>`).join("")}</div>`;
  }

  // ---------- VOICE_LOGS ----------
  function renderVoice(body) {
    const wave = (s) => { let h = 7; return Array.from({ length: 48 }, (_, i) => { h = (h * 31 + s.charCodeAt(i % s.length)) % 97; return `<i style="height:${20 + (h % 80)}%"></i>`; }).join(""); };
    body.innerHTML = `<h2>VOICE_LOGS</h2><p class="muted">This site was spoken into existence with Wispr Flow. These are the raw dictations.</p>
      ${D.voiceLogs.map((v) => `<div class="vlog"><div class="t">● REC ${esc(v.time)}</div><div class="wave" aria-hidden="true">${wave(v.text)}</div><div>“${esc(v.text)}”</div></div>`).join("")}
      <h3>What voice changed</h3><div class="take">${esc(D.voiceTake)}</div>`;
  }

  // ---------- PROJECTS ----------
  function renderProjects(body) {
    const folder = (p, rank) => `<article class="folder${rank ? " featured" : ""}">${rank ? `<span class="conf">CASE #${rank}</span>` : ""}
      <h3>${esc(p.name)}</h3>${p.tag ? `<div class="ftag">${esc(p.tag)}</div>` : ""}<div>${esc(p.summary)}</div>
      ${p.points ? `<ul>${p.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      <div style="margin-top:6px">${(p.stack || []).map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
      ${p.outcome ? `<div style="margin-top:6px"><b>Outcome:</b> ${esc(p.outcome)}</div>` : ""}
      ${p.stats ? `<div class="stats">${p.stats}</div>` : ""}
      ${p.url ? `<div style="margin-top:8px"><a href="${esc(p.url)}" target="_blank" rel="noopener">Open case file ▸</a></div>` : ""}</article>`;
    const u = D.owner.github;
    body.innerHTML = `<h2>PROJECTS/</h2><p class="muted">Evidence of work, not credentials.</p>
      <h3>Top 3 cases</h3><div class="folders top">${D.projects.map((p, i) => folder(p, i + 1)).join("")}</div>
      ${D.certs ? `<p class="muted" style="margin-top:14px">Certifications: ${D.certs.map(esc).join(" · ")}</p>` : ""}
      <h3 style="margin-top:20px">Other files ${u ? `· github.com/${esc(u)}` : ""}</h3><div class="gh">${u ? '<p class="muted">Pulling records from GitHub…</p>' : '<p class="muted">Set <code>owner.github</code> in js/data.js to list repos live.</p>'}</div>`;
    if (!u) return;
    const gh = $(".gh", body);
    fetch(`https://api.github.com/users/${encodeURIComponent(u)}/repos?sort=pushed&per_page=100`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((repos) => {
        const featured = new Set(D.projects.map((p) => p.url));
        const list = repos.filter((r) => !r.fork && !featured.has(r.html_url)).sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.pushed_at) - new Date(a.pushed_at)).slice(0, 12);
        gh.innerHTML = list.length ? `<div class="folders">${list.map((r) => folder({
          name: r.name, summary: r.description || "No description filed.", stack: [r.language].filter(Boolean),
          stats: `★ ${r.stargazers_count} · updated ${new Date(r.pushed_at).toLocaleDateString()}`, url: r.html_url,
        })).join("")}</div>` : '<p class="muted">No public repos found.</p>';
      })
      .catch(() => { gh.innerHTML = `<p class="muted">GitHub didn't answer. <a href="https://github.com/${esc(u)}" target="_blank" rel="noopener">Open the profile ▸</a></p>`; });
  }

  // ---------- LOADOUT ----------
  function renderLoadout(body) {
    const order = { legendary: 0, rare: 1, common: 2 };
    const items = [...D.loadout].sort((a, b) => order[a.tier] - order[b.tier]);
    body.innerHTML = `<h2>LOADOUT.inv</h2>
      <div class="legend-row"><span class="l">Legendary · daily driver</span><span class="r">Rare · comfortable</span><span class="c">Common · still grinding</span></div>
      <div class="inv">${items.map((it) => `<div class="item ${it.tier}"><span class="s">${esc(it.slot)}</span><span class="n">${esc(it.name)}</span></div>`).join("")}</div>`;
  }

  // ---------- TERMINAL ----------
  function renderTerminal(body) {
    body.innerHTML = `<div class="term"><pre></pre><form><span>${esc(D.owner.handle)}@nightshift:~$</span><input aria-label="Terminal command" autocomplete="off" spellcheck="false"></form></div>`;
    const out = $("pre", body), inp = $("input", body);
    const say = (s) => { out.textContent += s + "\n"; body.scrollTop = body.scrollHeight; };
    say('Night Shift OS terminal. Type "help".');
    const cmds = {
      help: () => say("help · whoami · ls · open <app> · motto · date · clear · sudo hire " + D.owner.handle),
      whoami: () => say(`${D.owner.name} — ${D.owner.role}`),
      ls: () => say(Object.entries(APPS).filter(([, a]) => !a.hidden).map(([id, a]) => `${a.label.padEnd(18)} (open ${id})`).join("\n")),
      open: (a) => (APPS[a] && !APPS[a].hidden ? (say("opening " + a + "…"), openApp(a)) : say("no such app: " + (a || "?"))),
      motto: () => say(D.owner.motto),
      date: () => say(new Date().toString()),
      clear: () => { out.textContent = ""; },
      sudo: (...r) => say(r.join(" ").startsWith("hire") ? `[sudo] permission granted.\nDeploying ${D.owner.name} to Wispr Flow… ██████████ 100%\nSee you in Bangalore.` : "sudo: nice try."),
    };
    $("form", body).onsubmit = (e) => {
      e.preventDefault();
      const [c, ...args] = inp.value.trim().split(/\s+/);
      say(`${D.owner.handle}@nightshift:~$ ${inp.value}`);
      inp.value = "";
      if (c) (cmds[c.toLowerCase()] || (() => say(`command not found: ${c}`)))(...args);
    };
    setTimeout(() => inp.focus(), 50);
    body.addEventListener("click", () => inp.focus());
  }

  if (store.get("secret") === "1") APPS.secret.hidden = false;
  desktop();
  boot();
})();
