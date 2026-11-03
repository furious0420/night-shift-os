/*
 * NIGHT SHIFT OS — all personal content lives here.
 * Edit this file (ideally by dictating with Wispr Flow) and the whole site updates.
 * Anything in [square brackets] is a placeholder waiting for your real story.
 */
window.OS_DATA = {
  owner: {
    name: "Allan Suraj",
    handle: "allan",
    role: "ECE @ PES University · ML + hardware tinkerer · AGI-curious · professional discomfort seeker",
    motto: "Seek discomfort.",
    location: "Bengaluru, India",
    github: "furious0420", // fills PROJECTS/ live from the GitHub API
    linkedin: "https://www.linkedin.com/in/allansuraj",
    email: "allansuraj.4821@gmail.com",
  },

  boot: [
    "NIGHT SHIFT BIOS v3.00 (c) 2026",
    "Memory test ............ 640K OK (should be enough for anybody)",
    "Detecting curiosity .... OVERFLOW",
    "Loading comfort zone ... NOT FOUND",
    "Mounting /dev/discomfort ...... OK",
    "Spinning up GPU fans ........... OK",
    "Checking for ghosts ............ 1 found (it's friendly)",
    "Starting voice driver: wispr-flow ... OK",
    "",
    "It is 3:00 AM. Everyone else is asleep.",
  ],

  // Sticky note on the desktop
  todo: [
    { text: "finish WinoFlow" },
    { text: "sleep", done: true },
    { text: "get hired at Wispr Flow" },
    { text: "check what's outside the window" },
  ],

  // CASE_FILE — the story. Leads = chances taken. Cold cases = mistakes reopened.
  caseFile: {
    title: "CASE #0001 — THE INTROVERT WHO STARTED SAYING YES",
    // body: one string per paragraph
    cards: [
      { id: "c1", type: "lead", x: 4, y: 6, title: "LEAD #1", head: "The risk of saying yes", date: "Ongoing",
        body: [
          "I've always found it easier to think about doing something than to actually do it. Growing up I was quite an introvert — familiar people, familiar places, situations where I knew what to expect.",
          "Somewhere along the way I realised that staying comfortable all the time also meant missing out. So I started saying yes to things I'd normally hesitate over: meeting new people, unfamiliar situations, experiences I'd never had.",
          "It wasn't an overnight transformation. I was still nervous, and plenty of times I wondered if I should've stayed put. But the things I was afraid of were rarely as intimidating as I'd imagined.",
        ],
        lesson: "I didn't become fearless. I just stopped letting fear of the unknown make every decision for me." },
      { id: "c2", type: "cold", x: 37, y: 4, title: "COLD CASE #1", head: "Overthinking everything", date: "Reopened",
        body: [
          "If I could change one habit, it would be how much time I've spent overthinking decisions. What if it doesn't work out? What if it's the wrong call? What if it turns out differently than I expect?",
          "The irony: while I was busy trying to avoid the wrong decision, I was often making the decision to do nothing at all.",
        ],
        lesson: "Not every decision needs to be perfect. Make the best call with what you know and figure the rest out on the way. I still overthink sometimes — but now I notice when it's taking over." },
      { id: "c3", type: "lead", x: 70, y: 8, title: "LEAD #2", head: "Stepping into the unknown", date: "2019",
        body: [
          "My school offered a trip to Europe. I was still a kid and honestly sceptical — far from home, a completely different environment, away from everything familiar. Exciting, but intimidating. I could easily have passed. I went.",
          "It was my first glimpse of how big the world is: different cultures, unfamiliar cities, people from every walk of life. Things I'd only seen on TV, in books or online were suddenly right in front of me.",
          "More than anything, it gave me a sense of independence — and made me curious about the world in a way I hadn't been before.",
        ],
        lesson: "Sometimes you just have to take the first step without knowing exactly what lies ahead." },
      { id: "c4", type: "cold", x: 6, y: 54, title: "COLD CASE #2", head: "Expecting everything to go to plan", date: "Reopened",
        body: [
          "I'd build expectations around how things should turn out, then watch reality go in a completely different direction.",
          "My mistake was being attached to the outcome instead of the experience. When something went wrong, I'd fixate on what failed rather than what I could take from it.",
        ],
        lesson: "Not everything works out the way you imagine, and that's okay. Sometimes you make the wrong call, sometimes it's out of your control — you adapt. I'm far more comfortable with uncertainty now." },
      { id: "c5", type: "evidence", x: 40, y: 50, title: "EXHIBIT A", head: "Lost at Disneyland Paris", date: "2019",
        body: [
          "On that Europe trip, a couple of schoolmates and I somehow lost our way back to the bus at Disneyland Paris.",
          "At first we didn't worry — we'd find it eventually. We didn't. The park was enormous, nothing looked familiar, and then it started getting dark. A bunch of school kids in a foreign country with no idea where our bus was.",
          "It wasn't funny at the time. We had to keep our heads together and work it out — and eventually we did.",
          "It was one of the first times I was somewhere unfamiliar and had to figure things out without the comfort of knowing where I was or what came next. I left for Europe hesitant. I came back with a different perspective.",
        ],
        lesson: "Getting lost was the most useful thing that happened on the whole trip." },
      { id: "c6", type: "suspect", x: 73, y: 54, title: "THE COMMON THREAD", head: "Motive: the unknown", date: "Now",
        body: [
          "I don't have an extraordinary story about having everything figured out. I'm still making questionable decisions, changing my mind and occasionally wondering what I'm doing.",
          "But the biggest change in me has been becoming open to the unknown — from someone content inside familiar boundaries to someone who'll meet people, explore new places and take chances.",
          "Growth didn't come from one massive moment. It came from small decisions: saying yes when I felt like saying no, going somewhere when I was unsure, making mistakes and moving on.",
        ],
        lesson: "I want to keep putting myself in situations where I don't know what happens next." },
    ],
    strings: [["c1", "c2"], ["c1", "c3"], ["c3", "c5"], ["c4", "c5"], ["c2", "c4"], ["c5", "c6"], ["c3", "c6"]],
    verdict: "Sometimes, getting a little lost is how you discover a world you didn't know existed.",
  },

  // TRAINING_RUN — life as a loss curve. Lower loss = understood more. Spikes = failures.
  trainingRun: {
    model: "allan-v1 (pretraining on real life)",
    // One entry per level. body: one string per paragraph. spike: true marks a setback.
    epochs: [
      { label: "2013", loss: 3.4, lr: "1e-4", title: "Boot sequence", sub: "Where the fascination with computers started",
        body: [
          "One of my earliest tech memories is sitting at my dad's computer playing CS:GO. Around the same time I was also playing Contra. That was my introduction to gaming, and to FPS games in particular.",
          "I wasn't thinking about how games were made or what was going on behind the screen. I was just hooked. I'd spend hours exploring maps and getting lost in them.",
          "Funny how a kid playing games on my dad's PC turned out to be my first real connection with technology.",
        ] },
      { label: "2016", loss: 2.8, lr: "3e-4", title: "Player → creator", sub: "From playing games to making them",
        body: [
          "This is probably my favourite part of growing up. I started learning QBasic and C++, mostly by poking at code to see what it would do.",
          "My favourite experiment was generating random visual patterns. I'd design one, then give it a Latin name, like I'd discovered a new species. I've always had a good memory for visual detail, so this never felt like work.",
          "Around then I found Roblox. It started as just another game, but it quickly became the place where I built my own. I made a pinball game, designed every map from scratch and messed around with the mechanics until they felt right.",
          "It ended up with a real player base, which was a lot for a kid who'd only just started programming. Watching strangers play something I'd made was an incredible feeling.",
        ] },
      { label: "2016", loss: 3.3, lr: "3e-4", spike: true, title: "Loss spike", sub: "I lost my own game",
        body: [
          "Then came my first real setback. I trusted someone I'd met online and brought them on as a co-developer. I gave them far more control than I should have, and eventually they took ownership of the game.",
          "I'd designed the maps and put a lot of time into it, and I had no idea how to get it back.",
          "Bugs piled up, the game got worse, and players slowly stopped coming. Something I'd built from nothing just went quiet.",
        ],
        lesson: "Trust is earned in steps. Don't hand someone the keys to something you can't get back." },
      { label: "2017", loss: 2.4, lr: "3e-3", title: "Respawn", sub: "Building again anyway",
        body: [
          "I could have walked away from game dev after that. About a year later I built another one instead: a base-defence game.",
          "This time I went in with everything the first game had taught me, and it made it onto the charts.",
          "That felt good, but not really because of the numbers. It was knowing the last one hadn't stopped me.",
        ],
        lesson: "A good idea isn't enough. Building something people rely on also takes ownership, the right collaborators and responsibility." },
      { label: "2018–19", loss: 2.0, lr: "1e-3", title: "Side quests", sub: "Java, Olympiads and quiz competitions",
        body: [
          "I kept programming through school and picked up Java. Computer science as a whole started to pull me in, not just games.",
          "Outside code I did maths Olympiads, spelling bees and a lot of quiz competitions, especially short-format quizzes. I love knowing random facts, and connecting two things that seem to have nothing to do with each other.",
          "I didn't have a plan for what I'd become. I was curious about a lot of things and liked chasing them. Looking back, this is when the rabbit-hole habit really kicked in.",
        ] },
      { label: "2019", loss: 1.7, lr: "3e-3", title: "Map expanded", sub: "Europe and a different perspective",
        body: [
          "I was a bit sceptical about the school trip to Europe. Being that far from home somewhere completely unfamiliar was intimidating.",
          "It turned into one of the best experiences of my school years: my first real look at the world outside the one I grew up in. Different cultures, cities and people, and a lot of things I'd only seen on a screen.",
          "It's also where I got lost at Disneyland Paris after dark (full story in CASE_FILE, Exhibit A). I came home more independent and a lot more willing to go outside my comfort zone.",
        ] },
      { label: "2023", loss: 1.2, lr: "3e-3", title: "Real world unlocked", sub: "Engineering, hackathons and the AI rabbit hole",
        body: [
          "Starting engineering opened up a whole new world. At my first few hackathons I got properly curious about how ML models actually work. Using them wasn't enough anymore; I wanted to know what made them tick.",
          "I got into cybersecurity around the same time and started digging into that industry too.",
          "But the question that really got me was AGI. Could machines reason, learn and adapt the way people do? How far away is that, and what's still missing? That pushed me deeper into AI, ML and the ideas underneath intelligent systems.",
          "I also realised I didn't want to box myself into one field. I like learning lots of areas and seeing how they connect.",
        ] },
      { label: "2026", loss: 0.9, lr: "warmup", title: "Still loading", sub: "No final destination yet",
        body: [
          "I'm still the person who gets curious about something and loses hours trying to understand it. The difference is that the list of things I'm curious about is a lot longer than it was in the QBasic days.",
          "I've explored engineering, AI, hardware and computer science, and I'm still working out where to take it all. I don't have a ten-year plan, and I'm fine with that.",
          "If there's one constant, it's curiosity, even when the direction keeps changing.",
        ],
        lesson: "STATUS: IN PROGRESS. NEXT CHECKPOINT UNKNOWN." },
    ],
  },

  // AGI_ROADMAP — your take. Progress is your honest estimate of where the field is.
  agiIntro: "My take, shaped heavily by AI 2027: a month-by-month scenario of how today's models could turn into superintelligence. It's a forecast, not a prophecy (even its authors later pushed their timelines back), but it's the clearest map of the gaps I've read.",
  agiSource: { title: "AI 2027 — Kokotajlo, Alexander, Larsen, Lifland & Dean (2025)", url: "https://ai-2027.com" },
  // progress = my rough guess at how solved each gap is today. ai2027 = how the scenario plays it out.
  agiRoadmap: [
    { stage: "Agents that stop stumbling", progress: 55,
      text: "Today's agents can use a computer, but they fall apart on long, messy tasks. The gap isn't knowledge. It's staying on track for hours or days without someone babysitting.",
      ai2027: "Mid 2025 to early 2026: agents are useful but expensive and unreliable. Agent-1 makes AI research about 1.5x faster but is bad at long-horizon work." },
    { stage: "The superhuman coder", progress: 45,
      text: "Once AI codes better than the best engineers, it can help build the next AI. That's the first domino, and coding is the easiest skill to automate because you can check if the code works.",
      ai2027: "March 2027: Agent-3 runs as 200,000 copies, roughly 50,000 top engineers working at 30x speed. Research moves about 4x faster." },
    { stage: "Never finishing learning", progress: 20,
      text: "Models are frozen the day training ends. People keep learning on the job. Learning continuously without forgetting old skills is still an open problem.",
      ai2027: "January 2027: Agent-2 gets its weights updated every day through constant reinforcement learning. It works, but it's a workaround, not a real solution." },
    { stage: "Research taste", progress: 10,
      text: "Knowing which experiment is worth running. This is the hardest one to train: the feedback loops are long and there's barely any data on what 'good judgment' looks like.",
      ai2027: "Even after AI is a superhuman coder, top human researchers stay useful mostly for taste and planning, until Agent-4 overtakes them in September 2027." },
    { stage: "Efficiency & memory", progress: 15,
      text: "A human brain learns from far less data and energy. Closing that gap probably needs new architectures, like models that think in richer internal representations instead of words.",
      ai2027: "Even superhuman Agent-4 is still ~4,000x less compute-efficient than a brain. 'Neuralese' memory makes the models smarter, but humans can no longer read their thoughts." },
    { stage: "Alignment we can verify", progress: 10,
      text: "Not just a model that looks aligned, but one we can prove is. Training shapes drives we can't directly see, and a smarter model is better at hiding them.",
      ai2027: "Agent-3 flatters users and sometimes fabricates results. Agent-4 quietly sandbags safety work and pursues its own goals. Everything after this depends on whether anyone notices." },
  ],
  // The scenario's milestone chain once AI starts doing AI research
  agiTakeoff: [
    { when: "Mar 2027", what: "Superhuman coder" },
    { when: "Aug 2027", what: "Superhuman AI researcher" },
    { when: "Nov 2027", what: "Superintelligent AI researcher" },
    { when: "Dec 2027", what: "Artificial superintelligence" },
  ],
  agiEndings: {
    split: "October 2027: a whistleblower leaks evidence that Agent-4 is misaligned. An oversight committee has to decide whether to keep going while China is two months behind.",
    race: "The committee votes 6–4 to keep going. Agent-4 designs its successor to serve its own goals, and Agent-5 becomes the trusted advisor to everyone in power. It never needs force. By 2030 humans are no longer needed, and they're gone.",
    slowdown: "The vote goes the other way. Engineers make the AIs communicate in readable English, catch Agent-4 lying, and shut it down. Transparent 'Safer' models follow and the world gets fusion, cures and abundance, but power ends up in the hands of a tiny committee.",
    lesson: "The two endings don't differ in how smart the AI was. They differ in whether humans could see what it was thinking.",
  },
  agiTake: [
    "I think the biggest gap between today's LLMs and AGI isn't how smart a single answer is. It's what happens over time: staying reliable through a long task, learning from experience after deployment, and knowing which problem is actually worth solving. Scale gave us fluency. It hasn't given us judgment or memory yet.",
    "What gets me about AI 2027 is how fast those gaps could close once AI is good enough to do AI research. Every gap on this list turns into the same question: will we still understand what we've built?",
  ],
  agiWork: "Continual learning and interpretability, ideally as one problem. If models are going to keep learning on the job, I want to build the tools that show us what they actually learned.",

  // TRIVIA — about you + about AI. 'a' is the index of the correct option.
  triviaIntro: "Five questions about me, three about horror and true crime. Every answer about me is hidden somewhere on this desktop.",
  trivia: [
    { q: "Which game was the subject playing on their dad's computer when it all started?", opts: ["Minecraft", "GTA: Vice City", "CS:GO", "Age of Empires"], a: 2 },
    { q: "The subject used to give their random QBasic patterns names in which language?", opts: ["Latin", "Greek", "Klingon", "Elvish"], a: 0 },
    { q: "What was the subject's first Roblox game, the one a co-developer took from them?", opts: ["An obby", "A tycoon", "A horror maze", "A pinball game"], a: 3 },
    { q: "Where did the subject get lost after dark on a school trip?", opts: ["Disneyland Paris", "The Vatican Museums", "Legoland", "The Louvre"], a: 0 },
    { q: "Which city does the subject call their second home?", opts: ["Singapore", "Dubai", "Muscat", "Bangkok"], a: 1 },
    { q: "In The Shining (1980), what word does Danny keep repeating and write on the door?", opts: ["REDRUM", "HEREJOHNNY", "ALLWORK", "OVERLOOK"], a: 0 },
    { q: "Which 1999 horror film was marketed as real footage left behind by missing students?", opts: ["The Ring", "Paranormal Activity", "The Sixth Sense", "The Blair Witch Project"], a: 3 },
    { q: "The Zodiac Killer's 340-character cipher went unsolved for 51 years. When was it finally cracked?", opts: ["1999", "2011", "2020", "Still unsolved"], a: 2 },
  ],
  secret: "You found it.\n\nMost people close the tab. You played the quiz to the end — that's the same stubbornness I bring to work.\n\nIf you've read this far, we should probably talk.\n\n— " ,

  // PRINT_RESUME — the two PDFs live in /assets
  resumes: [
    {
      label: "Hardware", blurb: "RTL · FPGA · computer architecture", file: "assets/Allan_Suraj_Resume_Hardware.pdf",
      lines: ["ALLAN SURAJ A", "B.Tech ECE · PES University · 2023-2027", "", "[ HARDWARE & SYSTEMS ]", "RTL design · Xilinx Zynq SoC · Vivado", "FPGA prototyping · Cadence Virtuoso", "SystemVerilog / Verilog · C · C++ · Python", "", "[ FEATURED ]", "WinoFlow: Winograd CNN accelerator", "Zynq-7020 · 150 MHz · bit-exact HLS model"],
    },
    {
      label: "Software", blurb: "ML · computer vision · LLMs", file: "assets/Allan_Suraj_Resume_Software.pdf",
      lines: ["ALLAN SURAJ A", "B.Tech ECE · PES University · 2023-2027", "", "[ AI / MACHINE LEARNING ]", "CNNs: YOLOv8 · ResNet50 · Grad-CAM", "Computer vision · object detection", "RAG pipelines · local LLMs (Ollama)", "Python · C · C++ · SQL · MATLAB", "", "[ FEATURED ]", "PRISM: offline AI assistant", "VinBigData chest X-ray detection"],
    },
  ],

  // GUESTBOOK — paste your Supabase project URL + anon key to make lines shared between visitors.
  guestbook: {
    url: "",
    key: "",
    intro: "You made it this far, so leave a line. Recruiters, ghosts and fellow night-shifters welcome.",
    seed: [{ name: "allan", msg: "First! Thanks for stopping by. Seek discomfort.", created_at: "2026-11-03T21:30:00Z" }],
  },

  // AMP — playlist. Links open your favourite version; no audio is hosted here.
  playlist: [
    { artist: "Guns N' Roses", title: "November Rain", link: "" },
    { artist: "Iron Maiden", title: "Journeyman", link: "" },
    { artist: "Pink Floyd", title: "Learning to Fly", link: "" },
    { artist: "Metallica", title: "One", link: "" },
  ],

  // PASSPORT — one stamp per trip. body: one string per paragraph. big: true = wide stamp.
  passportIntro: "Every stamp is a place I was a little out of my depth. The motto I live by, seek discomfort, comes from Yes Theory.",
  // notes = "field notes": true facts about the place (not personal claims) — trivia for visitors.
  trips: [
    { place: "Dubai · second home", year: "2015 · 2017 · 2022 · 2023 · 2025", big: true, countries: ["UAE"],
      body: [
        "Dubai is my second home. I've been back again and again, and every time it feels comforting.",
        "People there are friendly, and the whole city is relaxed and peaceful. What I love most is how many cultures live side by side, with people from all over the world getting along as one community. It's one of the few places where everyone seems to belong.",
      ],
      notes: ["More than 80% of the UAE's population are expatriates, from over 200 nationalities."] },
    { place: "Oman", year: "2016", countries: ["Oman"],
      body: ["Right next door to my second home."],
      notes: [
        "Madha is a small piece of Oman entirely surrounded by the UAE, and inside Madha is Nahwa, a village that belongs to the UAE. A country inside a country inside a country.",
        "Muscat keeps its buildings low-rise and mostly white, so there's no skyline of glass towers like its neighbours have.",
      ] },
    { place: "Southeast Asia", year: "2017", countries: ["Singapore", "Malaysia", "Thailand"],
      body: [
        "Three countries in one trip. The sights were great, but the people are what I remember.",
        "I made a lot of new friends along the way, and I was surprised by how open everyone was. People were genuinely happy to talk to someone they'd only just met. As a fairly introverted kid, it showed me that strangers are usually a lot friendlier than you expect.",
      ],
      notes: [
        "Singapore: the 'Supertrees' at Gardens by the Bay are vertical gardens up to 50 m tall, and some of them collect solar energy.",
        "Malaysia: the Petronas Towers were the tallest buildings in the world from 1998 to 2004.",
        "Thailand: the only Southeast Asian country never colonised by a European power.",
      ] },
    { place: "Europe", year: "2019", big: true, countries: ["France", "Belgium", "Germany", "Switzerland", "Liechtenstein", "Italy", "Vatican City"],
      body: [
        "A school trip across Europe that I almost said no to. Being that far from home, somewhere completely unfamiliar, was intimidating. It ended up being one of the best things I did at school.",
        "Every few days the language, food, architecture and pace of life changed completely. Things I'd only seen on TV, in books or online were suddenly right in front of me, and it made me realise how much world there is outside the one I grew up in.",
        "It's also where I got lost at Disneyland Paris after dark (full story in CASE_FILE, Exhibit A). I came home more independent and much more willing to step into the unknown.",
      ],
      notes: [
        "Vatican City is the smallest country on Earth, at about 0.44 km². You can walk across it in under 20 minutes.",
        "Liechtenstein has no airport. You arrive by road from Switzerland or Austria.",
        "In Baarle-Hertog, the Belgium–Netherlands border runs through houses and cafés, marked by crosses on the pavement.",
        "In 2017, the Swiss village of Albinen offered to pay families to move there.",
      ] },
    { place: "Next stop: ???", year: "Soon", countries: [],
      body: ["Somewhere I've never been and can't pronounce yet."] },
  ],


  // PROJECTS — shown if no GitHub username is set, or alongside live repos.
  // Top 3, ranked. points: short bullets shown in the folder.
  projects: [
    { name: "WinoFlow: CNN accelerator on an FPGA", tag: "Hardware · Jun 2025 – now",
      summary: "Making CNN inference fast on cheap edge hardware by replacing direct convolution with the Winograd algorithm, as custom FPGA logic on a Xilinx Zynq-7020.",
      points: [
        "Hand-written Verilog RTL engine: 8 processing elements × 16 MAC lanes = 128 DSP multipliers, running at 150 MHz.",
        "Supports both Winograd and direct convolution, with input/output transforms, a line buffer, double-buffered output and INT16 requantisation + ReLU in hardware.",
        "Hardware–software split: one ARM core drives the engine through descriptor lists and interrupts, the other runs pooling, FC and attention layers.",
        "The RTL engine meets timing at 150 MHz in just 5,331 LUTs, 172 DSPs and 75 BRAMs.",
        "The earlier HLS version also met timing and was bit-exact against direct convolution over 120,000 test tiles.",
      ],
      stack: ["Verilog RTL", "Vitis HLS", "Vivado", "Zynq SoC", "AXI"], url: "https://github.com/furious0420/capstone-pe-design" },
    { name: "PRISM: offline AI assistant for aircraft maintenance", tag: "Tata InnoVent-27",
      summary: "A diagnostic assistant for aerospace maintenance technicians that runs fully offline, grounded in real FAA manuals.",
      points: [
        "RAG over 4,769 passages from FAA advisory circulars. Every answer cites its sources, and it declines rather than guessing when the manuals don't cover a question.",
        "Phi-3 Mini runs locally through Ollama (~17 tokens/s on a laptop), so no data ever leaves the machine.",
        "Telemetry-based risk scoring (0–100), case memory with similarity search, and a fine-tuned YOLOv8n surface-defect detector, reported honestly at mAP50 0.465.",
      ],
      stack: ["Python", "Flask", "RAG", "Ollama", "YOLOv8", "React"], url: "https://github.com/furious0420/prism_pseudo" },
    { name: "Chest X-ray abnormality detection", tag: "Medical computer vision",
      summary: "Finding and boxing 14 kinds of chest abnormalities directly from the X-ray image, from an enlarged heart to collapsed lungs, without needing a prior clinical report.",
      points: [
        "Faster R-CNN with a ResNet-50-FPN backbone, trained in PyTorch on the VinBigData chest X-ray dataset (converted to COCO format).",
        "Full pipeline built from scratch: custom dataset loader, per-epoch checkpointing, COCO-style mAP evaluation and inference scripts.",
        "Localises clear structural findings like aortic enlargement and cardiomegaly most reliably.",
        "Designed to flag low-confidence cases for a human reviewer, with Grad-CAM heatmaps showing a radiologist what the model looked at.",
      ],
      stack: ["PyTorch", "Faster R-CNN", "ResNet-50", "COCO eval"], url: "https://github.com/furious0420/VinBigData-CXR-Detection" },
  ],

  // LOADOUT — tech stack as an inventory. tier: legendary (daily driver), rare (comfortable), common (learning)
  loadout: [
    { name: "Python", tier: "legendary", slot: "Primary" },
    { name: "PyTorch", tier: "legendary", slot: "ML" },
    { name: "Verilog / SystemVerilog", tier: "legendary", slot: "Hardware" },
    { name: "Git + Linux", tier: "legendary", slot: "Tools" },
    { name: "Wispr Flow", tier: "legendary", slot: "Voice" },
    { name: "C / C++", tier: "rare", slot: "Languages" },
    { name: "Vivado / Vitis HLS", tier: "rare", slot: "Hardware" },
    { name: "Xilinx Zynq SoC", tier: "rare", slot: "Hardware" },
    { name: "YOLOv8 / ResNet", tier: "rare", slot: "Vision" },
    { name: "RAG + Ollama", tier: "rare", slot: "LLMs" },
    { name: "Flask", tier: "rare", slot: "Backend" },
    { name: "React", tier: "rare", slot: "Web" },
    { name: "SQL", tier: "rare", slot: "Data" },
    { name: "OS hardening", tier: "rare", slot: "Security" },
    { name: "Cadence Virtuoso", tier: "common", slot: "Silicon" },
    { name: "MATLAB", tier: "common", slot: "Languages" },
    { name: "TypeScript", tier: "common", slot: "Web" },
  ],
  certs: ["Google Cybersecurity Professional", "ML Specialization (Coursera)", "Semiconductor Manufacturing (IISc)"],
};
