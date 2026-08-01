# =====================================================================
# 01: ADVANCED DATA WRANGLING
# =====================================================================
# Description:
# Demonstrates professional data wrangling techniques using Pandas.
# Emphasizes vectorization over slow iterative loops, multi-indexing,
# and handling missing data gracefully.
# =====================================================================

import pandas as pd
import numpy as np

def load_and_clean_data(filepath: str) -> pd.DataFrame:
    """Loads dataset and performs standard cleaning operations."""
    df = pd.read_csv(filepath)
    
    # Standardize column names (lowercase, replace spaces with underscores)
    df.columns = df.columns.str.lower().str.replace(' ', '_')
    
    # Convert date columns to datetime objects
    df['signup_date'] = pd.to_datetime(df['signup_date'])
    df['last_purchase_date'] = pd.to_datetime(df['last_purchase_date'])
    
    return df

def feature_engineering_vectorized(df: pd.DataFrame) -> pd.DataFrame:
    """
    Demonstrates fast, vectorized feature engineering.
    AVOID using df.apply() when vectorization is possible.
    """
    # 1. Vectorized date math
    df['customer_tenure_days'] = (df['last_purchase_date'] - df['signup_date']).dt.days
    
    # 2. np.where for conditional logic (much faster than .apply)
    # Flag high-value retained customers
    df['is_high_value_retained'] = np.where(
        (df['total_revenue'] > 1000) & (df['churned'] == 0), 
        True, 
        False
    )
    
    return df

def calculate_cohort_retention(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculates average order value and churn rate grouped by acquisition cohort.
    Demonstrates multi-indexing and aggregation.
    """
    # Create cohort month feature
    df['cohort_month'] = df['signup_date'].dt.to_period('M')
    
    # Aggregate metrics
    cohort_metrics = df.groupby(['cohort_month', 'acquisition_channel']).agg({
        'customer_id': 'nunique',
        'total_revenue': 'sum',
        'churned': 'mean' # Mean of a 0/1 column gives the churn rate percentage
    }).rename(columns={
        'customer_id': 'total_customers',
        'churned': 'churn_rate'
    })
    
    return cohort_metrics

if __name__ == "__main__":
    # Ensure this runs relative to the project root
    file_path = "../../datasets/ecommerce_churn_data.csv"
    
    try:
        raw_df = load_and_clean_data(file_path)
        engineered_df = feature_engineering_vectorized(raw_df)
        cohorts = calculate_cohort_retention(engineered_df)
        
        print("\n--- Cohort Metrics ---")
        print(cohorts.head(10))
        
    except FileNotFoundError:
        print(f"Dataset not found at {file_path}. Ensure you are running this from the correct directory.")
