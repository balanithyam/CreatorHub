import os

pages_dir = r"D:\CreatorHub\frontend\src\pages"

# Let's inspect each page and replace data assignments
for fname in os.listdir(pages_dir):
    if not fname.endswith('.tsx'):
        continue
    fpath = os.path.join(pages_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Let's add safe array extraction helper or replace setX(res.data) with safe extract
    # Check if api.get or Promise.all is used
    print(f"Checking {fname}...")
