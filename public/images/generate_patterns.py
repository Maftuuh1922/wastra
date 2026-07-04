from PIL import Image, ImageDraw, ImageFont

def create_image(filename, text, size, color):
    img = Image.new('RGBA', size, (253, 251, 247, 0)) # transparent background
    d = ImageDraw.Draw(img)
    for y in range(0, size[1], 15):
        d.text((0, y), text, fill=color)
    img.save(filename, 'webp')

text_primary = "01001011 01010111 01010011 01010100 01010010 01000001 " * 5
create_image('c:/Users/Administrator/wastra/public/images/image_primary.webp', text_primary, (400, 400), (60, 56, 54, 255))

text_secondary = "  ( @ )   ( @ )   ( @ )   ( @ )   ( @ )   ( @ )  "
create_image('c:/Users/Administrator/wastra/public/images/image_secondary.webp', text_secondary, (350, 350), (60, 56, 54, 255))
