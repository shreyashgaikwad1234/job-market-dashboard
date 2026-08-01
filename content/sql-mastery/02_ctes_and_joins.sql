-- =====================================================================
-- 02: CTEs & COMPLEX JOINS
-- =====================================================================
-- Description:
-- Demonstrates the use of modular Common Table Expressions (CTEs) 
-- instead of nested subqueries, improving readability and performance.
-- =====================================================================

-- 1. Modular Analytics Pipeline using CTEs
WITH high_value_customers AS (
    SELECT 
        customer_id, 
        total_revenue, 
        avg_order_value
    FROM ecommerce_churn_data
    WHERE total_revenue > 1000
),
retained_customers AS (
    SELECT 
        customer_id, 
        days_since_last_purchase
    FROM ecommerce_churn_data
    WHERE churned = 0
)
SELECT 
    h.customer_id,
    h.total_revenue,
    r.days_since_last_purchase
FROM high_value_customers h
INNER JOIN retained_customers r 
    ON h.customer_id = r.customer_id
ORDER BY h.total_revenue DESC;

-- 2. Self Joins: Identifying Customers Acquired on the Same Day
-- Often used for fraud detection or cohort clustering.
SELECT 
    c1.customer_id AS customer_1,
    c2.customer_id AS customer_2,
    c1.signup_date
FROM ecommerce_churn_data c1
INNER JOIN ecommerce_churn_data c2 
    ON c1.signup_date = c2.signup_date
    AND c1.customer_id != c2.customer_id
    AND c1.customer_id < c2.customer_id -- Prevents duplicate mirrored rows
ORDER BY c1.signup_date;
