from PIL import Image
import os

f1 = r'C:\Users\Administrator\.gemini\antigravity-ide\brain\93282e0a-8aed-40ad-9b6c-ceb3c9fb89bf\media__1783155871595.png'
f2 = r'C:\Users\Administrator\.gemini\antigravity-ide\brain\93282e0a-8aed-40ad-9b6c-ceb3c9fb89bf\media__1783155706745.png'

# Save as webp
Image.open(f1).convert('RGB').save('c:/Users/Administrator/wastra/public/images/image_primary.webp', 'webp')
Image.open(f2).convert('RGB').save('c:/Users/Administrator/wastra/public/images/image_secondary.webp', 'webp')
print("Saved WEBP files")
