PATH = 'itsy.js'

FILES = [
	"screen.js",
	"input.js",
	"sound.js",
]

with open(PATH, 'w') as fo:
	for filepath in FILES:
		filename = filepath.split('/')[-1] # TODO
		raw = open(filepath).read()
		print(f'// ===[ {filename} ]=================\n', file=fo)
		print(raw, file=fo)

