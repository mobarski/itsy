# Intro

## Idea

Minimalistic *fantasy console* API/adapter for JS.

- simple and easy API
- adjustable resolution
- adjustable color palette
- 1 bit sprite/font-sheets
- playscii .char support
- pure JS - no external dependencies
- embeddable into single, small JS/HTML file
- simple sound-synth with adjustable channels
- playscii .psci support (TODO???)

`*` fantasy console -> https://en.wikipedia.org/wiki/Fantasy_video_game_console


## Why?

#### To lower the entry point to programming

In the 8-bit computer era, there was an interpreter (BASIC) on every computer.
You could start programming right away and the ability of a computer to teach
its user how to program was a selling point for hardware.

The API consisted of simple words with intuitive effects.
There were even keyboards with all the commands
[printed on the keys](https://en.wikipedia.org/wiki/ZX_Spectrum#/media/File:ZXSpectrum48k.jpg)
to improve the UX/ergonomy and facilitate exploration.

Programs written in BASIC were not 100% portable between the machines with different dialects
BUT it was easy to port them. Many books and magazines contained BASIC scripts 

Many years have passed, and computers are now much more powerful. Unfortunately the barier of entry
into programming had risen and not went down.

Reference: ["Why Johny can't code"](https://www.salon.com/2006/09/14/basic_2/)

#### To explore the aesthetics of modern text-art

- https://pl.pinterest.com/search/pins/?q=textmode-game
- https://pinterest.com/search/pins/?q=mrmotext
- https://twitter.com/hashtag/MRMOTEXT
- https://twitter.com/hashtag/playscii

## Minimal example

```html
<div id="screen"></div>
<script src="itsy.js"></script>

<script>
	
	init(320, 200)
	cls(0)
	rect(10,  10, 300, 90, 10)
	rect(10, 100, 300, 90, 4)
	flip()
	
</script>
```

## More typical example

```html
<div id="screen"></div>
<a onclick='fullscreen()'>fullscreen</a/>

<script src="itsy.js"></script>

<script>
	
	async function boot() {
		init(160, 144, 4, 90)
		label = "HELLO WORLD"
		frame = 0
	}
	
	function update() {
		frame += 1
	}
	
	function draw() {
		cls(0)
		for (let i=0; i<label.length; i++) {
			let x = 80 - label.length*8/2 + i*8
			let y = 72 - 10*sin(frame/8 + i/2)
			let c = frame/4%15 + 1
			text(label[i], x, y, 0, c)
		}
	}
	
	run(boot,update,draw)
	
</script>
```

# API

## screen

- **init**(w, h, [scale], [fps], [colors])

- **cls**([col])  ->  [width, height]
- **color**(col)  ->  prev_col
- **rect**(x, y, w, h, [col])
- **line**(x0, y0, x1, y1, [col])

- **text**(str, x, y, [font], [col1], [col0])  ->  [width, height]
- **chr**(i, x, y, [font], [col1], [col0])  ->  [width, height]

## screen (advanced)

- **flip**()
- **camera**(x, y)
- **pal**(col1, col2)  ->  prev_col
- **str**(i_list, x, y, [font], [col1], [col0])  ->  [width, height]

- **rect**(x, y, w, h, col1, col0, pattern) // TODO

## input

- **mouse**() -> [mx, my, m1, m2]

## sound

- **snd**(n, c=-1, t=0.25, volume=1.0)
- **channel**(n, volume=1.0, type='square', attack=0.1, release=0.5, detune=0, delay=0)

## math

- **int**(a, [b])

- **ceil**(a)
- **floor**(a)

- **random**()
- **rnd**(a, b)

- **abs**(a)
- **min**(a, ...)
- **max**(a, ...)
- **mid**(a, b, c)

- **sin**(a)
- **cos**(b)
- **atan2**(a, b)
- **PI**

- **sqrt**(a)

## other

- **halt**()
- **resume**()
- **fullscreen**()
- **time**() -> ms since start

# Reference materials

API inspiration:
- [Pyxel](https://github.com/kitao/pyxel)
- [PICO-8](https://www.lexaloffle.com/dl/docs/pico-8_manual.html)
- [TIC-80](https://tic80.com/learn)
- [PQ93](https://charliezip.itch.io/pq93)

FC inspiration:
- [Playscii](http://vectorpoem.com/playscii/)
- [PixelVision-8](https://github.com/PixelVision8/PixelVision8/wiki)
- [1Bit-Wonder](https://brastin3.itch.io/1bit-wonder)
- [cel7](https://rxi.itch.io/cel7)

Code inspiration:
- [Raccoon](https://github.com/Lyatus/raccoon)
- [Atoo](https://github.com/devicefuture/atto)
- [Octo](https://github.com/JohnEarnest/Octo)
- [PuzzleScript](https://github.com/increpare/PuzzleScript)
- [Yuki-JS](https://github.com/nrkn/yuki-js)

FC listing:
- https://paladin-t.github.io/fantasy/
- https://itch.io/tools/tag-fantasy-console
