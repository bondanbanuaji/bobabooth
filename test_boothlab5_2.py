from PIL import Image, ImageDraw

frame = Image.open('/home/boba/Projects/bobabooth/public/img/template/Free Frame Boothlab 5.png').convert('RGBA')

canvas1 = Image.new('RGBA', frame.size, (255, 255, 255, 255))
draw1 = ImageDraw.Draw(canvas1)
leftX = 70
rightX = 660
topY = 60
yGap = 510
w = 480
h = 490

for i in range(3):
    y = topY + i * yGap
    draw1.rectangle([leftX, y, leftX + w, y + h], fill=(255, 0, 0, 128))
    draw1.rectangle([rightX, y, rightX + w, y + h], fill=(255, 0, 0, 128))

canvas1.alpha_composite(frame)
canvas1.save('test_boothlab5_2.png')
