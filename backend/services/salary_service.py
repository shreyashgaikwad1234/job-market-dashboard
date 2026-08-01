import re
import numpy as np
from backend.database import get_db_connection

# Fallback salary grid in LPA if database returns insufficient records
SALARY_GRID = {
    "Data Analyst": {"0-1": (4.0, 6.0), "1-3": (6.0, 9.5), "3-5": (9.5, 14.0), "5+": (14.0, 22.0)},
    "Business Analyst": {"0-1": (4.5, 6.5), "1-3": (6.5, 10.0), "3-5": (10.0, 15.0), "5+": (15.0, 24.0)},
    "Product Analyst": {"0-1": (5.0, 7.0), "1-3": (7.0, 11.0), "3-5": (11.0, 17.0), "5+": (17.0, 26.0)},
    "Data Scientist": {"0-1": (6.0, 9.0), "1-3": (9.0, 15.0), "3-5": (15.0, 22.0), "5+": (22.0, 38.0)},
    "BI Analyst": {"0-1": (4.5, 6.0), "1-3": (6.0, 9.0), "3-5": (9.0, 13.5), "5+": (13.5, 20.0)},
    "Reporting Analyst": {"0-1": (3.5, 5.0), "1-3": (5.0, 7.5), "3-5": (7.5, 11.0), "5+": (11.0, 16.0)},
    "Operations Analyst": {"0-1": (3.5, 5.0), "1-3": (5.0, 7.5), "3-5": (7.5, 11.0), "5+": (11.0, 16.0)},
    "Strategy Analyst": {"0-1": (5.0, 8.0), "1-3": (8.0, 13.0), "3-5": (13.0, 19.0), "5+": (19.0, 30.0)},
    "Analytics Consultant": {"0-1": (5.0, 7.5), "1-3": (7.5, 12.0), "3-5": (12.0, 18.0), "5+": (18.0, 28.0)},
    "Management Consultant": {"0-1": (6.0, 10.0), "1-3": (10.0, 16.0), "3-5": (16.0, 24.0), "5+": (24.0, 40.0)},
    "Product Manager": {"0-1": (7.0, 11.0), "1-3": (11.0, 18.0), "3-5": (18.0, 28.0), "5+": (28.0, 45.0)},
}

def parse_salary_string(salary_str: str):
    """
    Parses a string like '₹6.0 - ₹9.5 LPA' and returns a tuple (6.0, 9.5).
    """
    if not salary_str:
        return None
        
    # Extract floating point numbers
    numbers = re.findall(r'[-+]?\d*\.\d+|\d+', salary_str)
    if not numbers:
        return None
        
    try:
        vals = [float(n) for n in numbers]
        if len(vals) >= 2:
            return vals[0], vals[1]
        elif len(vals) == 1:
            return vals[0], vals[0]
    except ValueError:
        return None
        
    return None

def get_salary_intelligence(role: str, location: str, experience: str):
    """
    Returns median, expected range, and top quartile salary in LPA.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Try exact filter first
    query = """
        SELECT salary 
        FROM jobs 
        WHERE role_category = ? AND location = ? AND experience = ? AND salary IS NOT NULL
    """
    cursor.execute(query, (role, location, experience))
    rows = cursor.fetchall()
    
    # Fallback 1: Ignore location (broader filter)
    if len(rows) < 5:
        query = """
            SELECT salary 
            FROM jobs 
            WHERE role_category = ? AND experience = ? AND salary IS NOT NULL
        """
        cursor.execute(query, (role, experience))
        rows = cursor.fetchall()
        
    conn.close()
    
    midpoints = []
    for row in rows:
        parsed = parse_salary_string(row['salary'])
        if parsed:
            min_val, max_val = parsed
            midpoint = (min_val + max_val) / 2.0
            midpoints.append(midpoint)
            
    # Fallback 2: Mathematical grid approximation if no data exists
    if len(midpoints) < 3:
        role_grid = SALARY_GRID.get(role, SALARY_GRID["Data Analyst"])
        min_val, max_val = role_grid.get(experience, role_grid["1-3"])
        
        # Build a small simulated array centered around the grid values
        midpoints = [
            min_val + 0.2 * (max_val - min_val),
            (min_val + max_val) / 2.0,
            max_val - 0.2 * (max_val - min_val)
        ]
        
    midpoints = sorted(midpoints)
    
    # Calculate percentiles
    median_val = np.percentile(midpoints, 50)
    p25 = np.percentile(midpoints, 25)
    p75 = np.percentile(midpoints, 75)
    
    return {
        "role": role,
        "location": location,
        "experience": experience,
        "median_salary": round(median_val, 1),
        "expected_range": f"₹{round(p25, 1)} - ₹{round(p75, 1)} LPA",
        "top_quartile": round(p75, 1),
        "data_points_analyzed": len(midpoints)
    }
