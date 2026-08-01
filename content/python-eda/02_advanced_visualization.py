# =====================================================================
# 02: ADVANCED VISUALIZATIONS
# =====================================================================
# Description:
# Demonstrates professional, enterprise-grade plotting techniques.
# Strips away standard UI clutter (spines, gridlines) to create
# high-density, editorial-quality charts suitable for SaaS dashboards.
# =====================================================================

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Set a professional, minimalistic aesthetic globally
sns.set_theme(style="white", rc={
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.spines.left": False,
    "axes.grid": True,
    "grid.alpha": 0.3,
    "font.family": "sans-serif"
})

def plot_churn_distribution(df: pd.DataFrame):
    """
    Plots a highly stylized distribution of days since last purchase,
    segmented by churn status.
    """
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # KDE Plot for smooth distributions
    sns.kdeplot(
        data=df, 
        x="days_since_last_purchase", 
        hue="churned", 
        fill=True, 
        alpha=0.6, 
        palette=["#10B981", "#EF4444"], # Professional Emerald vs Rose
        ax=ax
    )
    
    ax.set_title("Customer Activity Distribution by Churn Status", fontsize=16, fontweight='bold', pad=20)
    ax.set_xlabel("Days Since Last Purchase", fontsize=12)
    ax.set_ylabel("Density", fontsize=12)
    
    # Remove y-axis ticks for cleaner look (density absolute values rarely matter)
    ax.set_yticks([])
    
    plt.tight_layout()
    plt.savefig("churn_distribution.png", dpi=300)
    print("Saved churn_distribution.png")
    plt.close()

def plot_channel_revenue(df: pd.DataFrame):
    """
    Creates a professional horizontal bar chart of revenue by channel.
    """
    channel_rev = df.groupby('acquisition_channel')['total_revenue'].sum().sort_values(ascending=False).reset_index()
    
    fig, ax = plt.subplots(figsize=(10, 5))
    
    bars = sns.barplot(
        data=channel_rev, 
        y="acquisition_channel", 
        x="total_revenue", 
        color="#3B82F6", # Professional Blue
        ax=ax
    )
    
    # Add data labels directly to bars
    for i, p in enumerate(bars.patches):
        width = p.get_width()
        ax.text(width + (width * 0.02), p.get_y() + p.get_height()/2. + 0.1, 
                f"${width:,.0f}", 
                ha="left", va="center", fontsize=10, fontweight='bold', color="#4B5563")
    
    ax.set_title("Total Revenue by Acquisition Channel", fontsize=16, fontweight='bold', pad=20)
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.set_xticks([]) # Remove x-axis for cleaner look, relying on data labels
    
    plt.tight_layout()
    plt.savefig("channel_revenue.png", dpi=300)
    print("Saved channel_revenue.png")
    plt.close()

if __name__ == "__main__":
    file_path = "../../datasets/ecommerce_churn_data.csv"
    try:
        df = pd.read_csv(file_path)
        print("Generating professional visualizations...")
        plot_churn_distribution(df)
        plot_channel_revenue(df)
    except FileNotFoundError:
        print(f"Dataset not found at {file_path}. Ensure you are running this from the correct directory.")
