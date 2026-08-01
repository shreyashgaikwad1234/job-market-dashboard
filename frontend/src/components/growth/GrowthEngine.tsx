import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ResumeAnalysisResponse } from '../../types';
import { Target, Clock } from 'lucide-react';

interface Props {
  analysis: ResumeAnalysisResponse;
}

const GrowthEngine: React.FC<Props> = ({ analysis }) => {
  const missingSkills = analysis.skill_gap.missing_skills;
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const maxWeeks = Math.max(...missingSkills.map(s => s.time_to_learn_weeks), 12);
  
  return (
    <div className="w-full bg-slate-900 rounded-xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="relative z-10 mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-light text-slate-100 tracking-tight">Growth Engine</h2>
          <p className="text-slate-400 text-sm mt-2 font-medium">Strategic skill acquisition matrix</p>
        </div>
        
        <div className="flex gap-4 text-xs font-medium text-slate-400 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            Quick Wins
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
            Strategic Bets
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-500"></div>
            Peripheral
          </div>
        </div>
      </div>

      <div className="relative w-full h-[400px] border-l-2 border-b-2 border-slate-700/50 mt-4 z-10">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-slate-700/30 border-t border-dashed border-slate-600/50"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-slate-700/30 border-l border-dashed border-slate-600/50"></div>
        
        <div className="absolute top-4 left-4 text-[10px] font-bold tracking-widest text-slate-500/50 uppercase">Quick Wins</div>
        <div className="absolute top-4 right-4 text-[10px] font-bold tracking-widest text-slate-500/50 uppercase">Strategic Bets</div>
        <div className="absolute bottom-4 left-4 text-[10px] font-bold tracking-widest text-slate-500/50 uppercase">Minor Tweaks</div>
        <div className="absolute bottom-4 right-4 text-[10px] font-bold tracking-widest text-slate-500/50 uppercase">Distractions</div>

        <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Importance
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Time to Master (Weeks)
        </div>

        {missingSkills.map((skill, index) => {
          const xPercent = (skill.time_to_learn_weeks / maxWeeks) * 100;
          const yPercent = (skill.importance / 10) * 100;
          
          const isHighImp = skill.importance >= 7;
          const isLowTime = skill.time_to_learn_weeks <= (maxWeeks / 2);
          
          const isQuickWin = isHighImp && isLowTime;
          const isStrategic = isHighImp && !isLowTime;
          
          let bubbleColor = "bg-slate-500";
          let glowColor = "";
          let textColor = "text-slate-200";
          
          if (isQuickWin) {
            bubbleColor = "bg-blue-500";
            glowColor = "shadow-[0_0_20px_rgba(59,130,246,0.6)]";
            textColor = "text-blue-50";
          } else if (isStrategic) {
            bubbleColor = "bg-purple-500";
            glowColor = "shadow-[0_0_20px_rgba(168,85,247,0.6)]";
            textColor = "text-purple-50";
          }

          const isHovered = hoveredSkill === skill.skill;
          const isDimmed = hoveredSkill !== null && !isHovered;

          return (
            <motion.div
              key={skill.skill}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isDimmed ? 0.8 : 1, opacity: isDimmed ? 0.3 : 1 }}
              transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
              className="absolute group z-20 cursor-crosshair"
              style={{
                left: `${xPercent}%`,
                bottom: `${yPercent}%`,
                transform: 'translate(-50%, 50%)'
              }}
              onMouseEnter={() => setHoveredSkill(skill.skill)}
              onMouseLeave={() => setHoveredSkill(null)}
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-slate-800/95 backdrop-blur-xl border border-slate-600 p-4 rounded-xl shadow-2xl z-50 pointer-events-none"
                  >
                    <div className="font-bold text-slate-100 text-sm mb-3">{skill.skill}</div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Impact</span>
                        <span className="text-slate-100 font-bold">{skill.importance}/10</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Effort</span>
                        <span className="text-slate-100 font-bold">{skill.time_to_learn_weeks} wks</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="relative flex items-center justify-center">
                <div 
                  className={`rounded-full transition-all duration-300 flex items-center justify-center border border-white/20 shadow-inner
                    ${bubbleColor} ${glowColor} ${isHovered ? 'ring-4 ring-white/30 scale-110 z-40' : ''}
                  `}
                  style={{
                    width: Math.max(36, skill.importance * 7),
                    height: Math.max(36, skill.importance * 7),
                  }}
                >
                  <span className={`text-[10px] font-bold text-center px-1 leading-tight tracking-wide ${textColor} pointer-events-none drop-shadow-md`}>
                    {skill.skill.length > 10 && !isHovered ? skill.skill.slice(0,8) + '..' : skill.skill}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GrowthEngine;
