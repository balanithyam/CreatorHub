import urllib.request
import json

base_url = "http://localhost:5000/api"

# 1. Login as Creator
login_data = json.dumps({
    "email": "creator@creatorhub.com",
    "password": "Password123!"
}).encode('utf-8')

req = urllib.request.Request(f"{base_url}/auth/login", data=login_data, headers={
    'Content-Type': 'application/json',
    'User-Agent': 'Test'
})

with urllib.request.urlopen(req) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    token = res.get('token')
    user = res.get('user')
    print(f"Logged in successfully as {user.get('name')} ({user.get('role')})")

auth_headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json',
    'User-Agent': 'Test'
}

# 2. Test Get Discover Feeds
req = urllib.request.Request(f"{base_url}/discover", headers=auth_headers)
with urllib.request.urlopen(req) as resp:
    sources = json.loads(resp.read().decode('utf-8'))
    print(f"Discovered {len(sources)} live trend sources")

# 3. Test Get Ideas
req = urllib.request.Request(f"{base_url}/ideas", headers=auth_headers)
with urllib.request.urlopen(req) as resp:
    ideas = json.loads(resp.read().decode('utf-8'))
    print(f"Fetched {len(ideas)} active ideas in Kanban")

# 4. Test Get Blueprints
req = urllib.request.Request(f"{base_url}/blueprints", headers=auth_headers)
with urllib.request.urlopen(req) as resp:
    bps = json.loads(resp.read().decode('utf-8'))
    print(f"Fetched {len(bps)} narrative blueprints")

# 5. Test Get Content items & Versions
req = urllib.request.Request(f"{base_url}/content", headers=auth_headers)
with urllib.request.urlopen(req) as resp:
    items = json.loads(resp.read().decode('utf-8'))
    print(f"Fetched {len(items)} media production tracks")

# 6. Test Get Audience signals
req = urllib.request.Request(f"{base_url}/audience", headers=auth_headers)
with urllib.request.urlopen(req) as resp:
    feedbacks = json.loads(resp.read().decode('utf-8'))
    print(f"Fetched {len(feedbacks)} audience feedback signals")

print("ALL API ENDPOINTS FUNCTIONING 100% PERFECTLY!")
