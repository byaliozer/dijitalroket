import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowUp, Sparkles, Loader2, Check, ChevronRight, Wand2, Layers,
  Users2, LayoutDashboard, Boxes, Rocket, ImageIcon, PhoneCall, RefreshCw, CircleCheck,
} from "lucide-react";
import { api, formatApiError } from "../lib/api";
import SEO from "../components/SEO";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const media = (u) => (u && u.startsWith("http") ? u : `${BACKEND}${u}`);

const PLACEHOLDERS = [
  "Şirketime özel bir B2B sipariş sistemi istiyorum…",
  "Bayilerimin stok ve fiyat görebileceği bir platform istiyorum…",
  "Excel ile yürüttüğümüz süreci özel bir yazılıma dönüştürmek istiyorum…",
  "Müşterilerimin kullanacağı özel bir mobil uygulama yaptırmak istiyorum…",
  "İlaç takibi için özel bir uygulama geliştirmek istiyorum…",
  "Sahadaki ekibimi yönetebileceğim bir operasyon uygulaması istiyorum…",
];

const EXAMPLES = [
  { label: "B2B Bayi Sistemi", prompt: "Bayilerimin stok ve özel fiyatlarını görüp online sipariş verebileceği bir B2B bayi sistemi istiyorum." },
  { label: "Özel CRM", prompt: "Satış ekibimin müşteri, teklif ve satış sürecini takip edebileceği özel bir CRM istiyorum." },
  { label: "Mobil Uygulama", prompt: "Müşterilerimin kullanacağı, sipariş ve takip yapabileceği özel bir mobil uygulama istiyorum." },
  { label: "AI Asistan", prompt: "Gelen müşteri taleplerini otomatik sınıflandıran bir yapay zeka asistanı istiyorum." },
  { label: "Raporlama Paneli", prompt: "Tüm operasyonel verilerimi tek ekranda gösteren bir yönetim ve raporlama paneli istiyorum." },
  { label: "Sipariş Yönetimi", prompt: "Siparişlerin alınmasından teslimata kadar tüm süreci yöneten bir sipariş yönetim sistemi istiyorum." },
  { label: "Stok Takip", prompt: "Depo ve şube bazında stok hareketlerini anlık takip edebileceğim bir stok sistemi istiyorum." },
  { label: "Müşteri Portalı", prompt: "Müşterilerimin fatura, sipariş ve destek taleplerini görebileceği bir müşteri portalı istiyorum." },
  { label: "İlaç Takip", prompt: "İlaç kullanımını ve hatırlatmaları takip eden özel bir sağlık uygulaması istiyorum." },
  { label: "Personel Takip", prompt: "Personel giriş-çıkış, izin ve performansını takip eden bir insan kaynakları sistemi istiyorum." },
  { label: "Saha Operasyonu", prompt: "Sahadaki ekibin görev, konum ve raporlarını yöneten bir saha operasyon uygulaması istiyorum." },
  { label: "Rezervasyon Sistemi", prompt: "Randevu ve rezervasyonları online yöneten, hatırlatma gönderen bir rezervasyon sistemi istiyorum." },
];

const LOADING_MSGS = [
  "Fikriniz analiz ediliyor…",
  "İhtiyaçlar belirleniyor…",
  "Uygun modüller çıkarılıyor…",
  "Kullanıcı rolleri değerlendiriliyor…",
  "Proje yapısı oluşturuluyor…",
];

const SUCCESS_STEPS = [
  "Fikir analizi tamamlandı",
  "Proje kapsamı oluşturuldu",
  "Bilgileriniz kaydedildi",
  "İnceleme sürecine alındı",
];

/* ---------- small pieces ---------- */

