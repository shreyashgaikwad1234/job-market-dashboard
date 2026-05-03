import streamlit as st
import pandas as pd
import plotly.express as px
import ast
from collections import Counter
from itertools import combinations

st.set_page_config(layout="wide")

# -------------------- NAVBAR + UI STYLE --------------------
st.markdown("""
<style>

/* Background */
body {
    background: linear-gradient(135deg, #eef2ff, #f8fafc);
}

/* NAVBAR (FIXED VISIBILITY) */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 25px;
    background: white;
    border-radius: 14px;
    border: 1px solid #c7d2fe;
    margin-bottom: 20px;
}

.nav-left {
    font-size: 26px;
    font-weight: 800;
    color: #1e293b;
}

.nav-right a {
    margin-left: 25px;
    text-decoration: none;
    font-weight: 600;
    color: #1e293b;
}

.nav-right a:hover {
    color: #4f46e5;
    text-decoration: underline;
}

/* HEADER */
.title {
    text-align: center;
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 5px;
    color: #1e293b;
}

.subtitle {
    text-align: center;
    color: #6366f1;
    margin-bottom: 30px;
}

/* FILTER BOX */
.filter-box {
    background: white;
    padding: 15px;
    border-radius: 14px;
    border: 1px solid #e5e7eb;
}

/* SECTION */
.section-title {
    font-size: 22px;
    font-weight: 700;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #1e293b;
}

</style>

<div class="navbar">
    <div class="nav-left"> DATA SKILLS MATRIX</div>
    <div class="nav-right">
        <a href="#">Dashboard</a>
        <a href="https://github.com/shreyashgaikwad1234/job-market-dashboard" target="_blank">
            Project Repository
        </a>
    </div>
</div>
""", unsafe_allow_html=True)

# -------------------- LOAD DATA --------------------
@st.cache_data
def load():
    df = pd.read_csv("data/processed/jobs_clean.csv")

    def safe(x):
        try:
            return ast.literal_eval(x)
        except:
            return []

    df["extracted_skills"] = df["extracted_skills"].apply(safe)
    df["location"] = df["location"].str.split(",").str[0]
    return df

df = load()

# -------------------- HEADER --------------------
st.markdown('<div class="title">DATA SKILLS MATRIX</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Real insights for smarter career decisions</div>', unsafe_allow_html=True)

# -------------------- FILTER BAR --------------------
st.markdown('<div class="filter-box">', unsafe_allow_html=True)

f1, f2, f3 = st.columns(3)

with f1:
    role = st.selectbox("Role", ["All"] + list(df["title"].dropna().unique()))

with f2:
    location = st.selectbox("Location", ["All"] + list(df["location"].dropna().unique()))

with f3:
    skill_focus = st.selectbox(
        "Skill Focus",
        ["All", "python", "sql", "excel", "machine learning", "power bi", "tableau"]
    )

st.markdown('</div>', unsafe_allow_html=True)

# -------------------- FILTER LOGIC --------------------
filtered = df.copy()

if role != "All":
    filtered = filtered[filtered["title"].str.contains(role, case=False, na=False)]

if location != "All":
    filtered = filtered[filtered["location"] == location]

if skill_focus != "All":
    filtered = filtered[filtered["extracted_skills"].astype(str).str.contains(skill_focus)]

# -------------------- KPIs --------------------
k1, k2, k3 = st.columns(3)

k1.metric("Jobs", len(filtered))
k2.metric("Companies", filtered["companyName"].nunique())
k3.metric("Roles", filtered["title"].nunique())

# -------------------- PROCESS --------------------
exp = filtered.explode("extracted_skills")
exp = exp[exp["extracted_skills"].notna()]

skills = exp["extracted_skills"].value_counts().head(8).reset_index()
skills.columns = ["Skill", "Count"]

# -------------------- ROW 1 --------------------
c1, c2 = st.columns(2)

with c1:
    st.markdown('<div class="section-title"> Skill Distribution</div>', unsafe_allow_html=True)
    fig = px.pie(
        skills,
        names="Skill",
        values="Count",
        hole=0.55,
        color_discrete_sequence=px.colors.sequential.Plasma
    )
    st.plotly_chart(fig, width='stretch')

with c2:
    st.markdown('<div class="section-title">Skill Demand</div>', unsafe_allow_html=True)
    fig = px.bar(
        skills,
        x="Skill",
        y="Count",
        color="Skill",
        color_discrete_sequence=px.colors.sequential.Plasma
    )
    st.plotly_chart(fig, width='stretch')

# -------------------- ROW 2 --------------------
c3, c4 = st.columns(2)

# -------------------- SKILL COMBINATIONS --------------------
counter = Counter()

for s in filtered["extracted_skills"]:
    if isinstance(s, list):
        for combo in combinations(s, 2):
            counter[tuple(sorted(combo))] += 1

combo_df = pd.DataFrame(counter.most_common(6), columns=["Pair", "Count"])
combo_df["Pair"] = combo_df["Pair"].astype(str)

with c3:
    st.markdown('<div class="section-title"> Skill Combinations</div>', unsafe_allow_html=True)
    fig = px.bar(
        combo_df,
        x="Count",
        y="Pair",
        orientation="h",
        color_discrete_sequence=["#6366f1"]
    )
    st.plotly_chart(fig, width='stretch')

# -------------------- LOCATION INSIGHT --------------------
with c4:
    st.markdown('<div class="section-title"> Top Skill by City</div>', unsafe_allow_html=True)

    city_skill = (
        exp.groupby(["location", "extracted_skills"])
        .size()
        .reset_index(name="count")
    )

    top_city_skill = city_skill.sort_values("count", ascending=False).drop_duplicates("location")
    top_city_skill = top_city_skill.sort_values("count", ascending=False).head(6)

    fig = px.bar(
        top_city_skill,
        x="location",
        y="count",
        color="extracted_skills",
        text="extracted_skills",
        color_discrete_sequence=px.colors.qualitative.Bold
    )

    fig.update_traces(textposition='outside')

    st.plotly_chart(fig, width='stretch')