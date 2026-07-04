from PIL import Image
import os

f1 = r'C:\Users\Administrator\.gemini\antigravity-ide\brain\93282e0a-8aed-40ad-9b6c-ceb3c9fb89bf\media__1783155871595.png'
f2 = r'C:\Users\Administrator\.gemini\antigravity-ide\brain\93282e0a-8aed-40ad-9b6c-ceb3c9fb89bf\media__1783155706745.png'

# Read images
img1 = Image.open(f1).convert('RGB')
img2 = Image.open(f2).convert('RGB')

# Code ASCII has the random symbols, Kawung has "JAVA BATIK" text.
# The user's Image 33 (Code ASCII) is very dense. Image 32 (Kawung) has distinct ovals.
# Based on earlier sizes: 1783155706745 (185x1024) is Kawung, 1783155871595 (184x1024) is Code ASCII.

# Crop to square (width x width) from the top
tile1 = img1.crop((0, 0, img1.width, img1.width))
tile2 = img2.crop((0, 0, img2.width, img2.width))

# Save them as WEBP
# tile1 (Code ASCII) -> Spot 1 and 3 -> image_primary.webp
# tile2 (Kawung) -> Spot 2 -> image_secondary.webp
tile1.save('c:/Users/Administrator/wastra/public/images/image_primary.webp', 'webp')
tile2.save('c:/Users/Administrator/wastra/public/images/image_secondary.webp', 'webp')
print("Cropped and saved square tiles!")
