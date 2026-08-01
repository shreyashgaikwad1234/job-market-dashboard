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

When analyzing the distribution of continuous variables segmented by a categorical outcome (e.g., job titles), Kernel Density Estimation (KDE) plots provide a smoother representation than standard histograms. This is highly effective for visualizing overlapping salary bands.

```python
fig, ax = plt.subplots(figsize=(10, 6))

sns.kdeplot(
    data=main_roles, 
    x="salary_usd", 
    hue="job_title", 
    fill=True, 
    alpha=0.6, 
    palette=["#3B82F6", "#10B981", "#8B5CF6"], # Blue, Emerald, Purple
    ax=ax
)

ax.set_title("Salary Distribution by Core Data Roles", pad=20)
ax.xaxis.set_major_formatter('${x:,.0f}') # Format as currency
ax.set_yticks([]) # Remove y-axis ticks as absolute density values are rarely needed
plt.tight_layout()
```

## High-Density Bar Charts

For categorical data (such as top-paying skills), horizontal bar charts with direct data labels eliminate the need for an x-axis, improving the data-to-ink ratio.

```python
fig, ax = plt.subplots(figsize=(10, 5))
    
bars = sns.barplot(
    data=skill_rev, 
    y="primary_skill", 
    x="salary_usd", 
    color="#3B82F6",
    ax=ax
)

# Append direct data labels
for i, p in enumerate(bars.patches):
    width = p.get_width()
    ax.text(width + (width * 0.02), p.get_y() + p.get_height()/2. + 0.1, 
            f"${width:,.0f}", 
            ha="left", va="center")

ax.set_title("Average Salary by Primary Technical Skill", pad=20)
ax.set_xlabel("")
ax.set_ylabel("")
ax.set_xticks([]) # Remove x-axis entirely
plt.tight_layout()
```
