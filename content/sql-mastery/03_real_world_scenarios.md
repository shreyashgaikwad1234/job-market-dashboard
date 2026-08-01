# 🌎 Real World SQL Scenarios

This guide covers advanced analytical patterns frequently asked in data engineering and product analytics interviews.

## 👥 Cohort Analysis (Retention)

Cohort analysis groups users by a shared characteristic (usually sign-up month) and tracks their behavior over time.

> [!IMPORTANT]
> The goal is to see if newer cohorts are retaining better than older ones, indicating product improvements.

**Example: Monthly User Retention**

```sql
WITH UserFirstActivity AS (
  SELECT 
    user_id,
    DATE_TRUNC('month', MIN(activity_date)) as cohort_month
  FROM events
  GROUP BY 1
),
ActivityMonths AS (
  SELECT DISTINCT
    e.user_id,
    f.cohort_month,
    DATE_TRUNC('month', e.activity_date) as activity_month
  FROM events e
  JOIN UserFirstActivity f ON e.user_id = f.user_id
)
SELECT 
  cohort_month,
  EXTRACT(MONTH FROM AGE(activity_month, cohort_month)) as month_number,
  COUNT(DISTINCT user_id) as active_users
FROM ActivityMonths
GROUP BY 1, 2
ORDER BY 1, 2;
```

## 📉 Churn Calculation

Churn measures the rate at which customers stop doing business with an entity.

> [!NOTE]
> Defining churn is tricky. It could be "no activity in 30 days" or "explicitly canceled subscription".

**Example: SaaS Monthly Subscription Churn**

Calculate the churn rate: (Canceled in Month) / (Active at Start of Month)

```sql
WITH MonthlyStatus AS (
  SELECT 
    month,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_start,
    SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) as canceled_in_month
  FROM subscription_history
  GROUP BY month
)
SELECT 
  month,
  active_start,
  canceled_in_month,
  ROUND(canceled_in_month * 100.0 / NULLIF(active_start, 0), 2) as churn_rate_pct
FROM MonthlyStatus
ORDER BY month;
```

## 🌪️ Funnel Analysis

Funnel analysis tracks users as they move through a defined sequence of steps (e.g., Homepage -> Cart -> Checkout).

> [!TIP]
> Using `MAX(CASE WHEN...)` is a common pivot technique to flatten event rows into user-level funnel columns.

**Example: E-commerce 3-Step Funnel**

```sql
WITH UserEvents AS (
  SELECT
    user_id,
    MAX(CASE WHEN event_name = 'view_homepage' THEN 1 ELSE 0 END) as step1,
    MAX(CASE WHEN event_name = 'add_to_cart' THEN 1 ELSE 0 END) as step2,
    MAX(CASE WHEN event_name = 'purchase' THEN 1 ELSE 0 END) as step3
  FROM events
  WHERE event_date >= CURRENT_DATE - INTERVAL '7 days'
  GROUP BY user_id
)
SELECT
  COUNT(user_id) as total_users,
  SUM(step1) as homepage_views,
  SUM(step2) as cart_adds,
  SUM(step3) as purchases,
  ROUND(SUM(step2) * 100.0 / SUM(step1), 1) as step1_to_2_conversion,
  ROUND(SUM(step3) * 100.0 / SUM(step2), 1) as step2_to_3_conversion
FROM UserEvents;
```

> [!CAUTION]
> This simple funnel doesn't enforce strict event ordering (i.e., step 1 happening *before* step 2). For strict time-sequenced funnels, you need window functions or self-joins on timestamps.
