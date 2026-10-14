import json, base64, os, sys

def deploy(manifest_path):
    with open(manifest_path, 'r', encoding='utf-8') as f:
        manifest = json.load(f)
    for rel_path, b64_code in manifest.items():
        target = os.path.join('D:/CreatorHub', rel_path)
        os.makedirs(os.path.dirname(target), exist_ok=True)
        with open(target, 'wb') as out_f:
            out_f.write(base64.b64decode(b64_code))
        print(f'Deployed: {rel_path} ({os.path.getsize(target)} bytes)')

if __name__ == '__main__':
    if len(sys.argv) > 1:
        deploy(sys.argv[1])
