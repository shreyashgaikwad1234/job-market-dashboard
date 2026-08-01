# Advanced Data Wrangling (Pandas)

This section covers standard methodologies for data transformation and cleaning using the Pandas library in Python, emphasizing performance optimizations necessary for large-scale job market datasets.

## Performance: Vectorization over Iteration

When manipulating Pandas DataFrames, standard Python loops and `.apply()` functions introduce significant computational overhead. Vectorization utilizes optimized C code under the hood to perform operations on entire arrays concurrently.

### Example: Feature Engineering

```python
import pandas as pd
import numpy as np

# Anti-pattern (Iterative)
def calculate_status_iterative(row):
    if row['salary_usd'] > 150000 and row['remote_ratio'] == 100:
        return True
    return False

# df['high_paying_remote'] = df.apply(calculate_status_iterative, axis=1) # SLOW

# Optimized Pattern (Vectorized)
df['high_paying_remote'] = np.where((df['salary_usd'] > 150000) & (df['remote_ratio'] == 100), True, False) # FAST
```

## String Manipulation

Job titles in raw data are notoriously messy. Vectorized string methods (`.str`) provide a highly performant way to clean and categorize text data.

```python
# Identify management roles using vectorized regex matching
df['is_management'] = df['job_title'].str.contains('Lead|Manager|Director|Head', case=False, na=False)
```

## Multi-Indexing and Aggregation

Aggregating data across multiple dimensions (e.g., job title and experience level) results in a MultiIndex DataFrame, essential for creating pivot tables of salary bands.

```python
# Calculate average salary and posting count by role and experience
salary_bands = df.groupby(['job_title', 'experience_level']).agg({
    'posting_id': 'nunique',
    'salary_usd': 'mean'
}).rename(columns={
    'posting_id': 'total_postings',
    'salary_usd': 'avg_salary_usd'
})
```
