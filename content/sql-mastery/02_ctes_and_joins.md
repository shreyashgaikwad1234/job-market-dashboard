# 🧩 Advanced CTEs and Joins

Common Table Expressions (CTEs) and advanced joins are the building blocks of readable and complex SQL queries.

## 🏗️ Common Table Expressions (CTEs)

CTEs allow you to create temporary result sets that can be referenced within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement. 

> [!NOTE]
> CTEs make complex queries much more readable by breaking them down into logical, sequential steps.

### Basic CTE Example

```sql
WITH ActiveUsers AS (
  SELECT user_id
  FROM users
  WHERE last_login >= CURRENT_DATE - INTERVAL '30 days'
),
UserPurchases AS (
  SELECT user_id, COUNT(*) as total_orders
  FROM orders
  GROUP BY user_id
)
SELECT a.user_id, COALESCE(p.total_orders, 0)
FROM ActiveUsers a
LEFT JOIN UserPurchases p ON a.user_id = p.user_id;
```

## 🔄 Recursive CTEs

Recursive CTEs reference themselves. They are perfect for querying hierarchical data, like organizational charts or bill of materials.

> [!IMPORTANT]
> A recursive CTE consists of two parts: the anchor member (base case) and the recursive member, unioned together.

**Example: Employee Organization Chart**

```sql
WITH RECURSIVE OrgChart AS (
  -- Anchor member: Start with the CEO (manager_id is NULL)
  SELECT employee_id, name, manager_id, 1 as level
  FROM employees
  WHERE manager_id IS NULL
  
  UNION ALL
  
  -- Recursive member: Find employees reporting to the previous level
  SELECT e.employee_id, e.name, e.manager_id, o.level + 1
  FROM employees e
  INNER JOIN OrgChart o ON e.manager_id = o.employee_id
)
SELECT * FROM OrgChart ORDER BY level, name;
```

## 🔗 Advanced Joins

While `INNER` and `LEFT` joins are standard, self joins and cross joins have specific, powerful use cases.

### Self Joins

A self join is a regular join, but the table is joined with itself. It is useful for comparing rows within the same table.

**Example: Finding users from the same city**

```sql
SELECT 
  a.user_name AS user_1, 
  b.user_name AS user_2, 
  a.city
FROM users a
JOIN users b 
  ON a.city = b.city 
  AND a.user_id < b.user_id; -- Prevents duplicate pairs and matching with oneself
```

> [!TIP]
> The condition `a.user_id < b.user_id` is a classic trick to avoid commutative duplicates (A-B and B-A).

### Cross Joins

A `CROSS JOIN` produces the Cartesian product of two tables.

> [!WARNING]
> Use `CROSS JOIN` cautiously. Joining a 1000-row table with another 1000-row table yields 1,000,000 rows!

**Example: Generating a Date Spine**

Often used in reporting to ensure days with 0 metrics are still present.

```sql
SELECT date_dim.date, COALESCE(sales.amount, 0)
FROM date_dimension date_dim
CROSS JOIN (SELECT DISTINCT store_id FROM stores)
LEFT JOIN daily_sales sales
  ON date_dim.date = sales.date AND store_id = sales.store_id;
```
