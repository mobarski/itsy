from PIL import Image
import json
import base64

def get_bank(path):
	im = Image.open(path)
	w = im.width
	h = im.height

	data = [0]*(w*h)
	for y in range(h):
		for x in range(w):
			r,g,b,a = im.getpixel((x,y))
			if r>127:
				data[x+y*w] = 1
	
	return {"data":data, "width":w, "height":h}

def get_bank2(path):
	im = Image.open(path)
	w = im.width
	h = im.height

	data = [0]*(w*h//8) # TODO: ceil
	for y in range(h):
		for x in range(w):
			r,g,b,a = im.getpixel((x,y))
			i = x//8+ y*(w//8)
			if r>127:
				data[i] |= 1<<(x%8)
	
	return {"data":data, "width":w, "height":h}

if __name__=="__main__":
	path = 'img/MRMOTEXT EX.png'
	bank = get_bank(path)
	with open('rom.js','w') as fo:
		print(f'bank[5] = {json.dumps(bank)}', file=fo)
	data = bank['data']
	w = bank['width']
	h = bank['height']
	for y in range(h):
		print(''.join(map(str,data[y*h:(y+1)*h])))
	#b64 = base64.b64encode(open(path,'rb').read())
	#open('rom.b64.js','wb').write(b64)
	