function LoadingCycle({ messages }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), 900);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <div className="flex items-center gap-3 text-[#1E3A8A]">
      <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" />
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium"
        >
          {messages[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function BlueprintPanel({ idea, answers, blueprint, building }) {
  return (
    <div className="glass-card p-6 sm:p-7" data-testid="dr-ai-blueprint">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#22D3EE] text-white">
          <Layers className="h-4 w-4" />
        </span>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2563EB]">Project Blueprint</div>
          <div className="text-xs text-slate-500">DR AI tarafından oluşturuluyor</div>
        </div>
      </div>

      {!blueprint && (
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">Fikir</div>
            <p className="mt-1 text-sm text-slate-700 line-clamp-3">{idea}</p>
          </div>
          <AnimatePresence>
            {answers.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-slate-100 bg-white/70 p-3"
              >
                <div className="text-[10px] font-semibold text-slate-400">{a.question}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-700">{a.answer}</div>
              </motion.div>
            ))}
          </AnimatePresence>
          {building && (
            <div className="pt-2"><LoadingCycle messages={["Modüller çıkarılıyor…", "Mimari kuruluyor…", "Blueprint hazırlanıyor…"]} /></div>
          )}
          {!building && answers.length === 0 && (
            <p className="text-xs text-slate-400">Sorulara yanıt verdikçe proje sinyalleri burada belirecek.</p>
          )}
        </div>
      )}

      {blueprint && (
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }} className="mt-5">
          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
            <h3 className="font-heading text-2xl font-extrabold text-[#0B1B34]">{blueprint.project_name}</h3>
            <p className="text-sm font-medium text-[#2563EB]">{blueprint.project_type}</p>
            {blueprint.tagline && <p className="mt-1 text-sm text-slate-500 italic">{blueprint.tagline}</p>}
            {blueprint.description && <p className="mt-3 text-sm leading-relaxed text-slate-700">{blueprint.description}</p>}
          </motion.div>

          {blueprint.target_users?.length > 0 && (
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mt-4">
              <BpLabel icon={<Users2 className="h-3.5 w-3.5" />} text="Hedef Kullanıcılar" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {blueprint.target_users.map((u, i) => (
                  <span key={i} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">{u}</span>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mt-4">
            <BpLabel icon={<Boxes className="h-3.5 w-3.5" />} text="Temel Modüller" />
            <div className="mt-2 grid gap-1.5">
              {blueprint.modules.map((m, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, x: 10 }, show: { opacity: 1, x: 0 } }}
                  className="flex items-center gap-2 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50/60 to-transparent px-3 py-2"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-[#2563EB]/10 text-[#2563EB]"><Check className="h-3 w-3" /></span>
                  <span className="text-sm text-slate-700">{m}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {blueprint.admin_features?.length > 0 && (
            <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mt-4">
              <BpLabel icon={<LayoutDashboard className="h-3.5 w-3.5" />} text="Yönetim Paneli" />
              <ul className="mt-2 space-y-1">
                {blueprint.admin_features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><ChevronRight className="h-4 w-4 mt-0.5 text-[#22D3EE]" />{f}</li>
                ))}
              </ul>
            </motion.div>
          )}

          <motion.div variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mt-4 grid grid-cols-1 gap-2">
            <div className="rounded-xl bg-[#0B1B34] p-4 text-white">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#22D3EE]">Önerilen Platform</div>
              <div className="mt-0.5 text-sm font-semibold">{blueprint.platform}</div>
            </div>
            {blueprint.optional_features?.length > 0 && (
              <div className="rounded-xl border border-slate-100 bg-white/70 p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Opsiyonel Gelişim Alanları</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {blueprint.optional_features.map((o, i) => (
                    <span key={i} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-500">{o}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function BpLabel({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
      <span className="text-[#2563EB]">{icon}</span> {text}
    </div>
  );
}

/* ---------- main page ---------- */

export default function DrAiUret() {
  const [stage, setStage] = useState("idle"); // idle|analyzing|questions|building|blueprint|mockup_loading|mockup_result|form|success
  const [idea, setIdea] = useState("");
  const [phIndex, setPhIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [curQ, setCurQ] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [blueprint, setBlueprint] = useState(null);
  const [mockups, setMockups] = useState([]);
  const [mockupFeedback, setMockupFeedback] = useState("");
  const [lead, setLead] = useState({ name: "", company: "", phone: "", email: "", note: "" });
  const [busy, setBusy] = useState(false);
  const taRef = useRef(null);

  useEffect(() => {
    if (stage !== "idle") return;
    const t = setInterval(() => setPhIndex((v) => (v + 1) % PLACEHOLDERS.length), 3200);
    return () => clearInterval(t);
  }, [stage]);

  const autoresize = (el) => { if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 220) + "px"; } };

  const startAnalysis = async () => {
    const text = idea.trim();
    if (text.length < 6) { toast.error("Lütfen fikrinizi birkaç cümleyle yazın."); return; }
    setStage("analyzing");
    try {
      const { data } = await api.post("/dr-ai/questions", { idea: text });
      setQuestions(data.questions || []);
      setAnswers([]); setCurQ(0); setAnswerText("");
      setStage("questions");
    } catch (e) {
      toast.error(formatApiError(e?.response?.data?.detail));
      setStage("idle");
    }
  };

  const buildBlueprint = async (finalAnswers) => {
    setStage("building");
    try {
      const { data } = await api.post("/dr-ai/blueprint", { idea: idea.trim(), answers: finalAnswers });
      setBlueprint(data.blueprint);
      setStage("blueprint");
    } catch (e) {
      toast.error(formatApiError(e?.response?.data?.detail));
      setStage("questions");
    }
  };

  const submitAnswer = (value) => {
    const q = questions[curQ];
    const ans = (value ?? answerText).trim();
    if (!ans) { toast.error("Lütfen bir yanıt seçin veya yazın."); return; }
    const next = [...answers, { question: q.question, answer: ans }];
    setAnswers(next);
    setAnswerText("");
    if (curQ + 1 < questions.length) {
      setCurQ(curQ + 1);
    } else {
      buildBlueprint(next);
    }
  };

  const generateMockup = async () => {
    setStage("mockup_loading");
    try {
      const { data } = await api.post("/dr-ai/mockup", {
        project_name: blueprint.project_name, description: blueprint.description,
        project_type: blueprint.project_type, modules: blueprint.modules, platform: blueprint.platform,
      }, { timeout: 210000 });
      setMockups(data.images || []);
      setStage("mockup_result");
    } catch (e) {
      toast.error(formatApiError(e?.response?.data?.detail) || "Görsel üretilemedi.");
      setStage("form");
    }
  };

  const submitLead = async () => {
    if (!lead.name.trim() || !lead.phone.trim()) { toast.error("Ad Soyad ve Telefon zorunludur."); return; }
    setBusy(true);
    try {
      await api.post("/dr-ai/lead", {
        idea: idea.trim(), answers, blueprint: blueprint || {},
        mockup_images: mockups, mockup_feedback: mockupFeedback, ...lead,
      });
      setStage("success");
    } catch (e) {
      toast.error(formatApiError(e?.response?.data?.detail));
    } finally { setBusy(false); }
  };

  const showBlueprintPanel = ["questions", "building", "blueprint", "mockup_loading", "mockup_result", "form"].includes(stage);

  return (
    <div className="dr-ai-page relative min-h-screen overflow-hidden">
      <SEO
        title="DR AI ile Üret | Fikrinizi Yapay Zeka ile Projeye Dönüştürün — Dijital Roket"
        description="Aklınızdaki yazılım fikrini yazın; Dijital Roket'in yapay zekâsı DR AI birkaç akıllı soruyla kapsamı netleştirsin, canlı bir proje taslağı ve örnek arayüz görseli oluştursun. B2B, CRM, mobil uygulama, portal ve otomasyon için."
      />
      <style>{`
        .dr-ai-page{background:#EEF4FF;}
        .dr-ai-aurora{position:absolute;inset:-20%;z-index:0;filter:blur(70px);opacity:.9;
          background:
            radial-gradient(38% 44% at 18% 22%, rgba(37,99,235,.28), transparent 60%),
            radial-gradient(34% 40% at 82% 18%, rgba(34,211,238,.24), transparent 60%),
            radial-gradient(46% 50% at 70% 82%, rgba(139,92,246,.20), transparent 62%),
            radial-gradient(40% 46% at 30% 78%, rgba(59,130,246,.18), transparent 60%);
          animation:drift 16s ease-in-out infinite alternate;}
        @keyframes drift{0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-3%,2%,0) scale(1.06)}100%{transform:translate3d(3%,-2%,0) scale(1.03)}}
        .glass-card{background:rgba(255,255,255,.72);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
          border:1px solid rgba(255,255,255,.7);border-radius:22px;box-shadow:0 24px 60px -28px rgba(30,58,138,.35);}
        .dr-input-wrap{background:rgba(255,255,255,.8);backdrop-filter:blur(18px);border:1px solid rgba(148,163,184,.35);
          border-radius:24px;box-shadow:0 26px 70px -30px rgba(30,58,138,.45);transition:border-color .3s, box-shadow .3s;}
        .dr-input-wrap:focus-within{border-color:rgba(37,99,235,.55);box-shadow:0 0 0 4px rgba(37,99,235,.12),0 30px 80px -30px rgba(37,99,235,.5);}
        @media (prefers-reduced-motion: reduce){.dr-ai-aurora{animation:none}}
      `}</style>
      <div className="dr-ai-aurora" aria-hidden="true" />

      <div className="relative z-10 container-x pt-24 pb-24">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> DR AI · Yapay Zeka Üretim Sistemi
          </span>
          <h1 className="mt-5 font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0B1B34]">
            DR AI ile <span className="bg-gradient-to-r from-[#2563EB] to-[#22D3EE] bg-clip-text text-transparent">Üret</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600">
            Aklınızdaki yazılım fikrini anlatın. Yapay zekâmız bunu birkaç akıllı soruyla netleştirip canlı bir proje taslağına dönüştürsün.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            Fikriniz net olmasa bile sorun değil — birkaç cümle yeterli. B2B, CRM, mobil uygulama, portal, otomasyon ve daha fazlası.
          </p>
        </div>

        {/* IDLE: input + examples */}
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="mx-auto mt-10 max-w-2xl">
              <div className="dr-input-wrap p-2.5">
                <textarea
                  ref={taRef}
                  data-testid="dr-ai-input"
                  aria-label="Yazılım fikrinizi yazın"
                  value={idea}
                  onChange={(e) => { setIdea(e.target.value); autoresize(e.target); }}
                  onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) startAnalysis(); }}
                  rows={2}
                  placeholder={PLACEHOLDERS[phIndex]}
                  className="w-full resize-none bg-transparent px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none"
                />
                <div className="flex items-center justify-between px-2 pb-1">
                  <span className="text-xs text-slate-400">Fikrinizi yazın, gerisini yapay zekâ ile birlikte netleştirelim.</span>
                  <button
                    data-testid="dr-ai-submit"
                    onClick={startAnalysis}
                    aria-label="Fikri gönder"
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-blue-600/30 transition hover:scale-105 active:scale-95"
                  >
                    <ArrowUp className="h-5 w-5 transition group-hover:-translate-y-0.5" />
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 text-center text-xs font-medium text-slate-400">Örnek fikirlerden birini seçebilirsiniz</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {EXAMPLES.map((ex, i) => (
                    <motion.button
                      key={ex.label}
                      data-testid={`dr-ai-example-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                      whileHover={{ y: -3 }}
                      onClick={() => { setIdea(ex.prompt); autoresize(taRef.current); taRef.current?.focus(); }}
                      className="rounded-full border border-white/70 bg-white/60 px-3.5 py-1.5 text-sm font-medium text-slate-600 backdrop-blur transition hover:border-[#2563EB]/40 hover:text-[#0B1B34] hover:shadow-md"
                    >
                      {ex.label}
                    </motion.button>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-center text-xs text-slate-400">Bu deneyim özellikle şirket sahipleri ve yöneticiler için tasarlanmıştır.</p>
            </motion.div>
          )}

          {stage === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto mt-14 max-w-md">
              <div className="glass-card flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#2563EB]/20" />
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#22D3EE] text-white"><Wand2 className="h-6 w-6" /></span>
                </div>
                <LoadingCycle messages={LOADING_MSGS} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INTERACTIVE: two columns */}
        {showBlueprintPanel && (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* left: conversation / actions */}
            <div className="order-2 lg:order-1">
              <AnimatePresence mode="wait">
                {stage === "questions" && questions[curQ] && (
                  <motion.div key={`q-${curQ}`} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} className="glass-card p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#2563EB]">DR AI Soruyor</span>
                      <span className="text-xs text-slate-400">{curQ + 1} / {questions.length}</span>
                    </div>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div className="h-full bg-gradient-to-r from-[#2563EB] to-[#22D3EE]" animate={{ width: `${((curQ) / questions.length) * 100}%` }} />
                    </div>
                    <h2 className="mt-5 font-heading text-xl font-bold text-[#0B1B34]">{questions[curQ].question}</h2>
                    {questions[curQ].options?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {questions[curQ].options.map((o, oi) => (
                          <button
                            key={oi}
                            data-testid={`dr-ai-option-${curQ}-${oi}`}
                            onClick={() => submitAnswer(o)}
                            className="rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#2563EB]/50 hover:bg-[#2563EB]/5 hover:text-[#0B1B34]"
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-end gap-2">
                      <textarea
                        data-testid="dr-ai-answer-input"
                        aria-label="Yanıtınız"
                        rows={1}
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAnswer(); } }}
                        placeholder="Kendi yanıtınızı da yazabilirsiniz…"
                        className="flex-1 resize-none rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2.5 text-sm outline-none focus:border-[#2563EB]"
                      />
                      <button data-testid="dr-ai-answer-submit" onClick={() => submitAnswer()} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#0B1B34] px-4 text-sm font-semibold text-white transition hover:bg-[#132844]">
                        {curQ + 1 < questions.length ? "Devam" : "Taslağı Oluştur"} <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "building" && (
                  <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
                    <LoadingCycle messages={["Cevaplarınız değerlendiriliyor…", "Modüller belirleniyor…", "Proje adı üretiliyor…", "Blueprint oluşturuluyor…"]} />
                  </motion.div>
                )}

                {stage === "blueprint" && (
                  <motion.div key="bp-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-7">
                    <div className="flex items-center gap-2 text-[#2563EB]"><CircleCheck className="h-5 w-5" /><span className="text-sm font-bold">Proje taslağınız hazır</span></div>
                    <h2 className="mt-3 font-heading text-xl font-bold text-[#0B1B34]">Bu proje için örnek bir ekran görseli oluşturalım mı?</h2>
                    <p className="mt-2 text-sm text-slate-500">Yapay zekâ, taslağınıza dayanarak örnek bir arayüz (mockup) üretebilir. Bu, kavramsal bir önizlemedir.</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button data-testid="dr-ai-mockup-yes" onClick={generateMockup} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]">
                        <ImageIcon className="h-4 w-4" /> Evet, örnek ekranı oluştur
                      </button>
                      <button data-testid="dr-ai-mockup-no" onClick={() => setStage("form")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-white">
                        Şimdilik gerek yok
                      </button>
                    </div>
                  </motion.div>
                )}

                {stage === "mockup_loading" && (
                  <motion.div key="mk-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8">
                    <LoadingCycle messages={["Örnek ekran hazırlanıyor…", "Arayüz kurgulanıyor…", "Görsel işleniyor…", "Son rötuşlar…"]} />
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {[0, 1].map((i) => <div key={i} className="aspect-[3/2] animate-pulse rounded-xl bg-slate-200/70" />)}
                    </div>
                  </motion.div>
                )}

                {stage === "mockup_result" && (
                  <motion.div key="mk-result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-7" data-testid="dr-ai-mockups">
                    <h2 className="font-heading text-lg font-bold text-[#0B1B34]">Örnek arayüz önizlemesi</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {mockups.map((m, i) => (
                        <a key={i} href={media(m)} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
                          <img src={media(m)} alt={`Örnek ekran ${i + 1}`} data-testid={`dr-ai-mockup-img-${i}`} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                        </a>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-600">Bu görsel fikrinize yakın mı?</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {["Evet, beğendim", "Kısmen", "Hayır, farklı bir yaklaşım istiyorum"].map((f, k) => (
                        <button key={k} data-testid={`dr-ai-mockup-feedback-${k}`} onClick={() => { setMockupFeedback(f); setStage("form"); }} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${mockupFeedback === f ? "border-[#2563EB] bg-[#2563EB] text-white" : "border-slate-200 bg-white/70 text-slate-600 hover:border-[#2563EB]/40"}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setStage("form")} className="mt-4 text-sm font-semibold text-[#2563EB] hover:underline">Devam et →</button>
                  </motion.div>
                )}

                {stage === "form" && (
                  <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-7">
                    <h2 className="font-heading text-xl font-bold text-[#0B1B34]">Projenizi Dijital Roket'e iletin</h2>
                    <p className="mt-1.5 text-sm text-slate-500">Oluşturduğumuz proje taslağını ekibimize gönderin. Sizi arayalım, fikrinizi birlikte gerçeğe dönüştürelim.</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Field label="Ad Soyad" required>
                        <input data-testid="lead-name" autoComplete="name" value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} className="dr-field" placeholder="Adınız Soyadınız" />
                      </Field>
                      <Field label="Şirket Adı">
                        <input data-testid="lead-company" autoComplete="organization" value={lead.company} onChange={(e) => setLead({ ...lead, company: e.target.value })} className="dr-field" placeholder="Şirketiniz" />
                      </Field>
                      <Field label="Telefon" required>
                        <input data-testid="lead-phone" type="tel" autoComplete="tel" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value.replace(/[^0-9+()\s]/g, "") })} className="dr-field" placeholder="0 5xx xxx xx xx" />
                      </Field>
                      <Field label="E-posta (opsiyonel)">
                        <input data-testid="lead-email" type="email" autoComplete="email" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} className="dr-field" placeholder="ornek@firma.com" />
                      </Field>
                      <div className="sm:col-span-2">
                        <Field label="Notunuz (opsiyonel)">
                          <textarea data-testid="lead-note" rows={2} value={lead.note} onChange={(e) => setLead({ ...lead, note: e.target.value })} className="dr-field resize-none" placeholder="Eklemek istedikleriniz…" />
                        </Field>
                      </div>
                    </div>
                    <button data-testid="lead-submit" onClick={submitLead} disabled={busy} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] disabled:opacity-60">
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} Projemi Gönder
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
              <style>{`.dr-field{width:100%;border-radius:12px;border:1px solid rgb(226 232 240);background:rgba(255,255,255,.85);padding:.6rem .85rem;font-size:14px;outline:none}.dr-field:focus{border-color:#2563EB}`}</style>
            </div>

            {/* right: blueprint */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              <BlueprintPanel idea={idea} answers={answers} blueprint={blueprint} building={stage === "building"} />
            </div>
          </div>
        )}

        {/* SUCCESS */}
        <AnimatePresence>
          {stage === "success" && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-12 max-w-xl" data-testid="dr-ai-success">
              <div className="glass-card p-8 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#22D3EE] text-white shadow-xl shadow-blue-600/30">
                  <Rocket className="h-9 w-9" />
                </motion.div>
                <h2 className="mt-6 font-heading text-2xl font-extrabold text-[#0B1B34]">Projeniz Dijital Roket'e ulaştı.</h2>
                <p className="mt-3 text-sm text-slate-600">Yapay zekâ ile oluşturulan proje taslağınız ekibimize aktarıldı. Uygun bir ön çalışma sonrası sizinle iletişime geçeceğiz.</p>
                <div className="mx-auto mt-6 max-w-sm space-y-2 text-left">
                  {SUCCESS_STEPS.map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 * i }} className="flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-2.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-white"><Check className="h-3 w-3" /></span>
                      <span className="text-sm font-medium text-slate-700">{s}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-[#0B1B34] px-4 py-3 text-sm text-white/90">
                  Sıradaki adım: <span className="font-semibold text-[#22D3EE]">Dijital Roket ön değerlendirmesi ve prototip yaklaşımı</span>
                </div>
                <a href="/projeler" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:gap-2.5 transition-all">Geliştirdiğimiz projeleri inceleyin <ChevronRight className="h-4 w-4" /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* signature */}
        <div className="mt-16 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-[#2563EB]" /> Powered by Dijital Roket AI
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}{required && <span className="text-red-500"> *</span>}</span>
      {children}
    </label>
  );
}
