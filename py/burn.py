from PIL import Image
import json
import base64
import re

def get_font(path):
	im = Image.open(path)
	w = im.width
	h = im.height

	data = [0]*(w*h//8) # TODO: ceil
	for y in range(h):
		for x in range(w):
			try:
				r,g,b,a = (im.getpixel((x,y))+(0,0,0,0))[:4]
			except TypeError:
				v = im.getpixel((x,y))
				r=g=b = v
			i = x//8+ y*w//8
			if r+g+b > 0:
				data[i] |= 1<<(x%8)
	
	return {"data":data, "width":w, "height":h}


def parse_charmap(path):
	lines = open(path,encoding='utf8').readlines()
	lines = [x.rstrip('\r\n') for x in lines if not x.strip().startswith('//')]
	cols,rows = [int(x.strip()) for x in lines[1].strip().split(',')]
	data = lines[2:]
	flat = ''.join(data)
	charmap = {c:i for i,c in enumerate(flat) if c.strip()}
	return {'charmap':charmap, 'rows':rows, 'cols':cols}


def burn_fonts(output, xxx):
	with open(output,'w') as fo:
		for i,path in xxx.items():
			font = get_font(path)
			font.update(parse_charmap(path.replace('.png','.char')))
			font['w'] = font['width'] // font['cols']
			font['h'] = font['height'] // font['rows']
			print(f'fc.font[{i}] = {json.dumps(font).replace(", ",",")}', file=fo)

if __name__=="__main__":
	burn_fonts('../js/rom.js',{
			0:'../charsets/c64_petscii.png',
			#1:'../charsets/MRMOTEXT EX.png',
			2:'../charsets/apple2.png',
			3:'../charsets/atari.png',
			4:'../charsets/bbc_master.png',
			5:'../charsets/cpc.png',
			6:'../charsets/dos.png',
			7:'../charsets/speccy.png',
			8:'../charsets/teletext_uk.png',
			9:'../charsets/intellivision.png',
			10:'../charsets/msx.png',
			11:'../charsets/pacman.png',
			12:'../charsets/sharp.png',
		})
