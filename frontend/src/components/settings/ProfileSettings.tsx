import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, RefreshCw, Shield } from 'lucide-react';
import { MOCK_ROLES, MOCK_LOCATIONS, MOCK_STANDARD_SKILLS } from '../../lib/data/mockData';
import type { ProfileType } from '../../types';

interface ProfileSettingsProps {
  profile: ProfileType;
  onUpdateProfile: (profile: ProfileType) => void;
  onReset: () => void;
}

export default function ProfileSettings({ profile, onUpdateProfile, onReset }: ProfileSettingsProps) {
  const handleTrackChange = (e: React.ChangeEvent<HTMLSelectElement>) => onUpdateProfile({ ...profile, track: e.target.value });
  const handleExperienceChange = (e: React.ChangeEvent<HTMLSelectElement>) => onUpdateProfile({ ...profile, experience: e.target.value });
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => onUpdateProfile({ ...profile, location: e.target.value });
  const toggleSkill = (skill: string) => {
    const skills = profile.skills.includes(skill) ? profile.skills.filter(s => s !== skill) : [...profile.skills, skill];
    onUpdateProfile({ ...profile, skills });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>Settings</span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '48px', lineHeight: 1.1, letterSpacing: '-0.025em', color: 'var(--text-title)' }}>
          Workspace Settings
        </h2>
        <p style={{ fontSize: '16px', color: 'var(--text-body)', lineHeight: 1.65, maxWidth: '600px' }}>
          Update your workspace variables to recalculate all matching rates, salary projections, and learning paths.
        </p>
      </div>

      {/* ── Parameter Cards ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

        {/* Core Profile */}
        <div className="surface-lg" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
            <span style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-title)' }}>Core Profile</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>Target Career Track</label>
              <select value={profile.track} onChange={handleTrackChange} className="input-field">
                {MOCK_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>Experience</label>
                <select value={profile.experience} onChange={handleExperienceChange} className="input-field">
                  <option value="0-1 Years">0-1 Years</option>
                  <option value="1-3 Years">1-3 Years</option>
                  <option value="3-5 Years">3-5 Years</option>
                  <option value="5+ Years">5+ Years</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>Location</label>
                <select value={profile.location} onChange={handleLocationChange} className="input-field">
                  {MOCK_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="surface-lg" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Shield style={{ width: '16px', height: '16px', color: 'var(--danger)' }} />
              <span style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-title)' }}>Danger Zone</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', lineHeight: 1.6 }}>
              Clear your local storage and return to the onboarding wizard. This cannot be undone.
            </p>
          </div>
          <button onClick={onReset} className="btn-danger" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <RefreshCw style={{ width: '15px', height: '15px' }} />
            <span>Reset Workspace</span>
          </button>
        </div>
      </div>

      {/* ── Skills Inventory ──────────────────────────────────── */}
      <div className="surface-lg" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <span style={{ fontSize: '20px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-title)' }}>
          Skills Inventory ({profile.skills.length} selected)
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {MOCK_STANDARD_SKILLS.map(skill => {
            const isSelected = profile.skills.includes(skill);
            return (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', border: '1px solid', transition: 'all 150ms',
                  ...(isSelected
                    ? { backgroundColor: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                    : { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-body)' }
                  ),
                }}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
