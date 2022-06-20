import requests
from pprint import pprint

def get_url(n,page=1):
	return "https://lospec.com/palette-list/load?colorNumberFilterType=exact&colorNumber={}&page={}&tag=&sortingType=default".format(n,page)

with open('palettes.json','w') as f:
	for n in range(4,37):
		page = 0
		while True:
			url = get_url(n,page)
			resp = requests.get(url).json()

			if not resp['palettes']: break
			for pal in resp['palettes']:
				print('	"{}":"{}",'.format(pal['slug'],pal['colors']),file=f)
			page += 1
