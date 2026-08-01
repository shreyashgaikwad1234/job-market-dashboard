-- =====================================================================
-- 03: MARKET TRENDS (JOB MARKET ANALYTICS)
-- =====================================================================
-- Description:
-- Demonstrates enterprise-grade queries for measuring macro trends,
-- skill demand, and remote work ratios over time.
-- =====================================================================

-- 1. Most In-Demand Skills by Salary
-- A critical KPI for technical recruiters and job seekers.
SELECT 
    primary_skill,
    COUNT(posting_id) AS total_postings,
    ROUND(AVG(salary_usd), 0) AS avg_salary_usd,
    ROUND(MAX(salary_usd), 0) AS max_salary_usd
FROM data_roles_salaries
GROUP BY primary_skill
HAVING COUNT(posting_id) >= 2 -- Filter for statistical relevance
ORDER BY avg_salary_usd DESC;

-- 2. Remote Work Trends Over Time
-- Tracks how remote work availability is changing month-over-month.
WITH MonthlyTrends AS (
    SELECT 
        -- Standardize posting date to the first of the month
        DATE(SUBSTR(posting_date, 1, 7) || '-01') AS posting_month,
        COUNT(posting_id) AS total_jobs,
        SUM(CASE WHEN remote_ratio = 100 THEN 1 ELSE 0 END) AS fully_remote_jobs,
        SUM(CASE WHEN remote_ratio = 0 THEN 1 ELSE 0 END) AS fully_onsite_jobs
    FROM data_roles_salaries
    GROUP BY DATE(SUBSTR(posting_date, 1, 7) || '-01')
)
SELECT 
    posting_month,
    total_jobs,
    fully_remote_jobs,
    ROUND((fully_remote_jobs * 100.0) / total_jobs, 2) AS remote_job_pct,
    fully_onsite_jobs,
    ROUND((fully_onsite_jobs * 100.0) / total_jobs, 2) AS onsite_job_pct
FROM MonthlyTrends
ORDER BY posting_month ASC;
