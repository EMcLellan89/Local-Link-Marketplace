import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, MessageSquare, ChevronLeft } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Direction = 'inbound' | 'outbound';

interface Message {
  id: string;
  direction: Direction;
  text: string;
  sent_at: string;
}

interface Conversation {
  id: string;
  customer_name: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
  messages: Message[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    customer_name: 'Sarah Mitchell',
    last_message: "Thanks! I'll review the proposal tonight.",
    last_message_at: '2026-04-24T09:30:00',
    unread_count: 0,
    messages: [
      { id: 'm1', direction: 'outbound', text: 'Hi Sarah, I wanted to follow up on the website redesign proposal I sent last week.', sent_at: '2026-04-23T14:00:00' },
      { id: 'm2', direction: 'inbound', text: 'Hi! Yes, it looks great. I have a few questions about the timeline.', sent_at: '2026-04-23T14:45:00' },
      { id: 'm3', direction: 'outbound', text: 'Of course! Happy to answer. What specifically are you wondering about?', sent_at: '2026-04-23T15:00:00' },
      { id: 'm4', direction: 'inbound', text: "Thanks! I'll review the proposal tonight.", sent_at: '2026-04-24T09:30:00' },
    ],
  },
  {
    id: '2',
    customer_name: 'James Kowalski',
    last_message: 'Can we reschedule Thursday?',
    last_message_at: '2026-04-24T08:00:00',
    unread_count: 2,
    messages: [
      { id: 'm5', direction: 'inbound', text: 'Hey, I wanted to confirm our appointment on Thursday at 2pm.', sent_at: '2026-04-23T10:00:00' },
      { id: 'm6', direction: 'outbound', text: 'Yes, confirmed! I will see you then.', sent_at: '2026-04-23T10:30:00' },
      { id: 'm7', direction: 'inbound', text: 'Can we reschedule Thursday?', sent_at: '2026-04-24T08:00:00' },
    ],
  },
  {
    id: '3',
    customer_name: 'Maria Torres',
    last_message: 'Got it, thanks!',
    last_message_at: '2026-04-22T16:00:00',
    unread_count: 0,
    messages: [
      { id: 'm8', direction: 'outbound', text: 'Hi Maria, checking in about the SEO package. Any questions?', sent_at: '2026-04-22T15:00:00' },
      { id: 'm9', direction: 'inbound', text: 'Got it, thanks!', sent_at: '2026-04-22T16:00:00' },
    ],
  },
  {
    id: '4',
    customer_name: 'Derek Chang',
    last_message: 'Looking forward to the meeting!',
    last_message_at: '2026-04-21T11:30:00',
    unread_count: 0,
    messages: [
      { id: 'm10', direction: 'outbound', text: 'Derek, I have your strategy session scheduled for Monday at 11am.', sent_at: '2026-04-21T09:00:00' },
      { id: 'm11', direction: 'inbound', text: 'Looking forward to the meeting!', sent_at: '2026-04-21T11:30:00' },
    ],
  },
  {
    id: '5',
    customer_name: 'Priya Patel',
    last_message: 'Perfect, see you there.',
    last_message_at: '2026-04-20T17:00:00',
    unread_count: 0,
    messages: [
      { id: 'm12', direction: 'inbound', text: 'Is the workshop still happening on the 26th?', sent_at: '2026-04-20T16:30:00' },
      { id: 'm13', direction: 'outbound', text: 'Yes! We are confirmed for April 26th at 1pm.', sent_at: '2026-04-20T16:45:00' },
      { id: 'm14', direction: 'inbound', text: 'Perfect, see you there.', sent_at: '2026-04-20T17:00:00' },
    ],
  },
  {
    id: '6',
    customer_name: 'Angela White',
    last_message: 'Sounds good to me.',
    last_message_at: '2026-04-19T13:00:00',
    unread_count: 1,
    messages: [
      { id: 'm15', direction: 'outbound', text: 'Angela, I wanted to share the social media report for March.', sent_at: '2026-04-19T12:00:00' },
      { id: 'm16', direction: 'inbound', text: 'Sounds good to me.', sent_at: '2026-04-19T13:00:00' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date('2026-04-24T12:00:00');
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatMessageTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Conversation List Item
// ---------------------------------------------------------------------------

interface ConvListItemProps {
  conv: Conversation;
  selected: boolean;
  onClick: () => void;
}

function ConvListItem({ conv, selected, onClick }: ConvListItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
        selected ? 'bg-[#2BB673]/10 border-r-2 border-[#2BB673]' : 'hover:bg-gray-50 border-r-2 border-transparent'
      }`}
    >
      {/* Avatar */}
      <div
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
        style={{ backgroundColor: '#2BB673' }}
      >
        {getInitials(conv.customer_name)}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className={`truncate text-sm font-semibold ${selected ? 'text-[#2BB673]' : 'text-gray-900'}`}>
            {conv.customer_name}
          </span>
          <span className="flex-shrink-0 text-xs text-gray-400">{formatTime(conv.last_message_at)}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-xs text-gray-500">{conv.last_message}</span>
          {conv.unread_count > 0 && (
            <span
              className="flex h-5 min-w-[20px] flex-shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white"
              style={{ backgroundColor: '#2BB673' }}
            >
              {conv.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Message Bubble
// ---------------------------------------------------------------------------

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isOutbound = message.direction === 'outbound';
  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className="max-w-[75%]">
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isOutbound
              ? 'rounded-br-sm text-white'
              : 'rounded-bl-sm bg-gray-100 text-gray-900'
          }`}
          style={isOutbound ? { backgroundColor: '#2BB673' } : {}}
        >
          {message.text}
        </div>
        <div className={`mt-1 text-xs text-gray-400 ${isOutbound ? 'text-right' : 'text-left'}`}>
          {formatMessageTime(message.sent_at)}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Thread Panel
// ---------------------------------------------------------------------------

interface ThreadPanelProps {
  conversation: Conversation | null;
  onBack: () => void;
  onSend: (convId: string, text: string) => void;
}

function ThreadPanel({ conversation, onBack, onSend }: ThreadPanelProps) {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages.length]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !conversation) return;
    onSend(conversation.id, text);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-400">
        <MessageSquare className="h-12 w-12 text-gray-200" />
        <p className="text-sm font-medium">Select a conversation</p>
        <p className="text-xs text-gray-300">Choose a contact to view messages</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Thread header */}
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3.5">
        {/* Mobile back button */}
        <button
          onClick={onBack}
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: '#2BB673' }}
        >
          {getInitials(conversation.customer_name)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900">{conversation.customer_name}</div>
          <div className="text-xs text-gray-400">Customer</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {conversation.messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-[#2BB673] focus-within:ring-2 focus-within:ring-[#2BB673]/20 transition-all">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message... (Enter to send)"
            className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white transition-colors disabled:opacity-40"
            style={{ backgroundColor: '#2BB673' }}
            onMouseEnter={e => { if (inputText.trim()) e.currentTarget.style.backgroundColor = '#23995f'; }}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#2BB673')}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CRMMessagesPage() {
  useAuth();
  const [conversations, setConversations] = useState<Conversation[]>(
    [...MOCK_CONVERSATIONS].sort(
      (a, b) => new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
    )
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showThread, setShowThread] = useState(false); // mobile toggle

  const selectedConv = conversations.find(c => c.id === selectedId) ?? null;

  const handleSelectConv = (id: string) => {
    setSelectedId(id);
    setShowThread(true);
    // Clear unread count
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, unread_count: 0 } : c))
    );
  };

  const handleBack = () => {
    setShowThread(false);
  };

  const handleSend = (convId: string, text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      direction: 'outbound',
      text,
      sent_at: new Date().toISOString(),
    };
    setConversations(prev =>
      prev.map(c =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              last_message: text,
              last_message_at: newMessage.sent_at,
            }
          : c
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">

          {/* Back link */}
          <Link
            to="/merchant/crm-hub"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            CRM Hub
          </Link>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            <p className="mt-1 text-sm text-gray-500">Customer communications in one place</p>
          </div>

          {/* Two-panel layout */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm" style={{ height: '600px' }}>
            <div className="flex h-full">

              {/* Left: Conversation list */}
              <div
                className={`flex w-full flex-col border-r border-gray-100 md:w-1/3 ${
                  showThread ? 'hidden md:flex' : 'flex'
                }`}
              >
                {/* List header */}
                <div className="border-b border-gray-100 px-4 py-3.5">
                  <h2 className="text-sm font-semibold text-gray-900">Conversations</h2>
                  <p className="text-xs text-gray-400">{conversations.length} contacts</p>
                </div>

                {/* Conversation list */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {conversations.map(conv => (
                    <ConvListItem
                      key={conv.id}
                      conv={conv}
                      selected={conv.id === selectedId}
                      onClick={() => handleSelectConv(conv.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Thread panel */}
              <div
                className={`flex w-full flex-col md:flex md:w-2/3 ${
                  showThread ? 'flex' : 'hidden md:flex'
                }`}
              >
                <ThreadPanel
                  conversation={selectedConv}
                  onBack={handleBack}
                  onSend={handleSend}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
