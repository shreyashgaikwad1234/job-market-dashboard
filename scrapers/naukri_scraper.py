import requests
from bs4 import BeautifulSoup

url = "https://in.indeed.com/jobs?q=data+analyst&l=Pune"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)
print(response.status_code)

soup = BeautifulSoup(response.text, "html.parser")

jobs = soup.find_all("div", class_="job_seen_beacon")

print("Jobs found:", len(jobs))

for job in jobs:
    title = job.find("h2")
    company = job.find("span", class_="companyName")

    print("Job:", title.text.strip() if title else "N/A")
    print("Company:", company.text.strip() if company else "N/A")
    print("-" * 40)