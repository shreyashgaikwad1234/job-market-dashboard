import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ResumeAnalysisResponse } from '../../types';
import { Briefcase, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface Props {
  analysis: ResumeAnalysisResponse;
}

const CareerTransition: React.FC<Props> = ({ analysis }) => {
  const { current_role, transitions } = analysis.career_paths;
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const svgWidth = 800;
  const svgHeight = Math.max(400, transitions.length * 100);
  const startX = 200;
  const endX = svgWidth - 250;
  
  const startY = svgHeight / 2;
  
  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case 'low': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      case 'medium': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'high': return 'text-rose-400 border-rose-400/30 bg-rose-400/10';
      default: return 'text-slate-400 border-slate-700 bg-slate-800';
    }
  };

  const getStrokeColor = (effort: string, isHovered: boolean, isDimmed: boolean) => {
    if (isDimmed) return 'rgba(51, 65, 85, 0.3)';
    switch (effort.toLowerCase()) {
      case 'low': return isHovered ? '#34d399' : 'rgba(52, 211, 153, 0.4)';
      case 'medium': return isHovered ? '#fbbf24' : 'rgba(251, 191, 36, 0.4)';
      case 'high': return isHovered ? '#fb7185' : 'rgba(251, 113, 133, 0.4)';
      default: return isHovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.4)';
    }
  };

  const getDemandIcon = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'growing': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'stable': return <Minus className="w-4 h-4 text-slate-400" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-rose-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-2xl overflow-hidden relative">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-slate-100 tracking-tight">Career Topology</h2>
        <p className="text-slate-400 text-sm mt-2 font-medium">Mapping optimal vectors from your current position</p>
      </div>

      <div className="relative w-full overflow-x-auto flex justify-center scrollbar-hide">
        <div style={{ width: svgWidth, height: svgHeight }} className="relative min-w-[800px]">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {transitions.map((transition, index) => {
              const nodeY = (svgHeight / (transitions.length + 1)) * (index + 1);
              const isHovered = hoveredNode === transition.target_role;
              const isDimmed = hoveredNode !== null && !isHovered;
              
              const cp1X = startX + (endX - startX) / 2;
              const cp1Y = startY;
              const cp2X = startX + (endX - startX) / 2;
              const cp2Y = nodeY;

              return (
                <g key={`path-${index}`}>
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: index * 0.2, ease: "easeInOut" }}
                    d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${nodeY}`}
                    fill="none"
                    stroke={getStrokeColor(transition.effort_level, isHovered, isDimmed)}
                    strokeWidth={isHovered ? 4 : 2}
                    className="transition-colors duration-300"
                  />
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: isDimmed ? 0 : 1, scale: isDimmed ? 0 : 1 }}
                    transition={{ duration: 0.3, delay: 1.5 + index * 0.1 }}
                  >
                    <rect
                      x={startX + (endX - startX) * 0.5 - 24}
                      y={(startY + nodeY) / 2 - 12}
                      width="48"
                      height="24"
                      rx="12"
                      fill="#1e293b"
                      stroke="#334155"
                      className="transition-opacity duration-300"
                    />
                    <text
                      x={startX + (endX - startX) * 0.5}
                      y={(startY + nodeY) / 2 + 4}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="600"
                      className="transition-opacity duration-300"
                    >
                      {transition.overlap_pct}%
                    </text>
                  </motion.g>
                </g>
              );
            })}
          </svg>

          <div
            className="absolute z-10 flex items-center justify-center"
            style={{ left: startX - 180, top: startY - 40, width: 180, height: 80 }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800/80 backdrop-blur-md border border-slate-600 rounded-xl p-4 shadow-xl flex flex-col items-center justify-center w-full relative z-20 group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Briefcase className="w-5 h-5 text-blue-400 mb-2 relative z-10" />
              <div className="text-sm font-semibold text-slate-200 text-center relative z-10">{current_role}</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1 relative z-10">Current Axis</div>
            </motion.div>
          </div>

          {transitions.map((transition, index) => {
            const nodeY = (svgHeight / (transitions.length + 1)) * (index + 1);
            const isHovered = hoveredNode === transition.target_role;
            const isDimmed = hoveredNode !== null && !isHovered;

            return (
              <div
                key={`node-${index}`}
                className="absolute z-10 flex items-center"
                style={{ left: endX, top: nodeY - 45, width: 250, height: 90 }}
                onMouseEnter={() => setHoveredNode(transition.target_role)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className={`w-full p-4 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
                    isDimmed ? 'opacity-40 scale-95 border-slate-800 bg-slate-900/50' : 
                    isHovered ? 'scale-105 shadow-[0_0_30px_rgba(0,0,0,0.3)] z-30 ' + getEffortColor(transition.effort_level) : 
                    'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-100 text-sm leading-tight pr-2">{transition.target_role}</h3>
                    <div className="flex items-center gap-1 shrink-0 bg-slate-900/50 rounded-full px-2 py-0.5 border border-slate-700/50">
                      {getDemandIcon(transition.hiring_demand)}
                      <span className="text-[10px] font-medium text-slate-300 uppercase tracking-wider">{transition.hiring_demand}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-medium">Salary Delta</span>
                      <span className={`text-xs font-bold ${transition.salary_delta_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {transition.salary_delta_pct > 0 ? '+' : ''}{transition.salary_delta_pct}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-500 font-medium">Effort</span>
                      <span className="text-xs font-bold text-slate-300">{transition.effort_level}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CareerTransition;
