with open(r"D:\CreatorHub\backend\utils\autoSeed.js", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("actionType: 'version_uploaded'", "actionType: 'version_created'")

with open(r"D:\CreatorHub\backend\utils\autoSeed.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated autoSeed with version_created!")
