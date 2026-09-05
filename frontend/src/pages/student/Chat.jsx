import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, SendHorizontal, Info, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatMessage from '../../components/chat/ChatMessage';
import TypingIndicator from '../../components/chat/TypingIndicator';
import QuickChips from '../../components/chat/QuickChips';
import { apiFetch } from '../../utils/api';
import { isDevAuthEnabled } from '../../devAuth';
import { generateDevChatReply } from '../../utils/devChat';

const Chat = () => {
  const { userProfile, isDevAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Track if we've processed the initial message to prevent double-sends
  const processedInitialMsg = useRef(false);

  // Initialize with empty state message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `Arre yaar! Bohot khushi hui ki tum aa gaye! 🔥\n\nMain hoon Sajan Shah — aaj se main tumhara 24/7 personal mentor hoon.\n\nPehle ek kaam karo — teen cheezein batao mujhe:\n1️⃣ Tumhara naam kya hai?\n2️⃣ Life mein abhi sabse badi takleef kya chal rahi hai?\n3️⃣ Agle 90 din mein kya achieve karna chahte ho?\n\nSeedha batao yaar — judgment free zone hai yahan.`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-grow textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Extract core send logic to reuse
  const sendMessageToApi = async (messageText, options = {}) => {
    if (!messageText.trim() && !selectedImage) return;

    const newUserMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      imageUrl: selectedImage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setSelectedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsTyping(true);

    const pushAssistant = (content) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
    };

    // Prefer real OpenAI via backend; dig local reply is used only if the API fails
    try {
      const apiMessages = [...messages, newUserMessage].map((m) => {
        if (m.role === 'user' && m.imageUrl) {
          return {
            role: m.role,
            content: [
              { type: 'text', text: m.content || 'Here is an image.' },
              { type: 'image_url', image_url: { url: m.imageUrl } },
            ],
          };
        }
        return {
          role: m.role,
          content: m.content,
        };
      });

      const response = await apiFetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: apiMessages,
          userProfile,
          isGoalCheckin: options.isGoalCheckin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.details || 'Failed to get response');
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/event-stream') || !response.body) {
        throw new Error('Unexpected chat response');
      }

      const assistantMessageId = `${Date.now()}-stream`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.replace('data: ', ''));
                if (data.content) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId
                        ? { ...msg, content: msg.content + data.content }
                        : msg
                    )
                  );
                }
              } catch (e) {
                console.error('Error parsing stream chunk', e, line);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      // Always fall back to a useful local reply rather than a dead end
      pushAssistant(generateDevChatReply(messageText));
    }
  };

  const handleSend = () => {
    sendMessageToApi(inputValue);
  };

  // Check for auto-triggered message from navigation state
  useEffect(() => {
    if (location.state?.initialMessage && !processedInitialMsg.current && messages.length > 0) {
      processedInitialMsg.current = true;
      const initialMsg = location.state.initialMessage;
      const isGoalCheckin = location.state.isGoalCheckin;
      
      // Clear the state so it doesn't re-trigger on refresh
      navigate(location.pathname, { replace: true, state: {} });
      
      // Send the message
      sendMessageToApi(initialMsg, { isGoalCheckin });
    }
  }, [location.state, location.pathname, navigate, messages.length]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[var(--color-bg)] relative overflow-hidden">
      
      {/* Chat Header */}
      <div className="h-[68px] bg-white border-b border-[var(--color-border)] px-5 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-[42px] h-[42px] rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center">
              <span className="text-[var(--color-primary)] font-serif font-bold text-[16px]">SS</span>
            </div>
            <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-full bg-green-500 border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-[16px] font-serif font-bold text-[var(--color-primary)]">
              AI Sajan Shah
            </h2>
            <div className="text-[12px] font-sans text-[var(--color-text-secondary)] flex items-center gap-1 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
              Online • Your personal mentor
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Language / Info buttons */}
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[var(--color-bg)] text-[var(--color-text-hint)] hover:text-[var(--color-primary)] transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-5 pb-2 relative z-10">
        <div className="text-center mb-6 mt-2">
          <span className="text-[12px] font-sans text-[var(--color-text-hint)] bg-white px-3 py-1 rounded-full border border-[var(--color-border)]">
            Today
          </span>
        </div>
        
        {messages.map((msg, idx) => {
          const isFirstInSequence = idx === 0 || messages[idx - 1].role !== msg.role;
          return (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isFirstInSequence={isFirstInSequence} 
            />
          );
        })}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-[var(--color-border)] z-30 shrink-0 relative">
        <QuickChips onChipClick={(chip) => sendMessageToApi(chip)} />
        
        <div className="p-3 lg:p-4 pb-[max(12px,env(safe-area-inset-bottom))] flex flex-col gap-2">
          {selectedImage && (
            <div className="relative self-start ml-[46px]">
              <img src={selectedImage} alt="Preview" className="h-24 rounded-lg border border-[var(--color-border)] object-cover shadow-sm" />
              <button 
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-white text-red-500 rounded-full p-1 shadow-md border border-[var(--color-border)] hover:bg-red-50 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          <div className="flex items-end gap-2 w-full max-w-4xl mx-auto">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[var(--color-text-hint)] hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] transition-colors mb-1"
            >
              <Paperclip className="w-[18px] h-[18px]" />
            </button>
            
            <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Sajan Shah..."
            className="flex-1 min-h-[48px] max-h-[120px] bg-[var(--color-bg)] border border-[var(--color-border)] focus:border-[var(--color-accent)] rounded-[24px] px-5 py-3 text-[15px] font-sans text-[var(--color-primary)] placeholder-[var(--color-text-hint)] outline-none resize-none overflow-y-auto transition-colors scrollbar-hide"
            rows="1"
          />
          
          <button 
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedImage) || isTyping}
            className={`w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 transition-all mb-[1px]
              ${(inputValue.trim() || selectedImage) && !isTyping 
                ? 'bg-[var(--color-accent)] text-white hover:opacity-90' 
                : 'bg-[var(--color-bg)] text-[var(--color-text-hint)] border border-[var(--color-border)]'
              }`}
          >
            {isTyping ? (
               <div className="w-5 h-5 border-2 border-[var(--color-text-hint)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
            ) : (
              <SendHorizontal className="w-5 h-5 ml-[-2px]" />
            )}
          </button>
        </div>
        </div>
        
        <div className="text-center pb-3">
          <span className="text-xs font-sans text-[var(--color-text-hint)]">Powered by Sajan Shah's teachings</span>
        </div>
      </div>
    </div>
  );
};

export default Chat;
