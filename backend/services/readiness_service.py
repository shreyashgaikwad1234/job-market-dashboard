from backend.services.skills_service import analyze_skill_gap
from backend.database import get_db_connection

EXP_MAPPING = {
    "0-1": 0,
    "1-3": 1,
    "3-5": 2,
    "5+": 3
}

def get_role_experience_distribution(role: str):
    """
    Returns the distribution of experience levels required in the market for a specific role.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT experience, COUNT(*) as cnt
        FROM jobs
        WHERE role_category = ?
        GROUP BY experience
    """, (role,))
    data = cursor.fetchall()
    conn.close()
    
    total = sum(row['cnt'] for row in data)
    if total == 0:
        return {}
        
    return {row['experience']: row['cnt'] / total for row in data}

def calculate_readiness_score(role: str, user_skills: list, user_exp: str, user_location: str):
    """
    Calculates a Career Readiness Score from 0 to 100 with detailed breakdowns.
    """
    # 1. Skill Match Score (70% weight)
    gap_analysis = analyze_skill_gap(role, user_skills)
    skill_match_pct = gap_analysis["match_percentage"]
    weighted_skills = (skill_match_pct / 100.0) * 70.0
    
    # 2. Experience Alignment (20% weight)
    exp_dist = get_role_experience_distribution(role)
    
    # Heuristic experience scoring
    # Let's see what experience level is most demanded in the market
    best_exp_level = max(exp_dist.items(), key=lambda x: x[1])[0] if exp_dist else "1-3"
    
    user_idx = EXP_MAPPING.get(user_exp, 1)
    best_idx = EXP_MAPPING.get(best_exp_level, 1)
    
    if user_idx >= best_idx:
        # User meets or exceeds the most in-demand experience level
        exp_score = 20.0
    else:
        # Proportional discount
        exp_score = 20.0 * (1.0 - 0.25 * (best_idx - user_idx))
        
    # 3. Location / Work Mode Fit (10% weight)
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if there is active hiring in user's location
    cursor.execute("""
        SELECT COUNT(*) 
        FROM jobs 
        WHERE role_category = ? AND (location = ? OR location = 'Remote')
    """, (role, user_location))
    location_jobs = cursor.fetchone()[0]
    conn.close()
    
    if user_location.lower() == "remote":
        location_score = 10.0
    elif location_jobs > 5:
        location_score = 10.0  # high demand
    elif location_jobs > 0:
        location_score = 8.0   # moderate demand
    else:
        location_score = 5.0   # low/no local demand
        
    total_score = min(100, int(round(weighted_skills + exp_score + location_score)))
    
    return {
        "readiness_score": total_score,
        "breakdown": {
            "skills": {
                "score": round(weighted_skills, 1),
                "max": 70.0,
                "percentage": skill_match_pct
            },
            "experience": {
                "score": round(exp_score, 1),
                "max": 20.0,
                "user_level": user_exp,
                "market_focus": best_exp_level
            },
            "location": {
                "score": round(location_score, 1),
                "max": 10.0,
                "user_location": user_location
            }
        },
        "skills_gap": {
            "matching": gap_analysis["matching_skills"],
            "missing": gap_analysis["missing_skills"]
        }
    }
