with open('itsy0.js','w') as fo:
	for fn in ['computer','time','core','storage','banks','palette','screen','text','boot','mouse','touch','keyboard','math','network']:
		with open(fn+'.js','r') as f:
			fo.write(f.read())

# TODO: https://obfuscator.io/
