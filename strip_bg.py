import os, re
files = [
    ('components/about-platform.tsx', 'className="section-texture-kawung bg-background py-20 md:py-28"', 'className="py-20 md:py-28"'),
    ('components/why-choose-us.tsx', 'className="bg-contrast py-20 md:py-28"', 'className="py-20 md:py-28"'),
    ('components/motif-catalog.tsx', 'className="bg-background py-20 md:py-28"', 'className="py-20 md:py-28"'),
    ('components/motif-catalog.tsx', 'id="katalog" className="bg-background py-20 md:py-28"', 'id="katalog" className="py-20 md:py-28"'),
    ('components/cultural-trends.tsx', 'className="bg-background py-20 md:py-28"', 'className="py-20 md:py-28"'),
    ('components/learning-center.tsx', 'id="belajar" className="bg-contrast py-20 md:py-28"', 'id="belajar" className="py-20 md:py-28"'),
    ('components/how-it-works.tsx', 'className="bg-background py-20 md:py-28"', 'className="py-20 md:py-28"')
]
for f, old, new in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    content = content.replace(old, new)
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
