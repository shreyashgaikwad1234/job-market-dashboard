# Window Functions

Window functions perform calculations across a set of table rows that are related to the current row. This section outlines standard implementations for ranking, offset, and aggregate window functions using job market data.

All examples adhere to standard ANSI SQL.

## Ranking Operations

Ranking functions assign a rank to each row within a partition.

### RANK vs DENSE_RANK

| Function | Output Behavior | Tie Handling |
| :--- | :--- | :--- |
| `ROW_NUMBER()` | Sequential integer | Non-deterministic on ties |
| `RANK()` | Rank with gaps | `1, 1, 3, 4` |
| `DENSE_RANK()` | Rank without gaps | `1, 1, 2, 3` |

**Example: Ranking Salaries by Experience Level**

```sql
SELECT 
  job_title,
  experience_level,
  salary_usd,
  DENSE_RANK() OVER(PARTITION BY experience_level ORDER BY salary_usd DESC) as rank
FROM data_roles_salaries;
```

## Percentiles

Window functions can calculate statistical percentiles, critical for analyzing salary bands.

**Example: Salary Percentile Calculation**

```sql
SELECT 
  job_title,
  salary_usd,
  ROUND(PERCENT_RANK() OVER (ORDER BY salary_usd) * 100, 2) AS salary_percentile
FROM data_roles_salaries;
```

## Offset Functions (LAG and LEAD)

Offset functions access data from subsequent or previous rows in the same result set without requiring self-joins, useful for tracking salary growth over time.

**Example: Salary Trend Over Time**

```sql
SELECT 
  job_title,
  posting_date,
  salary_usd,
  LAG(salary_usd, 1) OVER(PARTITION BY job_title ORDER BY posting_date) as prev_salary,
  (salary_usd - LAG(salary_usd, 1) OVER(PARTITION BY job_title ORDER BY posting_date)) / 
  LAG(salary_usd, 1) OVER(PARTITION BY job_title ORDER BY posting_date) * 100 as growth_pct
FROM data_roles_salaries;
```
