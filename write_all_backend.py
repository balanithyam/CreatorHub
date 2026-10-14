import os

def w(path, code):
    full = os.path.join('D:/CreatorHub', path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as out_f:
        out_f.write(code.strip() + '\n')
    print('Created:', path)

print('Builder initialized.')
