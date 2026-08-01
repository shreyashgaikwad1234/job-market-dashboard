import React from 'react';
import { 
  Terminal, Search, Sun, Moon, LogOut, FileText, BarChart3, TrendingUp, 
  Map, Target, Globe, BookOpen
} from 'lucide-react';
import type { ParsedResume } from '../../types';

interface AppShellProps {
  activeWorkspace: string;
  setActiveWorkspace: (workspace: string) => void;
  parsedResume: ParsedResume | null;
  children: React.ReactNode;
  onOpenCommandPalette: () => void;
  onReset: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function AppShell({
  activeWorkspace, setActiveWorkspace, parsedResume, children,
  onOpenCommandPalette, onReset, theme, toggleTheme
}: AppShellProps) {

  const workspaces = [
    { id: 'executive', label: 'Executive Summary', icon: Terminal },
    { id: 'skill-gap', label: 'Skill Gap Intelligence', icon: Target },
    { id: 'salary', label: 'Salary Intelligence', icon: BarChart3 },
    { id: 'career-paths', label: 'Career Paths', icon: Map },
    { id: 'growth', label: 'Growth Engine', icon: TrendingUp },
    { id: 'roadmap', label: 'Learning Roadmap', icon: BookOpen },
    { id: 'market', label: 'Market Insights', icon: Globe },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-page)' }}>
      
      {/* ── Sidebar ──────────────────────────────────────────────── */}
      <aside style={{
        width: '260px',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        backgroundColor: 'var(--bg-elevated)',
        flexShrink: 0
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'var(--text-title)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Terminal style={{ width: '14px', height: '14px', color: 'var(--bg-page)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--text-title)', letterSpacing: '-0.02em' }}>
            DATASKILLS<span style={{ color: 'var(--accent)' }}>MATRIX</span>
          </span>
        </div>

        {/* Profile Summary Badge */}
        {parsedResume && (
          <div style={{ padding: '0 16px', marginBottom: '24px' }}>
            <div className="surface-sm" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent)' }}>
                  {parsedResume.name.charAt(0)}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-title)' }}>
                  {parsedResume.name}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Lv. {parsedResume.inferred_level} {parsedResume.headline}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
            Workspaces
          </span>
          {workspaces.map(ws => {
            const isActive = activeWorkspace === ws.id;
            const Icon = ws.icon;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspace(ws.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                  border: 'none', background: isActive ? 'var(--accent-muted)' : 'transparent',
                  textAlign: 'left', transition: 'all 150ms ease',
                  position: 'relative'
                }}
              >
                {isActive && (
                  <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '16px', borderRadius: '0 4px 4px 0', backgroundColor: 'var(--accent)' }} />
                )}
                <Icon style={{ width: '16px', height: '16px', color: isActive ? 'var(--accent)' : 'var(--text-faint)' }} />
                <span style={{ fontSize: '14px', fontWeight: 500, color: isActive ? 'var(--accent)' : 'var(--text-body)' }}>
                  {ws.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border)' }}>
          <button 
            onClick={onOpenCommandPalette}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-elevated)', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search style={{ width: '14px', height: '14px' }} />
              <span style={{ fontSize: '13px' }}>Search</span>
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>⌘K</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={toggleTheme}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-body)' }}
            >
              {theme === 'dark' ? <Sun style={{ width: '14px', height: '14px' }} /> : <Moon style={{ width: '14px', height: '14px' }} />}
              <span style={{ fontSize: '13px', fontWeight: 500 }}>{theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
            {parsedResume && (
              <button 
                onClick={onReset}
                title="Reset Resume Data"
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <LogOut style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 40px', minHeight: '100%' }}>
          {children}
        </div>
      </main>
      
    </div>
  );
}
