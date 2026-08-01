-- =====================================================================
-- 01: ADVANCED WINDOW FUNCTIONS (JOB MARKET ANALYTICS)
-- =====================================================================
-- Description:
-- Demonstrates the use of RANK, DENSE_RANK, LEAD, LAG, and percentiles
-- over a dataset of Data Science salaries and roles.
-- =====================================================================

-- 1. Ranking Job Titles by Highest Salary (DENSE_RANK vs RANK)
-- Identifying the top-paying roles within specific experience levels.
SELECT 
    job_title,
    experience_level,
    salary_usd,
    RANK() OVER (PARTITION BY experience_level ORDER BY salary_usd DESC) AS salary_rank,
    DENSE_RANK() OVER (PARTITION BY experience_level ORDER BY salary_usd DESC) AS salary_dense_rank
FROM data_roles_salaries
ORDER BY experience_level, salary_usd DESC;

-- 2. Calculating Salary Percentiles (PERCENT_RANK)
-- Find out what percentile a specific salary falls into across the entire dataset.
SELECT 
    job_title,
    experience_level,
    salary_usd,
    ROUND(PERCENT_RANK() OVER (ORDER BY salary_usd) * 100, 2) AS salary_percentile
FROM data_roles_salaries
ORDER BY salary_percentile DESC;

-- 3. Comparing Current Job Posting Salary to Previous (LEAD and LAG)
-- See how a specific role's salary trended over time based on posting date.
SELECT 
    job_title,
    posting_date,
    salary_usd,
    LAG(salary_usd, 1) OVER (
        PARTITION BY job_title 
        ORDER BY posting_date
    ) AS previous_posting_salary,
    salary_usd - LAG(salary_usd, 1) OVER (
        PARTITION BY job_title 
        ORDER BY posting_date
    ) AS salary_growth_since_last_posting
FROM data_roles_salaries
ORDER BY job_title, posting_date;
