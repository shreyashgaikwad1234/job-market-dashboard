# 🪟 Master Window Functions in SQL

Window functions are essential for advanced data analysis. They allow you to perform calculations across a set of table rows that are somehow related to the current row, without collapsing the result set like aggregate functions do.

> [!NOTE]
> All examples use standard ANSI SQL and are compatible with PostgreSQL, Snowflake, and BigQuery.

## 🏆 Ranking Functions

Ranking functions assign a rank to each row within a partition of a result set.

### RANK() vs DENSE_RANK() vs ROW_NUMBER()

| Function | Description | Ties Behavior |
| :--- | :--- | :--- |
| `ROW_NUMBER()` | Unique sequential integer per row | Random or non-deterministic |
| `RANK()` | Rank of current row with gaps | `1, 1, 3, 4` |
| `DENSE_RANK()` | Rank of current row without gaps | `1, 1, 2, 3` |

> [!TIP]
> Use `DENSE_RANK()` when you want to find the top N distinct values (e.g., top 3 highest salaries).

**Example: E-commerce Top Sellers**

Find the top 3 best-selling products per category:

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

## 🕰️ LAG() and LEAD()

Access data from a previous or subsequent row in the same result set without the use of a self-join.

> [!IMPORTANT]
> `LAG` and `LEAD` require an `ORDER BY` clause within the `OVER()` function.

**Example: SaaS MRR Growth**

Calculate month-over-month (MoM) growth in Monthly Recurring Revenue (MRR):

```sql
SELECT 
  month,
  mrr,
  LAG(mrr, 1) OVER(ORDER BY month) as prev_month_mrr,
  (mrr - LAG(mrr, 1) OVER(ORDER BY month)) / LAG(mrr, 1) OVER(ORDER BY month) * 100 as mom_growth_pct
FROM saas_revenue
ORDER BY month;
```

## 📈 Running Totals & Moving Averages

You can compute cumulative sums or moving averages using the `ROWS` or `RANGE` clause.

**Example: E-commerce Cumulative Revenue**

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

> [!CAUTION]
> By default, an `ORDER BY` in a window function implies `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. Be careful when duplicates exist in the order by column!
