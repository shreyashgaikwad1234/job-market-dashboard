import type {
  SalaryInsightsType,
  RoleComparisonType,
  ScoreBreakdownType,
  RoadmapResponse,
  HiringMoversType,
  CompanyListingType,
  CooccurrenceType
} from '../../types';

export const MOCK_ROLES = [
  "Data Analyst",
  "Business Analyst",
  "Product Analyst",
  "BI Analyst",
  "Data Scientist",
  "Analytics Consultant",
  "Strategy Analyst"
];

export const MOCK_LOCATIONS = [
  "Bangalore",
  "Mumbai",
  "Pune",
  "Delhi NCR",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Remote"
];

export const MOCK_STANDARD_SKILLS = [
  "SQL", "Excel", "Python", "Statistics", "Agile", "Snowflake", "dbt", "Git",
  "Machine Learning", "AWS", "PyTorch", "Spark", "MLflow", "Tableau",
  "Power BI", "Docker", "Airflow", "Kubernetes", "CI/CD", "Jira", "NoSQL"
];

export const MOCK_GAP_ANALYSIS = {
  "Data Scientist": {
    match_percentage: 45.2,
    matching_skills: ["SQL", "Excel", "Machine Learning", "AWS"],
    missing_skills: [
      { skill: "Python", importance: 0.88, jobs_unlocked_pct: 88.0 },
      { skill: "dbt", importance: 0.65, jobs_unlocked_pct: 65.0 },
      { skill: "Snowflake", importance: 0.58, jobs_unlocked_pct: 58.0 },
      { skill: "Statistics", importance: 0.52, jobs_unlocked_pct: 52.0 },
      { skill: "Git", importance: 0.44, jobs_unlocked_pct: 44.0 },
      { skill: "PyTorch", importance: 0.35, jobs_unlocked_pct: 35.0 }
    ],
    total_role_jobs: 1240
  },
  "Data Analyst": {
    match_percentage: 68.4,
    matching_skills: ["SQL", "Excel", "Tableau", "Power BI"],
    missing_skills: [
      { skill: "Python", importance: 0.72, jobs_unlocked_pct: 72.0 },
      { skill: "Git", importance: 0.35, jobs_unlocked_pct: 35.0 },
      { skill: "Agile", importance: 0.28, jobs_unlocked_pct: 28.0 }
    ],
    total_role_jobs: 2450
  }
};

export const MOCK_READINESS: Record<string, ScoreBreakdownType> = {
  "Data Scientist": {
    skills_score: 31,
    experience_score: 20,
    location_score: 10,
    project_bonus: 5,
    total_score: 66
  },
  "Data Analyst": {
    skills_score: 55,
    experience_score: 15,
    location_score: 10,
    project_bonus: 8,
    total_score: 88
  }
};

export const MOCK_SALARY_INSIGHTS: Record<string, SalaryInsightsType> = {
  "Data Scientist": {
    percentiles: {
      "10th": 650000,
      "25th": 850000,
      "50th": 1200000,
      "75th": 1850000,
      "90th": 2620000
    },
    location_comparison: [
      { city: "Bangalore", median_salary: 1340000, premium_pct: 11.6 },
      { city: "Mumbai", median_salary: 1250000, premium_pct: 4.1 },
      { city: "Pune", median_salary: 1200000, premium_pct: 0.0 },
      { city: "Delhi NCR", median_salary: 1150000, premium_pct: -4.1 },
      { city: "Hyderabad", median_salary: 1300000, premium_pct: 8.3 },
      { city: "Remote", median_salary: 1400000, premium_pct: 16.6 }
    ],
    skill_drivers: [
      { skill: "Python", premium_pct: 18.0, importance: 0.88 },
      { skill: "dbt", premium_pct: 15.0, importance: 0.65 },
      { skill: "Snowflake", premium_pct: 12.0, importance: 0.58 },
      { skill: "Machine Learning", premium_pct: 22.0, importance: 0.92 }
    ]
  },
  "Data Analyst": {
    percentiles: {
      "10th": 450000,
      "25th": 600000,
      "50th": 950000,
      "75th": 1300000,
      "90th": 1800000
    },
    location_comparison: [
      { city: "Bangalore", median_salary: 1050000, premium_pct: 10.5 },
      { city: "Mumbai", median_salary: 980000, premium_pct: 3.1 },
      { city: "Pune", median_salary: 950000, premium_pct: 0.0 },
      { city: "Delhi NCR", median_salary: 910000, premium_pct: -4.2 },
      { city: "Hyderabad", median_salary: 1000000, premium_pct: 5.2 },
      { city: "Remote", median_salary: 1100000, premium_pct: 15.7 }
    ],
    skill_drivers: [
      { skill: "Python", premium_pct: 12.0, importance: 0.72 },
      { skill: "Tableau", premium_pct: 8.0, importance: 0.62 },
      { skill: "SQL", premium_pct: 15.0, importance: 0.95 },
      { skill: "Excel", premium_pct: 4.0, importance: 0.82 }
    ]
  }
};

