from PIL import Image
import glob
import os

for path in sorted(glob.glob('/home/boba/Projects/bobabooth/public/img/template/*.png')):
    img = Image.open(path).convert('RGBA')
    width, height = img.size
    print(f"\n--- {os.path.basename(path)} ---")
    print(f"Dimensions: {width}x{height}")
    
    alpha = img.split()[-1]
    pixels = alpha.load()
    holes = []
    visited = set()
    
    for y in range(0, height, 5): # skip by 5 for speed
        for x in range(0, width, 5):
            if pixels[x, y] < 10 and (x, y) not in visited:
                min_x = x
                min_y = y
                
                px = x
                while px < width and pixels[px, y] < 10:
                    px += 1
                max_x = px - 1
                
                py = y
                while py < height and pixels[x, py] < 10:
                    py += 1
                max_y = py - 1
                
                if (max_x - min_x) > 50 and (max_y - min_y) > 50:
                    # check if the whole rect is transparent
                    is_rect = True
                    for test_y in range(min_y, max_y, 10):
                        if pixels[min_x + (max_x - min_x)//2, test_y] >= 10:
                            is_rect = False
                            break
                            
                    if is_rect:
                        for vy in range(min_y, max_y + 1, 5):
                            for vx in range(min_x, max_x + 1, 5):
                                visited.add((vx, vy))
                        holes.append((min_x, min_y, max_x - min_x + 1, max_y - min_y + 1))
                else:
                    visited.add((x, y))

    if not holes:
        print("No transparent holes found.")
    else:
        # Merge overlapping or close boxes
        merged = []
        for hx, hy, hw, hh in holes:
            found = False
            for i, (mx, my, mw, mh) in enumerate(merged):
                if abs(hx-mx) < 50 and abs(hy-my) < 50:
                    merged[i] = (min(hx, mx), min(hy, my), max(hw, mw), max(hh, mh))
                    found = True
                    break
            if not found:
                merged.append((hx, hy, hw, hh))

        merged.sort(key=lambda b: (b[1], b[0]))
        for i, (hx, hy, hw, hh) in enumerate(merged):
            print(f"Hole {i+1}: x={hx}, y={hy}, width={hw}, height={hh}")
