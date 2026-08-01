# =====================================================================
# 02: ADVANCED VISUALIZATIONS (JOB MARKET ANALYTICS)
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

def plot_salary_distribution(df: pd.DataFrame):
    """
    Plots a highly stylized distribution of salaries,
    segmented by job title (focusing on Data Scientists vs Engineers).
    """
    # Filter to main roles for cleaner visualization
    main_roles = df[df['job_title'].isin(['Data Scientist', 'Data Engineer', 'Data Analyst'])]
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # KDE Plot for smooth distributions
    sns.kdeplot(
        data=main_roles, 
        x="salary_usd", 
        hue="job_title", 
        fill=True, 
        alpha=0.6, 
        palette=["#3B82F6", "#10B981", "#8B5CF6"], # Blue, Emerald, Purple
        ax=ax
    )
    
    ax.set_title("Salary Distribution by Core Data Roles", fontsize=16, fontweight='bold', pad=20)
    ax.set_xlabel("Salary (USD)", fontsize=12)
    ax.set_ylabel("Density", fontsize=12)
    
    # Format x-axis as currency
    ax.xaxis.set_major_formatter('${x:,.0f}')
    
    # Remove y-axis ticks for cleaner look (density absolute values rarely matter)
    ax.set_yticks([])
    
    plt.tight_layout()
    plt.savefig("salary_distribution.png", dpi=300)
    print("Saved salary_distribution.png")
    plt.close()

def plot_top_paying_skills(df: pd.DataFrame):
    """
    Creates a professional horizontal bar chart of the highest paying skills.
    """
    # Calculate average salary per skill
    skill_rev = df.groupby('primary_skill')['salary_usd'].mean().sort_values(ascending=False).reset_index()
    
    fig, ax = plt.subplots(figsize=(10, 5))
    
    bars = sns.barplot(
        data=skill_rev, 
        y="primary_skill", 
        x="salary_usd", 
        color="#3B82F6", # Professional Blue
        ax=ax
    )
    
    # Add data labels directly to bars
    for i, p in enumerate(bars.patches):
        width = p.get_width()
        ax.text(width + (width * 0.02), p.get_y() + p.get_height()/2. + 0.1, 
                f"${width:,.0f}", 
                ha="left", va="center", fontsize=10, fontweight='bold', color="#4B5563")
    
    ax.set_title("Average Salary by Primary Technical Skill", fontsize=16, fontweight='bold', pad=20)
    ax.set_xlabel("")
    ax.set_ylabel("")
    ax.set_xticks([]) # Remove x-axis for cleaner look, relying on data labels
    
    plt.tight_layout()
    plt.savefig("top_paying_skills.png", dpi=300)
    print("Saved top_paying_skills.png")
    plt.close()

if __name__ == "__main__":
    file_path = "../../datasets/data_roles_salaries.csv"
    try:
        df = pd.read_csv(file_path)
        print("Generating professional job market visualizations...")
        plot_salary_distribution(df)
        plot_top_paying_skills(df)
    except FileNotFoundError:
        print(f"Dataset not found at {file_path}. Ensure you are running this from the correct directory.")
