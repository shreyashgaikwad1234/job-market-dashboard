export interface ParsedResume {
  id: string;
  name: string;
  headline: string;
  inferred_level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Principal';
  years_of_experience: number;
  education: Array<{ degree: string; institution: string; year: string }>;
  experience: Array<{ title: string; company: string; duration: string; bullets: string[] }>;
  projects: Array<{ title: string; description: string }>;
  skills: {
    technical: string[];
    business: string[];
    soft: string[];
  };
}

export interface ATSAnalysis {
  overall_score: number;
  formatting_score: number;
  action_verbs_score: number;
  quantified_impact_score: number;
  feedback: Array<{ category: string; suggestion: string; severity: 'high' | 'medium' | 'low' }>;
}

export interface ResumeInsights {
  strengths: string[];
  weaknesses: string[];
  ai_reasoning: string;
  recommended_role: string;
}

export interface SkillGapAnalysis {
  match_percentage: number;
  verified_skills: string[];
  missing_skills: Array<{ skill: string; importance: number; time_to_learn_weeks: number }>;
  market_demand_percentile: number;
}

export interface SalaryAnalysis {
  current_estimate: number;
  percentiles: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  location_premium: Array<{ city: string; median: number; premium_pct: number }>;
  skill_roi: Array<{ skill: string; expected_bump_pct: number }>;
}

export interface CareerPathAnalysis {
  current_role: string;
  transitions: Array<{
    target_role: string;
    overlap_pct: number;
    effort_level: 'Low' | 'Medium' | 'High';
    hiring_demand: 'Growing' | 'Stable' | 'Declining';
    salary_delta_pct: number;
  }>;
}

export interface LearningRoadmap {
  total_xp_available: number;
  weekly_goals: Array<{ week: number; focus: string; hours_required: number }>;
  stages: Array<{
    name: string;
    topics: string[];
    capstone: { title: string; checklist: string[] };
  }>;
}

export interface MarketAnalysis {
  trending_skills: Array<{ skill: string; growth_pct: number }>;
  declining_skills: Array<{ skill: string; drop_pct: number }>;
  top_hiring_companies: Array<{ name: string; open_roles: number }>;
  city_demand_heatmap: Array<{ city: string; demand_index: number }>;
}

export interface ResumeAnalysisResponse {
  status: 'success' | 'partial' | 'failed';
  parsed_resume: ParsedResume;
  ats_analysis: ATSAnalysis;
  insights: ResumeInsights;
  skill_gap: SkillGapAnalysis;
  salary: SalaryAnalysis;
  career_paths: CareerPathAnalysis;
  roadmap: LearningRoadmap;
  market: MarketAnalysis;
}

// Global Application State Type
export interface AppState {
  hasResume: boolean;
  isAnalyzing: boolean;
  analysisError: string | null;
  analysisData: ResumeAnalysisResponse | null;
}
