# Advanced Data Visualization

This section covers enterprise-grade data visualization patterns using Python. Standard default plots often contain unnecessary UI clutter (gridlines, borders, axis spines) that detract from the data.

## Configuration for Editorial Quality

Global aesthetic parameters can be defined using Seaborn to ensure consistency across all visualizations.

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Global editorial theme configuration
sns.set_theme(style="white", rc={
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.spines.left": False,
    "axes.grid": True,
    "grid.alpha": 0.3,
    "font.family": "sans-serif"
})
```

## Density and Distribution Plots

When analyzing the distribution of continuous variables segmented by a categorical outcome (e.g., churn), Kernel Density Estimation (KDE) plots provide a smoother representation than standard histograms.

```python
fig, ax = plt.subplots(figsize=(10, 6))

sns.kdeplot(
    data=df, 
    x="days_since_last_purchase", 
    hue="churned", 
    fill=True, 
    alpha=0.6, 
    palette=["#10B981", "#EF4444"], # Emerald vs Rose
    ax=ax
)

ax.set_title("Customer Activity Distribution by Churn Status", pad=20)
ax.set_yticks([]) # Remove y-axis ticks as absolute density values are rarely needed
plt.tight_layout()
```

## High-Density Bar Charts

For categorical data, horizontal bar charts with direct data labels eliminate the need for an x-axis, improving the data-to-ink ratio.

```python
fig, ax = plt.subplots(figsize=(10, 5))
    
bars = sns.barplot(
    data=channel_rev, 
    y="acquisition_channel", 
    x="total_revenue", 
    color="#3B82F6",
    ax=ax
)

# Append direct data labels
for i, p in enumerate(bars.patches):
    width = p.get_width()
    ax.text(width + (width * 0.02), p.get_y() + p.get_height()/2. + 0.1, 
            f"${width:,.0f}", 
            ha="left", va="center")

ax.set_title("Total Revenue by Acquisition Channel", pad=20)
ax.set_xlabel("")
ax.set_ylabel("")
ax.set_xticks([]) # Remove x-axis entirely
plt.tight_layout()
```
