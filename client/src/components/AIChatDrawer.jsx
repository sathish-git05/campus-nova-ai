import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  BookOpen, 
  HelpCircle, 
  Flame, 
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';

export const AIChatDrawer = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'init_1',
      sender: 'ai',
      text: `Hello **${user?.name || 'there'}**! 👋 I am your **CampusNova AI Smart Assistant**.\n\nI can answer questions regarding your timetable, exam dates, syllabus concepts, faculty availability, live IoT sensor safety, and placement preparation. What can I do for you today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat' or 'questionGen'
  
  // Question Gen state
  const [subject, setSubject] = useState('Artificial Intelligence & ML');
  const [topic, setTopic] = useState('Heuristic Search & A* Algorithm');
  const [generatedQuestions, setGeneratedQuestions] = useState(null);
  const [genLoading, setGenLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeMode]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAI(text, user);
      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: res.reply || 'I could not process this query. Please try again.',
        source: res.source,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai_err_${Date.now()}`,
          sender: 'ai',
          text: '⚠️ Network connection to AI service failed. Please check server status.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!topic) return;
    setGenLoading(true);
    try {
      const res = await api.generateQuestions(subject, topic, 'Unit 1 & 2');
      setGeneratedQuestions(res);
    } catch (err) {
      console.error(err);
    } finally {
      setGenLoading(false);
    }
  };

  const quickPrompts = [
    '📅 When is my next exam?',
    '👨‍🏫 Is Dr. Priya available right now?',
    '🌡️ What is the current server room temperature?',
    '🚌 Where is Route 12 bus right now?',
    '💼 Microsoft SDE interview tips'
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '440px',
      maxWidth: '100vw',
      background: 'var(--bg-secondary)',
      borderLeft: '1px solid var(--border-glow)',
      boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(99, 102, 241, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              CampusNova AI Assistant
              <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>ONLINE</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>24/7 Smart Campus Core</span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Mode Switcher */}
      <div style={{ display: 'flex', padding: '8px 16px', gap: '8px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border-subtle)' }}>
        <button
          onClick={() => setActiveMode('chat')}
          style={{
            flex: 1,
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            background: activeMode === 'chat' ? 'var(--accent-primary)' : 'transparent',
            color: activeMode === 'chat' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          💬 AI Chatbot
        </button>
        <button
          onClick={() => setActiveMode('questionGen')}
          style={{
            flex: 1,
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            cursor: 'pointer',
            background: activeMode === 'questionGen' ? 'var(--accent-primary)' : 'transparent',
            color: activeMode === 'questionGen' ? '#fff' : 'var(--text-secondary)'
          }}
        >
          🎯 Question Generator
        </button>
      </div>

      {/* Body */}
      {activeMode === 'chat' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Messages list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%'
                }}
              >
                {msg.sender === 'ai' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <Bot size={16} />
                  </div>
                )}

                <div style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: msg.sender === 'user' ? 'var(--accent-primary)' : 'var(--bg-card)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.86rem',
                  lineHeight: '1.45',
                  whiteSpace: 'pre-wrap',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {msg.text}
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.6)', marginTop: '4px', textAlign: 'right' }}>
                    {msg.time} {msg.source && `• ${msg.source}`}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <Bot size={16} />
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <span className="pulse-dot" style={{ marginRight: '8px' }} />
                  Campus AI is analyzing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt chips */}
          <div style={{ padding: '8px 16px', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid var(--border-subtle)' }}>
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.72rem',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '8px' }}
          >
            <input
              type="text"
              placeholder="Ask about marks, exams, IoT sensors, faculty..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input"
              style={{ fontSize: '0.85rem', padding: '9px 12px' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ padding: '9px 14px' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* AI Question Generator Tool */
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Enter your subject and specific unit topic to generate probable university exam questions with answer blueprints:
          </div>

          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Unit Topic / Syllabus Section</label>
            <input
              type="text"
              value={topic}
              placeholder="e.g., A* Search & Heuristics, Normalization, TCP Congestion Control"
              onChange={(e) => setTopic(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={genLoading || !topic}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Sparkles size={16} />
            <span>{genLoading ? 'Synthesizing Questions...' : 'Generate Exam Questions'}</span>
          </button>

          {generatedQuestions && (
            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>
                  📌 Part A (2-Mark Conceptual Questions)
                </span>
              </div>
              {generatedQuestions.twoMarkQuestions?.map((q, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '12px', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '4px' }}>Q{idx + 1}. {q.q}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>💡 <em>Hint: {q.hint}</em></div>
                </div>
              ))}

              <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px', marginTop: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f59e0b' }}>
                  📝 Part B (16-Mark Comprehensive Problem)
                </span>
              </div>
              {generatedQuestions.sixteenMarkQuestions?.map((q, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '12px', fontSize: '0.82rem' }}>
                  <div style={{ fontWeight: 600, color: '#fff', marginBottom: '8px' }}>Q{idx + 1}. {q.q}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <strong>Marking Rubric:</strong>
                    <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                      {q.breakdown?.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