export const MOCK_COMPARE: Record<string, RoleComparisonType> = {
  "Data Analyst_Data Scientist": {
    listings: { roleA: 4800, roleB: 2700 },
    salaries: { roleA: 950000, roleB: 1420000 },
    difficulty: { roleA: "Easy", roleB: "Hard" },
    transition_effort: { roleA: "3 Months", roleB: "8 Months" },
    remote_pct: { roleA: 18, roleB: 35 },
    growth_rate: { roleA: 12, roleB: 28 },
    overlap_skills: ["SQL", "Excel", "Statistics"],
    roleA_exclusive: ["Power BI", "Tableau"],
    roleB_exclusive: ["PyTorch", "Spark", "MLflow"]
  }
};

export const MOCK_SKILL_STACKS = [
  { rank: "01", stack: "SQL + Python", demand: "42%", premium: "+18%", diff: "Medium", diffColor: "#f59e0b", diffBg: "rgba(245, 158, 11, 0.1)", roi: "94/100" },
  { rank: "02", stack: "SQL + dbt", demand: "27%", premium: "+22%", diff: "Medium", diffColor: "#f59e0b", diffBg: "rgba(245, 158, 11, 0.1)", roi: "86/100" },
  { rank: "03", stack: "Python + PyTorch", demand: "14%", premium: "+28%", diff: "Hard", diffColor: "#f43f5e", diffBg: "rgba(244, 63, 94, 0.1)", roi: "82/100" },
  { rank: "04", stack: "Excel + Power BI", demand: "31%", premium: "+8%", diff: "Easy", diffColor: "#10b981", diffBg: "rgba(16, 185, 129, 0.1)", roi: "74/100" }
];

export const MOCK_ROADMAP: Record<string, RoadmapResponse> = {
  "Data Scientist": {
    stages: [
      {
        name: 'Foundation Stack',
        nodes: [
          { id: 'python', label: '01. Master Python', status: 'completed' },
          { id: 'pytorch', label: '02. Master PyTorch', status: 'active' },
        ],
        capstone: {
          title: 'Causal Inference Model & Report',
          hours: 50,
          checklist: [
            'Handle data skew parameters',
            'Compute feature cross correlations',
            'Formulate confidence interval bands'
          ]
        }
      },
      {
        name: 'Intermediate Stack',
        nodes: [
          { id: 'git', label: '03. Master Git & Statistics', status: 'active' },
          { id: 'dl', label: '04. Master Deep Learning', status: 'locked' },
          { id: 'de', label: '05. Master Data Engineering', status: 'locked' },
          { id: 'cloud', label: '06. Master Cloud (AWS/GCP)', status: 'locked' },
        ],
        capstone: {
          title: 'End-to-End ML Pipeline',
          hours: 80,
          checklist: [
            'Build custom ETL scripts',
            'Deploy prediction models',
            'Configure database write locks'
          ]
        }
      },
      {
        name: 'Advanced Track',
        nodes: [
          { id: 'nlp', label: '07. Master NLP', status: 'locked' },
          { id: 'mlops', label: '08. Master MLOps', status: 'locked' },
          { id: 'ds_adv', label: '09. Advanced Data Science', status: 'locked' },
        ],
        capstone: {
          title: 'Production ML System',
          hours: 120,
          checklist: [
            'Architect model registry',
            'Setup drift monitoring alerts',
            'Implement batch inference jobs'
          ]
        }
      }
    ]
  }
};

export const MOCK_MOVERS: HiringMoversType = {
  emerging: [
    { skill: "Databricks", growth: 14 },
    { skill: "Airflow", growth: 24 },
    { skill: "dbt", growth: 22 }
  ],
  declining: [
    { skill: "Power BI", drop: 4 },
    { skill: "Local SQL", drop: 8 }
  ]
};

export const MOCK_COMPANIES: CompanyListingType[] = [
  { company: 'TCS Innovation Hub', listings_count: 18 },
  { company: 'Stripe India Tech', listings_count: 12 },
  { company: 'Razorpay Systems', listings_count: 9 },
  { company: 'Flipkart Logistics', listings_count: 7 },
  { company: 'Infosys Research', listings_count: 5 }
];

export const MOCK_COOCCURRENCE: CooccurrenceType[] = [
  { combo: 'SQL + Excel', pct: '72%', desc: 'Foundational Analyst Stack' },
  { combo: 'SQL + Python', pct: '42%', desc: 'Advanced Analytics Stack' },
  { combo: 'Python + ML', pct: '28%', desc: 'Data Scientist Core Stack', isLast: true },
  { combo: 'Python + Tableau', pct: '35%', desc: 'BI Developer Stack' },
  { combo: 'SQL + dbt', pct: '31%', desc: 'Analytics Engineer Stack' },
  { combo: 'Excel + Power BI', pct: '58%', desc: 'Business Analyst Stack', isLast: true }
];
