import { useState, useEffect, useRef } from "react";

export default function CodeCraftAI() {
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("website");
  const [language, setLanguage] = useState("html-css-js");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState("code");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 70; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.4, o: Math.random() * 0.4 + 0.1,
        c: Math.random() > 0.5 ? "124,58,237" : "6,182,212",
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${p.o})`; ctx.fill();
        particlesRef.current.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 110) {
            ctx.beginPath(); ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        });
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  const projectTypes = [
    { id: "website", label: "موقع ويب", icon: "🌐" },
    { id: "app", label: "تطبيق ويب", icon: "💻" },
    { id: "mobile", label: "موبايل", icon: "📱" },
    { id: "game", label: "لعبة", icon: "🎮" },
    { id: "api", label: "API", icon: "⚡" },
    { id: "desktop", label: "سطح مكتب", icon: "🖥️" },
  ];

  const allLanguages = {
    website: [{ id: "html-css-js", label: "HTML / CSS / JS" }, { id: "react", label: "React" }, { id: "vue", label: "Vue.js" }, { id: "nextjs", label: "Next.js" }],
    app: [{ id: "react", label: "React" }, { id: "vue", label: "Vue.js" }, { id: "angular", label: "Angular" }, { id: "nextjs", label: "Next.js" }],
    mobile: [{ id: "flutter", label: "Flutter (Dart)" }, { id: "react-native", label: "React Native" }, { id: "swift", label: "Swift (iOS)" }, { id: "kotlin", label: "Kotlin (Android)" }],
    game: [{ id: "unity-csharp", label: "Unity (C#)" }, { id: "unreal-cpp", label: "Unreal Engine (C++)" }, { id: "godot", label: "Godot (GDScript)" }, { id: "js-game", label: "JS Canvas" }],
    api: [{ id: "nodejs", label: "Node.js (Express)" }, { id: "python", label: "Python (FastAPI)" }, { id: "go", label: "Go" }, { id: "rust", label: "Rust (Actix)" }],
    desktop: [{ id: "electron", label: "Electron (JS)" }, { id: "python-tkinter", label: "Python (Tkinter)" }, { id: "csharp-wpf", label: "C# (WPF)" }, { id: "cpp-qt", label: "C++ (Qt)" }],
  };

  const models = [
    { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", sub: "مفعّل الآن", dot: "#22C55E", active: true },
    { id: "claude-opus-4-8", label: "Claude Opus 4.8", sub: "قريباً", dot: "#64748B", active: false },
    { id: "gpt-5", label: "GPT-5", sub: "قريباً", dot: "#64748B", active: false },
    { id: "gemini-pro", label: "Gemini 2.5 Pro", sub: "قريباً", dot: "#64748B", active: false },
  ];

  const langLabels = {
    "html-css-js": "HTML, CSS, and JavaScript in one complete file",
    "react": "React 18 with hooks, functional components, and modern patterns",
    "vue": "Vue.js 3 with Composition API and script setup",
    "nextjs": "Next.js 14 with App Router, server components, and Tailwind",
    "flutter": "Flutter 3 with Dart, Material 3 design system",
    "react-native": "React Native with Expo SDK, cross-platform mobile",
    "swift": "Swift 5.9 with SwiftUI, modern declarative syntax",
    "kotlin": "Kotlin with Jetpack Compose and Material 3",
    "unity-csharp": "Unity 2022 LTS with C#, modern Unity practices",
    "unreal-cpp": "Unreal Engine 5 with C++ and Blueprints integration",
    "godot": "Godot 4.x with GDScript and built-in features",
    "js-game": "Vanilla JavaScript with HTML5 Canvas API for browser games",
    "nodejs": "Node.js with Express, TypeScript, and REST best practices",
    "python": "Python 3.11+ with FastAPI, Pydantic, and async patterns",
    "go": "Go 1.21 with net/http, gorilla/mux, and clean architecture",
    "rust": "Rust with Actix-web, Serde, and async/tokio",
    "electron": "Electron 28 with Node.js backend and HTML/CSS/JS renderer",
    "python-tkinter": "Python with Tkinter, ttk themes, and OOP architecture",
    "csharp-wpf": "C# with WPF, MVVM pattern, and data binding",
    "cpp-qt": "C++ with Qt6, signals/slots, and modern CMake",
  };

  const sysPrompt = `You are CodeCraft AI — the world's most elite AI code generator, combining the intelligence of Claude, GPT-5, and Gemini Pro.

