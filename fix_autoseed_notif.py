with open(r"D:\CreatorHub\backend\utils\autoSeed.js", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("type: 'review_comment'", "type: 'review_request'")

with open(r"D:\CreatorHub\backend\utils\autoSeed.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Updated autoSeed with review_request!")
