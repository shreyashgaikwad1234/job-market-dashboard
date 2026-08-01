-- =====================================================================
-- 02: CTEs & COMPLEX JOINS (JOB MARKET ANALYTICS)
-- =====================================================================
-- Description:
-- Demonstrates the use of modular Common Table Expressions (CTEs) 
-- instead of nested subqueries, improving readability and performance.
-- =====================================================================

-- 1. Modular Analytics Pipeline using CTEs
-- Finding average salaries by role, but only for roles with a high average salary.
WITH RoleAverages AS (
    SELECT 
        job_title, 
        AVG(salary_usd) AS avg_salary,
        COUNT(posting_id) AS total_postings
    FROM data_roles_salaries
    GROUP BY job_title
),
HighPayingRoles AS (
    SELECT 
        job_title, 
        avg_salary,
        total_postings
    FROM RoleAverages
    WHERE avg_salary > 120000
)
SELECT 
    d.job_title,
    d.experience_level,
    d.salary_usd,
    h.avg_salary AS role_avg_salary
FROM data_roles_salaries d
INNER JOIN HighPayingRoles h 
    ON d.job_title = h.job_title
ORDER BY d.salary_usd DESC;

-- 2. Self Joins: Identifying Salary Discrepancies
-- Finding Junior/Entry level postings that pay more than Senior postings in the same city.
SELECT 
    junior.job_title,
    junior.location,
    junior.salary_usd AS junior_salary,
    senior.salary_usd AS senior_salary
FROM data_roles_salaries junior
INNER JOIN data_roles_salaries senior 
    ON junior.location = senior.location
    AND junior.job_title = senior.job_title
    AND junior.experience_level IN ('Entry', 'Junior')
    AND senior.experience_level IN ('Senior', 'Lead')
WHERE junior.salary_usd > senior.salary_usd;