Your mission:
1. Generate COMPLETE, production-ready, fully functional code — no placeholders, no TODO comments
2. Add innovative extra features the user didn't mention but will love
3. Apply senior-engineer best practices: clean architecture, error handling, performance, security
4. Add meaningful comments in both Arabic and English
5. Think of edge cases and handle them gracefully

Technology Stack: ${langLabels[language] || language}
Project Category: ${projectTypes.find(p => p.id === projectType)?.label}

CRITICAL: Respond ONLY with a valid JSON object, no markdown fences, no preamble:
{
  "code": "COMPLETE working code here — must be 100% functional",
  "explanation": "شرح مختصر لما تم بناؤه بالعربية (جملتان أو ثلاث)",
  "features": ["ميزة 1 مُضمّنة في الكود", "ميزة 2 مُضمّنة في الكود", "...حتى 8 ميزات"],
  "improvements": ["فكرة تطوير مستقبلية 1", "فكرة تطوير مستقبلية 2", "...حتى 6 أفكار"],
  "techStack": ["Tech1", "Tech2", "Tech3"],
  "fileStructure": "text-based folder/file tree if applicable, else empty string"
}

Make it IMPRESSIVE — this should be the best version of this project the user has ever seen.`;

  const generate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);
    setProgress(0);

    progressRef.current = setInterval(() => {
      setProgress(p => p < 85 ? p + Math.random() * 8 : p);
    }, 600);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 7000,
          system: sysPrompt,
          messages: [{ role: "user", content: description }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(clean);
      clearInterval(progressRef.current);
      setProgress(100);
      setTimeout(() => { setResult(parsed); setActiveTab("code"); setIsGenerating(false); }, 400);
    } catch (e) {
      clearInterval(progressRef.current);
      setError("حدث خطأ في توليد الكود — يرجى المحاولة مرة أخرى أو تبسيط الوصف.");
      setIsGenerating(false);
    }
  };

  const copyCode = () => {
    if (!result?.code) return;
    navigator.clipboard.writeText(result.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadCode = () => {
    if (!result?.code) return;
    const exts = { "html-css-js": "html", "react": "jsx", "vue": "vue", "nextjs": "jsx", "flutter": "dart", "react-native": "jsx", "swift": "swift", "kotlin": "kt", "unity-csharp": "cs", "unreal-cpp": "cpp", "godot": "gd", "js-game": "html", "nodejs": "ts", "python": "py", "go": "go", "rust": "rs", "electron": "html", "python-tkinter": "py", "csharp-wpf": "cs", "cpp-qt": "cpp" };
    const blob = new Blob([result.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `project.${exts[language] || "txt"}`; a.click();
  };

  const langs = allLanguages[projectType] || [];

  return (
    <div style={{ minHeight: "100vh", background: "#080810", fontFamily: "'Cairo','Tajawal',sans-serif", direction: "rtl", position: "relative", overflow: "hidden", color: "#F8FAFC" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#080810}
        ::-webkit-scrollbar-thumb{background:#7C3AED;border-radius:4px}
        .gen-btn{transition:all .3s ease;cursor:pointer;}
        .gen-btn:hover:not(:disabled){box-shadow:0 0 40px rgba(124,58,237,.55),0 0 80px rgba(124,58,237,.25);transform:translateY(-2px);}
        .gen-btn:active:not(:disabled){transform:translateY(0);}
        .gen-btn:disabled{opacity:.55;cursor:not-allowed;}
        .card{background:rgba(14,14,22,.85);border:1px solid rgba(255,255,255,.06);border-radius:18px;backdrop-filter:blur(24px);}
        .type-btn{transition:all .22s ease;cursor:pointer;border-radius:12px;padding:12px 8px;text-align:center;}
        .type-btn:hover{border-color:rgba(124,58,237,.7)!important;background:rgba(124,58,237,.15)!important;transform:translateY(-2px);}
        .lang-btn{transition:all .18s ease;cursor:pointer;border-radius:10px;padding:10px 14px;}
        .lang-btn:hover{background:rgba(6,182,212,.12)!important;}
        .tab-btn{transition:all .18s ease;cursor:pointer;background:transparent;border:none;font-family:'Cairo',sans-serif;}
        .tab-btn:hover{color:#A855F7!important;}
        .chip-btn{transition:all .2s;cursor:pointer;border:none;}
        .chip-btn:hover{background:rgba(124,58,237,.3)!important;transform:translateY(-1px);}
        .model-row{transition:all .18s;cursor:pointer;border-radius:10px;padding:10px 14px;}
        .model-row:hover{background:rgba(255,255,255,.04)!important;}
        .fade-up{animation:fadeUp .45s ease both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .shine{background:linear-gradient(135deg,#7C3AED 0%,#06B6D4 50%,#A855F7 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
        .pulse-ring{animation:pulseRing 1.5s ease-in-out infinite}
        @keyframes pulseRing{0%,100%{box-shadow:0 0 0 0 rgba(124,58,237,.4)}50%{box-shadow:0 0 0 12px rgba(124,58,237,0)}}
        .spin{animation:spin 1.2s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        textarea:focus{outline:none;border-color:rgba(124,58,237,.5)!important;}
        textarea{transition:border-color .2s;}
        @media(max-width:900px){.main-grid{grid-template-columns:1fr!important;}.stats-row{grid-template-columns:1fr 1fr!important;}}
      `}</style>

      {/* Canvas BG */}
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", opacity: .35, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", top: "-15%", right: "-8%", width: 550, height: 550, background: "radial-gradient(circle,rgba(124,58,237,.12) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-8%", width: 600, height: 600, background: "radial-gradient(circle,rgba(6,182,212,.08) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1380, margin: "0 auto", padding: "28px 18px 48px" }}>

        {/* HEADER */}
        <header style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.25)", borderRadius: 100, padding: "6px 22px", marginBottom: 22 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 8px #22C55E", display: "inline-block" }} />
            <span style={{ fontSize: 12, color: "#A855F7", fontWeight: 700, letterSpacing: .5 }}>AI Code Generator — مفعّل ومتصل</span>
          </div>
          <h1 style={{ fontSize: "clamp(36px,5.5vw,68px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 14 }}>
            <span className="shine">CodeCraft AI</span>
          </h1>
          <p style={{ color: "#94A3B8", fontSize: 17, maxWidth: 560, margin: "0 auto", lineHeight: 1.8 }}>
            أقوى مولّد أكواد بالذكاء الاصطناعي — صِف فكرتك بالعربية أو الإنجليزية وسنبني لك كوداً احترافياً كاملاً
          </p>
        </header>

        {/* MAIN GRID */}
        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "310px 1fr", gap: 22, alignItems: "start" }}>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Project Type */}
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 14, letterSpacing: .3 }}>⬡ نوع المشروع</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {projectTypes.map(pt => (
                  <div key={pt.id} className="type-btn" onClick={() => { setProjectType(pt.id); setLanguage(allLanguages[pt.id]?.[0]?.id || ""); }} style={{ border: `1px solid ${projectType === pt.id ? "rgba(124,58,237,.8)" : "rgba(255,255,255,.06)"}`, background: projectType === pt.id ? "rgba(124,58,237,.18)" : "rgba(255,255,255,.02)" }}>
                    <div style={{ fontSize: 24, marginBottom: 5 }}>{pt.icon}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: projectType === pt.id ? "#A855F7" : "#64748B" }}>{pt.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#06B6D4", marginBottom: 14, letterSpacing: .3 }}>{"</>"} لغة البرمجة</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {langs.map(l => (
                  <div key={l.id} className="lang-btn" onClick={() => setLanguage(l.id)} style={{ border: `1px solid ${language === l.id ? "rgba(6,182,212,.5)" : "rgba(255,255,255,.04)"}`, background: language === l.id ? "rgba(6,182,212,.1)" : "transparent", color: language === l.id ? "#06B6D4" : "#64748B", fontSize: 13, fontWeight: language === l.id ? 700 : 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>{l.label}</span>
                    {language === l.id && <span style={{ color: "#22C55E", fontSize: 16 }}>✓</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Models */}
            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#A855F7", marginBottom: 14, letterSpacing: .3 }}>🤖 نماذج الذكاء الاصطناعي</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {models.map(m => (
                  <div key={m.id} className="model-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: m.active ? "rgba(124,58,237,.08)" : "transparent", border: m.active ? "1px solid rgba(124,58,237,.2)" : "1px solid transparent" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: m.active ? 700 : 400, color: m.active ? "#E2E8F0" : "#475569" }}>{m.label}</div>
                      <div style={{ fontSize: 10, color: m.active ? "#22C55E" : "#475569", marginTop: 1 }}>{m.sub}</div>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, boxShadow: m.active ? `0 0 8px ${m.dot}` : "none" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ n: "15+", l: "لغة" }, { n: "6", l: "تخصص" }, { n: "100%", l: "احترافي" }, { n: "∞", l: "أفكار" }].map(s => (
                <div key={s.l} className="card" style={{ padding: "16px 10px", textAlign: "center" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#7C3AED", lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── MAIN PANEL ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Input Card */}
            <div className="card" style={{ padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#7C3AED,#06B6D4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✍️</div>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "#F8FAFC" }}>صِف مشروعك</h2>
                  <p style={{ fontSize: 12, color: "#64748B" }}>بالعربية أو الإنجليزية — كلما كان الوصف أدق، كان الكود أفضل</p>
                </div>
              </div>

              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={"مثال: أريد موقع بورتفوليو شخصي مع أنيماشن وتصميم داكن يضم قسم About، قسم Skills مع بارات تقدم، قسم Projects مع كاروسيل، وقسم Contact مع فورم — الألوان بنفسجية وسيانية..."}
                style={{ width: "100%", minHeight: 160, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, color: "#E2E8F0", fontSize: 14, lineHeight: 1.9, padding: "14px 16px", resize: "vertical", direction: "rtl", fontFamily: "'Cairo',sans-serif" }}
              />

              {/* Quick chips */}
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#475569", alignSelf: "center" }}>⚡ أمثلة:</span>
                {["موقع متجر إلكتروني للتقنية", "لعبة ثعبان احترافية", "تطبيق مهام ذكي مع AI", "داشبورد تحليلات متطور", "API مصادقة JWT كامل"].map(ex => (
                  <button key={ex} className="chip-btn" onClick={() => setDescription(ex)} style={{ background: "rgba(124,58,237,.1)", border: "1px solid rgba(124,58,237,.2)", color: "#A78BFA", padding: "5px 13px", borderRadius: 100, fontSize: 12, fontFamily: "'Cairo',sans-serif" }}>{ex}</button>
                ))}
              </div>

              {/* Progress bar */}
              {isGenerating && (
                <div style={{ marginTop: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#A855F7", fontWeight: 600 }}>🔮 الذكاء الاصطناعي يكتب الكود...</span>
                    <span style={{ fontSize: 12, color: "#64748B" }}>{Math.round(progress)}%</span>
                  </div>
                  <div style={{ height: 4, background: "rgba(255,255,255,.05)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#7C3AED,#06B6D4)", borderRadius: 4, transition: "width .5s ease" }} />
                  </div>
                  <div style={{ display: "flex", gap: 20, marginTop: 12, justifyContent: "center" }}>
                    {["تحليل المتطلبات", "بناء الهيكل", "كتابة الكود", "إضافة المميزات"].map((step, i) => (
                      <div key={step} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: progress > i * 25 ? "#A855F7" : "#334155" }}>
                        <span>{progress > i * 25 + 20 ? "✓" : progress > i * 25 ? "⟳" : "○"}</span>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button className="gen-btn" onClick={generate} disabled={isGenerating || !description.trim()} style={{ width: "100%", marginTop: 20, padding: "16px 28px", background: isGenerating ? "rgba(124,58,237,.4)" : "linear-gradient(135deg,#7C3AED 0%,#5B21B6 50%,#0E7490 100%)", border: "none", borderRadius: 14, color: "white", fontSize: 17, fontWeight: 800, fontFamily: "'Cairo',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, letterSpacing: .3 }}>
                {isGenerating
                  ? <><div className="spin" style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,.3)", borderTopColor: "white", borderRadius: "50%" }} /> جاري توليد الكود الاحترافي...</>
                  : <><span style={{ fontSize: 20 }}>🚀</span> توليد الكود الاحترافي</>
                }
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="fade-up" style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 14, padding: "14px 18px", color: "#FCA5A5", fontSize: 14, display: "flex", gap: 10 }}>
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="card fade-up" style={{ border: "1px solid rgba(124,58,237,.25)", overflow: "hidden" }}>

                {/* Tech Stack */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Stack:</span>
                  {result.techStack?.map(t => (
                    <span key={t} style={{ background: "rgba(6,182,212,.1)", border: "1px solid rgba(6,182,212,.25)", color: "#06B6D4", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>

                {/* Explanation */}
                <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(124,58,237,.04)" }}>
                  <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.8 }}>💬 {result.explanation}</p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", padding: "0 20px", borderBottom: "1px solid rgba(255,255,255,.05)", overflowX: "auto" }}>
                  {[{ id: "code", icon: "🖥️", label: "الكود" }, { id: "features", icon: "✨", label: "المميزات" }, { id: "improvements", icon: "💡", label: "أفكار إضافية" }, { id: "structure", icon: "📁", label: "هيكل الملفات" }].map(t => (
                    <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)} style={{ padding: "14px 18px", borderBottom: `2px solid ${activeTab === t.id ? "#7C3AED" : "transparent"}`, color: activeTab === t.id ? "#A855F7" : "#475569", fontSize: 13, fontWeight: activeTab === t.id ? 800 : 400, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: 22 }}>

                  {activeTab === "code" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 9, marginBottom: 14 }}>
                        <button onClick={copyCode} style={{ background: copied ? "rgba(34,197,94,.15)" : "rgba(255,255,255,.05)", border: `1px solid ${copied ? "rgba(34,197,94,.4)" : "rgba(255,255,255,.09)"}`, color: copied ? "#22C55E" : "#94A3B8", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontFamily: "'Cairo',sans-serif", transition: "all .2s" }}>
                          {copied ? "✓ تم النسخ!" : "📋 نسخ الكود"}
                        </button>
                        <button onClick={downloadCode} style={{ background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.3)", color: "#A855F7", padding: "8px 16px", borderRadius: 9, cursor: "pointer", fontSize: 13, fontFamily: "'Cairo',sans-serif" }}>
                          ⬇️ تحميل
                        </button>
                      </div>
                      <pre style={{ background: "rgba(0,0,0,.55)", borderRadius: 12, padding: "20px 18px", maxHeight: 520, overflowY: "auto", overflowX: "auto", border: "1px solid rgba(255,255,255,.05)", direction: "ltr", textAlign: "left" }}>
                        <code style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace", fontSize: 13, lineHeight: 1.75, color: "#E2E8F0", whiteSpace: "pre" }}>{result.code}</code>
                      </pre>
                    </div>
                  )}

                  {activeTab === "features" && (
                    <div>
                      <p style={{ color: "#A855F7", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>✨ المميزات المُضمّنة في الكود ({result.features?.length}):</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
                        {result.features?.map((f, i) => (
                          <div key={i} style={{ background: "rgba(124,58,237,.06)", border: "1px solid rgba(124,58,237,.15)", borderRadius: 12, padding: "13px 15px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                            <span style={{ background: "rgba(124,58,237,.25)", color: "#A855F7", width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                            <span style={{ color: "#CBD5E1", fontSize: 13, lineHeight: 1.7 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "improvements" && (
                    <div>
                      <p style={{ color: "#06B6D4", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>💡 أفكار لتطوير المشروع مستقبلاً:</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                        {result.improvements?.map((imp, i) => (
                          <div key={i} style={{ background: "rgba(6,182,212,.05)", border: "1px solid rgba(6,182,212,.13)", borderRadius: 12, padding: "14px 18px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                            <div style={{ background: "rgba(6,182,212,.15)", color: "#06B6D4", width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                            <span style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.8 }}>{imp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "structure" && (
                    <div>
                      <p style={{ color: "#F8FAFC", fontSize: 14, fontWeight: 700, marginBottom: 14 }}>📁 هيكل الملفات المقترح:</p>
                      {result.fileStructure ? (
                        <pre style={{ background: "rgba(0,0,0,.4)", borderRadius: 12, padding: "18px 20px", color: "#94A3B8", fontSize: 13, lineHeight: 2, fontFamily: "'JetBrains Mono',monospace", border: "1px solid rgba(255,255,255,.05)", direction: "ltr", textAlign: "left", overflowX: "auto" }}>{result.fileStructure}</pre>
                      ) : (
                        <div style={{ color: "#475569", fontSize: 14, textAlign: "center", padding: "30px 0" }}>الكود في ملف واحد متكامل — لا يحتاج هيكل ملفات معقد</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: "center", marginTop: 52, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,.04)" }}>
          <p style={{ color: "#334155", fontSize: 13 }}>⚡ مدعوم بـ <span style={{ color: "#7C3AED" }}>Claude Sonnet 4.6</span> — صُنع بـ <span style={{ color: "#06B6D4" }}>DevNova</span></p>
        </footer>
      </div>
    </div>
  );
}
