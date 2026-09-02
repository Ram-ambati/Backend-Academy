import React, { useEffect } from 'react';
import ChatWindow from '../../components/ai/ChatWindow/ChatWindow';
import Card from '../../components/common/Card/Card';
import useAuthStore from '../../stores/useAuthStore';
import { Bot, Sparkles, Zap, ShieldCheck } from 'lucide-react';

const AiTutor = () => {
  const user = useAuthStore((state) => state.user);

  /* Reset window scroll to top when page mounts and ensure sidebar is open */
  useEffect(() => {
    window.scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent('autoOpenSidebar'));
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Full Width Chat Window */}
      <div style={{ flex: 1, minHeight: '550px', width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <ChatWindow user={user} />
      </div>
    </div>
  );
};

export default AiTutor;
