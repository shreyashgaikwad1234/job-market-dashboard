import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import type { ResumeAnalysisResponse } from '../../types';

interface MarketPulseProps {
  analysis: ResumeAnalysisResponse;
}

const MarketPulse: React.FC<MarketPulseProps> = ({ analysis }) => {
  const { market, salary } = analysis;

  // Data for "Which skills are changing?"
  const skillTrends = [
    ...(market.trending_skills || []).map((s) => ({ skill: s.skill, value: s.growth_pct, type: 'growth' })),
    ...(market.declining_skills || []).map((s) => ({ skill: s.skill, value: -s.drop_pct, type: 'decline' })),
  ].sort((a, b) => b.value - a.value);

  // Data for "Which cities pay the most?"
  const cityData = (salary.location_premium || []).map((loc) => ({
    city: loc.city,
    premium: loc.premium_pct,
    median: loc.median,
  })).sort((a, b) => b.premium - a.premium);

  // Top companies
  const companyData = [...(market.top_hiring_companies || [])].sort((a, b) => b.open_roles - a.open_roles);
  const maxRoles = companyData.length > 0 ? companyData[0].open_roles : 1;

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      padding: '32px',
      background: '#ffffff',
      color: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: '#0f172a' }}>Market Insights</h2>
        <p style={{ color: '#64748b', fontSize: '15px', margin: '6px 0 0 0', lineHeight: 1.5 }}>
          Real-time, data-driven analysis of your technology stack across the industry.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        
        {/* Question 1 */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '20px' }}>
            Which skills are rising?
          </h3>
          <div style={{ height: '320px', width: '100%', background: '#f8fafc', padding: '16px 16px 16px 0', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillTrends} layout="vertical" margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="skill" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#334155' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: '13px' }} formatter={(val: number) => [`${val > 0 ? '+' : ''}${val}%`, 'Trend']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
                  {skillTrends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Question 3 */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '20px' }}>
            Which cities pay the most?
          </h3>
          <div style={{ height: '320px', width: '100%', background: '#f8fafc', padding: '16px 24px 16px 0', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="premium" type="number" name="Premium %" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} tickFormatter={(val) => `+${val}%`} />
                <YAxis dataKey="city" type="category" name="City" tick={{ fontSize: 12, fill: '#334155' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} width={70} />
                <ZAxis dataKey="median" type="number" range={[60, 400]} name="Median Salary" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', fontSize: '13px' }} formatter={(val: number, name: string) => [name === 'Median Salary' ? `$${val.toLocaleString()}` : `${val}%`, name]} />
                <Scatter data={cityData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Question 2 */}
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', marginBottom: '20px' }}>
            What companies hire my stack?
          </h3>
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', overflow: 'hidden', height: '320px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 1 }}>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569' }}>Company</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600, color: '#475569', textAlign: 'right' }}>Open Roles</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((company, i) => (
                    <tr key={i} style={{ borderBottom: i === companyData.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 500, color: '#0f172a' }}>{company.name}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                          <span style={{ fontWeight: 500, color: '#334155' }}>{company.open_roles}</span>
                          <div style={{ width: '48px', height: '4px', background: '#f1f5f9', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.max(5, (company.open_roles / maxRoles) * 100)}%`, height: '100%', background: '#3b82f6' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {companyData.length === 0 && (
                    <tr>
                      <td colSpan={2} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                        No hiring data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default MarketPulse;
