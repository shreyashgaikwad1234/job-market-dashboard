import React from 'react';
import { Trophy, CheckCircle, Clock, Star, Target, Flag } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ResumeAnalysisResponse } from '../../types';

export default function RoadmapTree({ analysis }: { analysis: ResumeAnalysisResponse }) {
  const { roadmap } = analysis;

  return (
    <div className="flex flex-col gap-10 w-full max-w-5xl mx-auto py-8">
      {/* Header section with Gamified stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Trophy size={240} />
        </div>
        
        <div className="space-y-2 z-10">
          <h2 className="text-3xl font-light tracking-tight text-white">Learning Roadmap</h2>
          <p className="text-sm text-slate-300 font-medium tracking-wide uppercase">Your path to mastery</p>
        </div>

        <div className="flex gap-8 z-10 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
          <div>
            <div className="text-xs text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Star className="w-3 h-3" /> Total XP
            </div>
            <div className="text-3xl font-semibold">{roadmap.total_xp_available.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Target className="w-3 h-3" /> Goals
            </div>
            <div className="text-3xl font-semibold">{roadmap.weekly_goals.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Weekly Goals */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Clock className="w-5 h-5 text-indigo-500" /> Weekly Quests
          </h3>
          
          <div className="space-y-4">
            {roadmap.weekly_goals.map((goal, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index} 
                className="group relative bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="absolute -left-2.5 -top-2.5 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                  {goal.week}
                </div>
                <h4 className="font-medium text-gray-800 mb-2 mt-1">{goal.focus}</h4>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {goal.hours_required} hrs
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-xs px-3 py-1 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Quest
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Stages & Capstones */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Flag className="w-5 h-5 text-amber-500" /> Milestone Stages
          </h3>

          <div className="relative border-l-2 border-gray-100 ml-4 space-y-10 pb-4">
            {roadmap.stages.map((stage, index) => (
              <div key={index} className="relative pl-8">
                {/* Node marker */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-white border-4 border-amber-400 rounded-full shadow-sm" />
                
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{stage.name}</h4>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {stage.topics.map(topic => (
                    <span key={topic} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Capstone Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-amber-600 tracking-wider uppercase mb-1">Capstone Project</div>
                      <h5 className="text-lg font-medium text-gray-900 mb-3">{stage.capstone.title}</h5>
                      
                      <div className="space-y-2">
                        {stage.capstone.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
