# Common Table Expressions (CTEs) and Joins

Common Table Expressions (CTEs) provide a mechanism to write modular, readable queries by establishing temporary result sets.

## Standard CTE Implementation

CTEs mitigate the readability issues associated with deeply nested subqueries.

**Example: Aggregation Pipeline**

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
SELECT a.user_id, COALESCE(p.total_orders, 0) as total_orders
FROM ActiveUsers a
LEFT JOIN UserPurchases p ON a.user_id = p.user_id;
```

## Recursive CTEs

Recursive CTEs reference their own output. They are strictly required for traversing hierarchical data structures (e.g., organizational charts, category trees).

A recursive CTE requires an anchor member (base case) and a recursive member, combined via `UNION ALL`.

**Example: Hierarchical Traversal**

```sql
WITH RECURSIVE OrgChart AS (
  -- Anchor member
  SELECT employee_id, name, manager_id, 1 as hierarchy_level
  FROM employees
  WHERE manager_id IS NULL
  
  UNION ALL
  
  -- Recursive member
  SELECT e.employee_id, e.name, e.manager_id, o.hierarchy_level + 1
  FROM employees e
  INNER JOIN OrgChart o ON e.manager_id = o.employee_id
)
SELECT * FROM OrgChart
ORDER BY hierarchy_level, manager_id;
```

## Self Joins

Self joins involve joining a table to itself. This is typically used for comparing rows within the same table or establishing pairwise relationships.

**Example: Pairwise Comparison**

```sql
SELECT 
  c1.customer_id AS customer_1,
  c2.customer_id AS customer_2,
  c1.signup_date
FROM customers c1
INNER JOIN customers c2 
  ON c1.signup_date = c2.signup_date
  AND c1.customer_id < c2.customer_id
ORDER BY c1.signup_date;
```
