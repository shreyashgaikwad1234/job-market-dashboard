# Advanced Data Wrangling with Pandas

> [!NOTE]
> This guide covers advanced techniques for data manipulation using Pandas, focusing on performance, elegant multi-indexing, and robust missing data handling. Essential for data science and analytics interviews.

## 1. Vectorization vs. `.apply()`

Vectorized operations in Pandas are implemented in C and operate on entire arrays, making them orders of magnitude faster than iterating row by row or using `.apply()`.

### The Performance Hierarchy

| Method | Speed | Flexibility | Use Case |
|---|---|---|---|
| Vectorization | Fastest (1x) | Low | Simple arithmetic, native NumPy/Pandas functions |
| `np.where()` | Very Fast (1.5x) | Medium | Conditional logic (if-else) |
| `.map()` / `.replace()` | Fast (2x) | Medium | Dictionary lookups, exact value replacement |
| `.apply()` | Slow (10x-100x) | High | Complex custom Python logic |
| `iterrows()` | Very Slow (1000x) | High | Almost never (anti-pattern) |

> [!CAUTION]
> Avoid `.apply()` unless absolutely necessary. It is essentially a glorified `for` loop under the hood.

### Example: Optimizing Conditional Logic

**Anti-pattern:**
```python
import pandas as pd
import numpy as np

# Inefficient
def categorize(salary):
    if salary > 100000:
        return 'High'
    elif salary > 50000:
        return 'Medium'
    else:
        return 'Low'

df['Salary_Category'] = df['Salary'].apply(categorize)
```

**Optimized Pattern (using `np.select`):**
```python
# Highly efficient
conditions = [
    (df['Salary'] > 100000),
    (df['Salary'] > 50000)
]
choices = ['High', 'Medium']
df['Salary_Category'] = np.select(conditions, choices, default='Low')
```

## 2. Mastering Multi-Indexing

Multi-indexing allows for representing higher-dimensional data in a tabular format.

### Grouping and Unstacking

```python
# Grouping by multiple columns creates a MultiIndex Series
grouped = df.groupby(['Department', 'Role'])['Salary'].mean()

# Unstacking moves the inner index level to columns
salary_matrix = grouped.unstack(level='Role')
```

> [!TIP]
> Use `.xs()` (cross-section) to elegantly select data at a particular level of a MultiIndex.
> ```python
> # Select all 'Data Scientist' roles across all departments
> df.xs('Data Scientist', level='Role')
> ```

## 3. Dealing with Missing Data Elegantly

Handling missing data goes beyond just `.dropna()` or `.fillna(0)`.

### Advanced Imputation Techniques

1.  **Interpolation:** Useful for time-series data.
    ```python
    # Linear interpolation
    df['Stock_Price'] = df['Stock_Price'].interpolate(method='linear')
    ```
2.  **Forward/Backward Fill:**
    ```python
    # Forward fill with a limit to avoid over-imputing
    df['Status'] = df['Status'].ffill(limit=2)
    ```
3.  **Group-Specific Imputation:** Filling NaNs with the mean of a specific group.
    ```python
    df['Salary'] = df.groupby('Role')['Salary'].transform(lambda x: x.fillna(x.mean()))
    ```

> [!WARNING]
> Always analyze the mechanism of missingness (MCAR, MAR, MNAR) before imputing. Group-specific imputation can mask systemic data collection errors.
