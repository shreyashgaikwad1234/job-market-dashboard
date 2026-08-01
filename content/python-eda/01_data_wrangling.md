# Advanced Data Wrangling (Pandas)

This section covers standard methodologies for data transformation and cleaning using the Pandas library in Python, emphasizing performance optimizations necessary for large-scale datasets.

## Performance: Vectorization over Iteration

When manipulating Pandas DataFrames, standard Python loops and `.apply()` functions introduce significant computational overhead. Vectorization utilizes optimized C code under the hood to perform operations on entire arrays concurrently.

### Example: Feature Engineering

```python
import pandas as pd
import numpy as np

# Anti-pattern (Iterative)
def calculate_status_iterative(row):
    if row['revenue'] > 1000 and row['churned'] == 0:
        return True
    return False

# df['high_value'] = df.apply(calculate_status_iterative, axis=1) # SLOW

# Optimized Pattern (Vectorized)
df['high_value'] = np.where((df['revenue'] > 1000) & (df['churned'] == 0), True, False) # FAST
```

## Missing Data Imputation

Handling missing values (`NaN`) requires domain-specific logic rather than arbitrary deletion.

```python
# Forward fill for time-series data
df['daily_stock'] = df['daily_stock'].ffill()

# Mean imputation grouped by category
df['price'] = df['price'].fillna(df.groupby('category')['price'].transform('mean'))
```

## Multi-Indexing and Aggregation

Aggregating data across multiple dimensions often results in a MultiIndex DataFrame.

```python
# Calculate total customers and churn rate by cohort and channel
cohort_metrics = df.groupby(['cohort_month', 'acquisition_channel']).agg({
    'customer_id': 'nunique',
    'churned': 'mean'
}).rename(columns={
    'customer_id': 'total_customers',
    'churned': 'churn_rate'
})
```
