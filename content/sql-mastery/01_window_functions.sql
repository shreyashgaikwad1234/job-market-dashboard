-- =====================================================================
-- 01: ADVANCED WINDOW FUNCTIONS
-- =====================================================================
-- Description:
-- Demonstrates the use of RANK, DENSE_RANK, LEAD, LAG, and running totals
-- over an e-commerce transactional dataset. This is highly requested in 
-- top-tier Data Engineering & Analytics interviews.
-- =====================================================================

-- 1. Ranking Customers by Total Spend (DENSE_RANK vs RANK)
-- Identifying top-tier customers without gaps in ranking if there are ties.
SELECT 
    customer_id,
    customer_segment,
    total_revenue,
    RANK() OVER (ORDER BY total_revenue DESC) AS revenue_rank,
    DENSE_RANK() OVER (ORDER BY total_revenue DESC) AS revenue_dense_rank
FROM ecommerce_churn_data
WHERE churned = 0
ORDER BY total_revenue DESC;

-- 2. Calculating Moving Averages & Running Totals
-- Useful for smoothing out volatility in revenue across cohorts or time.
SELECT 
    signup_date,
    total_revenue,
    SUM(total_revenue) OVER (
        ORDER BY signup_date 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total_revenue,
    AVG(total_revenue) OVER (
        ORDER BY signup_date 
        ROWS BETWEEN 3 PRECEDING AND CURRENT ROW
    ) AS rolling_3day_avg
FROM ecommerce_churn_data
ORDER BY signup_date;

-- 3. Time-Series Analysis: LEAD and LAG
-- Comparing a customer's current order value to their previous ones (simulated with aggregate data)
-- or finding the gap in days between customer signups in a specific channel.
SELECT 
    customer_id,
    acquisition_channel,
    signup_date,
    LAG(signup_date, 1) OVER (
        PARTITION BY acquisition_channel 
        ORDER BY signup_date
    ) AS previous_channel_signup,
    -- Calculate days between signups in the same channel
    signup_date - LAG(signup_date, 1) OVER (
        PARTITION BY acquisition_channel 
        ORDER BY signup_date
    ) AS days_since_last_channel_signup
FROM ecommerce_churn_data
ORDER BY acquisition_channel, signup_date;
