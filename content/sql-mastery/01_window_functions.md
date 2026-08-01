# Window Functions

Window functions perform calculations across a set of table rows that are related to the current row. This section outlines standard implementations for ranking, offset, and aggregate window functions.

All examples adhere to standard ANSI SQL.

## Ranking Operations

Ranking functions assign a rank to each row within a partition.

### RANK vs DENSE_RANK

| Function | Output Behavior | Tie Handling |
| :--- | :--- | :--- |
| `ROW_NUMBER()` | Sequential integer | Non-deterministic on ties |
| `RANK()` | Rank with gaps | `1, 1, 3, 4` |
| `DENSE_RANK()` | Rank without gaps | `1, 1, 2, 3` |

**Example: Category Ranking**

```sql
WITH ProductSales AS (
  SELECT 
    category,
    product_name,
    SUM(sales_amount) as total_revenue
  FROM orders
  GROUP BY category, product_name
)
SELECT * FROM (
  SELECT 
    category,
    product_name,
    total_revenue,
    DENSE_RANK() OVER(PARTITION BY category ORDER BY total_revenue DESC) as rank
  FROM ProductSales
) ranked
WHERE rank <= 3;
```

## Offset Functions (LAG and LEAD)

Offset functions access data from subsequent or previous rows in the same result set without requiring self-joins.

**Example: Month-over-Month (MoM) Calculation**

```sql
SELECT 
  month,
  mrr,
  LAG(mrr, 1) OVER(ORDER BY month) as prev_month_mrr,
  (mrr - LAG(mrr, 1) OVER(ORDER BY month)) / LAG(mrr, 1) OVER(ORDER BY month) * 100 as mom_growth_pct
FROM saas_revenue
ORDER BY month;
```

## Running Totals

Cumulative aggregations utilize the `ROWS` or `RANGE` clause within the window definition.

**Example: Cumulative Revenue**

```sql
SELECT
  order_date,
  daily_revenue,
  SUM(daily_revenue) OVER(
    ORDER BY order_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) as cumulative_revenue
FROM daily_sales;
```
