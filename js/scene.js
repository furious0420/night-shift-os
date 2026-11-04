/* NIGHT SHIFT OS — the outside: a dark bedroom at 3 AM. Click to sit down and zoom into the CRT.
   Built from primitives with three.js (no models). Falls back to the boot screen if WebGL is unavailable. */
(() => {
  "use strict";
  const intro = document.getElementById("intro");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const done = () => { intro.remove(); window.NSOS.boot(); };

  let webgl = false;
  try { const c = document.createElement("canvas"); webgl = !!(window.THREE && (c.getContext("webgl2") || c.getContext("webgl"))); } catch { /* no WebGL */ }
  if (!webgl) return done();

  const T = window.THREE;
  const D = window.OS_DATA;

  // ---------- renderer / camera ----------
  const renderer = new T.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputEncoding = T.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  intro.querySelector(".stage").appendChild(renderer.domElement);

  const scene = new T.Scene();
  scene.background = new T.Color(0x030407);
  scene.fog = new T.FogExp2(0x030407, 0.16);

  const camera = new T.PerspectiveCamera(50, innerWidth / innerHeight, 0.01, 40);
  // portrait screens get a wider lens so the desk still fits
  const fit = () => { camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < 1 ? 50 + (1 - camera.aspect) * 40 : 50; camera.updateProjectionMatrix(); };
  fit();
  const HOME = new T.Vector3(0.15, 1.5, 1.45);
  const LOOK = new T.Vector3(0, 1.0, -2.2);
  camera.position.copy(HOME);
  camera.lookAt(LOOK);

  // ---------- helpers ----------
  const mat = (color, o = {}) => new T.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0.05, ...o });
  const box = (w, h, d, m, x, y, z, parent = scene) => {
    const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const canvasTex = (w, h, draw) => {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    draw(g, w, h);
    const t = new T.CanvasTexture(c);
    t.encoding = T.sRGBEncoding;
    t.anisotropy = 4;
    return { tex: t, g, c };
  };
  const plane = (w, h, material, x, y, z, ry = 0) => {
    const mesh = new T.Mesh(new T.PlaneGeometry(w, h), material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = ry;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  };

  // ---------- room ----------
  const wallMat = mat(0x1a1d24);
  const floor = new T.Mesh(new T.PlaneGeometry(10, 10), mat(0x0f0c0a, { roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  plane(10, 5, wallMat, 0, 2.5, -3);
  plane(10, 5, wallMat, -3.2, 2.5, 0, Math.PI / 2);
  plane(10, 5, wallMat, 3.2, 2.5, 0, -Math.PI / 2);
  // rug
  const rug = new T.Mesh(new T.CircleGeometry(1.1, 40), mat(0x2a0d0d, { roughness: 1 }));
  rug.rotation.x = -Math.PI / 2; rug.position.set(0, 0.005, -1.3); rug.receiveShadow = true;
  scene.add(rug);

  // ---------- desk ----------
  const wood = mat(0x2b1d14, { roughness: 0.7 });
  box(2.3, 0.06, 0.95, wood, 0, 0.75, -2.3);
  for (const [x, z] of [[-1.08, -2.72], [1.08, -2.72], [-1.08, -1.88], [1.08, -1.88]]) box(0.06, 0.75, 0.06, wood, x, 0.375, z);
  box(0.5, 0.28, 0.85, mat(0x231710), 0.78, 0.58, -2.3); // drawer block

  // ---------- CRT monitor ----------
  const beige = mat(0xb9b09a, { roughness: 0.6 });
  box(0.3, 0.04, 0.3, beige, 0, 0.8, -2.42);
  const crt = box(0.62, 0.5, 0.42, beige, 0, 1.07, -2.36);
  box(0.5, 0.42, 0.25, beige, 0, 1.07, -2.62); // tube back
  const bezel = box(0.56, 0.42, 0.02, mat(0x8f8775), 0, 1.08, -2.145);
  bezel.castShadow = false;

  // screen: a live canvas
  const SW = 512, SH = 384;
  const screen = canvasTex(SW, SH, () => {});
  const screenMesh = plane(0.48, 0.36, new T.MeshBasicMaterial({ map: screen.tex, toneMapped: false }), 0, 1.085, -2.133);
  let scare = 0;
  const drawScreen = (t) => {
    const g = screen.g;
    g.fillStyle = "#020a05"; g.fillRect(0, 0, SW, SH);
    const glow = g.createRadialGradient(SW / 2, SH / 2, 10, SW / 2, SH / 2, SW * 0.7);
    glow.addColorStop(0, "rgba(57,255,136,.10)"); glow.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = glow; g.fillRect(0, 0, SW, SH);
    g.font = "28px VT323, monospace";
    g.fillStyle = "#39ff88"; g.shadowColor = "#39ff88"; g.shadowBlur = 8;
    if (scare > t) {
      g.fillStyle = "#ff3b3b"; g.shadowColor = "#ff3b3b";
      g.font = "64px VT323, monospace";
      g.fillText("BEHIND YOU", 120, 210);
    } else {
      const lines = ["NIGHT SHIFT OS v3.00", "", `${D.owner.handle}@nightshift:~$ uptime`, " 03:00 AM  up all night", "", "> sit down to log in"];
      lines.forEach((l, i) => g.fillText(l, 36, 60 + i * 34));
      if (Math.floor(t * 2) % 2) g.fillRect(36 + g.measureText("> sit down to log in").width + 6, 60 + 5 * 34 - 22, 14, 26);
    }
    g.shadowBlur = 0;
    g.fillStyle = "rgba(0,0,0,.25)";
    for (let y = 0; y < SH; y += 3) g.fillRect(0, y, SW, 1);
    screen.tex.needsUpdate = true;
  };

  const screenLight = new T.PointLight(0x39ff88, 1.1, 3.2, 2);
  screenLight.position.set(0, 1.08, -1.95);
  scene.add(screenLight);

  // keyboard + mouse + mug
  const keyboard = box(0.48, 0.025, 0.16, beige, 0, 0.795, -1.95);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 12; k++) box(0.03, 0.01, 0.028, mat(0xd8d0bc), -0.2 + k * 0.036, 0.812, -2.0 + r * 0.034);
  box(0.06, 0.025, 0.1, beige, 0.36, 0.795, -1.95);
  const mug = new T.Mesh(new T.CylinderGeometry(0.045, 0.04, 0.1, 20), mat(0x6e0f0f));
  mug.position.set(-0.45, 0.83, -2.0); mug.castShadow = true; scene.add(mug);

  // PC tower with a blinking LED
  const tower = mat(0x16181c, { metalness: 0.3, roughness: 0.5 });
  box(0.22, 0.5, 0.48, tower, 0.82, 1.03, -2.35);
  const led = new T.Mesh(new T.SphereGeometry(0.008, 8, 8), new T.MeshBasicMaterial({ color: 0xff3b3b }));
  led.position.set(0.82, 1.2, -2.108); scene.add(led);
  box(0.16, 0.01, 0.005, mat(0x333333), 0.82, 1.12, -2.108);

  // dot-matrix printer (prints the résumés)
  const printer = new T.Group();
  box(0.36, 0.11, 0.26, beige, 0, 0.835, 0, printer);
  box(0.3, 0.012, 0.2, mat(0x6f6858), 0, 0.893, -0.01, printer); // lid
  box(0.26, 0.02, 0.01, mat(0x0a0a0a), 0, 0.86, 0.131, printer); // paper slot
  const feed = box(0.22, 0.004, 0.16, mat(0xece5d3), 0, 0.95, -0.13, printer); feed.rotation.x = -0.9; // paper waiting at the back
  const pled = new T.Mesh(new T.SphereGeometry(0.006, 8, 8), new T.MeshBasicMaterial({ color: 0x113311 }));
  pled.position.set(0.15, 0.855, 0.132); printer.add(pled);
  printer.position.set(-0.86, 0, -2.05);
  scene.add(printer);
  // the page that feeds out: drawn line by line onto a canvas
  const PW = 220, PH = 240;
  const page = canvasTex(PW, PH, () => {});
  const sheet = new T.Mesh(new T.PlaneGeometry(0.22, 0.24), mat(0xffffff, { map: page.tex, roughness: 0.95 }));
  sheet.rotation.x = -Math.PI / 2; sheet.position.set(-0.86, 0.862, -2.05); sheet.visible = false;
  scene.add(sheet);
  const drawPage = (lines, n) => {
    const g = page.g;
    g.fillStyle = "#ece5d3"; g.fillRect(0, 0, PW, PH);
    g.fillStyle = "#c9c0aa"; for (let y = 6; y < PH; y += 14) { g.fillRect(3, y, 5, 5); g.fillRect(PW - 8, y, 5, 5); }
    g.fillStyle = "#222"; g.font = "bold 11px 'Share Tech Mono', monospace";
    lines.slice(0, n).forEach((l, i) => g.fillText(l.slice(0, 30), 14, 18 + i * 15));
    page.tex.needsUpdate = true;
  };

  // desk lamp (the flicker)
  const metal = mat(0x2a2a2a, { metalness: 0.6, roughness: 0.4 });
  const base = new T.Mesh(new T.CylinderGeometry(0.08, 0.09, 0.025, 24), metal);
  base.position.set(-0.8, 0.79, -2.45); scene.add(base);
  const arm = box(0.02, 0.5, 0.02, metal, -0.8, 1.03, -2.45); arm.rotation.x = 0.25;
  const shade = new T.Mesh(new T.ConeGeometry(0.11, 0.16, 24, 1, true), mat(0x3a0a0a, { side: T.DoubleSide }));
  shade.position.set(-0.78, 1.27, -2.3); shade.rotation.set(-0.9, 0, -0.35); scene.add(shade);
  const bulb = new T.Mesh(new T.SphereGeometry(0.03, 12, 12), new T.MeshBasicMaterial({ color: 0xffc27a }));
  bulb.position.set(-0.77, 1.23, -2.25); scene.add(bulb);
  const lamp = new T.SpotLight(0xffb35c, 2.2, 4, 0.75, 0.6, 2);
  lamp.position.copy(bulb.position);
  lamp.target.position.set(-0.4, 0.78, -1.9);
  lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024);
  scene.add(lamp, lamp.target);

  // chair
  // chair, pulled out and turned, as if someone just got up
  const chair = new T.Group();
  const chairMat = mat(0x111214, { roughness: 0.6 });
  box(0.5, 0.07, 0.48, chairMat, 0, 0.5, 0, chair);
  const back = box(0.48, 0.6, 0.06, chairMat, 0, 0.85, 0.25, chair); back.rotation.x = -0.12;
  box(0.05, 0.42, 0.05, metal, 0, 0.25, 0, chair);
  for (let i = 0; i < 5; i++) { const leg = box(0.32, 0.03, 0.04, metal, 0, 0.04, 0, chair); leg.rotation.y = (i / 5) * Math.PI * 2; }
  chair.position.set(0.85, 0, -1.2); chair.rotation.y = -0.9;
  scene.add(chair);

  // guitar leaning on the right wall
  const guitar = new T.Group();
  const gMat = mat(0x5c0b0b, { roughness: 0.35, metalness: 0.2 });
  const lower = new T.Mesh(new T.SphereGeometry(0.2, 24, 16), gMat); lower.scale.set(1, 1.1, 0.22);
  const upper = new T.Mesh(new T.SphereGeometry(0.15, 24, 16), gMat); upper.scale.set(1, 1.05, 0.22); upper.position.y = 0.25;
  const neck = new T.Mesh(new T.BoxGeometry(0.05, 0.62, 0.03), mat(0x1b120c)); neck.position.y = 0.66;
  const head = new T.Mesh(new T.BoxGeometry(0.08, 0.14, 0.03), mat(0x0d0d0d)); head.position.y = 1.03;
  const hole = new T.Mesh(new T.CircleGeometry(0.05, 20), mat(0x050505)); hole.position.set(0, 0.12, 0.046);
  [lower, upper, neck, head].forEach((m) => { m.castShadow = true; guitar.add(m); });
  guitar.add(hole);
  guitar.position.set(2.75, 0.24, -2.1); guitar.rotation.set(0, -0.9, 0.18);
  scene.add(guitar);

  // shelf + globe + books
  box(0.9, 0.03, 0.22, wood, 1.95, 1.45, -2.88);
  const globe = new T.Mesh(new T.SphereGeometry(0.1, 24, 16), mat(0x1f4d6b, { roughness: 0.5 }));
  globe.position.set(2.2, 1.6, -2.86); globe.castShadow = true; scene.add(globe);
  [[1.62, 0x3b1e1e, 0.24], [1.67, 0x1e2b3b, 0.21], [1.72, 0x2b2b1e, 0.26], [1.77, 0x101010, 0.2]].forEach(([x, c, h]) => box(0.04, h, 0.16, mat(c), x, 1.465 + h / 2, -2.87));

  // ---------- wall art (canvas textures) ----------
  const wallArt = (w, h, pw, ph, x, y, draw) => {
    const t = canvasTex(pw, ph, draw);
    const m = plane(w, h, mat(0xffffff, { map: t.tex, roughness: 0.9 }), x, y, -2.985);
    box(w + 0.04, h + 0.04, 0.01, mat(0x0a0a0a), x, y, -2.995);
    return m;
  };
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  fontsReady.then(() => {
    // gig poster
    const gig = wallArt(0.62, 0.88, 310, 440, 1.95, 2.25, (g, w, h) => {
      g.fillStyle = "#0b0b0b"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#8b0000"; g.beginPath(); g.arc(w / 2, 170, 95, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#0b0b0b"; g.font = "bold 120px 'Chakra Petch', Impact, sans-serif"; g.textAlign = "center"; g.fillText("☠", w / 2, 210);
      g.fillStyle = "#e8e0d0"; g.font = "bold 38px 'Chakra Petch', Impact, sans-serif"; g.fillText("SEEK", w / 2, 320); g.fillText("DISCOMFORT", w / 2, 360);
      g.fillStyle = "#ff3b3b"; g.font = "22px VT323, monospace"; g.fillText("WORLD TOUR · 03:00 AM", w / 2, 400);
    });
    // horror movie poster
    const horror = wallArt(0.5, 0.72, 250, 360, -1.85, 2.35, (g, w, h) => {
      const grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, "#14181f"); grd.addColorStop(1, "#000"); g.fillStyle = grd; g.fillRect(0, 0, w, h);
      g.fillStyle = "#d9d2c0"; g.beginPath(); g.ellipse(w / 2, 150, 80, 38, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#7a0000"; g.beginPath(); g.arc(w / 2, 150, 26, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#000"; g.beginPath(); g.arc(w / 2, 150, 11, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#c62828"; g.font = "bold 34px 'Chakra Petch', Impact, sans-serif"; g.textAlign = "center"; g.fillText("DON'T OPEN", w / 2, 270); g.fillText("IT", w / 2, 305);
      g.fillStyle = "#666"; g.font = "16px VT323, monospace"; g.fillText("NOW SHOWING ON THIS PC", w / 2, 340);
    });
    // case-file corkboard above the desk
    const cork = wallArt(1.0, 0.62, 500, 310, -0.35, 1.95, (g, w, h) => {
      g.fillStyle = "#6b4a2b"; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.25})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      const notes = [[40, 40], [200, 25], [360, 50], [90, 175], [270, 170], [400, 190]];
      g.strokeStyle = "#c62828"; g.lineWidth = 3;
      [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [1, 4]].forEach(([a, b]) => { g.beginPath(); g.moveTo(notes[a][0] + 40, notes[a][1] + 8); g.lineTo(notes[b][0] + 40, notes[b][1] + 8); g.stroke(); });
      notes.forEach(([x, y], i) => {
        g.fillStyle = i === 4 ? "#cfc6b0" : "#ece3cf"; g.fillRect(x, y, 80, 60 + (i % 2) * 20);
        g.fillStyle = "#333"; for (let l = 0; l < 4; l++) g.fillRect(x + 8, y + 16 + l * 10, 60 - (l % 2) * 18, 3);
        g.fillStyle = "#b71c1c"; g.beginPath(); g.arc(x + 40, y + 8, 6, 0, Math.PI * 2); g.fill();
      });
      g.fillStyle = "#e8e0d0"; g.font = "bold 22px 'Chakra Petch', sans-serif"; g.fillText("CASE #0001", 18, h - 18);
    });

    spot("gig", "SEEK DISCOMFORT poster", [gig], () => { pulse = clock.getElapsedTime() + 0.7; pulsing = gig; speak(`"${D.owner.motto}" The only rule in this room.`); });
    spot("horror", "DON'T OPEN IT poster", [horror], () => { whisper(); scare = clock.getElapsedTime() + 0.6; speak("Not yet. Log in first."); });
    spot("cork", "Case-file corkboard", [cork], () => {
      focus = { pos: new T.Vector3(-0.35, 1.9, -1.75), look: new T.Vector3(-0.35, 1.95, -3) };
      speak("CASE #0001. Every lead and every cold case. The full file is on the PC.");
    });
  });

  // ---------- window: rain, moon, lightning, and someone outside ----------
  const WW = 256, WH = 220;
  const win = canvasTex(WW, WH, () => {});
  const pane = plane(1.1, 0.95, new T.MeshBasicMaterial({ map: win.tex }), -1.95, 1.0, -2.99);
  const frameMat = mat(0x0c0c0c);
  box(1.18, 0.04, 0.05, frameMat, -1.95, 1.49, -2.98); box(1.18, 0.04, 0.05, frameMat, -1.95, 0.51, -2.98);
  box(0.04, 1.0, 0.05, frameMat, -2.53, 1.0, -2.98); box(0.04, 1.0, 0.05, frameMat, -1.37, 1.0, -2.98);
  box(0.03, 0.95, 0.04, frameMat, -1.95, 1.0, -2.975); box(1.1, 0.03, 0.04, frameMat, -1.95, 1.0, -2.975);
  const drops = Array.from({ length: 70 }, () => [Math.random() * WW, Math.random() * WH, 4 + Math.random() * 6]);
  let flash = 0, figure = false;
  const drawWindow = (t) => {
    const g = win.g, lit = flash > 0;
    const sky = g.createLinearGradient(0, 0, 0, WH);
    sky.addColorStop(0, lit ? "#9fb4ff" : "#0b1224"); sky.addColorStop(1, lit ? "#3a4870" : "#03050c");
    g.fillStyle = sky; g.fillRect(0, 0, WW, WH);
    if (!lit) { g.fillStyle = "rgba(220,230,255,.9)"; g.beginPath(); g.arc(196, 46, 16, 0, Math.PI * 2); g.fill(); }
    g.fillStyle = lit ? "#1a1f33" : "#05070d";
    [[0, 150, 40], [40, 130, 30], [70, 160, 50], [120, 120, 36], [156, 145, 44], [200, 135, 56]].forEach(([x, y, w]) => g.fillRect(x, y, w, WH - y));
    if (lit && figure) { // a silhouette standing in the yard
      g.fillStyle = "#000"; g.beginPath(); g.arc(128, 128, 11, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.moveTo(110, 220); g.quadraticCurveTo(110, 142, 128, 140); g.quadraticCurveTo(146, 142, 146, 220); g.fill();
    }
    if (lampOff && !lit) { // with the lamp off, something in the yard is easier to see
      g.fillStyle = "#ff2626"; g.shadowColor = "#ff2626"; g.shadowBlur = 6;
      g.beginPath(); g.arc(121, 150, 2.2, 0, Math.PI * 2); g.arc(135, 150, 2.2, 0, Math.PI * 2); g.fill();
      g.shadowBlur = 0;
    }
    g.strokeStyle = lit ? "rgba(255,255,255,.5)" : "rgba(160,180,220,.35)"; g.lineWidth = 1;
    for (const d of drops) {
      g.beginPath(); g.moveTo(d[0], d[1]); g.lineTo(d[0] - 1.5, d[1] + d[2]); g.stroke();
      d[1] += d[2] * 0.9; if (d[1] > WH) { d[1] = -10; d[0] = Math.random() * WW; }
    }
    win.tex.needsUpdate = true;
  };

  // ---------- lights ----------
  const ambient = new T.AmbientLight(0x404a66, 0.22);
  scene.add(ambient);
  const moon = new T.DirectionalLight(0x7f95ff, 0.35);
  moon.position.set(-2.2, 2.4, -4); moon.target.position.set(0, 0, -1);
  moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024);
  scene.add(moon, moon.target);

  // ---------- sound (synthesised on demand; nothing plays until the visitor clicks something) ----------
  let ac = null;
  const audio = () => { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); return ac; };
  const curve = new Float32Array(512).map((_, i) => Math.tanh((i / 256 - 1) * 8));
  const chug = (f, t0, len, vol) => {
    const a = audio(), sh = a.createWaveShaper(), lp = a.createBiquadFilter(), v = a.createGain();
    sh.curve = curve; lp.type = "lowpass"; lp.frequency.value = len > 0.3 ? 2400 : 900;
    v.gain.setValueAtTime(vol, t0); v.gain.exponentialRampToValueAtTime(0.001, t0 + len);
    sh.connect(lp); lp.connect(v); v.connect(a.destination);
    [f, f * 1.5, f * 2].forEach((x) => { const o = a.createOscillator(); o.type = "sawtooth"; o.frequency.value = x; o.connect(sh); o.start(t0); o.stop(t0 + len + 0.05); });
  };
  const riff = () => {
    const t0 = audio().currentTime + 0.02;
    [0, 0.13, 0.26, 0.39].forEach((d) => chug(73.42, t0 + d, 0.11, 0.1));
    chug(87.31, t0 + 0.52, 0.11, 0.1);
    chug(73.42, t0 + 0.65, 1.4, 0.12);
  };
  const whisper = () => {
    const a = audio(), n = a.createBuffer(1, a.sampleRate * 1.4, a.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = a.createBufferSource(), bp = a.createBiquadFilter(), v = a.createGain(), t0 = a.currentTime;
    src.buffer = n; bp.type = "bandpass"; bp.Q.value = 3;
    bp.frequency.setValueAtTime(700, t0); bp.frequency.exponentialRampToValueAtTime(2600, t0 + 1.3);
    v.gain.setValueAtTime(0.0001, t0); v.gain.exponentialRampToValueAtTime(0.35, t0 + 0.4); v.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.35);
    src.connect(bp); bp.connect(v); v.connect(a.destination); src.start();
  };

  // ---------- things you can poke before sitting down ----------
  const say = intro.querySelector(".intro-say"), hint = intro.querySelector(".intro-hint");
  const ROOM = 9; // everything except the monitor
  const spots = [], seen = new Set();
  let focus = null, pulse = 0, pulsing = null, spin = 0.15, wobble = 0, steamT = -99, lampOff = false, sayT = 0;
  const speak = (text) => {
    say.textContent = text; say.classList.add("show");
    clearTimeout(sayT); sayT = setTimeout(() => say.classList.remove("show"), 4500);
  };
  const spot = (id, label, objs, act) => {
    const meshes = [];
    objs.forEach((o) => o.traverse((m) => {
      if (!m.isMesh) return;
      if (m.material.emissive) m.material = m.material.clone(); // so the hover glow doesn't light up shared materials
      m.userData.spot = id; meshes.push(m);
    }));
    spots.push({ id, label, meshes, act });
  };
  const touch = matchMedia("(hover: none)").matches;
  const paintHint = () => {
    hint.textContent = seen.size === 0 ? (touch ? "Tap things to explore · tap the monitor to sit down" : "Click things to explore · click the monitor to sit down")
      : `Explored ${seen.size}/${ROOM} · ${touch ? "tap" : "click"} the monitor to sit down`;
  };
  paintHint();
  const poke = (s) => {
    s.act();
    if (s.id === "monitor") return;
    seen.add(s.id); paintHint();
    if (seen.size === ROOM && window.NSOS.award) window.NSOS.award("snoop");
  };

  const countries = new Set(D.trips.flatMap((t) => t.countries)).size;
  spot("monitor", "Sit down & log in", [crt, bezel, screenMesh, keyboard], () => sitDown());
  spot("guitar", "Guitar", [guitar], () => { wobble = clock.getElapsedTime() + 1.6; riff(); speak("Drop D. Always drop D."); });
  spot("globe", "Globe", [globe], () => { spin = 14; speak(`${countries} countries so far. Dubai is home #2.`); });
  spot("lamp", "Desk lamp", [base, arm, shade, bulb], () => { lampOff = !lampOff; speak(lampOff ? "…you shouldn't have done that. Look at the window." : "Better. Mostly."); });
  // printer: zoom in, pick a résumé, watch it feed out, get the PDF
  const chooser = intro.querySelector(".intro-print");
  let job = null; // { lines, t0, file }
  const closeChooser = () => chooser.classList.remove("show");
  chooser.innerHTML = `<p>PRINT WHICH RÉSUMÉ?</p>${D.resumes.map((r, i) => `<button class="btn" type="button" data-i="${i}"><b>${r.label.toUpperCase()}</b><small>${r.blurb}</small></button>`).join("")}`;
  chooser.addEventListener("click", (e) => {
    e.stopPropagation();
    const b = e.target.closest("button"); if (!b || job) return;
    const r = D.resumes[+b.dataset.i];
    closeChooser();
    job = { lines: r.lines, file: r.file, t0: clock.getElapsedTime(), printed: 0 };
    drawPage(job.lines, 0); sheet.visible = true; sheet.position.y = 0.862;
    speak(`Printing the ${r.label.toLowerCase()} résumé…`);
  });
  const buzz = () => {
    const a = audio(), o = a.createOscillator(), v = a.createGain(), t0 = a.currentTime;
    o.type = "square"; o.frequency.value = 160 + Math.random() * 90;
    v.gain.setValueAtTime(0.025, t0); v.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.1);
    o.connect(v); v.connect(a.destination); o.start(t0); o.stop(t0 + 0.11);
  };
  const download = (file) => { const a = document.createElement("a"); a.href = file; a.download = file.split("/").pop(); document.body.appendChild(a); a.click(); a.remove(); };
  spot("printer", "Printer", [printer], () => {
    focus = { pos: new T.Vector3(-0.62, 1.2, -1.45), look: new T.Vector3(-0.86, 0.86, -2.0) };
    if (job) return;
    chooser.classList.add("show");
    speak("Still works. Mostly. Pick one.");
  });
  spot("mug", "Mug", [mug], () => { steamT = clock.getElapsedTime(); speak("Coffee #4. It's 3 AM. This is fine."); });
  spot("window", "Window", [pane], () => {
    focus = { pos: new T.Vector3(-1.6, 1.1, -1.7), look: new T.Vector3(-1.95, 1.0, -3) };
    figure = false; nextBolt = clock.getElapsedTime() + 0.9; // the next flash shows who's out there
    speak("Don't look for too long.");
  });

  // steam for the mug
  const steam = Array.from({ length: 8 }, () => {
    const s = new T.Sprite(new T.SpriteMaterial({ color: 0xdddddd, transparent: true, opacity: 0, depthWrite: false }));
    s.scale.setScalar(0.05); scene.add(s); return s;
  });

  const ray = new T.Raycaster(), ndc = new T.Vector2();
  const hitSpot = (x, y) => {
    ndc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(spots.flatMap((s) => s.meshes), false)[0];
    return hit ? spots.find((s) => s.id === hit.object.userData.spot) : null;
  };
  let hovered = null;
  const glow = (s, on) => s && s.meshes.forEach((m) => m.material.emissive && m.material.emissive.setHex(on ? 0x3a2410 : 0x000000));

  // ---------- interaction ----------
  const mouse = { x: 0, y: 0 };
  addEventListener("pointermove", (e) => {
    mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5;
    if (zoom || touch) return;
    const s = hitSpot(e.clientX, e.clientY);
    if (s !== hovered) { glow(hovered, false); glow(s, true); hovered = s; }
  });
  addEventListener("resize", () => {
    fit();
    renderer.setSize(innerWidth, innerHeight);
  });

  let zoom = null; // { t0, from, fromLook }
  const SCREEN = screenMesh.position.clone();
  const sitDown = () => {
    if (zoom) return;
    if (reduceMotion) return finish();
    focus = null; glow(hovered, false); closeChooser();
    intro.classList.add("zooming");
    zoom = { t0: performance.now(), from: camera.position.clone(), fromLook: camLook.clone() };
  };
  const finish = () => {
    intro.classList.add("fade");
    setTimeout(() => { running = false; renderer.dispose(); done(); }, 650);
  };
  intro.addEventListener("click", (e) => {
    if (e.target.closest(".skip") || zoom) return;
    if (focus) { focus = null; closeChooser(); return; } // step back from a close-up first
    const s = hitSpot(e.clientX, e.clientY);
    if (s) poke(s); else sitDown();
  });
  intro.querySelector(".skip").addEventListener("click", (e) => { e.stopPropagation(); finish(); });
  const onKey = (e) => {
    if (e.key === "Escape" && focus) { focus = null; closeChooser(); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); removeEventListener("keydown", onKey); sitDown(); }
  };
  addEventListener("keydown", onKey);

  // ---------- loop ----------
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const clock = new T.Clock();
  let running = true, nextBolt = 6, nextScare = 14, lastScreen = 0, lampOut = 0, prevT = 0;
  const lookNow = LOOK.clone(), camPos = HOME.clone(), camLook = LOOK.clone(), want = new T.Vector3();

  const frame = () => {
    if (!running) return;
    const t = clock.getElapsedTime(), dt = t - prevT;
    prevT = t;

    // lightning: two quick flashes; every other storm, someone is standing outside
    if (t > nextBolt) {
      figure = !figure;
      flash = 0.12;
      setTimeout(() => { flash = 0.18; }, 180);
      nextBolt = t + 9 + Math.random() * 9;
    }
    if (flash > 0) flash -= dt;
    ambient.intensity = flash > 0 ? 1.4 : lampOff ? 0.12 : 0.22;
    moon.intensity = flash > 0 ? 2.2 : 0.35;

    // lamp flicker (and sometimes it dies for a moment)
    if (t > lampOut && Math.random() < 0.004) lampOut = t + 0.25 + Math.random() * 0.5;
    const out = lampOff || t < lampOut;
    lamp.intensity = out ? 0 : 2.2 * (0.86 + Math.random() * 0.14);
    bulb.material.color.setHex(out ? 0x221a10 : 0xffc27a);

    led.material.color.setHex(Math.floor(t * 3) % 4 === 0 ? 0x220000 : 0xff3b3b);
    screenLight.intensity = 1.0 + Math.sin(t * 40) * 0.05 + (scare > t ? 0.8 : 0);
    if (t > nextScare) { scare = t + 0.35; nextScare = t + 18 + Math.random() * 14; }
    if (t - lastScreen > 0.1) { drawScreen(t); drawWindow(t); lastScreen = t; }

    // object reactions
    globe.rotation.y += spin * dt; spin = Math.max(0.15, spin - dt * 5);
    guitar.rotation.z = 0.18 + (wobble > t ? Math.sin(t * 38) * 0.025 * (wobble - t) : 0);
    if (pulsing) pulsing.scale.setScalar(pulse > t ? 1 + Math.sin((pulse - t) * 18) * 0.03 : 1);
    if (job) { // feed the page out of the slot, one printed line at a time
      const k = Math.min(1, (t - job.t0) / 3.2), n = Math.ceil(k * job.lines.length);
      sheet.position.z = -2.05 + k * 0.27;
      if (n > job.printed) { job.printed = n; drawPage(job.lines, n); buzz(); }
      pled.material.color.setHex(Math.floor(t * 8) % 2 ? 0x39ff88 : 0x113311);
      if (k === 1) {
        sheet.position.y = 0.783; // the finished page drops onto the desk
        download(job.file);
        pled.material.color.setHex(0x113311);
        speak("Printed. Check your downloads.");
        if (window.NSOS.award) window.NSOS.award("printed");
        job = null;
      }
    }
    steam.forEach((s, i) => {
      const age = t - steamT, ph = (age * 0.5 + i / steam.length) % 1;
      s.position.set(mug.position.x + Math.sin(t * 2 + i) * 0.015, 0.9 + ph * 0.28, mug.position.z);
      s.material.opacity = age < 6 ? (1 - ph) * 0.3 * Math.min(1, (6 - age) / 2) : 0;
    });

    if (zoom) {
      const k = Math.min(1, (performance.now() - zoom.t0) / 2200), e = ease(k);
      const to = new T.Vector3(SCREEN.x, SCREEN.y, SCREEN.z + 0.4);
      camera.position.lerpVectors(zoom.from, to, e);
      lookNow.lerpVectors(zoom.fromLook, SCREEN, e);
      camera.lookAt(lookNow);
      if (k === 1 && !zoom.ended) { zoom.ended = true; finish(); }
    } else {
      if (focus) want.copy(focus.pos);
      else want.set(HOME.x + mouse.x * 0.35 + Math.sin(t * 0.3) * 0.03, HOME.y - mouse.y * 0.2 + Math.sin(t * 0.5) * 0.015, HOME.z);
      const k = reduceMotion ? 1 : 1 - Math.pow(0.002, dt);
      camPos.lerp(want, k); camLook.lerp(focus ? focus.look : LOOK, k);
      camera.position.copy(camPos);
      camera.lookAt(camLook);
    }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  };
  intro.classList.add("ready");
  frame();
})();
