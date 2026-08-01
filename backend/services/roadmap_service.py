from collections import Counter
from itertools import combinations
import sqlite3
from backend.database import get_db_connection
from backend.services.skills_service import analyze_skill_gap, get_role_skills_distribution
from backend.services.salary_service import get_salary_intelligence

def get_skill_stacks(role: str = None, limit: int = 6):
    """
    Analyzes which pairs of skills are most frequently demanded together in the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Query to fetch all jobs and their skills
    if role:
        query = """
            SELECT js.job_id, s.skill_name
            FROM job_skills js
            JOIN skills s ON js.skill_id = s.skill_id
            JOIN jobs j ON js.job_id = j.job_id
            WHERE j.role_category = ?
        """
        cursor.execute(query, (role,))
    else:
        query = """
            SELECT js.job_id, s.skill_name
            FROM job_skills js
            JOIN skills s ON js.skill_id = s.skill_id
        """
        cursor.execute(query)
        
    rows = cursor.fetchall()
    conn.close()
    
    # Group skills by job ID
    job_skills_map = {}
    for row in rows:
        job_id = row['job_id']
        skill = row['skill_name']
        if job_id not in job_skills_map:
            job_skills_map[job_id] = []
        job_skills_map[job_id].append(skill)
        
    # Count pairs
    pair_counter = Counter()
    for skills in job_skills_map.values():
        if len(skills) >= 2:
            # Sort to ensure order-independence (e.g. SQL+Python == Python+SQL)
            for pair in combinations(sorted(skills), 2):
                pair_counter[pair] += 1
                
    total_jobs = len(job_skills_map)
    if total_jobs == 0:
        return []
        
    top_pairs = []
    for pair, count in pair_counter.most_common(limit):
        pct = (count / total_jobs) * 100
        # Calculate dummy salary premium based on skills presence
        # Let's say if it contains Python or Machine Learning it gets higher premium
        premium = 8.0
        if any(x in [pair[0].lower(), pair[1].lower()] for x in ["python", "machine learning"]):
            premium = 18.0
        elif any(x in [pair[0].lower(), pair[1].lower()] for x in ["aws", "databricks", "snowflake"]):
            premium = 12.0
            
        top_pairs.append({
            "stack": f"{pair[0]} + {pair[1]}",
            "skill_a": pair[0],
            "skill_b": pair[1],
            "frequency_count": count,
            "demand_percentage": round(pct, 1),
            "salary_premium_pct": premium
        })
        
    return top_pairs

def get_role_comparison(role_a: str, role_b: str):
    """
    Compares two roles side-by-side: skills overlap, average salaries, total jobs, etc.
    """
    # 1. Fetch counts
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE role_category = ?", (role_a,))
    count_a = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM jobs WHERE role_category = ?", (role_b,))
    count_b = cursor.fetchone()[0]
    
    conn.close()
    
    # 2. Salary intel
    sal_a = get_salary_intelligence(role_a, "Bangalore", "1-3")
    sal_b = get_salary_intelligence(role_b, "Bangalore", "1-3")
    
    # 3. Skills overlap
    dist_a, _ = get_role_skills_distribution(role_a)
    dist_b, _ = get_role_skills_distribution(role_b)
    
    skills_a_set = set(dist_a.keys())
    skills_b_set = set(dist_b.keys())
    
    common_skills = sorted(list(skills_a_set.intersection(skills_b_set)), key=lambda x: dist_a[x]["frequency"] + dist_b[x]["frequency"], reverse=True)[:5]
    unique_a = sorted(list(skills_a_set - skills_b_set), key=lambda x: dist_a[x]["frequency"], reverse=True)[:4]
    unique_b = sorted(list(skills_b_set - skills_a_set), key=lambda x: dist_b[x]["frequency"], reverse=True)[:4]
    
    return {
        "role_a": {
            "name": role_a,
            "jobs_count": count_a,
            "median_salary": sal_a["median_salary"],
            "salary_range": sal_a["expected_range"],
            "unique_skills": unique_a
        },
        "role_b": {
            "name": role_b,
            "jobs_count": count_b,
            "median_salary": sal_b["median_salary"],
            "salary_range": sal_b["expected_range"],
            "unique_skills": unique_b
        },
        "common_skills": common_skills
    }

def generate_career_roadmap(role: str, current_skills: list):
    """
    Generates a monthly step-by-step roadmap to acquire missing skills.
    """
    gap = analyze_skill_gap(role, current_skills)
    missing = gap["missing_skills"]
    
    if not missing:
        return [
            {
                "step": 1,
                "duration": "1 Month",
                "title": "Build Advanced Capstone Projects",
                "details": f"You already match all core skills for {role}! Focus on building end-to-end portfolio projects.",
                "skills_covered": current_skills[:3]
            },
            {
                "step": 2,
                "duration": "1 Month",
                "title": "Interview Preparation",
                "details": "Practice core data structure questions, system design, and behavioral questions.",
                "skills_covered": ["Interview Prep"]
            }
        ]
        
    roadmap = []
    step_num = 1
    
    # We allocate 1 month for complex skills and 0.5 months for tool/visualization skills
    tool_skills = {"excel", "power bi", "tableau", "git", "jira", "confluence", "html", "css"}
    
    current_step_skills = []
    current_duration = 0.0
    
    for item in missing:
        skill = item["skill"]
        is_tool = skill.lower() in tool_skills
        
        # Accumulate skills into blocks
        current_step_skills.append(skill)
        current_duration += 0.5 if is_tool else 1.0
        
        if current_duration >= 1.0 or len(current_step_skills) >= 2:
            # Flush step
            dur_str = "1 Month" if current_duration >= 1.0 else "2 Weeks"
            skills_list = ", ".join(current_step_skills)
            
            roadmap.append({
                "step": step_num,
                "duration": dur_str,
                "title": f"Master {skills_list}",
                "details": f"Focus on core concepts, syntax, and building micro-projects utilizing {skills_list} which unlocks {item['jobs_unlocked_pct']}% of jobs in the market.",
                "skills_covered": list(current_step_skills)
            })
            step_num += 1
            current_step_skills = []
            current_duration = 0.0
            
    # Flush remaining if any
    if current_step_skills:
        skills_list = ", ".join(current_step_skills)
        roadmap.append({
            "step": step_num,
            "duration": "2 Weeks",
            "title": f"Master {skills_list}",
            "details": f"Complete hands-on tutorials and lab exercises for {skills_list}.",
            "skills_covered": list(current_step_skills)
        })
        step_num += 1
        
    # Append Capstone Project Step
    roadmap.append({
        "step": step_num,
        "duration": "1 Month",
        "title": "Design a Comprehensive Capstone Project",
        "details": f"Build a data analytics dashboard or predictive pipelines using SQL, Python, and BI tools. Publish your work on GitHub.",
        "skills_covered": ["Portfolio Building", "GitHub"]
    })
    step_num += 1
    
    # Append Interview Prep
    roadmap.append({
        "step": step_num,
        "duration": "1 Month",
        "title": f"Interview Prep & Resume Optimization",
        "details": f"Tailor your resume to highlight matching skills for {role}. Practice SQL queries and mock interviews.",
        "skills_covered": ["Mock Interviews", "Resume Writing"]
    })
    
    return roadmap
