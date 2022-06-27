PATH = '../js/itsy.js'

FILES = [
	"../js/core.js",
	"../js/math.js",
	"../js/screen.js",
	"../js/mouse.js",
	#"../js/experimental.js",
	#"../js/sound.js",
	"../js/font.js",
	"../js/rom.js",
]

with open(PATH, 'w') as fo:
	for filepath in FILES:
		filename = filepath.split('/')[-1] # TODO
		raw = open(filepath).read()
		print(f'// ===[ {filename} ]=================\n', file=fo)
		print(raw, file=fo)
