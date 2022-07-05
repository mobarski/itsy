MINIFY = True

PATH = '../js/itsy.js'

FILES = [
	"../js/core.js",
	"../js/math.js",
	"../js/screen.js",
	"../js/mouse.js",
	#"../js/experimental.js",
	"../js/sound.js",
	"../js/font.js",
	"../js/rom.js",
]

if MINIFY:
	import jsmin
	minify = jsmin.jsmin

with open(PATH, 'w') as fo:
	for filepath in FILES:
		filename = filepath.split('/')[-1] # TODO
		raw = open(filepath).read()
		if MINIFY:
			raw = minify(raw, quote_chars="'\"`")
		else:
			print(f'// ===[ {filename} ]=================\n', file=fo)
		print(raw, file=fo)
