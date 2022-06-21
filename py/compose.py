PATH = '../js/itsy.js'

FILES = [
	"../js/core.js",
	"../js/screen.js",
	"../js/input.js",
	#"../js/sound.js",
	"../js/rom.js",
]

with open(PATH, 'w') as fo:
	for filepath in FILES:
		filename = filepath.split('/')[-1] # TODO
		raw = open(filepath).read()
		print(f'// ===[ {filename} ]=================\n', file=fo)
		print(raw, file=fo)

