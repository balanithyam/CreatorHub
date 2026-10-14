import os, base64

def w(path, code):
    full = os.path.join('D:/CreatorHub', path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(code.strip() + '\n')
    print('Was Created:', path)
