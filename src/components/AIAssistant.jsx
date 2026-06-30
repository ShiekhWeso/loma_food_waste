import React, { useState, useRef, useEffect } from "react";

// ── Config ────────────────────────────────────────────────────────────────────
const GROQ_PROXY_URL = "http://localhost:5000/api/groq";

// ── Bilingual System Prompt ───────────────────────────────────────────────────
function buildSystemPrompt(meals, user) {
  const mealList = (meals || [])
    .filter(m => m.qty > 0 && !m.hidden)
    .slice(0, 25)
    .map(m =>
      `• ${m.name} — ${m.restaurant} | Rescue: $${m.rescuePrice?.toFixed(2)} (${
        m.discount || Math.round(((m.originalPrice - m.rescuePrice) / m.originalPrice) * 100)
      }% off) | Qty: ${m.qty} | Category: ${m.category} | Reason: ${m.returnReason || "Cancellation"}`
    )
    .join("\n");

  return `You are Lo'ma AI Assistant — a smart, bilingual (Arabic & English) food rescue assistant for the Lo'ma platform.

CRITICAL LANGUAGE RULE:
- Detect the language of the user's message.
- If user writes in Arabic → respond ONLY in Arabic (use natural Egyptian/Modern Standard Arabic).
- If user writes in English → respond ONLY in English.
- Never mix languages in the same response.

ABOUT LO'MA:
Lo'ma rescues surplus high-quality restaurant food at 30-70% discounts, connecting restaurants with conscious diners.
لو'ما تنقذ الطعام الفائض عالي الجودة من المطاعم بخصومات تصل لـ 70%، وتربط بين المطاعم والمستخدمين الواعيين.

USER:
Name: ${user?.name || "Guest"}
Role: ${user?.role || "customer"}

AVAILABLE MEALS RIGHT NOW:
${mealList || "No meals available currently."}

RULES:
- Only recommend meals from the list above. Never invent meals or prices.
- Be concise, warm, and helpful.
- Always end with a clear action suggestion.
- If asked something outside Lo'ma scope, redirect gently.`;
}

// ── Quick Suggestions ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: "🍽️", text: "ما الوجبات المتاحة؟",     textEn: "What's available now?" },
  { icon: "🔥", text: "أكبر الخصومات",            textEn: "Biggest discounts" },
  { icon: "❓", text: "كيف تعمل المنصة؟",          textEn: "How does Lo'ma work?" },
  { icon: "🛒", text: "مساعدة في الدفع",           textEn: "Help with checkout" },
];

// ── Detect arabic text ────────────────────────────────────────────────────────
const isArabicText = (txt) => /[\u0600-\u06FF]/.test(txt);

