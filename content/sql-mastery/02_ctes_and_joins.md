# Common Table Expressions (CTEs) and Joins

Common Table Expressions (CTEs) provide a mechanism to write modular, readable queries by establishing temporary result sets.

## Standard CTE Implementation

CTEs mitigate the readability issues associated with deeply nested subqueries. They are highly effective for filtering data based on pre-calculated aggregations, such as average salaries.

**Example: Salary Filtering Pipeline**

```sql
WITH RoleAverages AS (
  SELECT job_title, AVG(salary_usd) AS avg_salary
  FROM data_roles_salaries
  GROUP BY job_title
),
HighPayingRoles AS (
  SELECT job_title, avg_salary
  FROM RoleAverages
  WHERE avg_salary > 120000
)
SELECT 
  d.job_title,
  d.salary_usd,
  h.avg_salary
FROM data_roles_salaries d
INNER JOIN HighPayingRoles h ON d.job_title = h.job_title;
```

## Self Joins

Self joins involve joining a table to itself. This is typically used for comparing rows within the same table, such as finding salary discrepancies across experience levels in the same location.

**Example: Finding Salary Discrepancies**

```sql
SELECT 
  junior.job_title,
  junior.location,
  junior.salary_usd AS junior_salary,
  senior.salary_usd AS senior_salary
FROM data_roles_salaries junior
INNER JOIN data_roles_salaries senior 
  ON junior.location = senior.location
  AND junior.job_title = senior.job_title
  AND junior.experience_level = 'Entry'
  AND senior.experience_level = 'Senior'
WHERE junior.salary_usd > senior.salary_usd;
```
