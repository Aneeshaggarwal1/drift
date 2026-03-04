'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '@/lib/api/client';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import type { ConversationType, DestinationCard, ItineraryDay, ProfileData } from '@/lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  conversationType: ConversationType;
  initialMessage?: string;   // AI sends this on mount automatically
  conversationId?: string;
  tripId?: string;
  placeholder?: string;
  onPickDestination?: (card: DestinationCard) => void;
  onConfirmProfile?: (data: ProfileData) => void;
  onSaveTrip?: (days: ItineraryDay[]) => void;
  onConversationId?: (id: string) => void;
  className?: string;
}

export default function ChatInterface({
  conversationType,
  initialMessage,
  conversationId: initialConvId,
  tripId,
  placeholder = 'Message Drift…',
  onPickDestination,
  onConfirmProfile,
  onSaveTrip,
  onConversationId,
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [convId, setConvId] = useState(initialConvId);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const didInit = useRef(false);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingText, scrollToBottom]);

  const sendMessage = useCallback(async (text: string, silent = false) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = { role: 'user', content: text };
    if (!silent) {
      setMessages(prev => [...prev, userMsg]);
      setInput('');
    }

    setIsStreaming(true);
    setStreamingText('');
    setError('');

    let accumulated = '';

    await streamChat(
      { conversationType, message: text, conversationId: convId, tripId },
      (chunk) => {
        accumulated += chunk;
        setStreamingText(accumulated);
      },
      (newConvId) => {
        if (newConvId && !convId) {
          setConvId(newConvId);
          onConversationId?.(newConvId);
        }
        setMessages(prev => [
          ...(silent ? prev : prev),
          { role: 'assistant', content: accumulated },
        ]);
        setStreamingText('');
        setIsStreaming(false);
      },
      (err) => {
        setError(err);
        setIsStreaming(false);
        setStreamingText('');
      },
    );
  }, [isStreaming, convId, conversationType, tripId, onConversationId]);

  // Auto-send initial message once (deferred to avoid setState-in-effect lint error)
  useEffect(() => {
    if (initialMessage && !didInit.current) {
      didInit.current = true;
      const t = setTimeout(() => sendMessage(initialMessage, true), 0);
      return () => clearTimeout(t);
    }
  }, [initialMessage, sendMessage]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    // auto resize
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }

  return (
    <div className={`flex flex-col h-full ${className ?? ''}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" aria-live="polite" aria-atomic="false">
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            message={msg}
            onPickDestination={onPickDestination}
            onConfirmProfile={onConfirmProfile}
            onSaveTrip={onSaveTrip}
          />
        ))}

        {isStreaming && (
          streamingText
            ? (
              <div className="flex items-start gap-3 animate-[fadeIn_200ms_ease-out]">
                <div className="w-7 h-7 rounded-full bg-[#E8A838]/10 border border-[#E8A838]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[#E8A838] text-xs font-semibold" style={{ fontFamily: 'Fraunces, serif' }}>D</span>
                </div>
                <div className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[90%]">
                  <p className="text-[#F5F0E8] text-sm whitespace-pre-wrap leading-relaxed">{streamingText}</p>
                </div>
              </div>
            )
            : <TypingIndicator />
        )}

        {error && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#D4756B]/10 border border-[#D4756B]/20 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[#D4756B] text-xs">!</span>
            </div>
            <div className="bg-[#1A1A1A] border border-[#D4756B]/20 rounded-2xl rounded-tl-sm px-4 py-3">
              <p className="text-[#D4756B] text-sm">I got a bit confused there. Can you try again?</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#2A2A2A] px-4 py-3 bg-[#0F0F0F]">
        <div className="flex items-end gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl px-4 py-3 focus-within:border-[#E8A838]/40 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-[#F5F0E8] placeholder:text-[#3A3A3A] resize-none focus:outline-none max-h-40 leading-relaxed disabled:opacity-50"
            style={{ height: 'auto' }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isStreaming}
            className="w-8 h-8 rounded-xl bg-[#E8A838] text-[#0F0F0F] flex items-center justify-center hover:bg-[#d4972e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 12V2M3 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-[#3A3A3A] text-xs mt-2 text-center">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
