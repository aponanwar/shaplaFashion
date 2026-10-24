'use client';

import { useState, useRef, useEffect } from 'react';
import { FaWhatsapp, FaPaperPlane } from 'react-icons/fa';
import { FiX, FiRefreshCw, FiPackage, FiTruck, FiRotateCcw, FiCreditCard, FiMessageSquare } from 'react-icons/fi';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export default function WhatsAppChatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const businessPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '+8801700000000';
  const cleanPhone = businessPhone.replace(/[^0-9]/g, '');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: '🌸 Welcome to Shapla Fashion! How can I assist you today? You can choose a quick topic below or type your question.',
      timestamp: 'Just now',
      quickActions: [
        { label: '📦 Track My Order', action: 'track' },
        { label: '🚚 Delivery Details', action: 'delivery' },
        { label: '💳 Payment Methods', action: 'payment' },
        { label: '↩️ Return Policy', action: 'return' },
        { label: '💬 Talk to Human', action: 'human' },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('track') || lower.includes('order')) {
        botResponse = '🔍 You can track your order at /orders by entering your Order ID (e.g. SF2610XXXXX). Or you can message our WhatsApp agent with your Order ID for real-time tracking!';
      } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('charge') || lower.includes('time')) {
        botResponse = '🚚 Delivery within Dhaka is ৳60 (1-2 days). Outside Dhaka across Bangladesh is ৳120 (2-4 days). Free delivery on orders over ৳999!';
      } else if (lower.includes('payment') || lower.includes('bkash') || lower.includes('nagad') || lower.includes('card') || lower.includes('cod')) {
        botResponse = '💳 We accept:\n• Cash on Delivery (COD)\n• bKash Instant Payment\n• Nagad Payment\n• Visa & Mastercard credit/debit cards';
      } else if (lower.includes('return') || lower.includes('refund') || lower.includes('exchange')) {
        botResponse = '↩️ We have a 7-day hassle-free return and exchange policy for unworn items with tags intact. Contact us via WhatsApp to initiate a return.';
      } else if (lower.includes('human') || lower.includes('agent') || lower.includes('live')) {
        botResponse = '👩‍💼 Connecting you to a WhatsApp representative! Click the green button below to chat directly with our support team.';
      } else {
        botResponse = `Thanks for reaching out! For detailed questions regarding "${text}", our team is ready to assist you on WhatsApp immediately.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          timestamp: 'Just now',
          quickActions: [
            { label: '💬 Open WhatsApp Chat', action: 'human' },
            { label: '📦 Track Order', action: 'track' },
          ],
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const handleAction = (action: string) => {
    if (action === 'human') {
      window.open(`https://wa.me/${cleanPhone}?text=Hello%20Shapla%20Fashion,%20I%20need%20assistance.`, '_blank');
      return;
    }
    if (action === 'track') handleSend('How do I track my order?');
    if (action === 'delivery') handleSend('What are your delivery fees and timelines?');
    if (action === 'payment') handleSend('What payment methods are supported?');
    if (action === 'return') handleSend('What is your return policy?');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Open WhatsApp Support"
          >
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-300 border-2 border-white"></span>
            </span>
            <FaWhatsapp className="text-2xl" />
            <span className="font-semibold text-sm hidden sm:inline">WhatsApp Help</span>
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="w-[360px] sm:w-[390px] h-[520px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up z-50">
            {/* Header */}
            <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg">
                    🌸
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#075e54] rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Shapla Fashion Support</h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Online &bull; Instant Reply
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-white"
                aria-label="Close chat"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Messages body with WhatsApp wallpaper pattern background */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none'
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}
                  >
                    {msg.text}
                    <div className="text-[10px] text-gray-400 text-right mt-1 font-mono">
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Quick action buttons if available */}
                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.quickActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAction(action.action)}
                          className="text-xs bg-white text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-gray-200 px-2.5 py-1.5 rounded-full transition-all shadow-sm font-medium"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-white px-3 py-2 rounded-xl w-fit shadow-sm">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct WhatsApp link CTA */}
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
              <span>Prefer WhatsApp app?</span>
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="text-green-700 font-semibold hover:underline flex items-center gap-1"
              >
                <FaWhatsapp className="text-green-600 text-sm" /> Open in WhatsApp
              </a>
            </div>

            {/* Input area */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 border border-transparent focus:border-emerald-500 focus:bg-white rounded-full px-4 py-2 text-sm text-gray-800 outline-none transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-[#075e54] text-white flex items-center justify-center hover:bg-[#128c7e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                aria-label="Send message"
              >
                <FaPaperPlane size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
