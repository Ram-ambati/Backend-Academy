import React, { useEffect } from 'react';
import ChatWindow from '../../components/ai/ChatWindow/ChatWindow';
import Card from '../../components/common/Card/Card';
import useAuthStore from '../../stores/useAuthStore';
import { Bot, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const AiTutor = () => {
  const user = useAuthStore((state) => state.user);

  /* Reset window scroll to top when page mounts */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={28} style={{ color: 'var(--gold)' }} /> AI RAG Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
            Ask questions about Spring Boot, database indexing, JPA mappings, microservices, and design patterns.
          </p>
        </div>
      </div>

      {/* Main Grid: Features Left, Interactive Chat Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Side: Context Capabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} style={{ color: 'var(--gold)' }} /> Context-Aware RAG
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Our AI model is indexed on all Backend Academy course curricula, code snippets, and architectural blueprints.
            </p>
          </Card>

          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} style={{ color: 'var(--green)' }} /> Suggested Topics
            </h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <li>Why use gap numbering for sequences?</li>
              <li>Spring Security JWT Filter chain</li>
              <li>Database index B-Tree vs Hash</li>
              <li>Spring Boot Transaction isolation levels</li>
            </ul>
          </Card>

          <Card style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} style={{ color: 'var(--gold)' }} /> Senior Guardrails
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
              Trained to answer from first principles. Explains architectural trade-offs, not just copy-paste solutions.
            </p>
          </Card>
        </div>

        {/* Right Side: Full Chat Window */}
        <div style={{ height: 'calc(100vh - 160px)', minHeight: '550px' }}>
          <ChatWindow user={{ initials: user?.initials || 'ME' }} />
        </div>
      </div>
    </div>
  );
};

export default AiTutor;
