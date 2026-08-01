import type { ResumeAnalysisResponse, ProfileType } from '../../types';

// Simulate network delay to test loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * MOCK API BACKEND
 * In production, this would make real HTTP requests to the FastAPI backend.
 * For this UI build, it returns deterministic dummy data matching the strict Data Contracts.
 */
export async function generateAnalysisFromProfile(profile: ProfileType): Promise<ResumeAnalysisResponse> {
  // Simulate heavy processing time for streaming states
  await delay(1500);

  // Return a completely structured, robust dummy response
  return {
    status: 'success',
    parsed_resume: {
      id: 'res_123456',
      name: 'Guest User',
      headline: profile.track,
      inferred_level: profile.experience,
      years_of_experience: 3.5,
      education: [
        { degree: 'B.Tech in Computer Science', institution: 'IIT Bombay', year: '2020' }
      ],
      experience: [
        {
          title: 'Data Scientist',
          company: 'FinTech Corp',
          duration: '2021 - Present',
          bullets: [
            'Built churn prediction model with 89% accuracy using XGBoost.',
            'Deployed scalable ML pipelines on AWS SageMaker.',
            'Increased customer retention by 12%.'
          ]
        },
        {
          title: 'Data Analyst',
          company: 'Retail Inc',
          duration: '2020 - 2021',
          bullets: [
            'Created SQL dashboards for marketing team.',
            'Automated daily reporting using Python and Airflow.'
          ]
        }
      ],
      projects: [
        { title: 'Customer Segmentation', description: 'K-Means clustering on 1M+ rows of sales data.' }
      ],
      skills: {
        technical: profile.skills,
        business: ['A/B Testing', 'Stakeholder Management', 'Customer Retention'],
        soft: ['Communication', 'Problem Solving']
      }
    },
    ats_analysis: {
      overall_score: 82,
      formatting_score: 95,
      action_verbs_score: 70,
      quantified_impact_score: 85,
      feedback: [
        { category: 'Action Verbs', suggestion: 'Replace weak verbs like "Created" with strong verbs like "Architected" or "Engineered".', severity: 'medium' },
        { category: 'Length', suggestion: 'Resume is perfectly sized at 1 page.', severity: 'low' }
      ]
    },
    insights: {
      strengths: [
        'Strong quantitative impact in recent roles.',
        'Good mix of traditional analytics (SQL, Airflow) and ML (XGBoost, SageMaker).'
      ],
      weaknesses: [
        'Missing deep learning frameworks (TensorFlow/PyTorch) required for senior AI roles.',
        'Lack of MLOps CI/CD pipeline experience.'
      ],
      ai_reasoning: 'Based on 7,500+ Indian Data Scientist job postings, your profile strongly matches Mid-Level roles. However, transitioning to Senior requires CI/CD and advanced modeling.',
      recommended_role: 'Senior Data Scientist'
    },
    skill_gap: {
      match_percentage: 78,
      verified_skills: profile.skills,
      missing_skills: [
        { skill: 'PyTorch', importance: 9, time_to_learn_weeks: 6 },
        { skill: 'Docker/Kubernetes', importance: 8, time_to_learn_weeks: 4 },
        { skill: 'MLflow', importance: 7, time_to_learn_weeks: 2 }
      ],
      market_demand_percentile: 85
    },
    salary: {
      current_estimate: 2400000,
      percentiles: {
        p10: 1200000,
        p25: 1800000,
        p50: 2400000,
        p75: 3200000,
        p90: 4500000
      },
      location_premium: [
        { city: 'Bangalore', median: 2800000, premium_pct: 16 },
        { city: 'Pune', median: 2100000, premium_pct: -12 },
        { city: 'Hyderabad', median: 2300000, premium_pct: -4 },
        { city: 'Remote', median: 3000000, premium_pct: 25 }
      ],
      skill_roi: [
        { skill: 'PyTorch', expected_bump_pct: 15 },
        { skill: 'MLOps (Docker/K8s)', expected_bump_pct: 22 }
      ]
    },
    career_paths: {
      current_role: profile.track,
      transitions: [
        { target_role: 'Machine Learning Engineer', overlap_pct: 70, effort_level: 'Medium', hiring_demand: 'Growing', salary_delta_pct: 25 },
        { target_role: 'Data Engineering Lead', overlap_pct: 60, effort_level: 'High', hiring_demand: 'Growing', salary_delta_pct: 18 },
        { target_role: 'Product Analyst', overlap_pct: 85, effort_level: 'Low', hiring_demand: 'Stable', salary_delta_pct: -5 }
      ]
    },
    roadmap: {
      total_xp_available: 3000,
      weekly_goals: [
        { week: 1, focus: 'Containerization Basics (Docker)', hours_required: 8 },
        { week: 2, focus: 'Advanced Docker & Kubernetes Intro', hours_required: 10 },
        { week: 3, focus: 'MLflow & Model Tracking', hours_required: 6 }
      ],
      stages: [
        {
          name: 'MLOps Foundations',
          topics: ['Docker', 'Kubernetes', 'CI/CD for ML'],
          capstone: { title: 'Deploy a containerized model API', checklist: ['Dockerize API', 'Push to ECR', 'Deploy to ECS'] }
        },
        {
          name: 'Advanced Modeling',
          topics: ['PyTorch Basics', 'Transformers Intro'],
          capstone: { title: 'Fine-tune an LLM', checklist: ['Setup PyTorch', 'Train model', 'Evaluate metrics'] }
        }
      ]
    },
    market: {
      trending_skills: [
        { skill: 'Generative AI', growth_pct: 350 },
        { skill: 'LangChain', growth_pct: 210 },
        { skill: 'MLOps', growth_pct: 85 }
      ],
      declining_skills: [
        { skill: 'SAS', drop_pct: 45 },
        { skill: 'Hadoop', drop_pct: 30 }
      ],
      top_hiring_companies: [
        { name: 'Amazon', open_roles: 145 },
        { name: 'Fractal Analytics', open_roles: 112 },
        { name: 'Walmart Global Tech', open_roles: 98 }
      ],
      city_demand_heatmap: [
        { city: 'Bangalore', demand_index: 100 },
        { city: 'Hyderabad', demand_index: 75 },
        { city: 'Pune', demand_index: 60 },
        { city: 'Gurgaon', demand_index: 80 }
      ]
    }
  };
}
