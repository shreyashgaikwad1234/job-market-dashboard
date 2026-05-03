import pandas as pd
import re
from collections import Counter

# Load data
df = pd.read_json("data/raw/jobs.json")

print("Total rows:", len(df))

# Skill list
SKILLS = [
    "python", "sql", "excel", "power bi", "tableau",
    "machine learning", "pandas", "numpy", "aws",
    "statistics", "data analysis", "deep learning"
]

# Skill extraction function
def extract_skills(text):
    text = str(text).lower()
    found = []
    for skill in SKILLS:
        if re.search(r'\b' + skill + r'\b', text):
            found.append(skill)
    return found

# Apply on jobDescription
df["extracted_skills"] = df["jobDescription"].apply(extract_skills)

# 🔥 Skill frequency
all_skills = []
for skills in df["extracted_skills"]:
    all_skills.extend(skills)

skill_counts = Counter(all_skills)

print("\nTop Skills:\n", skill_counts.most_common(10))

# 🔥 Save cleaned data
df.to_csv("data/processed/jobs_clean.csv", index=False)

print("\n✅ Clean data saved to data/processed/jobs_clean.csv")