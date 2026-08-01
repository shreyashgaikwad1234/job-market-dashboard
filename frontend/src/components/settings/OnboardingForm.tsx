import React, { useState } from 'react';
import { 
  ArrowRight, ArrowLeft, Terminal, Check, Upload,
  Database, LineChart, Code, Cpu, MapPin, Milestone
} from 'lucide-react';
import { MOCK_ROLES, MOCK_LOCATIONS, MOCK_STANDARD_SKILLS } from '../../lib/data/mockData';
import type { ProfileType } from '../../types';

interface OnboardingFormProps {
  onComplete: (profile: ProfileType) => void;
}

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState('Data Scientist');
  const [experience, setExperience] = useState('1-3 Years');
  const [location, setLocation] = useState('Bangalore');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['SQL', 'Excel', 'Machine Learning', 'AWS']);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleNext = () => {
    if (step < 3) setStep(prev => prev + 1);
    else startScanning();
  };

  const handlePrev = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const startScanning = () => {
    setIsScanning(true);
    const messages = [
      "Connecting to India Job Market database...",
      `Correlating active listings in ${location}...`,
      `Calculating skill frequency weights for ${track}...`,
      "Analyzing match coverage vectors...",
      "Generating Data Career Intelligence report..."
    ];
    let msgIdx = 0;
    setScanMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx++;
      if (msgIdx < messages.length) {
        setScanMessage(messages[msgIdx]);
      } else {
        clearInterval(interval);
        setIsScanning(false);
        onComplete({ track, skills: selectedSkills, experience, location });
      }
    }, 900);
  };

  const getRoleIcon = (role: string) => {
    const icons: Record<string, any> = {
      "Data Scientist": Cpu, "Data Analyst": LineChart, "Business Analyst": Database,
      "BI Analyst": LineChart, "Analytics Consultant": Code, "Strategy Analyst": Milestone,
    };
    return icons[role] || Database;
  };

  const getRoleDesc = (role: string) => {
    const descs: Record<string, string> = {
      "Data Scientist": "Statistical modeling & ML pipelines.",
      "Data Analyst": "Analytical dashboards & KPIs.",
      "Business Analyst": "Operations audit & requirements.",
      "BI Analyst": "Business Intelligence stack.",
      "Analytics Consultant": "Infrastructure & engineering.",
      "Strategy Analyst": "Market assessment & growth.",
    };
    return descs[role] || "General analytics track.";
  };

  return (
    <div style={{
      width: '100%', maxWidth: '680px', margin: '0 auto', padding: '48px',
      backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: '20px', boxShadow: 'var(--shadow-lg)', userSelect: 'none',
    }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal style={{ width: '16px', height: '16px', color: 'var(--accent)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-body)' }}>
            Configure Workspace
          </span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
          Step {step} of 3
        </span>
      </div>

      {/* ── Progress Dots ────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '32px' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            width: s === step ? '32px' : '10px', height: '10px', borderRadius: '999px',
            backgroundColor: s <= step ? 'var(--accent)' : 'var(--bg-elevated)',
            border: s <= step ? 'none' : '1px solid var(--border)',
            transition: 'all 300ms ease',
          }} />
        ))}
      </div>

      {/* ── Scanning Loader ──────────────────────────────────── */}
      {isScanning ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', textAlign: 'center', gap: '24px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid var(--border)', borderTopColor: 'var(--accent)',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              Processing Profile
            </span>
            <p style={{ fontSize: '14px', color: 'var(--text-body)', fontFamily: 'var(--font-mono)', marginTop: '12px', maxWidth: '360px' }}>
              {scanMessage}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ── Step 1: Role / Experience / Location ──────────── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: 'var(--text-title)' }}>Select Target Track</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', marginTop: '6px' }}>Pick your role, experience, and location to begin analysis.</p>
              </div>

              {/* Roles */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>Target Role</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {MOCK_ROLES.slice(0, 6).map(role => {
                    const Icon = getRoleIcon(role);
                    const isSelected = track === role;
                    return (
                      <button
                        key={role}
                        onClick={() => setTrack(role)}
                        style={{
                          padding: '16px 14px', borderRadius: '12px', cursor: 'pointer',
                          display: 'flex', flexDirection: 'column', gap: '8px',
                          textAlign: 'left', border: '1px solid', transition: 'all 150ms',
                          ...(isSelected
                            ? { backgroundColor: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                            : { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-body)' }
                          ),
                        }}
                      >
                        <Icon style={{ width: '18px', height: '18px' }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: isSelected ? 'var(--accent)' : 'var(--text-title)' }}>{role}</span>
                        <span style={{ fontSize: '12px', color: isSelected ? 'var(--accent)' : 'var(--text-muted)', opacity: 0.8 }}>{getRoleDesc(role)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience + Location */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>Experience</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {['0-1 Years', '1-3 Years', '3-5 Years', '5+ Years'].map(exp => (
                      <button
                        key={exp}
                        onClick={() => setExperience(exp)}
                        style={{
                          padding: '12px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                          cursor: 'pointer', border: '1px solid', textAlign: 'left', transition: 'all 150ms',
                          ...(experience === exp
                            ? { backgroundColor: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                            : { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-body)' }
                          ),
                        }}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-body)' }}>Location</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {MOCK_LOCATIONS.slice(0, 6).map(loc => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc)}
                        style={{
                          padding: '12px 14px', borderRadius: '10px', fontSize: '14px', fontWeight: 500,
                          cursor: 'pointer', border: '1px solid', textAlign: 'left', transition: 'all 150ms',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          ...(location === loc
                            ? { backgroundColor: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                            : { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-body)' }
                          ),
                        }}
                      >
                        <MapPin style={{ width: '13px', height: '13px', opacity: 0.6 }} />
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Skills ───────────────────────────────── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: 'var(--text-title)' }}>Skill Audit</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', marginTop: '6px' }}>Select the tools, languages, and frameworks you're proficient in.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {MOCK_STANDARD_SKILLS.map(skill => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        padding: '10px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                        cursor: 'pointer', border: '1px solid', transition: 'all 150ms',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        ...(isSelected
                          ? { backgroundColor: 'var(--accent-muted)', borderColor: 'var(--accent)', color: 'var(--accent)' }
                          : { backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-body)' }
                        ),
                      }}
                    >
                      {isSelected && <Check style={{ width: '14px', height: '14px' }} />}
                      {skill}
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* ── Step 3: Resume Upload ────────────────────────── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: 'var(--text-title)' }}>Resume Upload</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-body)', marginTop: '6px' }}>Upload your resume for enhanced analysis. This step is optional.</p>
              </div>

              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault(); setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile) setFile(droppedFile);
                }}
                style={{
                  padding: '48px 24px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer',
                  border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
                  backgroundColor: isDragging ? 'var(--accent-muted)' : 'var(--bg-elevated)',
                  transition: 'all 200ms',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                }}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload style={{ width: '28px', height: '28px', color: isDragging ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-title)' }}>
                  {file ? file.name : 'Drop your resume here'}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF, DOCX, or TXT — max 5 MB'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }}
                />
              </div>
            </div>
          )}

          {/* ── Nav Buttons ──────────────────────────────────── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            {step > 1 ? (
              <button onClick={handlePrev} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft style={{ width: '15px', height: '15px' }} />
                <span>Back</span>
              </button>
            ) : <div />}
            <button onClick={handleNext} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{step === 3 ? 'Launch Workspace' : 'Continue'}</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
