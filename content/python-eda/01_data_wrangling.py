# =====================================================================
# 01: ADVANCED DATA WRANGLING (JOB MARKET ANALYTICS)
# =====================================================================
# Description:
# Demonstrates professional data wrangling techniques using Pandas.
# Emphasizes vectorization over slow iterative loops, multi-indexing,
# and handling missing data gracefully in Job Market datasets.
# =====================================================================

import pandas as pd
import numpy as np

def load_and_clean_data(filepath: str) -> pd.DataFrame:
    """Loads dataset and performs standard cleaning operations."""
    df = pd.read_csv(filepath)
    
    # Standardize column names (lowercase, replace spaces with underscores)
    df.columns = df.columns.str.lower().str.replace(' ', '_')
    
    # Convert date columns to datetime objects
    df['posting_date'] = pd.to_datetime(df['posting_date'])
    
    return df

def feature_engineering_vectorized(df: pd.DataFrame) -> pd.DataFrame:
    """
    Demonstrates fast, vectorized feature engineering.
    AVOID using df.apply() when vectorization is possible.
    """
    # 1. np.where for conditional logic (much faster than .apply)
    # Flag high-paying remote roles
    df['is_high_paying_remote'] = np.where(
        (df['salary_usd'] > 150000) & (df['remote_ratio'] == 100), 
        True, 
        False
    )
    
    # 2. Vectorized text matching
    # Identify management roles based on job title
    df['is_management'] = df['job_title'].str.contains('Lead|Manager|Director', case=False, na=False)
    
    return df

def calculate_salary_bands(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculates average salary and remote ratio grouped by role and experience.
    Demonstrates multi-indexing and aggregation.
    """
    # Aggregate metrics
    salary_bands = df.groupby(['job_title', 'experience_level']).agg({
        'posting_id': 'nunique',
        'salary_usd': 'mean',
        'remote_ratio': 'mean' 
    }).rename(columns={
        'posting_id': 'total_postings',
        'salary_usd': 'avg_salary_usd',
        'remote_ratio': 'avg_remote_pct'
    })
    
    return salary_bands

if __name__ == "__main__":
    # Ensure this runs relative to the project root
    file_path = "../../datasets/data_roles_salaries.csv"
    
    try:
        raw_df = load_and_clean_data(file_path)
        engineered_df = feature_engineering_vectorized(raw_df)
        salary_metrics = calculate_salary_bands(engineered_df)
        
        print("\n--- Salary Metrics by Role & Experience ---")
        print(salary_metrics.head(10))
        
    except FileNotFoundError:
        print(f"Dataset not found at {file_path}. Ensure you are running this from the correct directory.")
