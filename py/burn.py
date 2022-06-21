from PIL import Image
import json
import base64

# 1->130kb 8->25kb 16:20kb

def get_bank1(path):
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

def get_bank8(path):
	im = Image.open(path)
	w = im.width
	h = im.height

	data = [0]*(w*h//8) # TODO: ceil
	for y in range(h):
		for x in range(w):
			r,g,b,a = im.getpixel((x,y))
			i = x//8+ y*w//8
			if r>127:
				data[i] |= 1<<(x%8)
	
	return {"data":data, "width":w, "height":h}

def get_bank16(path):
	im = Image.open(path)
	w = im.width
	h = im.height

	data = [0]*(w*h//16) # TODO: ceil
	for y in range(h):
		for x in range(w):
			r,g,b,a = im.getpixel((x,y))
			i = x//16+ y*w//16
			if r>127:
				data[i] |= 1<<(x%16)
	
	return {"data":data, "width":w, "height":h}

# !!!!!!!!!!!!!!!!!!
get_bank = get_bank8
# !!!!!!!!!!!!!!!!!!

if __name__=="__main__":
	path = '../charsets/MRMOTEXT EX.png'
	bank1 = get_bank1(path)
	bank8 = get_bank8(path)
	bank16 = get_bank16(path)
	with open('../js/rom.js','w') as fo:
		print(f'fc.bank[0] = {json.dumps(bank8).replace(" ","")}', file=fo)
		print(f'fc.bank[8] = {json.dumps(bank8).replace(" ","")}', file=fo)
		#print(f'fc.bank[16] = {json.dumps(bank16).replace(" ","")}', file=fo)

