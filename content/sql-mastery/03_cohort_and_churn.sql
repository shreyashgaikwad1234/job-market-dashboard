-- =====================================================================
-- 03: REAL-WORLD SCENARIOS (CHURN & COHORTS)
-- =====================================================================
-- Description:
-- Demonstrates enterprise-grade queries for measuring churn rates 
-- and segmenting customers by acquisition cohorts.
-- =====================================================================

-- 1. Churn Rate by Acquisition Channel
-- A critical KPI for marketing ROI.
SELECT 
    acquisition_channel,
    COUNT(customer_id) AS total_customers,
    SUM(churned) AS churned_customers,
    ROUND(SUM(churned) * 100.0 / COUNT(customer_id), 2) AS churn_rate_pct
FROM ecommerce_churn_data
GROUP BY acquisition_channel
ORDER BY churn_rate_pct DESC;

-- 2. Customer Cohort Analysis (By Signup Month)
-- Tracks the lifetime value (LTV) metric segmented by the month the customer joined.
WITH cohorts AS (
    SELECT 
        -- Standardize signup date to the first of the month
        DATE(SUBSTR(signup_date, 1, 7) || '-01') AS cohort_month,
        customer_id,
        total_revenue,
        churned
    FROM ecommerce_churn_data
)
SELECT 
    cohort_month,
    COUNT(customer_id) AS new_customers,
    SUM(total_revenue) AS total_cohort_ltv,
    ROUND(AVG(total_revenue), 2) AS avg_revenue_per_user_arpu,
    ROUND(SUM(churned) * 100.0 / COUNT(customer_id), 2) AS cohort_churn_rate_pct
FROM cohorts
GROUP BY cohort_month
ORDER BY cohort_month ASC;
