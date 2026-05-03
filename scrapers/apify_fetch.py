import requests
import json
import os

# 🔹 Read token from environment
API_TOKEN = os.environ.get("APIFY_TOKEN")

if not API_TOKEN:
    print("❌ Token not found. Set it in environment")
    exit()

# 🔹 Dataset ID
DATASET_ID = "2xgOPHxkl4xnpeasQ"

# 🔹 API URL
url = f"https://api.apify.com/v2/datasets/{DATASET_ID}/items?limit=1000&clean=true"

# 🔹 Header auth (SAFE)
headers = {
    "Authorization": f"Bearer {API_TOKEN}"
}

response = requests.get(url, headers=headers)

print("Status:", response.status_code)

data = response.json()

if isinstance(data, list):
    print("Total jobs:", len(data))
else:
    print("❌ ERROR:", data)
    exit()

with open("data/raw/jobs.json", "w") as f:
    json.dump(data, f, indent=2)

print("✅ Saved successfully")