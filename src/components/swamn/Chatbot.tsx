import { useEffect, useRef, useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { WeddingCelebration } from "./WeddingCelebration";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = "/api/public/chat";
const SECRET_CODE = "290209";

export const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [locked, setLocked] = useState(false);
  const [showWedding, setShowWedding] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm **Swamn Sphere** (SS) 🌊 Ask me anything about our mission, team, or how to get involved.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, open]);

  const pushAssistant = (content: string) =>
    setMessages((p) => [...p, { role: "assistant", content }]);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");

    // Secret movie-style flow
    if (locked) {
      pushAssistant("🔒 Access permanently locked for this session.");
      return;
    }

    if (awaitingCode) {
      if (text === SECRET_CODE) {
        setAwaitingCode(false);
        setAttemptsLeft(3);
        pushAssistant("✅ Code accepted. Opening the celebration… 💍💖");
        setTimeout(() => setShowWedding(true), 600);
        return;
      }
      const remaining = attemptsLeft - 1;
      setAttemptsLeft(remaining);
      if (remaining <= 0) {
        setLocked(true);
        setAwaitingCode(false);
        pushAssistant("❌ Wrong code. No attempts remaining. Access locked.");
      } else {
        pushAssistant(
          `❌ Wrong code. **${remaining} attempt${remaining === 1 ? "" : "s"} remaining.** Try again:`
        );
      }
      return;
    }

    if (text.toUpperCase() === "SS") {
      setAwaitingCode(true);
      pushAssistant(
        `🎬 You've discovered a secret. Enter the secret code to unlock the surprise.\n\nYou have **${attemptsLeft} attempts**.`
      );
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      if (!resp.ok || !resp.body) {
        let msg = "Something went wrong. Please try again.";
        if (resp.status === 429) msg = "Too many requests. Please wait a moment.";
        if (resp.status === 402) msg = "AI credits exhausted. Please try again later.";
        setMessages((p) => [...p, { role: "assistant", content: msg }]);
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      let done = false;

      setMessages((p) => [...p, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-primary-foreground shadow-glow transition-all hover:scale-105 ${
          open ? "" : "animate-pulse-ring"
        }`}
      >
        {open ? (
          <span className="text-xl">×</span>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[560px] w-[92vw] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="flex items-center gap-3 border-b border-border bg-background/60 px-4 py-3">
            <span className="h-2 w-2 rounded-full bg-aqua" />
            <div>
              <div className="h-display text-sm text-navy">Swamn Sphere · SS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                AI · Ask anything
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-navy text-primary-foreground"
                      : "bg-secondary text-navy"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none [&>*]:my-1">
                      <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground" aria-live="polite">
                <span className="h-1.5 w-1.5 rounded-full bg-navy/60" style={{ animation: "typing-dot 1.2s infinite", animationDelay: "0s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-navy/60" style={{ animation: "typing-dot 1.2s infinite", animationDelay: "0.15s" }} />
                <span className="h-1.5 w-1.5 rounded-full bg-navy/60" style={{ animation: "typing-dot 1.2s infinite", animationDelay: "0.3s" }} />
              </div>
            )}
          </div>

          <form
            onSubmit={send}
            className="flex items-center gap-2 border-t border-border bg-background/60 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={awaitingCode ? "Enter secret code…" : "Ask Swamn Sphere…"}
              maxLength={500}
              type={awaitingCode ? "password" : "text"}
              className="flex-1 rounded-full border border-border bg-card px-4 py-2 text-sm text-navy outline-none focus:border-navy/40"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-10 items-center rounded-full bg-navy px-4 text-xs font-medium text-primary-foreground transition-opacity disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {showWedding && <WeddingCelebration onClose={() => setShowWedding(false)} />}
    </>
  );
};
