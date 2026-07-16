"use client";
// components/chat/chat-launcher.tsx
//
// This whole widget is necessarily client-side — it's a stateful,
// interactive conversation. It's intentionally isolated as a small,
// self-contained island rather than making its parent page a client
// component too.

import { useState, useRef, useId } from "react";

interface ChatTurn {
  role: "user" | "assistant";
  content: string;
  products?: { id: string; name: string; priceCents: number; slug: string }[];
}

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sessionId = useId();

  async function send() {
    const message = input.trim();
    if (!message || loading) return;

    setTurns((t) => [...t, { role: "user", content: message }]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });
    const data = await res.json();

    setTurns((t) => [
      ...t,
      { role: "assistant", content: data.reply, products: data.products },
    ]);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 rounded-full bg-zinc-900 px-5 py-3 text-sm font-medium text-white shadow-lg"
      >
        Ask the shopping assistant
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 flex h-[480px] w-[360px] flex-col rounded-xl border border-zinc-200 bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3">
        <span className="text-sm font-medium">Shopping assistant</span>
        <button onClick={() => setOpen(false)} className="text-zinc-400">
          ✕
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
        {turns.length === 0 && (
          <p className="text-zinc-400">
            Try: &ldquo;waterproof hiking backpack under $120 that fits a
            16-inch laptop&rdquo;
          </p>
        )}
        {turns.map((turn, i) => (
          <div key={i}>
            <p className={turn.role === "user" ? "text-right text-zinc-700" : "text-zinc-900"}>
              {turn.content}
            </p>
            {turn.products && turn.products.length > 0 && (
              <ul className="mt-2 space-y-1">
                {turn.products.map((p) => (
                  <li key={p.id}>
                    <a href={`/products/${p.slug}`} className="text-zinc-600 underline">
                      {p.name} — ${(p.priceCents / 100).toFixed(2)}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {loading && <p className="text-zinc-400">Thinking…</p>}
      </div>

      <div className="flex gap-2 border-t border-zinc-200 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Describe what you need…"
          className="flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
        <button
          onClick={send}
          disabled={loading}
          className="rounded-lg bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
