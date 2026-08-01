from backend.database import get_db_connection
import pandas as pd

def get_role_skills_distribution(role: str):
    """
    Returns a dict mapping skill_name to its frequency (0.0 to 1.0) and raw count in the target role.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get total jobs in the role
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE role_category = ?", (role,))
    total_jobs = cursor.fetchone()[0]
    
    if total_jobs == 0:
        conn.close()
        return {}, 0
        
    # Get counts for each skill in this role
    query = """
        SELECT s.skill_name, COUNT(*) as cnt
        FROM job_skills js
        JOIN skills s ON js.skill_id = s.skill_id
        JOIN jobs j ON js.job_id = j.job_id
        WHERE j.role_category = ?
        GROUP BY s.skill_name
    """
    cursor.execute(query, (role,))
    skills_data = cursor.fetchall()
    conn.close()
    
    dist = {}
    for row in skills_data:
        skill = row['skill_name']
        cnt = row['cnt']
        dist[skill] = {
            "count": cnt,
            "frequency": cnt / total_jobs
        }
        
    return dist, total_jobs

def analyze_skill_gap(role: str, user_skills: list):
    """
    Computes matching percentage, lists matched skills, and ranks missing skills by ROI.
    """
    # Clean user skills
    user_skills_clean = {s.strip().lower() for s in user_skills if s.strip()}
    
    dist, total_jobs = get_role_skills_distribution(role)
    if not dist:
        return {
            "match_percentage": 0.0,
            "matching_skills": [],
            "missing_skills": []
        }
        
    # Calculate weighted matching score
    # Sum of frequencies of all skills demanded by the market
    sum_all_freq = sum(item["frequency"] for item in dist.values())
    
    matching_skills = []
    missing_skills = []
    sum_matched_freq = 0.0
    
    for skill_name, info in dist.items():
        freq = info["frequency"]
        if skill_name.lower() in user_skills_clean:
            matching_skills.append(skill_name)
            sum_matched_freq += freq
        else:
            missing_skills.append({
                "skill": skill_name,
                "importance": round(freq, 2),
                "jobs_unlocked_pct": round(freq * 100, 1)
            })
            
    # Sort missing skills by frequency descending
    missing_skills = sorted(missing_skills, key=lambda x: x["importance"], reverse=True)
    
    # Calculate match percentage
    match_percentage = 0.0
    if sum_all_freq > 0:
        match_percentage = round((sum_matched_freq / sum_all_freq) * 100, 1)
        
    return {
        "match_percentage": match_percentage,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "total_role_jobs": total_jobs
    }
