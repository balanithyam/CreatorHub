# Frontend generator script
import os

def write_file(rel_path, content):
    full_path = os.path.join('frontend', rel_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as out:
        out.write(content.strip() + '\n')
    print('Created: ' + full_path)

print('build_frontend_all.py ready')
