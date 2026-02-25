import os
import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Replacements to apply
    # We want to replace standard tailwind color codes
    # purple-X -> stone-X
    # pink-X -> amber-X  (for buttons/accents)
    
    # Simple regex replacing words
    updated = re.sub(r'\bpurple-(\d{2,3})\b', r'stone-\1', content)
    updated = re.sub(r'\bpink-(\d{2,3})\b', r'amber-\1', updated)
    
    if content != updated:
        with open(filepath, 'w') as f:
            f.write(updated)
        print(f"Updated {filepath}")

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.jsx', '.js', '.css')):
                process_file(os.path.join(root, file))

if __name__ == "__main__":
    process_directory('/Users/priyanshdhingra/Desktop/featherfold2/featherfold-frontend-vercel/src')
    process_directory('/Users/priyanshdhingra/Desktop/featherfold2/featherfold-frontend-vercel') # Update tailwind config or other files just in case
