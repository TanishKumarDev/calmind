"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  PlusCircle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
  ChatMessage,
  getAllChatSessions,
  ChatSession,
} from "@/lib/api/chat";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const SUGGESTED_QUESTIONS = [
  { text: "How can I manage my anxiety better?" },
  { text: "I've been feeling overwhelmed lately" },
  { text: "Can we talk about improving sleep?" },
  { text: "I need help with work-life balance" },
];

const glowAnimation = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: easeInOut,
    },
  },
};

export default function TherapyPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(
    params.sessionId as string
  );
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const handleNewSession = async () => {
    try {
      setIsLoading(true);
      const newSessionId = await createChatSession();
      setSessions((prev) => [
        {
          sessionId: newSessionId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...prev,
      ]);
      setSessionId(newSessionId);
      setMessages([]);
      window.history.pushState({}, "", `/therapy/${newSessionId}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);

        if (!sessionId || sessionId === "new") {
          const newSessionId = await createChatSession();
          setSessionId(newSessionId);
          window.history.pushState({}, "", `/therapy/${newSessionId}`);
          return;
        }

        const history = await getChatHistory(sessionId);
        if (Array.isArray(history)) {
          setMessages(
            history.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }))
          );
        } else {
          setMessages([]);
        }
      } catch {
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [sessionId]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const all = await getAllChatSessions();
        setSessions(all);
      } catch {}
    };
    loadSessions();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text || isTyping || !sessionId) return;

    setMessage("");
    setIsTyping(true);

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((p) => [...p, userMessage]);

    try {
      const response = await sendChatMessage(sessionId, text);
      const res = typeof response === "string" ? JSON.parse(response) : response;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          res.response ||
          res.message ||
          "I'm here for you. Tell me more about what you're feeling.",
        timestamp: new Date(),
      };

      setMessages((p) => [...p, assistantMessage]);
    } catch {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: "I’m having trouble responding right now. Try again soon.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => setMounted(true), []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleSuggested = (text: string) => {
    setMessage(text);
    setTimeout(() => handleSubmit(new Event("submit") as any), 0);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">

        {/* Sidebar */}
        <div className="w-80 flex flex-col border-r bg-muted/30">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Chat Sessions</h2>
              <Button variant="ghost" size="icon" onClick={handleNewSession}>
                <PlusCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {sessions.map((s) => (
                <div
                  key={s.sessionId}
                  className={cn(
                    "p-3 rounded-lg text-sm cursor-pointer hover:bg-primary/5 transition-colors",
                    s.sessionId === sessionId
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10"
                  )}
                  onClick={() =>
                    window.history.pushState({}, "", `/therapy/${s.sessionId}`)
                  }
                >
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-medium">
                      {s.messages[0]?.content.slice(0, 30) || "New Chat"}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-muted-foreground">
                    {s.messages[s.messages.length - 1]?.content ||
                      "No messages yet"}
                  </p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(s.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-background rounded-lg border">
          <div className="p-4 border-b flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="font-semibold">AI Therapist</h2>
          </div>

          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center space-y-6 max-w-md mx-auto">
                <motion.div
                  className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                  initial="initial"
                  animate="animate"
                  variants={glowAnimation}
                />
                <p className="text-lg font-medium">How can I assist you today?</p>

                <div className="space-y-3">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <Button
                      key={q.text}
                      variant="outline"
                      className="w-full py-4 text-left"
                      onClick={() => handleSuggested(q.text)}
                    >
                      {q.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.timestamp.toISOString()}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "px-6 py-6",
                        msg.role === "assistant" ? "bg-muted/30" : "bg-background"
                      )}
                    >
                      <div className="flex gap-4">
                        {msg.role === "assistant" ? (
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                        )}

                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">
                            {msg.role === "assistant" ? "AI Therapist" : "You"}
                          </p>

                          <div className="prose prose-sm dark:prose-invert">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <div className="px-6 py-6 flex gap-4 bg-muted/30">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                    <p className="text-sm text-muted-foreground">Typing...</p>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex gap-4"
            >
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 resize-none rounded-xl border p-3 min-h-[48px]"
                rows={1}
              />
              <Button
                type="submit"
                disabled={!message.trim() || isTyping}
                className="h-[48px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
