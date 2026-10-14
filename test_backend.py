import urllib.request
import json
import time

# Let's test if backend is reachable on port 5000
try:
    req = urllib.request.Request("http://localhost:5000/api/health", headers={'User-Agent': 'TestClient'})
    with urllib.request.urlopen(req, timeout=3) as resp:
        print("Health status:", resp.status, resp.read().decode('utf-8'))
except Exception as e:
    print("Backend currently not running or waiting to start:", e)
