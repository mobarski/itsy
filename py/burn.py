from PIL import Image
import json
import base64
import re

def get_bank(path):
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


def parse_charmap(path):
	lines = open(path,encoding='utf8').readlines()
	lines = [x.rstrip('\r\n') for x in lines if not x.strip().startswith('//')]
	cols,rows = [int(x.strip()) for x in lines[1].strip().split(', ')]
	data = lines[2:]
	flat = ''.join(data)
	charmap = {c:i for i,c in enumerate(flat) if c.strip()}
	return {'charmap':charmap, 'rows':rows, 'cols':cols}


def burn_banks(output, xxx):
	with open(output,'w') as fo:
		for i,path in xxx.items():
			bank = get_bank(path)
			bank.update(parse_charmap(path.replace('.png','.char')))
			bank['w'] = bank['width'] // bank['cols']
			bank['h'] = bank['height'] // bank['rows']
			print(f'fc.bank[{i}] = {json.dumps(bank).replace(", ",",")}', file=fo)

if __name__=="__main__":
	burn_banks('../js/rom.js',{
			0:'../charsets/MRMOTEXT EX.png',
			8:'../charsets/c64_petscii.png',
		})