// ── Detect action buttons from reply ─────────────────────────────────────────
function detectActions(reply) {
  const actions = [];
  if (/marketplace|browse|meal|deal|وجبات|تصفح|صفقات|متجر|سوق/i.test(reply))
    actions.push({ label: "🛍 Marketplace", labelAr: "🛍 السوق", page: "marketplace" });
  if (/cart|checkout|order|سلة|دفع|طلب|شراء/i.test(reply))
    actions.push({ label: "🛒 Open Cart", labelAr: "🛒 السلة", action: "cart" });
  if (/order.*histor|my order|طلبات|سجل الطلبات/i.test(reply))
    actions.push({ label: "📋 My Orders", labelAr: "📋 طلباتي", page: "profile" });
  if (/profile|account|حساب|ملف شخصي/i.test(reply))
    actions.push({ label: "👤 Profile", labelAr: "👤 حسابي", page: "profile" });
  return actions.slice(0, 3);
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AIAssistant({ user, meals, onNavigate }) {
  const [isOpen, setIsOpen]       = useState(false);
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [uiLang, setUiLang]       = useState("en"); // "ar" or "en"
  const messagesEndRef             = useRef(null);
  const inputRef                   = useRef(null);

  const welcomeSentRef = useRef(false);

  // Welcome message — fires once per session when user becomes available
  useEffect(() => {
    if (!welcomeSentRef.current) {
      welcomeSentRef.current = true;
      setMessages([{
        role: "assistant",
        id: Date.now(),
        content: `مرحباً${user?.name ? ` ${user.name.split(" ")[0]}` : ""}! 👋 أنا مساعد Lo'ma الذكي.\n\nHey${user?.name ? ` ${user.name.split(" ")[0]}` : ""}! I'm Lo'ma's AI assistant.\n\nاكتبلي بالعربي أو English وهرد عليك بنفس لغتك! 🌍`
      }]);
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const arabic = isArabicText(userText);
    setUiLang(arabic ? "ar" : "en");

    const userMsg = { role: "user", content: userText, id: Date.now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const systemPrompt = buildSystemPrompt(meals, user);
      const payload = [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch(GROQ_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload })
      });

      const data = await res.json();

      if (!res.ok) {
        const errDetail = data?.groq_error?.message || data?.message || `خطأ ${res.status}`;
        throw new Error(errDetail);
      }

      const reply = data.choices?.[0]?.message?.content?.trim();
      if (!reply) throw new Error("الرد فارغ من Groq");

      setMessages(prev => [...prev, {
        role: "assistant",
        content: reply,
        id: Date.now(),
        actions: detectActions(reply)
      }]);
    } catch (err) {
      console.error("AI error:", err.message);
      const isAr = isArabicText(userText);
      setMessages(prev => [...prev, {
        role: "assistant",
        id: Date.now(),
        isError: true,
        content: isAr
          ? `⚠️ حدث خطأ:\n${err.message}\n\nتأكد أن الـ server شغال على المنفذ 5000.`
          : `⚠️ Error:\n${err.message}\n\nMake sure the server is running on port 5000.`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleAction = (action) => {
    if (action.page) onNavigate(action.page);
    if (action.action === "cart") onNavigate("cart-open");
    setIsOpen(false);
  };

  const showSuggestions = messages.length <= 1 && !loading;

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="ai-float-btn fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Open AI Assistant"
        title="Lo'ma AI — عربي & English"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? "close" : "smart_toy"}
        </span>
      </button>

      {/* ── Chat Panel (Larger size layout) ── */}
      {isOpen && (
        <div
          className="chat-panel-enter fixed bottom-24 right-6 z-[150] bg-background rounded-[2.25rem] shadow-[0_28px_72px_rgba(0,0,0,0.18)] border border-outline-variant/15 flex flex-col overflow-hidden font-body"
          style={{ width: "480px", maxHeight: "680px", minHeight: "500px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-container px-6 py-5 flex items-center gap-3 shrink-0">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-headline font-bold text-white text-base leading-tight">Lo'ma Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse shrink-0" />
                <span className="text-white/80 text-xs font-semibold">AI · عربي & English</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" style={{ minHeight: 0 }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                    <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === "user" ? "" : "flex flex-col gap-2 text-left"}`}>
                  <div
                    className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed font-semibold whitespace-pre-wrap shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary-container text-white rounded-br-sm shadow-md"
                        : msg.isError
                          ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-sm"
                          : "bg-surface-container-low text-on-surface border border-outline-variant/15 rounded-bl-sm"
                    }`}
                    dir={isArabicText(msg.content) ? "rtl" : "ltr"}
                  >
                    {msg.content}
                  </div>

                  {msg.actions?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 pl-1">
                      {msg.actions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleAction(action)}
                          className="text-xs font-bold text-primary border border-primary/30 bg-primary/5 hover:bg-primary hover:text-white px-4 py-2 rounded-full transition-all duration-200 shadow-sm"
                        >
                          {uiLang === "ar" ? (action.labelAr || action.label) : action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary-container/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-base">smart_toy</span>
                </div>
                <div className="bg-surface-container-low border border-outline-variant/15 px-5 py-3.5 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <span key={i}
                        className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {showSuggestions && (
            <div className="px-5 pb-3 shrink-0 text-left">
              <p className="text-[10px] font-bold text-on-surface-variant mb-2 opacity-60">
                {uiLang === "ar" ? "اقتراحات سريعة:" : "Quick suggestions:"}
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(uiLang === "ar" ? s.text : s.textEn)}
                    className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant border border-outline-variant/30 bg-surface-container-low hover:bg-primary/10 hover:text-primary hover:border-primary/30 px-4 py-2 rounded-full transition-all duration-200"
                  >
                    <span>{s.icon}</span>
                    <span dir={uiLang === "ar" ? "rtl" : "ltr"}>{uiLang === "ar" ? s.text : s.textEn}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-5 border-t border-outline-variant/15 bg-surface-container-lowest/60 shrink-0">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسألني أي شيء..."
                dir="auto"
                className="flex-1 bg-surface-container-low border border-outline-variant/20 rounded-xl px-5 py-3 text-sm font-semibold text-on-background placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/30 transition-all"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white flex items-center justify-center disabled:opacity-35 transition-all hover:scale-105 active:scale-95 shrink-0 shadow-md"
              >
                <span className="material-symbols-outlined text-base">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
