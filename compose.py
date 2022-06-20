PATH = 'itsy.js'

FILES = [
	"screen.js",
	"input.js",
]

with open(PATH, 'w') as fo:
	for filepath in FILES:
		filename = filepath # TODO
		raw = open(filepath).read()
		print(f'// ===[ {filename} ]=================\n', file=fo)
		print(raw, file=fo)

