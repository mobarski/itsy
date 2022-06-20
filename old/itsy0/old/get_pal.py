import requests
import re

URLS = """
	---[ 4 ]---
	
	
	---[ 8 ]---

https://lospec.com/palette-list/funkyfuture-8
https://lospec.com/palette-list/infinite-ikea

	---[ 12 ]---
	
	
	---[ 15 ]---
	
	
	---[ 16 ]---


	---[ 22 ]---


	---[ 32 ]---
	
https://lospec.com/palette-list/mr-cool-juicy-fruit

	---[ 36 ]---
	
	
"""

urls = re.findall('(?m)^\S+',URLS)
for url in urls[:1]:
	raw = requests.get(url).text

	user,author = re.findall('<p class="attribution">Created by <a href="/(.+?)">(.+?)</a></p>',raw)[0]
	slug,name = re.findall('<a class="palette-name" href="/palette-list/(.+?)">(.+?)</a>',raw)[0]
	colors = re.findall('<div class="color" style="background:(.+?); ',raw)

	print(url)
	print(slug)
	print(name)
	print(user)
	print(author)
	print(colors)
	print(len(colors))
	print()
	
