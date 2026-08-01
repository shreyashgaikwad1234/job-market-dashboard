import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { ResumeAnalysisResponse } from '../../types';
import { ShieldCheck, Target, TrendingUp } from 'lucide-react';

export default function CareerAnalysis({ analysis }: { analysis: ResumeAnalysisResponse }) {
  const { skill_gap } = analysis;

  const chartData = useMemo(() => {
    const data = [];
    
    // verified skills
    skill_gap.verified_skills.slice(0, 4).forEach(skill => {
      data.push({
        subject: skill,
        verified: 100,
        missing: 0,
      });
    });

    // missing skills
    skill_gap.missing_skills.slice(0, 4).forEach(skill => {
      data.push({
        subject: skill.skill,
        verified: 0,
        missing: (skill.importance * 10) || 80, // rough heuristic
      });
    });

    return data;
  }, [skill_gap]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-light tracking-tight text-gray-900">Skill Gap Workspace</h2>
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase">Market Alignment Analysis</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-light text-gray-900">{skill_gap.match_percentage}%</div>
          <div className="text-sm text-gray-500">Match Percentage</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Radar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Competency vs. Market Demand</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Verified" dataKey="verified" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Radar name="Missing" dataKey="missing" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Insights & Stats */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-blue-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800">Market Percentile</h4>
            </div>
            <div className="text-3xl font-light text-gray-900 mb-1">Top {100 - skill_gap.market_demand_percentile}%</div>
            <p className="text-sm text-gray-500">In current applicant pool</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-emerald-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800">Verified Strengths</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill_gap.verified_skills.slice(0, 5).map(skill => (
                <span key={skill} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                  {skill}
                </span>
              ))}
              {skill_gap.verified_skills.length > 5 && (
                <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium rounded-full border border-gray-100">
                  +{skill_gap.verified_skills.length - 5} more
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-rose-500 w-5 h-5" />
              <h4 className="font-semibold text-gray-800">Critical Gaps</h4>
            </div>
            <div className="space-y-4">
              {skill_gap.missing_skills.slice(0, 3).map(skill => (
                <div key={skill.skill} className="flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-700">{skill.skill}</div>
                  <div className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                    {skill.time_to_learn_weeks} wk prep
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
