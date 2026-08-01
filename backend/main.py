from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

from backend.services.skills_service import analyze_skill_gap
from backend.services.readiness_service import calculate_readiness_score
from backend.services.salary_service import get_salary_intelligence
from backend.services.roadmap_service import get_skill_stacks, get_role_comparison, generate_career_roadmap

app = FastAPI(
    title="DataSkillsMatrix 2.0 API",
    description="Career Intelligence Platform Backend Services",
    version="2.0.0"
)

# Enable CORS for Next.js frontend (running on http://localhost:3000 or similar)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- REQUEST SCHEMAS ---
class GapAnalysisRequest(BaseModel):
    role: str
    skills: List[str]

class ReadinessRequest(BaseModel):
    role: str
    skills: List[str]
    experience: str
    location: str

class SalaryRequest(BaseModel):
    role: str
    location: str
    experience: str

class RoadmapRequest(BaseModel):
    role: str
    skills: List[str]

# --- ENDPOINTS ---

@app.get("/")
def read_root():
    return {"message": "Welcome to DataSkillsMatrix 2.0 API"}

@app.get("/api/v1/roles")
def get_roles():
    return {
        "roles": [
            "Data Analyst", "Business Analyst", "Product Analyst", 
            "BI Analyst", "Data Scientist", "Analytics Consultant", 
            "Strategy Analyst"
        ]
    }

@app.get("/api/v1/locations")
def get_locations():
    return {
        "locations": [
            "Bangalore", "Mumbai", "Pune", "Delhi NCR", "Hyderabad",
            "Chennai", "Kolkata", "Ahmedabad", "Remote",
            "Noida", "Gurgaon", "Gurugram", "Navi Mumbai", "Thane", 
            "Coimbatore", "Vadodara", "Surat", "Indore", "Jaipur", 
            "Kochi", "Trivandrum", "Chandigarh", "Lucknow", "Nagpur", 
            "Visakhapatnam", "Bhubaneswar"
        ]
    }

@app.post("/api/v1/skills/gap-analysis")
def post_gap_analysis(req: GapAnalysisRequest):
    try:
        res = analyze_skill_gap(req.role, req.skills)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/readiness")
def post_readiness(req: ReadinessRequest):
    try:
        res = calculate_readiness_score(req.role, req.skills, req.experience, req.location)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/salary/insights")
def post_salary_insights(req: SalaryRequest):
    try:
        res = get_salary_intelligence(req.role, req.location, req.experience)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/skill-stacks")
def get_stacks(role: Optional[str] = None, limit: int = 6):
    try:
        res = get_skill_stacks(role, limit)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/compare")
def get_compare(roleA: str, roleB: str):
    try:
        res = get_role_comparison(roleA, roleB)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/roadmap")
def post_roadmap(req: RoadmapRequest):
    try:
        res = generate_career_roadmap(req.role, req.skills)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
