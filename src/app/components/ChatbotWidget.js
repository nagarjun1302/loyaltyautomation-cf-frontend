"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, HelpCircle, FileText, ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";

// Quick action suggestions to guide the user
const QUICK_ACTIONS = [
  { label: "AC Motor Drives", query: "Show me available AC Motor Drives" },
  { label: "Request a B2B Quote", query: "I want to submit an inquiry/quote request" },
  { label: "PLC Catalog", query: "Do you have PLCs or HMI panels?" },
  { label: "Service & Support", query: "How do I get technical support?" },
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am **Loyalty Bot**, your technical sales assistant. I can help you search our catalog, look up product specifications, or submit a B2B quote request directly to our team. How can I help you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef(null);
  const router = useRouter();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Handle sending a message
  const handleSend = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setShowSuggestions(false); // Hide suggestions once conversation starts

    try {
      // Send chat history and current message to backend Express API
      // Backend is on http://localhost:5005
      const response = await axios.post("http://localhost:5005/api/chat", {
        message: userMessage.content,
        history: messages
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply }
      ]);
    } catch (err) {
      console.error("Chat API error:", err);
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm having trouble reaching the server. Please verify the backend is running on port 5005 or try again shortly." 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  // Helper to parse simple markdown formatting like bold (**text**) and links ([label](url))
  const renderMessageContent = (content) => {
    if (!content) return "";

    // Split text by bold markers (**text**)
    const parts = content.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-extrabold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      
      // Parse markdown links [Label](url)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      let match;
      const elements = [];
      let lastIndex = 0;

      while ((match = linkRegex.exec(part)) !== null) {
        // Add text before link
        if (match.index > lastIndex) {
          elements.push(part.substring(lastIndex, match.index));
        }
        
        const label = match[1];
        const url = match[2];
        const isInternal = url.startsWith("/");

        if (isInternal) {
          elements.push(
            <a
              key={match.index}
              href={url}
              onClick={(e) => {
                e.preventDefault();
                router.push(url);
                setIsOpen(false); // Close chatbot on navigation
              }}
              className="inline-flex items-center gap-1 font-semibold text-teal-600 underline hover:text-teal-800"
            >
              {label}
            </a>
          );
        } else {
          elements.push(
            <a
              key={match.index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-teal-600 underline hover:text-teal-800"
            >
              {label}
            </a>
          );
        }
        lastIndex = linkRegex.lastIndex;
      }

      if (lastIndex < part.length) {
        elements.push(part.substring(lastIndex));
      }

      return elements.length > 0 ? elements : part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Floating Toggle Bubble */}
      <motion.button
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-teal-600 to-teal-500 text-white shadow-xl shadow-teal-500/25 transition-all hover:from-teal-700 hover:to-teal-600 focus:outline-none"
        aria-label="Toggle support chat"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </motion.button>

      {/* Chat Window Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.93 }}
            transition={{ type: "spring", damping: 20, stiffness: 260 }}
            className="absolute bottom-18 right-0 flex h-[580px] w-[350px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[410px]"
          >
            {/* Elegant Header */}
            <div className="relative flex items-center gap-3 bg-slate-900 p-4 text-white">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-teal-500">
                <Bot className="h-5 w-5 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400"></span>
              </div>
              <div>
                <p className="font-bold text-sm leading-none text-white">Loyalty Sales Bot</p>
                <p className="mt-1 text-[11px] font-medium text-teal-400">Virtual sales assistant for Loyalty Automation</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role !== "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-teal-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
                  }`}>
                    <div className="whitespace-pre-wrap">
                      {renderMessageContent(msg.content)}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700 shadow-sm">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isLoading && (
                <div className="flex gap-3.5 justify-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 animate-pulse">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-none border border-slate-100 bg-white px-4 py-3 shadow-sm">
                    <span className="flex gap-1.5 items-center py-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400"></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Pills */}
            {showSuggestions && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <HelpCircle className="h-3.5 w-3.5" /> Suggestion topics:
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(action.query)}
                      className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <form onSubmit={handleFormSubmit} className="flex border-t border-slate-200 p-3 bg-white">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about VFDs, specifications, or quotes..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-white shadow-md shadow-teal-600/10 hover:bg-teal-700 disabled:opacity-50 transition"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
