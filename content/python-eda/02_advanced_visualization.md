# Advanced Visualization for Exploratory Data Analysis

> [!NOTE]
> Visualization is not just about making pretty charts; it's about uncovering hidden patterns. This guide covers high-density charts using Matplotlib, Seaborn, and Plotly.

## Visualization Library Ecosystem

| Library | Strengths | Weaknesses | Best For |
|---|---|---|---|
| **Matplotlib** | Infinite customization | Verbose, archaic defaults | Base layers, complex custom plots |
| **Seaborn** | Statistical aggregation, beautiful defaults | Hard to deeply customize | Quick EDA, statistical relationships |
| **Plotly** | Interactivity, dashboards | Performance on huge datasets | Interactive EDA, presentations |

## 1. High-Density Correlation Analysis

When dealing with many numerical features, a standard scatter plot becomes unreadable.

### The Seaborn Clustered Heatmap

> [!TIP]
> Use a clustered heatmap (`clustermap`) to automatically group highly correlated variables together, revealing latent structures in your dataset.

```python
import seaborn as sns
import matplotlib.pyplot as plt

# Calculate the correlation matrix
corr = df.select_dtypes(include='number').corr()

# Create a mask for the upper triangle (optional, for standard heatmap)
# mask = np.triu(np.ones_like(corr, dtype=bool))

# Generate a clustered heatmap
sns.clustermap(corr, 
               cmap='coolwarm', 
               vmin=-1, vmax=1, 
               annot=True, 
               fmt=".2f",
               figsize=(10, 8))
plt.show()
```

## 2. Multi-Dimensional Pair Plots

Pair plots are excellent for checking pairwise relationships and distributions simultaneously.

### Advanced Pair Plotting

```python
# Color by a categorical variable and add a KDE on the diagonal
sns.pairplot(df, 
             hue='Department', 
             palette='husl',
             diag_kind='kde',
             plot_kws={'alpha': 0.6, 's': 20, 'edgecolor': 'k'})
plt.show()
```

> [!IMPORTANT]
> If your dataset has >10 numerical columns, pair plots will take a very long time to render. Sub-sample your data or select specific columns using the `vars` parameter.

## 3. Interactive Distribution Analysis with Plotly

For presentations or deep dives, interactive charts allow you to hover over outliers and zoom in on specific regions.

### Plotly Violin Plots

Violin plots combine box plots with kernel density estimations.

```python
import plotly.express as px

fig = px.violin(df, 
                y="Salary", 
                x="Department", 
                color="Role", 
                box=True, # Add a box plot inside the violin
                points="all", # Show all points
                hover_data=df.columns) # Show all data on hover
                
fig.update_layout(title_text="Salary Distribution by Department and Role")
fig.show()
```

> [!CAUTION]
> While Plotly is powerful, rendering thousands of points (`points="all"`) in a browser can cause performance issues. Consider `points="outliers"` for large datasets.
