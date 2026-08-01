import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { ResumeAnalysisResponse } from '../../types';

interface SalaryIntelligenceProps {
  analysis: ResumeAnalysisResponse;
}

export default function SalaryIntelligence({ analysis }: SalaryIntelligenceProps) {
  const { salary } = analysis;
  const { percentiles, skill_roi } = salary;
  const currentEstimate = salary.current_estimate || percentiles.p50;

  // Simulator State
  const [targetPercentile, setTargetPercentile] = useState<number>(50);
  const [selectedSkillsCount, setSelectedSkillsCount] = useState<number>(0);

  // Distribution Data
  const distributionData = useMemo(() => {
    return [
      { name: '10th', salary: percentiles.p10, density: 10 },
      { name: '25th', salary: percentiles.p25, density: 40 },
      { name: '50th', salary: percentiles.p50, density: 100 },
      { name: '75th', salary: percentiles.p75, density: 40 },
      { name: '90th', salary: percentiles.p90, density: 10 },
    ];
  }, [percentiles]);

  // Calculations for ROI
  const maxSkills = skill_roi.length;
  const topSkills = [...skill_roi].sort((a, b) => b.expected_bump_pct - a.expected_bump_pct);
  const accumulatedBumpPct = topSkills.slice(0, selectedSkillsCount).reduce((sum, s) => sum + s.expected_bump_pct, 0);
  
  const baseSalary = percentiles.p50;
  const projectedSalary = Math.round(currentEstimate * (1 + accumulatedBumpPct / 100));
  
  const targetSalary = targetPercentile === 10 ? percentiles.p10
                     : targetPercentile === 25 ? percentiles.p25
                     : targetPercentile === 50 ? percentiles.p50
                     : targetPercentile === 75 ? percentiles.p75
                     : percentiles.p90;

  const gapToTarget = targetSalary - projectedSalary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-title)', margin: 0 }}>
          Salary Intelligence
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--text-body)', margin: 0 }}>
          Where do I stand in the market?
        </p>
      </div>

      {/* Distribution Chart */}
      <div style={{ 
        backgroundColor: 'var(--bg-elevated)', 
        border: '1px solid var(--border)', 
        borderRadius: '8px', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-title)' }}>Market Distribution (LPA)</div>
        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="salary" 
                tick={{ fill: 'var(--text-body)', fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(val) => `₹${val}L`}
              />
              <YAxis hide domain={[0, 110]} />
              <Tooltip 
                cursor={{ stroke: 'var(--text-muted)', strokeWidth: 1, strokeDasharray: '4 4' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{ 
                        background: 'var(--bg-elevated)', 
                        border: '1px solid var(--border)', 
                        padding: '8px 12px', 
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        <div style={{ color: 'var(--text-title)', fontWeight: 600 }}>{data.name} Percentile</div>
                        <div style={{ color: 'var(--text-body)' }}>₹{data.salary} LPA</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="density" 
                stroke="var(--text-title)" 
                strokeWidth={2}
                fill="var(--text-title)" 
                fillOpacity={0.1}
                isAnimationActive={false}
              />
              <ReferenceLine 
                x={currentEstimate} 
                stroke="var(--accent)" 
                strokeDasharray="3 3" 
                label={{ position: 'top', value: 'You', fill: 'var(--accent)', fontSize: 12, fontWeight: 600 }} 
              />
              {projectedSalary !== currentEstimate && (
                <ReferenceLine 
                  x={projectedSalary} 
                  stroke="var(--success)" 
                  strokeDasharray="3 3" 
                  label={{ position: 'top', value: 'Projected', fill: 'var(--success)', fontSize: 12, fontWeight: 600 }} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROI Simulator */}
      <div style={{ 
        backgroundColor: 'var(--bg-elevated)', 
        border: '1px solid var(--border)', 
        borderRadius: '8px', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-title)' }}>ROI Simulator</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <label style={{ color: 'var(--text-body)', fontWeight: 500 }}>Target Percentile</label>
              <span style={{ color: 'var(--text-title)', fontWeight: 600 }}>{targetPercentile}th (₹{targetSalary}L)</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="90" 
              step="15" 
              value={targetPercentile} 
              onChange={(e) => setTargetPercentile(Number(e.target.value))}
              style={{ accentColor: 'var(--text-title)', width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>P10</span>
              <span>P50</span>
              <span>P90</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <label style={{ color: 'var(--text-body)', fontWeight: 500 }}>High-ROI Skills Acquired</label>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{selectedSkillsCount} / {maxSkills}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max={maxSkills} 
              step="1" 
              value={selectedSkillsCount} 
              onChange={(e) => setSelectedSkillsCount(Number(e.target.value))}
              style={{ accentColor: 'var(--accent)', width: '100%' }}
            />
            {selectedSkillsCount > 0 && (
              <div style={{ fontSize: '12px', color: 'var(--text-body)' }}>
                Added: {topSkills.slice(0, selectedSkillsCount).map(s => s.skill).join(', ')} 
                <span style={{ color: 'var(--success)', marginLeft: '4px' }}>(+{accumulatedBumpPct}%)</span>
              </div>
            )}
          </div>

        </div>

        {/* Actionable Recommendation */}
        <div style={{ 
          marginTop: '8px', 
          padding: '16px', 
          backgroundColor: gapToTarget <= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          borderLeft: gapToTarget <= 0 ? '3px solid var(--success)' : '3px solid var(--text-muted)',
          borderRadius: '4px',
          fontSize: '13px',
          lineHeight: '1.5',
          color: 'var(--text-title)'
        }}>
          {gapToTarget <= 0 ? (
            <span>
              <strong>Target Reached:</strong> By acquiring these skills, your projected value (₹{projectedSalary}L) exceeds your target of ₹{targetSalary}L. You are positioned highly competitively for your level.
            </span>
          ) : (
            <span>
              <strong>Recommendation:</strong> You have a gap of ₹{gapToTarget}L to reach the {targetPercentile}th percentile. Focus on acquiring <strong>{topSkills[selectedSkillsCount]?.skill || 'more leadership skills'}</strong> to bridge this gap and optimize your market value.
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
