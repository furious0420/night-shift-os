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
    projects: '<path d="M4 8h12l3 4h17v22H4z"/><path d="M4 16h32"/>',
    loadout: '<rect x="5" y="5" width="13" height="13"/><rect x="22" y="5" width="13" height="13"/><rect x="5" y="22" width="13" height="13"/><rect x="22" y="22" width="13" height="13"/><path d="M9 12l3-4 3 4M26 9v6M29 12h-6"/>',
    terminal: '<rect x="4" y="6" width="32" height="28"/><path d="M10 15l5 4-5 4M18 25h10"/>',
    secret: '<rect x="9" y="17" width="22" height="17"/><path d="M14 17v-5a6 6 0 0 1 12 0v5M20 23v5"/>',
    trophy: '<path d="M12 6h16v8a8 8 0 0 1-16 0zM12 9H6v2a6 6 0 0 0 6 6M28 9h6v2a6 6 0 0 1-6 6M20 22v6M15 28h10v6H15z"/>',
    guestbook: '<path d="M8 5h22a2 2 0 0 1 2 2v28H10a2 2 0 0 1-2-2z"/><path d="M8 31a2 2 0 0 1 2-2h22M14 12h12M14 17h8"/><path d="M27 20l-6 6-1 3 3-1 6-6z"/>',
    printer: '<path d="M12 16V5h16v11"/><rect x="5" y="16" width="30" height="13" rx="2"/><path d="M12 25h16v11H12zM16 29h8M16 32h6"/><circle cx="30" cy="21" r="1"/>',
    bug: '<ellipse cx="20" cy="23" rx="8" ry="10"/><path d="M14 13a6 6 0 0 1 12 0M20 13v20M12 19H5M12 26H5M28 19h7M28 26h7M13 31l-5 4M27 31l5 4M15 9l-3-4M25 9l3-4"/>',
    coin: '<circle cx="20" cy="20" r="14"/><circle cx="20" cy="20" r="10"/><path d="M23 15h-4.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H17M20 12v3M20 25v3"/>',
    laptop: '<rect x="8" y="8" width="24" height="17" rx="1"/><path d="M4 30h32l-2 3H6z"/>',
    tower: '<rect x="11" y="4" width="18" height="32" rx="1"/><circle cx="20" cy="24" r="5"/><path d="M15 10h10M15 14h10"/>',
    plane: '<path d="M4 22l32-12-10 24-6-9z"/><path d="M20 25l16-15"/>',
    ticket: '<path d="M5 12h30v5a3 3 0 0 0 0 6v5H5v-5a3 3 0 0 0 0-6z"/><path d="M24 12v16" stroke-dasharray="2 2"/><path d="M11 19l3 2-1 4 3-2 3 2-1-4 3-2h-4l-1-3-1 3z"/>',
    mic: '<rect x="15" y="4" width="10" height="18" rx="5"/><path d="M10 19a10 10 0 0 0 20 0M20 29v6M14 35h12"/>',
    eye: '<path d="M3 20c5-8 11-12 17-12s12 4 17 12c-5 8-11 12-17 12S8 28 3 20z"/><circle cx="20" cy="20" r="6"/><circle cx="20" cy="20" r="2"/>',
  };
  const svg = (k) => `<svg viewBox="0 0 40 40" aria-hidden="true">${ICON[k]}</svg>`;

  // ---------- Apps ----------
  const APPS = {
    readme:   { label: "README.txt",      icon: "readme",   w: 520, h: 460, render: renderReadme },
    hire:     { label: "WHY_HIRE_ME.exe", icon: "bug",      w: 720, h: 680, color: "red", render: renderHire },
    shop:     { label: "UPGRADE_SHOP.exe",icon: "coin",     w: 760, h: 700, color: "amber", render: renderShop },
    casefile: { label: "CASE_FILE.exe",   icon: "casefile", w: 860, h: 720, color: "red", render: renderCaseFile },
    training: { label: "TRAINING_RUN.log",icon: "training", w: 720, h: 680, render: renderTraining },
    agi:      { label: "AGI_ROADMAP.md",  icon: "agi",      w: 700, h: 700, render: renderAgi },
    trivia:   { label: "TRIVIA.exe",      icon: "trivia",   w: 520, h: 480, color: "amber", render: renderTrivia },
    amp:      { label: "AMP.exe",         icon: "amp",      w: 440, h: 460, render: renderAmp },
    passport: { label: "PASSPORT",        icon: "passport", w: 720, h: 640, color: "amber", render: renderPassport },
    projects: { label: "PROJECTS/",       icon: "projects", w: 780, h: 600, color: "amber", render: renderProjects },
    loadout:  { label: "LOADOUT.inv",     icon: "loadout",  w: 600, h: 460, render: renderLoadout },
    guestbook:{ label: "GUESTBOOK.log",   icon: "guestbook",w: 560, h: 520, render: renderGuestbook },
    printer:  { label: "PRINT_RESUME.exe",icon: "printer",  w: 520, h: 560, color: "amber", render: renderPrinter, hidden: true },
    trophies: { label: "TROPHIES.exe",    icon: "trophy",   w: 520, h: 520, color: "amber", render: renderTrophies },
    terminal: { label: "TERMINAL",        icon: "terminal", w: 600, h: 400, render: renderTerminal },
    secret:   { label: "SECRET.txt",      icon: "secret",   w: 460, h: 380, color: "red", render: renderSecret, hidden: true },
    dontopen: { label: "DONT_OPEN.exe",   icon: "eye",      color: "red", render: haunt, hidden: true, overlay: true },
  };
  // hidden apps appear once unlocked (store key = app id)
  const shown = (id, a) => !a.hidden || store.get(id) === "1";
  const unlock = (id) => {
    if (store.get(id) === "1") return;
    store.set(id, "1");
    renderIcons();
    const ic = $(`[data-app="${id}"]`, $("#icons")); if (ic) ic.classList.add("new");
  };

  // ---------- Boot ----------
  let mode = "normal", visitor = store.get("name") || "visitor";

  function boot() {
    $("#boot").classList.remove("hidden");
    const log = $("#boot-log"), ui = $("#boot-ui");
    let i = 0, done = false;
    const finish = () => {
      if (done) return;
      done = true;
      log.textContent = D.boot.join("\n");
      document.removeEventListener("keydown", skip);
      $(".boot-hint").remove();
      login();
    };
    const next = () => {
      if (done) return;
      if (i >= D.boot.length) return finish();
      log.textContent += (i ? "\n" : "") + D.boot[i++];
      setTimeout(next, reduceMotion ? 0 : 180 + Math.random() * 260);
    };
    const skip = (e) => { e.preventDefault(); finish(); };
    next();
    document.addEventListener("keydown", skip);
    $("#boot").addEventListener("click", finish);

    function login() {
      ui.innerHTML = `<form class="login"><label for="who">login as:</label><input id="who" maxlength="24" autocomplete="off" spellcheck="false" placeholder="visitor" value="${esc(store.get("name") || "")}"><button class="btn small" type="submit">↵</button></form>`;
      const inp = $("#who", ui);
      inp.focus();
      $("form", ui).onsubmit = (e) => {
        e.preventDefault();
        visitor = inp.value.trim().slice(0, 24) || "visitor";
        store.set("name", visitor);
        ui.innerHTML = `<p class="granted">ACCESS GRANTED. Welcome, ${esc(visitor)}.</p>`;
        setTimeout(menu, reduceMotion ? 0 : 600);
      };
    }

    function menu() {
      const modes = [["normal", "NORMAL", "the full night shift"], ["safe", "SAFE MODE", "no scares, no glitches"], ["haunted", "HAUNTED", "you were warned"]];
      let sel = 0, gone = false;
      ui.insertAdjacentHTML("beforeend", `<div class="boot-menu" role="listbox" aria-label="Select boot mode"><p class="muted">SELECT BOOT MODE · ↑ ↓ or 1–3, then Enter</p>${modes.map(([, n, d], k) =>
        `<button type="button" role="option" class="bm${k === 2 ? " red" : ""}" data-k="${k}"><span class="sel">▸</span> ${k + 1}. ${esc(n)} <span class="muted">— ${esc(d)}</span></button>`).join("")}</div>`);
      const items = ui.querySelectorAll(".bm");
      const paint = () => items.forEach((b, k) => { b.classList.toggle("on", k === sel); b.setAttribute("aria-selected", k === sel); });
      paint(); items[0].focus();
      $("#boot").scrollTop = $("#boot").scrollHeight;
      const go = () => { if (gone) return; gone = true; document.removeEventListener("keydown", key); enter(modes[sel][0]); };
      const key = (e) => {
        if (e.key === "ArrowDown") sel = (sel + 1) % 3;
        else if (e.key === "ArrowUp") sel = (sel + 2) % 3;
        else if (["1", "2", "3"].includes(e.key)) sel = +e.key - 1;
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); return go(); }
        else return;
        e.preventDefault(); paint(); items[sel].focus();
      };
      document.addEventListener("keydown", key);
      $(".boot-menu", ui).onclick = (e) => { const b = e.target.closest(".bm"); if (b) { sel = +b.dataset.k; paint(); go(); } };
    }

    function enter(m) {
      mode = m;
      document.body.classList.toggle("haunted", m === "haunted");
      $("#boot").classList.add("hidden");
      $("#desktop").classList.remove("hidden");
      $("#taskbar").classList.remove("hidden");
      widgets();
      soundButton();
      voice();
      startEffects();
      award("clocked");
      if (m === "haunted") award("haunted");
      openApp("readme");
      if (store.get("seenHire") !== "1") { store.set("seenHire", "1"); setTimeout(() => openApp("hire"), reduceMotion ? 0 : 900); }
    }
  }

  function startEffects() {
    if (mode === "safe") return;
    const fast = mode === "haunted";
    if (!reduceMotion) { whispers(fast); glitches(fast); lurker(fast); }
    if (fast) unlock("dontopen"); else setTimeout(() => unlock("dontopen"), 60000);
  }

  // ---------- Desktop ----------
  function renderIcons() {
    const icons = $("#icons");
    icons.innerHTML = "";
    for (const [id, a] of Object.entries(APPS)) {
      if (!shown(id, a)) continue;
      icons.insertAdjacentHTML("beforeend",
        `<button class="icon ${a.color || ""}" data-app="${id}" type="button">${svg(a.icon)}<span>${esc(a.label)}</span></button>`);
    }
    icons.onclick = (e) => { const b = e.target.closest(".icon"); if (b) openApp(b.dataset.app); };

    const menu = $("#start-menu"), sb = $("#start-btn");
    menu.innerHTML = `<div class="head">${esc(D.owner.name)}<br><span class="muted" style="font-weight:400;font-size:13px">${esc(D.owner.role)}</span></div>` +
      Object.entries(APPS).filter(([id, a]) => shown(id, a))
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
    wallpaper();
  }

  // ---------- Horror layer ----------
  function glitches(fast) {
    const hit = () => {
      if (!document.hidden && !$("#haunt")) {
        document.body.classList.add("glitch");
        setTimeout(() => document.body.classList.remove("glitch"), 420);
      }
      setTimeout(hit, fast ? 9000 + Math.random() * 14000 : 35000 + Math.random() * 50000);
    };
    setTimeout(hit, fast ? 6000 : 20000);
  }

  function haunt() {
    if ($("#haunt")) return;
    const el = document.createElement("div");
    el.id = "haunt";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", "DONT_OPEN.exe");
    el.innerHTML = `<svg class="eye" viewBox="-60 -34 120 68" aria-hidden="true">
        <path class="lid" d="M-56 0C-36-30 36-30 56 0C36 30-36 30-56 0Z"/>
        <circle class="iris" r="17"/><circle class="pupil" r="7"/></svg>
      <pre class="haunt-text" aria-live="polite"></pre><p class="haunt-hint">click or press Esc to look away</p>`;
    document.body.appendChild(el);
    const iris = $(".iris", el), pupil = $(".pupil", el), eye = $(".eye", el), out = $(".haunt-text", el);
    const look = (e) => {
      const r = eye.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const a = Math.atan2(dy, dx), d = Math.min(1, Math.hypot(dx, dy) / 300);
      const x = Math.cos(a) * 22 * d, y = Math.sin(a) * 9 * d;
      iris.setAttribute("cx", x); iris.setAttribute("cy", y);
      pupil.setAttribute("cx", x); pupil.setAttribute("cy", y);
    };
    award("brave");
    const lines = [`I told you not to open it, ${visitor}.`, "", "I've been on this machine since 3:00 AM.", "I watched you read the case file.", "I watched you take the quiz.", "", "Don't worry. I only haunt people who stay curious."];
    let i = 0, timer = 0, ready = false;
    const type = () => {
      if (i >= lines.length) { ready = true; return; }
      out.textContent += (i ? "\n" : "") + lines[i++];
      timer = setTimeout(type, reduceMotion ? 0 : 900);
    };
    timer = setTimeout(type, 600);
    const close = (e) => {
      if (e.type === "keydown" && e.key !== "Escape") return;
      if (!ready && e.type === "click") { clearTimeout(timer); out.textContent = lines.join("\n"); ready = true; return; }
      clearTimeout(timer);
      removeEventListener("pointermove", look);
      removeEventListener("keydown", close, true);
      el.remove();
    };
    addEventListener("pointermove", look);
    addEventListener("keydown", close, true);
    el.addEventListener("click", close);
  }

  function whispers(fast) {
    const lines = [`${visitor}, did you hear that?`, "seek discomfort", "it's 3 AM", "the loss is going down…", `don't look behind you, ${visitor}`, "someone opened CASE_FILE", "the ghost likes metal", `${visitor}… you should be asleep`];
    const w = $("#whisper");
    setInterval(() => {
      if (document.hidden || Math.random() < 0.4) return;
      w.textContent = lines[Math.floor(Math.random() * lines.length)];
      w.style.left = 20 + Math.random() * 55 + "%";
      w.style.top = 15 + Math.random() * 60 + "%";
      w.classList.add("show");
      setTimeout(() => w.classList.remove("show"), 2600);
    }, fast ? 9000 : 22000);
  }

  // a pair of eyes that shows up in the dark and vanishes if you get close
  function lurker(fast) {
    const el = $("#lurker"), host = $("#desktop");
    let hideT = 0;
    const hide = () => { el.classList.remove("show"); clearTimeout(hideT); };
    host.addEventListener("pointermove", (e) => {
      if (!el.classList.contains("show")) return;
      const r = el.getBoundingClientRect();
      if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < 150) hide();
    });
    const appear = () => {
      if (!document.hidden && !$("#haunt")) {
        el.style.left = 35 + Math.random() * 55 + "%";
        el.style.top = 10 + Math.random() * 70 + "%";
        el.classList.add("show");
        hideT = setTimeout(hide, 4500);
      }
      setTimeout(appear, fast ? 12000 + Math.random() * 10000 : 40000 + Math.random() * 30000);
    };
    setTimeout(appear, fast ? 5000 : 25000);
  }

  // ---------- Wallpaper: a live neural network ----------
  let pulsesFired = 0;
  function wallpaper() {
    const cv = $("#wp-canvas"), g = cv.getContext("2d"), host = $("#desktop");
    const LINK = 130;
    let W = 0, H = 0, nodes = [], pulses = [], rings = [];
    const mouse = { x: -999, y: -999 };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      W = host.clientWidth; H = host.clientHeight;
      if (!W) return;
      cv.width = W * dpr; cv.height = H * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(24, Math.min(90, Math.round((W * H) / 16000)));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25, r: 1 + Math.random() * 1.8 }));
    };
    const near = (i) => nodes.map((n, j) => j).filter((j) => j !== i && Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < LINK);
    const fire = (i, red) => { const nb = near(i); if (nb.length) pulses.push({ a: i, b: nb[Math.floor(Math.random() * nb.length)], t: 0, sp: 0.012 + Math.random() * 0.02, red, hops: 3 }); };
    addEventListener("resize", resize);
    host.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    host.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
    host.addEventListener("click", (e) => {
      if (e.target.closest(".icon, .win, .widget, #lurker") || !nodes.length) return;
      rings.push({ x: e.clientX, y: e.clientY, t: 0 });
      let best = 0, bd = Infinity;
      nodes.forEach((n, i) => { const d = Math.hypot(n.x - e.clientX, n.y - e.clientY); if (d < bd) { bd = d; best = i; } });
      for (let k = 0; k < 5; k++) fire(best, mode === "haunted");
      if (++pulsesFired >= 10) award("sniper");
    });

    const step = (move) => {
      g.clearRect(0, 0, W, H);
      for (const n of nodes) {
        if (!move) continue;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.hypot(dx, dy);
        if (d < 170 && d > 1) { n.x += (dx / d) * 0.35; n.y += (dy / d) * 0.35; }
      }
      g.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) { g.strokeStyle = `rgba(57,255,136,${(1 - d / LINK) * 0.22})`; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
        }
        const n = nodes[i], md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (md < 170) { g.strokeStyle = `rgba(255,181,71,${(1 - md / 170) * 0.5})`; g.beginPath(); g.moveTo(n.x, n.y); g.lineTo(mouse.x, mouse.y); g.stroke(); }
        g.fillStyle = md < 170 ? "rgba(255,181,71,.9)" : "rgba(57,255,136,.55)";
        g.beginPath(); g.arc(n.x, n.y, n.r, 0, Math.PI * 2); g.fill();
      }
      if (!move) return;
      if (Math.random() < 0.04) fire(Math.floor(Math.random() * nodes.length), mode === "haunted" ? Math.random() < 0.6 : Math.random() < 0.08);
      const born = [];
      pulses = pulses.filter((p) => {
        p.t += p.sp;
        const a = nodes[p.a], b = nodes[p.b];
        if (!a || !b) return false;
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        g.fillStyle = p.red ? "#ff3b3b" : "#39ff88";
        g.shadowColor = g.fillStyle; g.shadowBlur = 10;
        g.beginPath(); g.arc(x, y, 2.2, 0, Math.PI * 2); g.fill();
        g.shadowBlur = 0;
        if (p.t < 1) return true;
        if (p.hops > 0) { const nb = near(p.b); if (nb.length) born.push({ a: p.b, b: nb[Math.floor(Math.random() * nb.length)], t: 0, sp: p.sp, red: p.red, hops: p.hops - 1 }); }
        return false;
      }).concat(born).slice(-120);
      rings = rings.filter((r) => {
        r.t += 0.02;
        g.strokeStyle = `rgba(57,255,136,${1 - r.t})`; g.lineWidth = 1.5;
        g.beginPath(); g.arc(r.x, r.y, r.t * 220, 0, Math.PI * 2); g.stroke();
        return r.t < 1;
      });
    };
    if (reduceMotion) { new ResizeObserver(() => { resize(); step(false); }).observe(host); return; }
    const loop = () => {
      if (!document.hidden && !host.classList.contains("hidden")) {
        if (!W) resize();
        if (W) step(true);
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  // ---------- Desktop widgets ----------
  function widgets() {
    const host = $("#widgets");
    host.innerHTML = `
      <aside class="widget note" aria-label="Sticky note"><b>TODO</b><ol>${D.todo.map((t) => `<li>${t.done ? `<s>${esc(t.text)}</s>` : esc(t.text)}</li>`).join("")}</ol></aside>
      <aside class="widget sysmon" aria-label="System monitor"><b>SYSMON</b><div class="rows"></div><div class="who">user: ${esc(visitor)} · mode: ${esc(mode)}</div></aside>`;
    const rows = $(".rows", host);
    const fear = { safe: [0, 5], normal: [25, 60], haunted: [85, 99] }[mode];
    const stats = () => [
      ["GPU TEMP", 62 + Math.random() * 16, "°C"],
      ["CURIOSITY", 100, "%"],
      ["SLEEP", 2 + Math.random() * 3, "%"],
      ["FEAR", fear[0] + Math.random() * (fear[1] - fear[0]), "%"],
    ];
    const paint = () => {
      rows.innerHTML = stats().map(([k, v, u]) => `<div class="row"><span>${k}</span><i><em style="width:${Math.min(100, v)}%"${k === "FEAR" && v > 70 ? ' class="hot"' : ""}></em></i><span>${Math.round(v)}${u}</span></div>`).join("");
    };
    paint();
    if (!reduceMotion) setInterval(paint, 1600);
  }

  // ---------- Ambient: CRT hum + low drone (all synthesised, nothing downloaded) ----------
  const ambient = (() => {
    let ac = null, master = null, built = false, on = false;
    const build = () => {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      const osc = (type, f, gain, dest, detune = 0) => {
        const o = ac.createOscillator(), v = ac.createGain();
        o.type = type; o.frequency.value = f; o.detune.value = detune; v.gain.value = gain;
        o.connect(v); v.connect(dest); o.start();
        return { o, v };
      };
      // mains hum from the CRT: 50 Hz and its harmonics
      const hum = ac.createGain(); hum.gain.value = 0.5; hum.connect(master);
      osc("sine", 50, 0.10, hum); osc("sine", 100, 0.06, hum); osc("triangle", 150, 0.015, hum);
      // faint static hiss
      const n = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = n.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const hiss = ac.createBufferSource(), bp = ac.createBiquadFilter(), hv = ac.createGain();
      hiss.buffer = n; hiss.loop = true; bp.type = "bandpass"; bp.frequency.value = 5200; bp.Q.value = 0.7; hv.gain.value = 0.012;
      hiss.connect(bp); bp.connect(hv); hv.connect(master); hiss.start();
      // the drone: detuned low saws through a slowly breathing low-pass
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 160; lp.Q.value = 6; lp.connect(master);
      osc("sawtooth", 36.71, 0.16, lp, -7); osc("sawtooth", 36.71, 0.16, lp, 7); osc("sawtooth", 55, 0.08, lp);
      const tri = osc("sawtooth", 51.91, 0, lp, 4); // tritone, only when haunted
      const lfo = ac.createOscillator(), depth = ac.createGain();
      lfo.frequency.value = 0.07; depth.gain.value = 90; lfo.connect(depth); depth.connect(lp.frequency); lfo.start();
      ambient.haunt = (h) => { tri.v.gain.setTargetAtTime(h ? 0.09 : 0, ac.currentTime, 1.5); lfo.frequency.setTargetAtTime(h ? 0.18 : 0.07, ac.currentTime, 1); };
      built = true;
    };
    return {
      haunt() {},
      get on() { return on; },
      set(v) {
        on = v;
        if (v && !built) { try { build(); } catch { on = false; return; } }
        if (!built) return;
        ac.resume();
        master.gain.setTargetAtTime(v ? 0.35 : 0, ac.currentTime, v ? 1.2 : 0.25);
        if (v) ambient.haunt(mode === "haunted");
      },
    };
  })();

  function soundButton() {
    const b = $("#sound-btn");
    const paint = () => { b.textContent = "SND: " + (ambient.on ? "ON" : "OFF"); b.setAttribute("aria-pressed", ambient.on); };
    b.onclick = () => { ambient.set(!ambient.on); store.set("sound", ambient.on ? "1" : "0"); paint(); };
    // called right after the boot-mode pick, which counts as the user gesture browsers need for audio
    const pref = store.get("sound");
    ambient.set(pref ? pref === "1" : mode !== "safe");
    paint();
  }

  // ---------- Guestbook ----------
  // Shared via Supabase when D.guestbook.url/key are set; otherwise lines are kept in this browser only.
  function renderGuestbook(body) {
    const cfg = D.guestbook || {}, live = !!(cfg.url && cfg.key);
    const api = live && `${cfg.url.replace(/\/$/, "")}/rest/v1/guestbook`;
    const H = live && { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" };
    const local = () => { try { return JSON.parse(store.get("guestbook") || "[]"); } catch { return []; } };
    body.innerHTML = `<h2>GUESTBOOK.log</h2>
      <p class="muted">${esc(cfg.intro || "")}${live ? "" : " (Offline copy: your line stays in this browser.)"}</p>
      <form class="gb-form">
        <input name="name" maxlength="24" autocomplete="off" aria-label="Your name" value="${esc(visitor === "visitor" ? "" : visitor)}" placeholder="name">
        <input name="msg" maxlength="140" autocomplete="off" aria-label="Your message" placeholder="leave a line…" required>
        <button class="btn small" type="submit">SIGN</button>
      </form>
      <p class="gb-status muted" role="status"></p>
      <ol class="gb-list"><li class="muted">loading…</li></ol>`;
    const list = $(".gb-list", body), status = $(".gb-status", body), form = $(".gb-form", body);
    const when = (t) => { const d = new Date(t); return isNaN(d) ? "" : d.toLocaleDateString([], { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); };
    const paint = (rows) => {
      list.innerHTML = rows.length ? rows.map((r) => `<li><span class="gb-t">${esc(when(r.created_at))}</span> <b>${esc(r.name || "anon")}</b>: ${esc(r.msg)}</li>`).join("")
        : `<li class="muted">No one's signed yet. Be the first.</li>`;
    };
    const load = () => {
      const seed = cfg.seed || [];
      if (!live) return paint([...local(), ...seed]);
      fetch(`${api}?select=name,msg,created_at&order=created_at.desc&limit=60`, { headers: H })
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((rows) => paint([...rows, ...seed]))
        .catch(() => { status.textContent = "Couldn't reach the guestbook server. Showing what's cached here."; paint([...local(), ...seed]); });
    };
    form.onsubmit = (e) => {
      e.preventDefault();
      const name = form.name.value.trim().slice(0, 24) || "anon", msg = form.msg.value.trim().slice(0, 140);
      if (!msg) return;
      const last = +store.get("gb-last") || 0;
      if (Date.now() - last < 60000) { status.textContent = "Easy. One line a minute."; return; }
      const row = { name, msg, created_at: new Date().toISOString() };
      const done = () => {
        store.set("gb-last", String(Date.now()));
        store.set("guestbook", JSON.stringify([row, ...local()].slice(0, 30)));
        form.msg.value = ""; status.textContent = "Signed. The ghost read it too.";
        award("signed"); load();
      };
      if (!live) return done();
      status.textContent = "writing…";
      fetch(api, { method: "POST", headers: { ...H, Prefer: "return=minimal" }, body: JSON.stringify({ name, msg }) })
        .then((r) => (r.ok ? done() : Promise.reject(r.status)))
        .catch(() => { status.textContent = "Couldn't sign right now. Try again in a bit."; });
    };
    load();
  }

  // ---------- PRINT_RESUME.exe: a dot-matrix printer that hands over the PDF ----------
  let printNext = -1; // set by voice commands before opening the app
  function renderPrinter(body, entry) {
    const R = D.resumes;
    body.innerHTML = `<h2>PRINT_RESUME.exe</h2><p class="muted">Two flavours. The printer is older than me, give it a second.</p>
      <div class="pr-pick">${R.map((r, i) => `<button class="btn" type="button" data-i="${i}"><b>${esc(r.label)}</b><small>${esc(r.blurb)}</small></button>`).join("")}</div>
      <div class="printer" aria-hidden="true"><div class="pr-head"><i></i><span>NS-24 DOT MATRIX</span></div><div class="pr-paper"><pre></pre></div></div>
      <p class="pr-status muted" role="status"></p>`;
    const paper = $(".pr-paper", body), pre = $("pre", body), status = $(".pr-status", body), led = $(".pr-head i", body);
    let busy = false, ac = null;
    const buzz = () => {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        const o = ac.createOscillator(), v = ac.createGain(), t = ac.currentTime;
        o.type = "square"; o.frequency.value = 180 + Math.random() * 90;
        v.gain.setValueAtTime(0.03, t); v.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
        o.connect(v); v.connect(ac.destination); o.start(t); o.stop(t + 0.13);
      } catch { /* no audio */ }
    };
    const print = (i) => {
      const r = R[i]; if (!r || busy) return;
      busy = true; led.classList.add("on");
      pre.textContent = ""; paper.classList.remove("done"); paper.style.height = "0px";
      status.textContent = `Printing ${r.label.toLowerCase()} résumé…`;
      const lines = r.lines.concat(["", "-- end of page --"]);
      let k = 0;
      const t = setInterval(() => {
        pre.textContent += (k ? "\n" : "") + lines[k++];
        paper.style.height = Math.min(220, 14 + k * 17) + "px";
        paper.scrollTop = paper.scrollHeight;
        if (ambient.on) buzz();
        if (k < lines.length) return;
        clearInterval(t); busy = false; led.classList.remove("on"); paper.classList.add("done");
        status.innerHTML = `Done. <a href="${esc(r.file)}" download>Download PDF</a> · <a href="${esc(r.file)}" target="_blank" rel="noopener">open in a tab</a>`;
        const a = document.createElement("a"); a.href = r.file; a.download = r.file.split("/").pop();
        document.body.appendChild(a); a.click(); a.remove();
        award("printed");
      }, reduceMotion ? 0 : 170);
      entry.cleanup.push(() => clearInterval(t));
    };
    $(".pr-pick", body).onclick = (e) => { const b = e.target.closest("button"); if (b) print(+b.dataset.i); };
    entry.print = print;
    if (printNext >= 0) { const i = printNext; printNext = -1; print(i); }
  }

  // ---------- Voice commands (Web Speech API; Chrome / Edge / Safari) ----------
  function voice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition, btn = $("#voice-btn");
    if (!SR) { btn.remove(); return; }
    const bar = $("#voice-bar"), heard = $(".vb-heard", bar), reply = $(".vb-reply", bar);
    const ALIAS = [
      [/\b(resume|résumé|cv|print)\b/, "printer"], [/\b(grant|shop|upgrade|money|3,?000|spend)\b/, "shop"], [/\b(guest ?book|sign)\b/, "guestbook"], [/\b(trophies|trophy|achievements?)\b/, "trophies"],
      [/\b(case ?file|story|evidence|case)\b/, "casefile"], [/\b(training|journey|timeline|run)\b/, "training"], [/\b(a ?g ?i|roadmap|super ?intelligence|future)\b/, "agi"],
      [/\b(trivia|quiz)\b/, "trivia"], [/\b(music|songs?|amp|playlist|metal)\b/, "amp"], [/\b(passport|travel|trips?|countries)\b/, "passport"],
      [/\b(projects?|work|github)\b/, "projects"], [/\b(skills|stack|loadout|tools)\b/, "loadout"], [/\b(terminal|shell|console)\b/, "terminal"],
      [/\b(read ?me|about|who is|who's|introduce)\b/, "readme"], [/\b(secret)\b/, "secret"],
    ];
    const run = (said) => {
      const s = said.toLowerCase().trim();
      if (/\b(don'?t open|scare me|ghost|haunt)/.test(s)) { unlock("dontopen"); openApp("dontopen"); return "You asked for it."; }
      if (/\bclose (all|everything)\b/.test(s)) { [...wins.keys()].forEach(closeWin); return "Closed everything."; }
      if (/\bclose\b/.test(s)) { if (focused) closeWin(focused); return "Closed."; }
      if (/\b(sound|ambien)\w* (on|off)\b/.test(s)) { const on = /\bon\b/.test(s); if (ambient.on !== on) $("#sound-btn").click(); return `Sound ${on ? "on" : "off"}.`; }
      if (/\b(hire|why should|wispr|india)\b/.test(s)) { award("hired"); openApp("hire"); return `Opening WHY_HIRE_ME.exe. ${D.owner.name} is ready when you are.`; }
      const hit = ALIAS.find(([re]) => re.test(s));
      if (!hit) return `Didn't catch a command in "${said}". Try "open projects".`;
      const id = hit[1];
      if (id === "printer") {
        const i = /hardware|rtl|fpga|vlsi|chip/.test(s) ? 0 : /software|ml|machine|ai\b|code/.test(s) ? 1 : -1;
        if (i >= 0) { const w = wins.get("printer"); if (w) { focusWin("printer"); w.print(i); } else { printNext = i; openApp("printer"); } }
        else openApp("printer");
        return i >= 0 ? `Printing the ${D.resumes[i].label.toLowerCase()} résumé.` : "Hardware or software? Say \"print hardware resume\".";
      }
      if (APPS[id].hidden && store.get(id) !== "1") return "Nice try. That one has to be earned.";
      openApp(id);
      return `Opening ${APPS[id].label}`;
    };
    let rec = null, hideT = 0;
    const stop = () => { btn.classList.remove("on"); btn.setAttribute("aria-pressed", "false"); if (rec) { rec.onend = null; try { rec.abort(); } catch { /* already stopped */ } rec = null; } };
    const show = () => { clearTimeout(hideT); bar.classList.add("show"); };
    const later = () => { clearTimeout(hideT); hideT = setTimeout(() => bar.classList.remove("show"), 4500); };
    btn.onclick = () => {
      if (rec) { stop(); later(); return; }
      rec = new SR();
      rec.lang = "en-US"; rec.interimResults = true; rec.maxAlternatives = 1;
      btn.classList.add("on"); btn.setAttribute("aria-pressed", "true");
      heard.textContent = "listening…"; reply.textContent = 'try "open projects", "play music", "print hardware resume", "sign the guestbook"';
      show();
      rec.onresult = (e) => {
        const r = e.results[e.results.length - 1], said = r[0].transcript;
        heard.textContent = `“${said}”`;
        if (r.isFinal) { reply.textContent = "→ " + run(said); award("voice"); }
      };
      rec.onerror = (e) => {
        heard.textContent = "mic offline";
        reply.textContent = e.error === "not-allowed" || e.error === "service-not-allowed" ? "Mic access was blocked. Allow it in the address bar and try again."
          : e.error === "no-speech" ? "Didn't hear anything. Click the mic and try again." : `Voice error: ${e.error}`;
      };
      rec.onend = () => { stop(); later(); };
      try { rec.start(); } catch { stop(); }
    };
  }

  // ---------- WHY_HIRE_ME.exe: Wispr Flow bug tracker + India launch plan ----------
  function renderHire(body, entry) {
    const H = D.hire, done = new Set();
    const total = H.issues.length;
    body.innerHTML = `<h2>WHY_HIRE_ME.exe</h2>
      <p class="muted hire-note">WISPR_FLOW // OPEN ISSUES · triaged by ${esc(D.owner.handle)}@nightshift · ${esc(H.note)}</p>
      <div class="hire-tabs" role="tablist"><button class="btn small on" role="tab" aria-selected="true" data-tab="bugs">BUG_TRACKER</button><button class="btn small" role="tab" aria-selected="false" data-tab="india">LAUNCH: INDIA</button></div>
      <div class="hire-pane" data-pane="bugs">
        ${H.issues.map((t, i) => `<details class="ticket" data-i="${i}">
          <summary><span class="tid">${esc(t.id)}</span><span class="sev sev-${esc(t.sev.toLowerCase())}">${esc(t.sev)}</span><b>"${esc(t.title)}"</b><span class="st">OPEN</span></summary>
          <dl><dt>SYMPTOM</dt><dd>${esc(t.symptom)}</dd><dt>ROOT CAUSE</dt><dd>${esc(t.cause)}</dd>
          <dt>PATCH</dt><dd><ul>${t.patch.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></dd></dl>
          <button class="btn small apply" type="button">[ APPLY PATCH ]</button><pre class="plog" aria-live="polite"></pre>
        </details>`).join("")}
        <p class="hire-foot"><span class="count">${total} issues open · 0 patched</span> · patch author available for hire</p>
      </div>
      <div class="hire-pane hidden" data-pane="india">
        <h3 class="launch-h">What I'd launch for Wispr Flow India</h3>
        <p>${esc(H.indiaIntro)}</p>
        <ol class="launch">${H.india.map((l) => `<li><span class="tid">${esc(l.id)}</span><b>${esc(l.title)}</b><p>${esc(l.body)}</p></li>`).join("")}</ol>
      </div>`;
    const foot = $(".hire-foot", body);
    const paint = () => {
      if (done.size < total) { $(".count", foot).textContent = `${total - done.size} issues open · ${done.size} patched`; return; }
      foot.innerHTML = `<b>${total}/${total} patched. Ship the author.</b> <a class="btn small" href="mailto:${esc(D.owner.email)}?subject=${encodeURIComponent("Night Shift OS: let's talk")}">EMAIL ME</a> <a class="btn small" href="${esc(D.owner.linkedin)}" target="_blank" rel="noopener">LINKEDIN</a>`;
      award("patched");
    };
    body.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-tab]");
      if (tab) {
        body.querySelectorAll("[data-tab]").forEach((b) => { b.classList.toggle("on", b === tab); b.setAttribute("aria-selected", b === tab); });
        body.querySelectorAll("[data-pane]").forEach((p) => p.classList.toggle("hidden", p.dataset.pane !== tab.dataset.tab));
        return;
      }
      const btn = e.target.closest(".apply"); if (!btn) return;
      const card = btn.closest(".ticket"), i = +card.dataset.i, t = H.issues[i], out = $(".plog", card);
      btn.disabled = true;
      const lines = [`> git apply ${t.id}.patch`, ...t.log, `status: OPEN → PATCHED ✔`];
      let k = 0;
      const step = () => {
        out.textContent += (k ? "\n" : "") + lines[k++];
        if (k < lines.length) { const id = setTimeout(step, reduceMotion ? 0 : 380); entry.cleanup.push(() => clearTimeout(id)); return; }
        card.classList.add("patched"); $(".st", card).textContent = "PATCHED"; btn.remove();
        done.add(i); paint();
      };
      step();
    });
  }

  // ---------- UPGRADE_SHOP.exe: spend the $3,000 grant like a loot drop ----------
  function renderShop(body, entry) {
    const G = D.grant, owned = new Set();
    const money = (n) => "$" + n.toLocaleString("en-US");
    let ac = null;
    const coin = (up) => {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        const t = ac.currentTime;
        [0, 0.07].forEach((d, k) => {
          const o = ac.createOscillator(), v = ac.createGain();
          o.type = "square"; o.frequency.value = up ? [988, 1319][k] : [660, 440][k];
          v.gain.setValueAtTime(0.05, t + d); v.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.12);
          o.connect(v); v.connect(ac.destination); o.start(t + d); o.stop(t + d + 0.13);
        });
      } catch { /* no audio */ }
    };
    body.innerHTML = `<h2>UPGRADE_SHOP.exe</h2><p class="muted">${esc(G.intro)}</p>
      <div class="wallet"><span>GRANT WALLET</span><b class="gold">${money(G.budget)}</b><i><em></em></i></div>
      <div class="shop">${G.items.map((it) => `<article class="item" data-id="${esc(it.id)}">
        <div class="item-top"><span class="item-ic">${svg(it.icon)}</span><div><b>${esc(it.name)}</b><span class="price">${money(it.price)}</span></div></div>
        <ul class="stats">${it.stats.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <button class="btn small buy" type="button">[ BUY ]</button></article>`).join("")}</div>
      <h3 class="eq-h">EQUIPPED <span class="muted">(click an item to refund it)</span></h3>
      <ol class="equipped"><li class="muted empty">Inventory empty. The grant is burning a hole in your pocket.</li></ol>
      <div class="shop-done hidden"><p class="banner">★ LOADOUT COMPLETE ★</p><button class="btn print" type="button">PRINT THE RECEIPT</button>
        <div class="pr-paper receipt"><pre></pre></div></div>`;
    const gold = $(".gold", body), bar = $(".wallet em", body), eq = $(".equipped", body), doneBox = $(".shop-done", body);
    const paint = () => {
      const spent = G.items.filter((it) => owned.has(it.id)).reduce((a, it) => a + it.price, 0), left = G.budget - spent;
      gold.textContent = money(left);
      bar.style.width = (left / G.budget) * 100 + "%";
      body.querySelectorAll(".item").forEach((c) => {
        const it = G.items.find((x) => x.id === c.dataset.id), have = owned.has(it.id);
        c.classList.toggle("owned", have);
        const b = $(".buy", c); b.textContent = have ? "EQUIPPED ✔" : "[ BUY ]"; b.disabled = have || it.price > left;
      });
      const mine = G.items.filter((it) => owned.has(it.id));
      eq.innerHTML = mine.length ? mine.map((it) => `<li data-id="${esc(it.id)}" tabindex="0" role="button" aria-label="Refund ${esc(it.name)}"><b>${esc(it.name)}</b> <span class="price">${money(it.price)}</span><p>${esc(it.why)}</p></li>`).join("")
        : `<li class="muted empty">Inventory empty. The grant is burning a hole in your pocket.</li>`;
      const all = owned.size === G.items.length;
      doneBox.classList.toggle("hidden", !all);
      if (all) award("spender");
    };
    const toggle = (id, buy) => { if (buy ? owned.has(id) : !owned.has(id)) return; buy ? owned.add(id) : owned.delete(id); coin(buy); paint(); };
    $(".shop", body).onclick = (e) => { const b = e.target.closest(".buy"); if (b && !b.disabled) toggle(b.closest(".item").dataset.id, true); };
    eq.onclick = (e) => { const li = e.target.closest("li[data-id]"); if (li) toggle(li.dataset.id, false); };
    eq.onkeydown = (e) => { const li = e.target.closest("li[data-id]"); if (li && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(li.dataset.id, false); } };

    // the receipt, fed out line by line like the printer on the desk
    const paper = $(".receipt", body), pre = $("pre", paper);
    $(".print", body).onclick = (e) => {
      const btn = e.currentTarget; btn.disabled = true;
      const W = 34, row = (l, r) => l.slice(0, W - r.length - 1).padEnd(W - r.length, ".") + r;
      const lines = ["   NIGHT SHIFT OS · GRANT RECEIPT", "   " + new Date().toLocaleDateString("en-GB") + "  03:00 AM", "-".repeat(W),
        ...G.items.map((it) => row(it.name.replace(/ \(.*\)/, ""), money(it.price))), "-".repeat(W),
        row("TOTAL", money(G.budget)), row("REMAINING", "$0"), "", "PAID BY: Wispr Flow (hopefully)", "CUSTOMER: " + D.owner.name, "", "   * THANK YOU. COME AGAIN. *"];
      pre.textContent = ""; paper.style.height = "0px";
      let k = 0;
      const t = setInterval(() => {
        pre.textContent += (k ? "\n" : "") + lines[k++];
        paper.style.height = 16 + k * 17 + "px";
        if (k < lines.length) return;
        clearInterval(t); btn.disabled = false; btn.textContent = "PRINT AGAIN";
      }, reduceMotion ? 0 : 140);
      entry.cleanup.push(() => clearInterval(t));
    };
    paint();
  }

  // ---------- Achievements ----------
  const TROPHIES = {
    clocked: ["Clocked in", "Booted Night Shift OS"],
    detective: ["Detective", "Read every piece of evidence in CASE_FILE"],
    trained: ["Fully trained", "Reached the final level of TRAINING_RUN"],
    quiz: ["Know-it-all", "Unlocked SECRET.txt"],
    dj: ["Headbanger", "Previewed a song in AMP"],
    brave: ["Should've listened", "Opened DONT_OPEN.exe"],
    hired: ["sudo hire", "Ran sudo hire in TERMINAL"],
    explorer: ["Explorer", "Opened every app on the desktop"],
    haunted: ["Glutton for punishment", "Booted in HAUNTED mode"],
    sniper: ["Neural sniper", "Fired 10 pulses through the wallpaper"],
    signed: ["Left a mark", "Signed the GUESTBOOK"],
    printed: ["Paper trail", "Printed a résumé"],
    voice: ["Voice of the night", "Ran a voice command"],
    spender: ["Big spender", "Spent the whole $3,000 grant"],
    patched: ["Patch Tuesday", "Applied every patch in WHY_HIRE_ME.exe"],
    snoop: ["Snoop", "Inspected everything in the room before sitting down"],
  };
  const got = (() => { try { return new Set(JSON.parse(store.get("trophies") || "[]")); } catch { return new Set(); } })();
  function award(id) {
    if (got.has(id) || !TROPHIES[id]) return;
    got.add(id);
    store.set("trophies", JSON.stringify([...got]));
    const t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = `<span class="tt">★ ACHIEVEMENT UNLOCKED · ${got.size}/${Object.keys(TROPHIES).length}</span><b>${esc(TROPHIES[id][0])}</b><span>${esc(TROPHIES[id][1])}</span>`;
    $("#toasts").appendChild(t);
    setTimeout(() => t.classList.add("out"), 3800);
    setTimeout(() => t.remove(), 4400);
    const w = wins.get("trophies");
    if (w) renderTrophies($(".win-body", w.el));
  }
  function renderTrophies(body) {
    const all = Object.entries(TROPHIES);
    body.innerHTML = `<h2>TROPHIES.exe</h2><p class="muted">${got.size}/${all.length} unlocked. Some of these are hidden in plain sight.</p>
      <div class="trophies">${all.map(([id, [n, d]]) => `<div class="trophy${got.has(id) ? " got" : ""}"><span class="star">${got.has(id) ? "★" : "☆"}</span><div><b>${got.has(id) ? esc(n) : "???"}</b><span>${got.has(id) ? esc(d) : "Locked"}</span></div></div>`).join("")}</div>`;
  }
  const opened = new Set();


  // ---------- Window manager ----------
  const wins = new Map();
  let z = 10, focused = null, cascade = 0;

  function openApp(id) {
    const app = APPS[id]; if (!app) return;
    if (app.overlay) return app.render();
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
    opened.add(id);
    if (Object.entries(APPS).every(([k, a]) => a.hidden || opened.has(k))) award("explorer");
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
      <p>Hey ${esc(visitor)}. You've booted my machine at 3 AM. Everything about me is on this desktop — the risks I've taken, the mistakes I've reopened, the models I've trained and the music that was playing while I did it.</p>
      <p class="muted">Motto: <span style="color:var(--blood)">${esc(o.motto)}</span> · ${esc(o.location)}</p>
      <h3>Where to start</h3>
      <p>
        <button class="btn small" data-go="casefile" type="button">Investigate the case</button>
        <button class="btn small" data-go="training" type="button">Watch my training run</button>
        <button class="btn small" data-go="trivia" type="button">Beat the quiz</button>
      </p>
      <p class="muted">This whole site was built by voice with Wispr Flow.</p>
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
    const seen = new Set();
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
      seen.add(c.id);
      if (seen.size === cf.cards.length) award("detective");
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
      if (cur === last) award("trained");
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
      body.innerHTML = `<h2>TRIVIA.exe</h2><p>${esc(D.triviaIntro || `${qs.length} questions.`)}</p>
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
      if (win) { unlock("secret"); award("quiz"); }
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
      award("dj");
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
      help: () => say("help · whoami · ls · open <app> · motto · date · ghost · clear · sudo hire " + D.owner.handle),
      whoami: () => say(`${D.owner.name} — ${D.owner.role}`),
      ls: () => say(Object.entries(APPS).filter(([id, a]) => shown(id, a)).map(([id, a]) => `${a.label.padEnd(18)} (open ${id})`).join("\n")),
      open: (a) => (APPS[a] && shown(a, APPS[a]) ? (say("opening " + a + "…"), openApp(a)) : say("no such app: " + (a || "?"))),
      motto: () => say(D.owner.motto),
      ghost: () => { say("who's there?"); setTimeout(() => say("…it's 3:00 AM. you shouldn't be awake."), 1400); setTimeout(() => unlock("dontopen"), 2800); },
      date: () => say(new Date().toString()),
      clear: () => { out.textContent = ""; },
      sudo: (...r) => (r.join(" ").startsWith("hire") && award("hired"), say(r.join(" ").startsWith("hire") ? `[sudo] permission granted.\nDeploying ${D.owner.name} to Wispr Flow… ██████████ 100%\nSee you in Bangalore.\n(The patch notes are in WHY_HIRE_ME.exe.)` : "sudo: nice try.")),
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

  desktop();
  // the 3D room (scene.js) calls boot() once you've sat down at the PC
  window.NSOS = { boot, award };
})();
