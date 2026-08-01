import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, User, TrendingUp, Coins, Compass, Map, Globe, Settings,
  RefreshCw, Sun, Moon, ArrowRight, Command
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
  onReset: () => void;
}

export default function CommandPalette({ isOpen, onClose, onSelectTab, onReset }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [focusIdx, setFocusIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allCommands = [
    { id: 'overview', label: 'Career Report', desc: 'View your career operating system', icon: User, group: 'Navigation' },
    { id: 'career', label: 'Career Intelligence', desc: 'How employable am I?', icon: TrendingUp, group: 'Navigation' },
    { id: 'salary', label: 'Salary Intelligence', desc: 'What am I worth?', icon: Coins, group: 'Navigation' },
    { id: 'growth', label: 'Growth Engine', desc: 'What should I learn?', icon: Compass, group: 'Navigation' },
    { id: 'paths', label: 'Career Paths', desc: 'Which path suits me?', icon: Map, group: 'Navigation' },
    { id: 'roadmap', label: 'Roadmap', desc: 'How do I get there?', icon: Map, group: 'Navigation' },
    { id: 'market', label: 'Market Pulse', desc: 'What is the market doing?', icon: Globe, group: 'Navigation' },
    { id: 'settings', label: 'Settings', desc: 'Workspace configuration', icon: Settings, group: 'Settings' },
    { id: 'reset', label: 'Reset Workspace', desc: 'Clear local data and restart', icon: RefreshCw, group: 'Settings' },
  ];

  const filtered = allCommands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()) || c.desc.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setFocusIdx(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx(prev => Math.min(prev + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx(prev => Math.max(prev - 1, 0)); }
      if (e.key === 'Enter' && filtered[focusIdx]) {
        e.preventDefault();
        executeCommand(filtered[focusIdx]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, focusIdx, filtered]);

  const executeCommand = (cmd: typeof allCommands[0]) => {
    if (cmd.id === 'reset') { onReset(); }
    else { onSelectTab(cmd.id); }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '20vh',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '560px',
          backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: '16px', boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Search Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
        }}>
          <Search style={{ width: '18px', height: '18px', color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setFocusIdx(0); }}
            placeholder="Type a command or search…"
            style={{
              flex: 1, fontSize: '16px', fontWeight: 500,
              color: 'var(--text-title)', backgroundColor: 'transparent',
              border: 'none', outline: 'none',
            }}
          />
          <span style={{
            fontSize: '11px', color: 'var(--text-faint)', padding: '2px 8px',
            borderRadius: '4px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)',
          }}>
            ESC
          </span>
        </div>

        {/* Results */}
        <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '8px' }}>
          {filtered.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              No matching commands found.
            </div>
          )}

          {/* Group by category */}
          {['Navigation', 'Settings'].map(group => {
            const groupItems = filtered.filter(c => c.group === group);
            if (groupItems.length === 0) return null;
            return (
              <div key={group}>
                <div style={{ padding: '8px 12px 4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  {group}
                </div>
                {groupItems.map(cmd => {
                  const Icon = cmd.icon;
                  const idx = filtered.indexOf(cmd);
                  const isFocused = idx === focusIdx;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setFocusIdx(idx)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        width: '100%', padding: '12px 14px', borderRadius: '10px',
                        border: 'none', textAlign: 'left', cursor: 'pointer',
                        backgroundColor: isFocused ? 'var(--bg-hover)' : 'transparent',
                        transition: 'background-color 100ms',
                      }}
                    >
                      <Icon style={{ width: '16px', height: '16px', color: isFocused ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: isFocused ? 'var(--text-title)' : 'var(--text-body)' }}>{cmd.label}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cmd.desc}</span>
                      </div>
                      {isFocused && <ArrowRight style={{ width: '13px', height: '13px', color: 'var(--text-faint)' }} />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 20px', borderTop: '1px solid var(--border)',
          fontSize: '11px', color: 'var(--text-faint)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Command style={{ width: '11px', height: '11px' }} />
            <span>K to toggle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
