import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, TrendingUp, Search, BarChart3, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { ProfileType } from '../../types';

interface HeroSectionProps {
  onStartAnalysis: (profile: ProfileType) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export default function HeroSection({ onStartAnalysis, theme, toggleTheme }: HeroSectionProps) {
  const [role, setRole] = useState('Data Scientist');
  const [experience, setExperience] = useState('3-5 Years');
  const [skills, setSkills] = useState<string[]>(['Python', 'SQL']);
  
  const availableSkills = ['Python', 'SQL', 'R', 'Tableau', 'Power BI', 'AWS', 'Spark', 'Snowflake', 'dbt', 'TensorFlow', 'PyTorch'];

  const toggleSkill = (s: string) => {
    if (skills.includes(s)) setSkills(skills.filter(sk => sk !== s));
    else setSkills([...skills, s]);
  };

  const handleStart = () => {
    onStartAnalysis({
      track: role,
      experience: experience,
      location: 'Remote',
      skills: skills
    });
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* ── Navigation ─────────────────────────────────────────────── */}
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--text-title)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Terminal style={{ width: '16px', height: '16px', color: 'var(--bg-page)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: 'var(--text-title)', letterSpacing: '-0.02em' }}>
            DATASKILLS<span style={{ color: 'var(--accent)' }}>MATRIX</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-body)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </nav>

      {/* ── Hero Content ───────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', gap: '64px', overflowX: 'hidden' }}>
        
        {/* Headline & Value Proposition */}
        <div style={{ textAlign: 'center', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: '100px', backgroundColor: 'var(--accent-muted)', color: 'var(--accent)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px' }}>
              Advanced Career Intelligence
            </span>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '64px', lineHeight: 1.1, letterSpacing: '-0.03em', color: 'var(--text-title)' }}>
              Data-driven decisions for <br />
              <span style={{ color: 'var(--accent)' }}>your data career.</span>
            </h1>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ fontSize: '20px', color: 'var(--text-body)', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto' }}>
            Build your profile below to instantly unlock market-calibrated salary data, missing skill identification, and deterministic learning roadmaps.
          </motion.p>
        </div>

        {/* Interactive Configuration Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ width: '100%', maxWidth: '720px' }}>
          <div className="surface-lg" style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', borderRadius: '24px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', boxShadow: 'var(--shadow-xl)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-title)' }}>Configure Your Profile</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Takes 30 seconds</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Role */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-title)' }}>Target Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-title)', fontSize: '15px', outline: 'none' }}
                >
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Analytics Engineer">Analytics Engineer</option>
                </select>
              </div>

              {/* Experience */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-title)' }}>Experience Level</label>
                <select 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-page)', color: 'var(--text-title)', fontSize: '15px', outline: 'none' }}
                >
                  <option value="0-1 Years">0-1 Years (Entry Level)</option>
                  <option value="1-3 Years">1-3 Years (Junior)</option>
                  <option value="3-5 Years">3-5 Years (Mid-Level)</option>
                  <option value="5+ Years">5+ Years (Senior)</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-title)' }}>Current Tech Stack</label>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{skills.length} selected</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableSkills.map(s => {
                  const isActive = skills.includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => toggleSkill(s)}
                      style={{
                        padding: '8px 16px', borderRadius: '100px', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                        backgroundColor: isActive ? 'var(--accent-muted)' : 'var(--bg-page)',
                        color: isActive ? 'var(--accent)' : 'var(--text-body)',
                        transition: 'all 150ms ease',
                        display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      {isActive && <CheckCircle2 style={{ width: '14px', height: '14px' }} />}
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div style={{ paddingTop: '16px' }}>
              <button 
                onClick={handleStart}
                style={{
                  width: '100%', padding: '16px', borderRadius: '12px', border: 'none',
                  backgroundColor: 'var(--text-title)', color: 'var(--bg-page)',
                  fontSize: '16px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'transform 150ms ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Generate Career Intelligence <ChevronRight style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Proof Section (Methodology) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', marginTop: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>
            Data Integrity & Methodology
          </span>
          <div style={{ display: 'flex', gap: '64px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { val: '12,500+', label: 'Job Postings Analyzed', icon: Database },
              { val: '250+', label: 'Technologies Tracked', icon: Terminal },
              { val: 'Weekly', label: 'Dataset Refresh', icon: TrendingUp },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <stat.icon style={{ width: '24px', height: '24px', color: 'var(--text-muted)' }} />
                <span style={{ fontSize: '32px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-title)' }}>{stat.val}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Workspace Previews */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '40px' }}>
          {[
            { title: 'Skill Gap Engine', desc: 'Identify exact technical requirements missing from your profile based on real job descriptions.', icon: Search },
            { title: 'Salary Intelligence', desc: 'Calculate your exact market percentile using deterministic geographic and skill-based modifiers.', icon: BarChart3 },
            { title: 'Market Trends', desc: 'Track hiring shifts across 300+ companies to prioritize learning the most demanded frameworks.', icon: TrendingUp },
          ].map(feature => (
            <div key={feature.title} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px', backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-page)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <feature.icon style={{ width: '18px', height: '18px', color: 'var(--text-title)' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-title)' }}>{feature.title}</span>
              <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6 }}>{feature.desc}</p>
            </div>
          ))}
        </motion.div>

      </main>
      
      <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: '13px' }}>
        &copy; {new Date().getFullYear()} DataSkillsMatrix. All rights reserved. Built with deterministic intelligence.
      </footer>
    </div>
  );
}