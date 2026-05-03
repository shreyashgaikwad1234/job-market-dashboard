import pandas as pd
import streamlit as st
from collections import Counter

# Load data
df = pd.read_csv("data/processed/jobs_clean.csv")

st.title("📊 Job Market Dashboard")

st.write("Total Jobs:", len(df))

# Extract skills again (they are stored as string)
df["extracted_skills"] = df["extracted_skills"].apply(eval)

# Count skills
all_skills = []
for skills in df["extracted_skills"]:
    all_skills.extend(skills)

skill_counts = Counter(all_skills)

# Convert to DataFrame
skill_df = pd.DataFrame(skill_counts.items(), columns=["Skill", "Count"])
skill_df = skill_df.sort_values(by="Count", ascending=False)

# Show table
st.subheader("Top Skills")
st.dataframe(skill_df)

# Show bar chart
st.subheader("Skill Demand Chart")
st.bar_chart(skill_df.set_index("Skill"))