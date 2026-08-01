# Real-World Analytics Scenarios

This section documents standard SQL architectures for common enterprise analytics patterns, specifically cohort analysis and retention metrics.

## Cohort Analysis

Cohort analysis segments subjects into related groups (cohorts) before analyzing their behavior over time. The most common grouping is by acquisition month.

**Example: Acquisition Cohort LTV**

```sql
WITH UserCohorts AS (
  SELECT 
    DATE_TRUNC('month', signup_date) AS cohort_month,
    user_id,
    total_revenue
  FROM users
)
SELECT 
  cohort_month,
  COUNT(DISTINCT user_id) AS total_users,
  SUM(total_revenue) AS cohort_ltv,
  SUM(total_revenue) / NULLIF(COUNT(DISTINCT user_id), 0) AS arpu
FROM UserCohorts
GROUP BY cohort_month
ORDER BY cohort_month;
```

## Retention and Churn

Retention analysis tracks the percentage of an acquisition cohort that remains active in subsequent periods.

**Example: 30-Day Retention Rate**

```sql
WITH Acquisition AS (
  SELECT user_id, signup_date
  FROM users
),
Activity AS (
  SELECT user_id, MAX(event_date) as last_active_date
  FROM user_events
  GROUP BY user_id
)
SELECT 
  DATE_TRUNC('month', a.signup_date) AS cohort_month,
  COUNT(a.user_id) AS cohort_size,
  SUM(CASE WHEN act.last_active_date >= a.signup_date + INTERVAL '30 days' THEN 1 ELSE 0 END) AS retained_30d,
  ROUND(
    SUM(CASE WHEN act.last_active_date >= a.signup_date + INTERVAL '30 days' THEN 1 ELSE 0 END)::numeric / 
    COUNT(a.user_id), 
  4) AS retention_rate_30d
FROM Acquisition a
LEFT JOIN Activity act ON a.user_id = act.user_id
GROUP BY 1
ORDER BY 1;
```
