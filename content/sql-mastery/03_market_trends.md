# Real-World Market Trends

This section documents standard SQL architectures for analyzing macro-level job market trends, specifically skill demand and remote work availability.

## Skill Demand and Compensation

Aggregating job postings by primary skill reveals the highest-paying technologies in the market. Utilizing the `HAVING` clause ensures statistical relevance by filtering out one-off postings.

**Example: Highest Paying Skills**

```sql
SELECT 
  primary_skill,
  COUNT(posting_id) AS total_postings,
  ROUND(AVG(salary_usd), 0) AS avg_salary
FROM data_roles_salaries
GROUP BY primary_skill
HAVING COUNT(posting_id) >= 5
ORDER BY avg_salary DESC;
```

## Remote Work Trends

Time-series analysis using `DATE_TRUNC` (or string manipulation depending on the dialect) tracks macro trends over time, such as the percentage of fully remote roles available each month.

**Example: Remote vs Onsite Ratios**

```sql
WITH MonthlyTrends AS (
  SELECT 
    DATE_TRUNC('month', posting_date) AS posting_month,
    COUNT(posting_id) AS total_jobs,
    SUM(CASE WHEN remote_ratio = 100 THEN 1 ELSE 0 END) AS fully_remote_jobs
  FROM data_roles_salaries
  GROUP BY 1
)
SELECT 
  posting_month,
  total_jobs,
  fully_remote_jobs,
  ROUND((fully_remote_jobs * 100.0) / NULLIF(total_jobs, 0), 2) AS remote_job_pct
FROM MonthlyTrends
ORDER BY posting_month ASC;
```
