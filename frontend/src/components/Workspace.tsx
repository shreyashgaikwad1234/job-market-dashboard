import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from './navigation/AppShell';
import HeroSection from './hero/HeroSection';
import CareerAnalysis from './career/CareerAnalysis';
import SalaryIntelligence from './salary/SalaryIntelligence';
import GrowthEngine from './growth/GrowthEngine';
import CareerTransition from './paths/CareerTransition';
import RoadmapTree from './roadmap/RoadmapTree';
import MarketPulse from './market/MarketPulse';
import CommandPalette from './shared/CommandPalette';

import { generateAnalysisFromProfile } from '../lib/services/api';
import type { AppState, ResumeAnalysisResponse, ProfileType } from '../types';
import { Terminal, ArrowRight, Sparkles, AlertCircle, FileText, Download } from 'lucide-react';

export default function Workspace() {
  // Global Application State
  const [appState, setAppState] = useState<AppState>({
    hasResume: false,
    isAnalyzing: false,
    analysisError: null,
    analysisData: null,
  });

  const [activeWorkspace, setActiveWorkspace] = useState('executive');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Initialization & Theme
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('appState');
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      if (savedState) {
        setAppState(JSON.parse(savedState));
      }
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'light') document.documentElement.classList.add('light');
        else document.documentElement.classList.remove('light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
  };

  const handleReset = () => {
    localStorage.removeItem('appState');
    setAppState({ hasResume: false, isAnalyzing: false, analysisError: null, analysisData: null });
    setActiveWorkspace('executive');
  };

  const handleStartAnalysis = async (profile: ProfileType) => {
    setAppState(prev => ({ ...prev, hasResume: true, isAnalyzing: true, analysisError: null }));
    try {
      const data = await generateAnalysisFromProfile(profile);
      const newState = { hasResume: true, isAnalyzing: false, analysisError: null, analysisData: data };
      setAppState(newState);
      localStorage.setItem('appState', JSON.stringify(newState));
    } catch (err) {
      setAppState(prev => ({ ...prev, isAnalyzing: false, analysisError: 'Failed to extract data. Please try another PDF.' }));
    }
  };

  // Keyboard shortcut listener for Command Palette (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* ── PROGRESSIVE LOADING SKELETON ────────────────────────────── */
  const renderLoadingState = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', padding: '40px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="skeleton" style={{ height: '48px', width: '30%' }} />
        <div className="skeleton" style={{ height: '24px', width: '50%' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Sparkles className="animate-spin" style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
          <span style={{ fontSize: '14px', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>Extracting semantic bullet points...</span>
        </div>
        <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '16px' }} />
      </div>
    </div>
  );

  /* ── ERROR STATE ─────────────────────────────────────────────── */
  const renderErrorState = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', textAlign: 'center', gap: '20px' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--danger-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle style={{ width: '28px', height: '28px', color: 'var(--danger)' }} />
      </div>
      <h3 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-title)' }}>Extraction Failed</h3>
      <p style={{ fontSize: '15px', color: 'var(--text-body)', maxWidth: '400px' }}>{appState.analysisError}</p>
      <button onClick={handleReset} className="btn-secondary" style={{ marginTop: '16px' }}>Return to Upload</button>
    </div>
  );

  /* ── LANDING PAGE (NO RESUME YET) ────────────────────────────── */
  if (!appState.hasResume) {
    return (
      <HeroSection 
        onStartAnalysis={handleStartAnalysis}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  /* ── MAIN APP SHELL ──────────────────────────────────────────── */
  return (
    <AppShell
      activeWorkspace={activeWorkspace}
      setActiveWorkspace={setActiveWorkspace}
      parsedResume={appState.analysisData?.parsed_resume || null}
      onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      onReset={handleReset}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveWorkspace}
        onReset={handleReset}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {appState.isAnalyzing && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderLoadingState()}
            </motion.div>
          )}

          {!appState.isAnalyzing && appState.analysisError && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {renderErrorState()}
            </motion.div>
          )}

          {!appState.isAnalyzing && appState.analysisData && (
            <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
              
              {/* Executive Summary */}
              {activeWorkspace === 'executive' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                        Executive Summary
                      </span>
                      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '48px', lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--text-title)' }}>
                        Intelligence Report for {appState.analysisData.parsed_resume.name.split(' ')[0]}
                      </h2>
                      <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.65, maxWidth: '600px' }}>
                        Your resume has been processed. We extracted {appState.analysisData.parsed_resume.skills.technical.length} technical skills and identified your profile as a {appState.analysisData.parsed_resume.inferred_level}-level candidate.
                      </p>
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', height: 'fit-content' }}
                    >
                      <Download style={{ width: '16px', height: '16px' }} />
                      <span>Export 42-Page PDF Report</span>
                    </button>
                  </div>

                  {/* High-Level Overview Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    <div className="surface-lg" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Resume ATS Score</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '40px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>
                          {appState.analysisData.ats_analysis.overall_score}
                        </span>
                        <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/ 100</span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                        High formatting score, but action verb density is at {appState.analysisData.ats_analysis.action_verbs_score}%. Consider upgrading passive phrasing.
                      </p>
                    </div>

                    <div className="surface-lg" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current Market Value</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '40px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-title)' }}>
                          ₹{(appState.analysisData.salary.current_estimate / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
                        Estimated baseline for {appState.analysisData.parsed_resume.headline} roles. Acquiring {appState.analysisData.skill_gap.missing_skills[0]?.skill} can push this to the 75th percentile.
                      </p>
                    </div>
                  </div>

                  <div className="surface-md" style={{ padding: '32px', borderLeft: '4px solid var(--accent)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Sparkles style={{ width: '20px', height: '20px', color: 'var(--accent)' }} />
                      <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-title)' }}>AI Career Coach</span>
                    </div>
                    <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.7, maxWidth: '800px' }}>
                      {appState.analysisData.insights.ai_reasoning}
                    </p>
                  </div>

                </div>
              )}

              {activeWorkspace === 'skill-gap' && <CareerAnalysis analysis={appState.analysisData} />}
              {activeWorkspace === 'salary' && <SalaryIntelligence analysis={appState.analysisData} />}
              {activeWorkspace === 'career-paths' && <CareerTransition analysis={appState.analysisData} />}
              {activeWorkspace === 'growth' && <GrowthEngine analysis={appState.analysisData} />}
              {activeWorkspace === 'roadmap' && <RoadmapTree analysis={appState.analysisData} />}
              {activeWorkspace === 'market' && <MarketPulse analysis={appState.analysisData} />}

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
