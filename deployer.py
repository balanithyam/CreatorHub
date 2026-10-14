import base64, os, sys

def deploy(file_map):
    for rel_path, b64_content in file_map.items():
        full = os.path.join('D:/CreatorHub', rel_path)
        os.makedirs(os.path.dirname(full), exist_ok=True)
        with open(full, 'wb') as f:
            f.write(base64.b64decode(b64_content))
        print(f'Deployed: {rel_path} ({os.path.getsize(full)} bytes)')
